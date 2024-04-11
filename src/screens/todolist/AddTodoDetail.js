import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
  Modal,
} from 'react-native';

import SubmitButton from '../../component/SubmitButton';
import Toast from 'react-native-easy-toast';
import {useNavigation} from '@react-navigation/native';

//modal
import {SelectTodoDateModal} from '../../modal/TodoModal/SelectTodoDateModal';
import {TimeSelectModal} from '../../modal/TodoModal/TimeSelectModal';
import AlarmTodoModal from '../../modal/TodoModal/AlarmTodoModal';
import RepeatModal from '../../modal/TodoModal/RepeatModal';
import CategorySelectModal from '../../modal/TodoModal/CategorySelectModal';

//state
import {TodoDateSetting} from '../../store/Item';

import {getDayOfWeek, formatDataForAPI} from '../../component/extractFromDate';

import {todoAdd} from '../../service/TodoService';

import {useQueryClient} from 'react-query';

const {width} = Dimensions.get('window');

const arrowIconSize = width * 0.05;

export default function AddTodoDetail() {
  const {
    StartDate,
    EndData,
    TimeDate,
    EndTimData,
    RepeatEndDate,
    RepeatType,
    RepeatWeek,
    repeatCleanUp,
    AlarmState,
    categoryContent,
    todoDateSettingCleanup,
    NewContent,
    MarkOn,
    setNewContent,
    CategotyId,
  } = TodoDateSetting();
  const {categoryName, colorCode} = categoryContent;

  const [isCalendalState, setIsCalendarState] = useState(MarkOn);
  const [isFocused, setIsFocused] = useState(false);
  const [isTimeType, setTimeType] = useState('');
  const [loading, setLoading] = useState(false);

  //모달 state
  // Date, Time, Alarm,Repeat
  const [isDateModal, setIsDateModal] = useState(false);
  const [isTimeModal, setIsTimeModal] = useState(false);
  const [isRepeatModal, setIsRepeatModal] = useState(false);
  const [isAlarmModal, setAlarmModal] = useState(false);
  const [isCategoryModal, setCategoryModal] = useState(false);

  //추가하면 업데이트 시켜줘야하므로
  let today = new Date();
  today.setUTCHours(today.getUTCHours() + 9);
  const formattedToday = today.toISOString().split('T')[0];
  const month = formattedToday.substring(0, 7);

  const toastRef = useRef(); // toast ref 생성
  const navigation = useNavigation();

  const todoDateSetting = TodoDateSetting();
  const queryClient = useQueryClient();

  const calendarStatetoggle = () => {
    setIsCalendarState(previousState => !previousState);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const completeButton = () => {
    //이거 누르면 API날아감

    const formatData = formatDataForAPI(
      todoDateSetting,
      isCalendalState,
      NewContent,
    );

    console.log('AddTodoDeatil', formatData);

    if (formatData.length === 0) {
      toastRef.current.show('추가된 날짜가 없습니다 날짜를 다시 확인해주세요');
    } else {
      setLoading(true);
      todoAdd(formatData).then(() => {
        console.log('할일등록 완료 및 cleanUP');
        console.log(categoryContent);
        queryClient.refetchQueries('showmonth');
        queryClient.refetchQueries('showDailyTodoKey');
        queryClient.refetchQueries('showTodayTodoKey');
        setLoading(false);

        navigation.goBack();
      });
    }
  };

  const renderDay = day => (
    <View key={day} style={styles.pressable}>
      <Text style={{color: '#5F5F5F'}}>{day}</Text>
    </View>
  );

  function toastModal() {
    toastRef.current.show('시간을 먼저 선택해주세요');
  }
  useEffect(() => {
    return () => {
      todoDateSettingCleanup();
    };
  }, []);

  return (
    <View style={{flex: 1}}>
      <Modal transparent={true} visible={loading}>
        <ActivityIndicator style={{marginTop: '60%'}} size="large" />
      </Modal>
      <Toast
        ref={toastRef}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }}
        textStyle={{
          fontSize: 14,
          color: 'white',
          textAlign: 'center',
        }}
        positionValue={useWindowDimensions().height * 0.7}
        fadeInDuration={200}
        fadeOutDuration={1000}></Toast>
      <SelectTodoDateModal
        visable={isDateModal}
        closeModal={() => setIsDateModal(false)}
      />
      <TimeSelectModal
        visable={isTimeModal}
        closeModal={() => setIsTimeModal(false)}
        timetype={isTimeType}
      />
      <RepeatModal
        visable={isRepeatModal}
        closeModal={() => setIsRepeatModal(false)}
      />
      <AlarmTodoModal
        visable={isAlarmModal}
        closeModal={() => setAlarmModal(false)}
      />
      <CategorySelectModal
        visable={isCategoryModal}
        closeModal={() => setCategoryModal(false)}
      />
      <View style={styles.containerView}>
        <KeyboardAvoidingView
          style={styles.modalView}
          behavior={Platform.OS === 'ios' ? 'padding' : null}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              <View style={[styles.rowcontainer, {marginBottom: '5%'}]}></View>

              <View style={[styles.rowcontainer, {marginBottom: '4%'}]}>
                <View
                  style={[
                    styles.categorycontainer,
                    {backgroundColor: colorCode ? colorCode : '#CBCBCB'},
                  ]}
                />
                <Text style={{fontSize: 16, fontWeight: 600}}>
                  {categoryName ? categoryName : '미분류'}
                </Text>
                <TouchableOpacity onPress={() => setCategoryModal(true)}>
                  <Image
                    style={{
                      height: arrowIconSize,
                      width: arrowIconSize,
                      marginLeft: '10%',
                    }}
                    source={require('../../../assets/arrowRight.png')}
                  />
                </TouchableOpacity>
              </View>

              <TextInput
                multiline
                maxLength={100}
                onChangeText={text => setNewContent(text)}
                //   value={isContent}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={'새 할일을 입력해주세요'}
                placeholderTextColor="#D1D1D2"
                value={NewContent}
              />

              <View style={styles.calendarbutotn} />

              <TouchableOpacity
                style={[
                  styles.rowcontainer,
                  {
                    backgroundColor: isCalendalState ? '#ECFBFF' : '#FAFAFA',
                    borderRadius: 6,
                    width: '50%',
                    padding: '2%',
                    borderWidth: 2,
                    borderColor: isCalendalState ? '#1DC2FF' : 'white',
                  },
                ]}
                onPress={calendarStatetoggle}>
                {!isCalendalState ? (
                  <Image
                    source={require('../../../assets/calendarUnCheck.png')}
                    style={{
                      height: arrowIconSize,
                      width: arrowIconSize,
                      marginRight: '2%',
                    }}
                  />
                ) : (
                  <Image
                    source={require('../../../assets/calendarCheck.png')}
                    style={{
                      height: arrowIconSize,
                      width: arrowIconSize,
                      marginRight: '2%',
                    }}
                  />
                )}

                <Text style={{color: !isCalendalState ? '#7E7E7E' : '#3F3F3F'}}>
                  이 할일을 캘린더에 표시
                </Text>
              </TouchableOpacity>

              {/* 날짜  시작*/}
              <View
                style={[
                  styles.todocontainer,
                  {marginTop: '15%'},
                  styles.rowcontainer,
                ]}>
                <TouchableOpacity
                  style={[styles.rowcontainer, {width: '50%'}]}
                  onPress={() => setIsDateModal(true)}>
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
                      {display: EndData ? 'flex' : 'none'},
                    ]}>
                    <Text style={{color: '#1DC2FF'}}>시작</Text>
                  </View>

                  {StartDate ? (
                    <Text style={{color: 'black'}}>
                      {getDayOfWeek(StartDate)}
                    </Text>
                  ) : (
                    <Text style={styles.contetnColor}>날짜</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.rowcontainer, {width: '50%'}]}
                  onPress={() => {
                    setIsTimeModal(true), setTimeType('');
                  }}>
                  <Image
                    source={require('../../../assets/calendarTime.png')}
                    style={{
                      height: arrowIconSize,
                      width: arrowIconSize,
                      marginRight: '2%',
                    }}
                  />

                  {TimeDate ? (
                    <Text style={{color: 'black'}}>{TimeDate}</Text>
                  ) : (
                    <Text style={styles.contetnColor}>시간</Text>
                  )}
                </TouchableOpacity>
              </View>

              {/* 날짜 종료*/}
              {EndData ? (
                <View style={[styles.todocontainer, styles.rowcontainer]}>
                  <TouchableOpacity
                    style={[styles.rowcontainer, {width: '50%'}]}
                    onPress={() => {
                      setIsDateModal(true);
                    }}>
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

                    {StartDate ? (
                      <Text style={{color: 'black'}}>
                        {getDayOfWeek(EndData)}
                      </Text>
                    ) : (
                      <Text style={styles.contetnColor}>날짜</Text>
                    )}
                  </TouchableOpacity>

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

                    {EndTimData ? (
                      <Text style={{color: 'black'}}>{EndTimData}</Text>
                    ) : (
                      <Text style={styles.contetnColor}>시간</Text>
                    )}
                  </TouchableOpacity>
                </View>
              ) : null}

              {/* 반복 */}
              <TouchableOpacity
                style={[
                  styles.todocontainer,
                  styles.rowcontainer,
                  {backgroundColor: EndData || !StartDate ? '#F0F0F0' : null},
                ]}
                onPress={() => setIsRepeatModal(true)}
                disabled={!!EndData || !StartDate}>
                <Image
                  source={require('../../../assets/calendarRepeat.png')}
                  style={{
                    height: arrowIconSize,
                    width: arrowIconSize,
                    marginRight: '2%',
                  }}
                />
                {RepeatType ? (
                  <View>
                    <View style={styles.rowcontainer}>
                      <View style={[styles.startandEnd, {marginBottom: '2%'}]}>
                        <Text style={{color: '#1DC2FF'}}>{RepeatType}</Text>
                      </View>
                      <View
                        style={[
                          styles.rowcontainer,
                          {display: RepeatType === '매주' ? 'flex' : 'none'},
                        ]}>
                        {RepeatWeek ? RepeatWeek.map(renderDay) : null}
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
                        {getDayOfWeek(StartDate)} {' - '}
                        {getDayOfWeek(RepeatEndDate.dateString)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={{
                        position: 'absolute',
                        top: 10,
                        left: width / 1.38,
                        zIndex: 10,
                      }}
                      onPress={repeatCleanUp}>
                      <Image
                        source={require('../../../assets/deleteRepeat.png')}
                        style={{
                          height: arrowIconSize,
                          width: arrowIconSize,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text style={styles.contetnColor}>반복</Text>
                )}
              </TouchableOpacity>

              {/* 알람 */}
              <TouchableOpacity
                style={[styles.todocontainer, styles.rowcontainer]}
                onPress={() => (TimeDate ? setAlarmModal(true) : toastModal())}>
                <Image
                  source={require('../../../assets/calendarAlram.png')}
                  style={{
                    height: arrowIconSize,
                    width: arrowIconSize,
                    marginRight: '2%',
                  }}
                />
                {AlarmState ? (
                  <Text>{AlarmState}</Text>
                ) : (
                  <Text style={styles.contetnColor}>알림</Text>
                )}
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>

      <View
        style={{
          justifyContent: 'flex-end',
          width: '100%',

          ...(Platform.OS === 'ios' && {
            position: 'absolute',
            top: isFocused ? '45%' : '87%',
          }),
          backgroundColor: 'white',
        }}>
        <View style={{height: 2, backgroundColor: '#F0F0F0'}} />
        <View style={{padding: '5%'}}>
          <SubmitButton
            state={NewContent}
            comment={'추가하기'}
            onPress={completeButton}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerView: {flex: 1, justifyContent: 'flex-end', alignItems: 'center'},
  modalView: {
    backgroundColor: 'white',

    padding: '5%',
    width: '100%',
    height: 'auto',
    flex: 1,
  },
  rowcontainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  titleStyle: {
    flex: 0.9,
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 19,
    color: 'black',
  },
  categorycontainer: {
    height: '100%',
    width: '2%',
    borderRadius: 2,
    marginRight: '3%',
    alignItems: 'center',
  },

  calendarbutotn: {backgroundColor: '#F0F0F0', height: 1, marginBottom: '2%'},
  todocontainer: {
    borderWidth: 2,
    borderColor: '#F0F0F0',
    borderRadius: 6,
    padding: '4%',
    marginBottom: '4%',
  },
  contetnColor: {color: '#B2B2B2'},
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
});
