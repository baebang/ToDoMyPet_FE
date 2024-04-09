import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Pressable,
} from 'react-native';

import {convertTo12HourFormat} from './extractFromDate';
import {
  clearTodo,
  cancelTodo,
  setachievementTodo,
} from '../service/TodoService';
import {useQueryClient} from 'react-query';
import {TodoDetail} from '../store/Item';
import {RefetchSetting} from '../store/Item';

const {width, height} = Dimensions.get('window');
const screenWidth = Dimensions.get('window').width;
const IconSize = screenWidth * 0.05;

export function TodoFrameSummary({todoData, expImageToast}) {
  const queryClient = useQueryClient();
  const {setTodoId} = TodoDetail();
  const {setFetch, setUpdateTodo} = RefetchSetting();

  let TodoQuery;

  if (todoData) {
    TodoQuery = todoData;
  } else {
    TodoQuery = queryClient.getQueryData('showTodayTodoKey');
  }

  if (TodoQuery && !TodoQuery.length) {
    return (
      <View style={{alignItems: 'center'}}>
        <Text style={{color: '#7E7E7E'}}>
          할 일을 추가하고 펫을 키워보세요.
        </Text>
      </View>
    );
  }



  const handleCheckboxChange = async (
    categoryIndex,
    todoIndex,
    clearYN,
    getExperiencePointOrNot,
  ) => {
    const newTodoData = [...TodoQuery];
    const todoListData = newTodoData[categoryIndex].todoList[todoIndex];

    const userDTO = {
      categoryId: newTodoData[categoryIndex].categoryId,
      todoId: todoListData.todoId,
    };

    console.log(userDTO);

    if (clearYN) {
      await cancelTodo(userDTO);
      queryClient.refetchQueries('showTodayTodoKey');
      setFetch(new Date().getTime());
      setUpdateTodo('');
    } else {
      await clearTodo(userDTO);

      queryClient.refetchQueries('showTodayTodoKey');
      queryClient.refetchQueries('MainPageShowQueryKey');
      queryClient.refetchQueries('AdoptedPetListQueryKey');
      setFetch(new Date().getTime());
      setUpdateTodo(new Date().getTime());
      if (!getExperiencePointOrNot) {
        expImageToast('5');
        setachievementTodo().then(res => {
          if (res) {
            queryClient.refetchQueries('achievmentsQueryKey');
            queryClient.refetchQueries('myPageQueryKey');
          }
        });
      }
    }
  };

  const alarmTypesReverse = {
    EVENT_TIME: '이벤트 시간',
    FIVE_MINUTE: '5분 전',
    TEN_MINUTE: '10분 전',
    FIFTEEN_MINUTE: '15분 전',
    THIRTY_MINUTE: '30분 전',
    ONE_HOUR: '1시간 전',
    TWO_HOUR: '2시간 전',
    ONE_DAY: '1일 전',
    TWO_DAY: '2일 전',
    ONE_WEEK: '1주 전',
  };

  return (
    <View>
      {TodoQuery &&
        TodoQuery.map((category, categoryIndex) => (
          <View key={categoryIndex}>
            <View style={[styles.rowcontainer, {marginBottom: '4%'}]}>
              <View
                style={[
                  styles.categorycontainer,
                  {backgroundColor: category.categoryColorCode},
                ]}
              />
              <Text style={{fontSize: 16, fontWeight: 600}}>
                {category.categoryName}
              </Text>
            </View>
            {category.todoList.map((todo, todoIndex) => (
              <View key={todoIndex}>
                <TouchableOpacity
                  style={[
                    styles.container,
                    {
                      borderColor: todo.clearYN ? '#ECFBFF' : '#F0F0F0',
                      backgroundColor: todo.clearYN ? '#ECFBFF' : null,
                    },
                  ]}>
                  <View>
                    {!todo.clearYN ? (
                      <View style={styles.rowcontainers}>
                        <Pressable
                          onPress={() => {
                            handleCheckboxChange(
                              categoryIndex,
                              todoIndex,
                              todo.clearYN,
                              todo.getExperiencePointOrNot,
                            );
                          }}
                          style={{
                            backgroundColor: '#CBCBCB',
                            width: 25,
                            height: 25,
                            borderRadius: 100,
                            marginRight: '5%',
                          }}
                        />
                        <Text style={{fontWeight: 500, paddingRight: '15%'}}>
                          {todo.content}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.rowcontainers}>
                        <Pressable
                          onPress={() => {
                            handleCheckboxChange(
                              categoryIndex,
                              todoIndex,
                              todo.clearYN,
                              todo.getExperiencePointOrNot,
                            );
                          }}
                          style={{
                            width: 25,
                            height: 25,
                            marginRight: '5%',
                            zIndex: 1,
                          }}
                        />
                        <Image
                          style={{
                            position: 'absolute',
                            width: 25,
                            height: 25,
                          }}
                          source={require('../../assets/todocheck.png')}></Image>
                        <Text
                          style={{
                            fontWeight: 500,
                            textDecorationLine: 'line-through',
                            color: '#1DC2FF',
                            paddingRight: '15%',
                          }}>
                          {todo.content}
                        </Text>
                      </View>
                    )}

                    <Pressable
                      style={{
                        height: '135%',
                        width: '90%',
                        position: 'absolute',
                        top: -8,
                        right: -4,
                        zIndex: 1,
                      }}
                      onPress={() => setTodoId(todo.todoId)}
                    />
                    <View style={{marginLeft: '11%', marginTop: '2%'}}>
                      {todo.isChecked ? (
                        <View style={styles.rowView}>
                          {todo.startedAtTime === null ? null : (
                            <>
                              <Image
                                source={require('../../assets/schedule.png')}
                                style={styles.iconSize}
                              />
                              <Text style={[styles.success]}>
                                {convertTo12HourFormat(todo.startedAtTime)}
                              </Text>
                            </>
                          )}

                          {todo.alertType !== 'NONE_ALERT' ? (
                            <>
                              <Image
                                source={require('../../assets/notifications.png')}
                                style={[styles.iconSize, {marginLeft: '4%'}]}
                              />
                              <Text style={styles.success}>
                                {alarmTypesReverse[todo.alertType]}
                              </Text>
                            </>
                          ) : null}
                        </View>
                      ) : (
                        <View style={styles.rowView}>
                          {todo.startedAtTime === null ? null : (
                            <>
                              <Image
                                source={require('../../assets/nonschedule.png')}
                                style={[styles.iconSize]}
                              />
                              <Text style={styles.noncolor}>
                                {convertTo12HourFormat(todo.startedAtTime)}
                              </Text>
                            </>
                          )}

                          {todo.alertType !== 'NONE_ALERT' ? (
                            <>
                              <Image
                                source={require('../../assets/nonnotifications.png')}
                                style={[styles.iconSize, {marginLeft: '4%'}]}
                              />
                              <Text style={styles.noncolor}>
                                {alarmTypesReverse[todo.alertType]}
                              </Text>
                            </>
                          ) : null}
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: '5%',
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    borderColor: 'red',
  },
  categorycontainer: {
    height: '120%',
    width: '2%',
    borderRadius: 2,
    marginRight: '3%',
    alignItems: 'center',
  },
  iconSize: {width: IconSize, height: IconSize},
  success: {color: '#77DAFF'},
  noncolor: {color: '#5F5F5F'},
  rowcontainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: '4%',
  },
  rowcontainers: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
