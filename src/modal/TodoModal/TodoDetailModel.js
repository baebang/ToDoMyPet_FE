import React, {useState, useEffect} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {detailTodoShow, deleteTodo} from '../../service/TodoService';
import {useQuery, useQueryClient} from 'react-query';
import {getDayOfWeek} from '../../component/extractFromDate';
import {convertTo12HourFormat} from '../../component/extractFromDate';
import {RefetchSetting, TodoDateSetting, TodoDetail} from '../../store/Item';
import {useNavigation} from '@react-navigation/native';
import {endRepeatTodo} from '../../service/TodoService';
import {EndRepeatTodoModal} from '../MypageModal/Setting';

const {width} = Dimensions.get('window');
const closeIconSize = width * 0.07;

const arrowIconSize = width * 0.05;

let today = new Date();
today.setUTCHours(today.getUTCHours() + 9);
const formattedToday = today.toISOString().split('T')[0];
const month = formattedToday.substring(0, 7);

export default function TodoDetailModel({visible, closeModal}) {
  const queryClient = useQueryClient();
  const {setFetch} = RefetchSetting();
  const {TodoAddDateCheck, TodoAddDate} = TodoDetail();
  const [addModal, setAddModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalFunction, setModalFunction] = useState('');

  const navigation = useNavigation();
  const {
    setStartDate,
    setEndData,
    setPeriodDate,
    setTimeDate,
    setEndTimData,
    setCategoryId,
    setTodoId,
    setRepeatEndDate,
    setRepeatType,
    setRepeatWeek,
    setAlarmState,
    setNewContent,
    setMarkOn,
    setcategoryContent,
  } = TodoDateSetting();

  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery(['showMonthTodoKey', visible], () => {
    if (visible) {
      return detailTodoShow(visible);
    } else {
      return null; // visible이 false인 경우에는 데이터를 가져오지 않음
    }
  });

  if (isLoading) {
    return console.log('데려오는중');
  }

  if (isError) {
    return <Text>MainPageShowQueryKey Error fetching</Text>;
  }
  if (userData) {
    const {
      alertAt,
      alertType,
      categoryColorCode,
      categoryName,
      content,
      endedAtDate,
      endedAtTime,
      markOnTheCalenderOrNot,
      receiveAlert,
      repeatData,
      repeatType,
      startedAtDate,
      startedAtTime,
      todoId,
      repeatEndDate,
      categoryId,
    } = userData;

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

    const repeatTypes = {
      REPEAT_DAILY: '매일',
      REPEAT_WEEKLY: '매주',
      REPEAT_MONTHLY: '매월',
      NONE_REPEAT: '반복 없음',
    };
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

    const convertedDays = repeatData.map(dayIndex => {
      // repeatData의 각 요소에 대해 요일을 변환하여 새로운 배열 생성
      return daysOfWeek[dayIndex]; // 배열의 인덱스는 0부터 시작하므로 dayIndex에서 1을 뺀 값을 사용
    });

    const renderDay = (day, index) => (
      <View key={`${day}-${index}`} style={styles.pressable}>
        <Text style={{color: '#5F5F5F'}}>{day}</Text>
      </View>
    );

    const deleteFunction = () => {
      deleteTodo(todoId).then(res => {
        queryClient.refetchQueries('showmonth');
        queryClient.refetchQueries('showDailyTodoKey');
        queryClient.refetchQueries('showTodayTodoKey');

        setFetch(new Date().getTime());
        closeModal();
      });
    };

    const modifyFunction = () => {
      setStartDate(startedAtDate);
      setEndData(endedAtDate);
      setPeriodDate(repeatData);
      setTimeDate(startedAtTime);
      setEndTimData(endedAtTime);
      setTodoId(todoId);
      setCategoryId(categoryId);

      setRepeatEndDate(repeatEndDate);
      setRepeatType(repeatType);
      setRepeatWeek(repeatData);
      setAlarmState(alertType);
      setNewContent(content);
      setMarkOn(markOnTheCalenderOrNot);
      setcategoryContent(categoryName, categoryColorCode);
      closeModal();
      navigation.navigate('ModifyTodoDetail');
    };

    const stopRepeatFunction = () => {
      const userDTO = {
        todoId: todoId,
        repeatEndDate: TodoAddDateCheck ? TodoAddDate : formattedToday,
      };

      endRepeatTodo(userDTO)
        .then(() => {
          queryClient.refetchQueries('showmonth');
          queryClient.refetchQueries('showDailyTodoKey');
          queryClient.refetchQueries('showTodayTodoKey');
          setFetch(new Date().getTime());
          closeModal();
        })
        .catch(error => {
          console.log(error);
        });
      closeModal();
    };

    return (
      <>
        <Modal transparent={true} visible={!!visible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={{padding: '5%'}}>
                <View
                  style={[
                    styles.rowcontainer,
                    {justifyContent: 'space-between'},
                  ]}>
                  <Pressable onPress={closeModal}>
                    <Image
                      style={{height: closeIconSize, width: closeIconSize}}
                      source={require('../../../assets/close.png')}
                    />
                  </Pressable>

                  <Text style={styles.titleStyle}>할일 상세보기</Text>
                  {repeatType !== 'NONE_REPEAT' ? (
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#FFE9EF',
                        padding: '2%',
                        borderRadius: 6,
                      }}
                      onPress={() => {
                        console.log('종료하기');
                        setAddModal(true);
                        setModalContent('종료');
                        setModalFunction(() => stopRepeatFunction);
                      }}>
                      <Text style={{color: '#FF2070'}}>종료하기</Text>
                    </TouchableOpacity>
                  ) : (
                    <View
                      style={{
                        backgroundColor: 'white',
                        padding: '2%',
                        borderRadius: 6,
                      }}>
                      <Text style={{color: 'white'}}>종료하기</Text>
                    </View>
                  )}
                </View>
                <View
                  style={[
                    styles.rowcontainer,
                    {marginTop: '8%', paddingLeft: '1%'},
                  ]}>
                  <View
                    style={[
                      styles.categorycontainer,
                      {backgroundColor: categoryColorCode},
                    ]}
                  />
                  <Text style={{fontSize: 16, fontWeight: 600}}>
                    {categoryName}
                  </Text>
                </View>
                <Text
                  style={{
                    paddingTop: '8%',
                    paddingBottom: '8%',
                    fontSize: 16,
                    fontWeight: 500,
                    paddingLeft: '1%',
                  }}>
                  {content}
                </Text>
                <View>
                  {/* 날짜  시작*/}
                  <View style={[styles.todocontainer, styles.rowcontainer]}>
                    <TouchableOpacity
                      style={[styles.rowcontainer, {width: '50%'}]}>
                      <Image
                        source={require('../../../assets/calendarMonth.png')}
                        style={{
                          height: arrowIconSize,
                          width: arrowIconSize,
                          marginRight: '2%',
                        }}
                      />
                      <View
                        style={[
                          styles.startandEnd,
                          {display: endedAtTime ? 'flex' : 'none'},
                        ]}>
                        <Text style={{color: '#1DC2FF'}}>시작</Text>
                      </View>

                      {startedAtDate ? (
                        <Text style={{color: 'black'}}>
                          {getDayOfWeek(startedAtDate)}
                        </Text>
                      ) : (
                        <Text style={styles.contetnColor}>날짜</Text>
                      )}
                    </TouchableOpacity>
                    {startedAtTime ? (
                      <View
                        style={[styles.rowcontainer, {width: '50%'}]}
                        >
                        <Image
                          source={require('../../../assets/calendarTime.png')}
                          style={{
                            height: arrowIconSize,
                            width: arrowIconSize,
                            marginRight: '2%',
                          }}
                        />

                        <Text style={{color: 'black'}}>
                          {convertTo12HourFormat(startedAtTime.slice(0, -3))}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  {/* 날짜 종료*/}
                  {endedAtTime ? (
                    <View style={[styles.todocontainer, styles.rowcontainer]}>
                      <View
                        style={[styles.rowcontainer, {width: '50%'}]}>
                        <Image
                          source={require('../../../assets/calendarMonth.png')}
                          style={{
                            height: arrowIconSize,
                            width: arrowIconSize,
                            marginRight: '2%',
                          }}
                        />
                        <View style={styles.startandEnd}>
                          <Text style={{color: '#1DC2FF'}}>종료</Text>
                        </View>

                        {startedAtDate ? (
                          <Text style={{color: 'black'}}>
                            {getDayOfWeek(endedAtDate)}
                          </Text>
                        ) : (
                          <Text style={styles.contetnColor}>날짜</Text>
                        )}
                      </View>

                      <TouchableOpacity
                        style={[styles.rowcontainer, {width: '50%'}]}
                        onPress={() => {
                          setIsTimeModal(true), setTimeType('end');
                        }}>
                        <Image
                          source={require('../../../assets/calendarTime.png')}
                          style={{
                            height: arrowIconSize,
                            width: arrowIconSize,
                            marginRight: '2%',
                          }}
                        />

                        {endedAtTime ? (
                          <Text style={{color: 'black'}}>
                            {convertTo12HourFormat(endedAtTime.slice(0, -3))}
                          </Text>
                        ) : (
                          <Text style={styles.contetnColor}>시간</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  ) : null}

                  {/* 반복 */}
                  {repeatType !== 'NONE_REPEAT' ? (
                    <View style={[styles.todocontainer, styles.rowcontainer]}>
                      <Image
                        source={require('../../../assets/calendarRepeat.png')}
                        style={{
                          height: arrowIconSize,
                          width: arrowIconSize,
                          marginRight: '2%',
                        }}
                      />

                      <View>
                        <View style={styles.rowcontainer}>
                          <View
                            style={[styles.startandEnd, {marginBottom: '2%'}]}>
                            <Text style={{color: '#1DC2FF'}}>
                              {repeatTypes[repeatType]}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.rowcontainer,
                              {
                                display:
                                  repeatType === 'REPEAT_WEEKLY'
                                    ? 'flex'
                                    : 'none',
                              },
                            ]}>
                            {convertedDays
                              ? convertedDays.map(renderDay)
                              : null}
                          </View>
                        </View>

                        <View style={styles.rowcontainer}>
                          <Image
                            source={require('../../../assets/calendarMonth.png')}
                            style={{
                              height: arrowIconSize,
                              width: arrowIconSize,
                              marginRight: '2%',
                            }}
                          />
                          <Text style={{color: '#5F5F5F'}}>
                            {getDayOfWeek(repeatEndDate)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ) : null}

                  {/* 알림 */}
                  {alertType !== 'NONE_ALERT' ? (
                    <View style={[styles.todocontainer, styles.rowcontainer]}>
                      <Image
                        source={require('../../../assets/calendarAlram.png')}
                        style={{
                          height: arrowIconSize,
                          width: arrowIconSize,
                          marginRight: '2%',
                        }}
                      />
                      <Text style={styles.contetnColor}>
                        {alarmTypesReverse[alertType]}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
              <View style={{height: 2, backgroundColor: '#F0F0F0'}} />
              <View style={{paddingTop: '5%', paddingBottom: '3%'}}>
                <View
                  style={[
                    styles.rowcontainer,
                    {
                      justifyContent: 'space-between',
                      marginHorizontal: '3%',
                      marginBottom: '5%',
                    },
                  ]}>
                  <Pressable
                    onPress={() => {
                      setAddModal(true);
                      setModalContent('삭제');
                      console.log('삭제하기');
                      setModalFunction(() => deleteFunction);
                    }}>
                    <View
                      style={[
                        styles.opctionButton,
                        {backgroundColor: '#FF0F3A'},
                      ]}>
                      <Text style={[styles.opctionText, {color: 'white'}]}>
                        삭제하기
                      </Text>
                    </View>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      console.log('수정하기');
                      setAddModal(true);
                      setModalContent('수정');
                      setModalFunction(() => modifyFunction);
                    }}>
                    <View
                      style={[
                        styles.opctionButton,
                        {backgroundColor: '#ECFBFF'},
                      ]}>
                      <Text style={[styles.opctionText, {color: '#1DC2FF'}]}>
                        수정하기
                      </Text>
                    </View>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
          <EndRepeatTodoModal
            closeModal={() => setAddModal(false)}
            state={addModal}
            content={modalContent}
            modalFunction={modalFunction}
            startedAtDate={startedAtDate}
          />
        </Modal>
      </>
    );
  }
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',

    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    width: '100%',
    height: 'auto',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  rowcontainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  titleStyle: {
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 19,
    color: 'black',
  },
  todocontainer: {
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: '4%',
    marginBottom: '4%',
  },
  startandEnd: {
    padding: '2%',
    backgroundColor: '#ECFBFF',
    borderRadius: 4,
    marginRight: '3%',
  },
  pressable: {
    padding: 4,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: '#F0F0F0',
    marginRight: '4%',
  },
  categorycontainer: {
    height: '100%',
    width: '2%',
    borderRadius: 2,
    marginRight: '3%',
    alignItems: 'center',
  },
  opctionButton: {
    borderRadius: 8,
    padding: 20,
    paddingHorizontal: '16%',
    alignItems: 'center',
  },
  opctionText: {fontSize: 16},
});
