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
import {TodoDateSetting, TodoDetail} from '../../store/Item';

import {getDayOfWeek, formatDataForAPI} from '../../component/extractFromDate';

import {modifyTodo} from '../../service/TodoService';

import {useQueryClient} from 'react-query';

const {width} = Dimensions.get('window');

const arrowIconSize = width * 0.05;

let today = new Date();
today.setUTCHours(today.getUTCHours() + 9);
const formattedToday = today.toISOString().split('T')[0];

export default function ModifyTodoDetail() {
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
    TodoId,
    CategotyId,
    setTimeDate,
  } = TodoDateSetting();

  function convertTimeFormat() {
    if (TimeDate) {
      // 시간, 분, 초를 추출
      var [hours, minutes, seconds] = TimeDate.split(':').map(Number);

      // 오후와 오전을 구분
      var meridiem = hours >= 12 ? 'PM' : 'AM';

      // 24시간 형식을 12시간 형식으로 변환
      if (hours === 0) {
        hours = 12;
      } else if (hours > 12) {
        hours -= 12;
      }

      // 24:00:00을 AM12:00으로 변경
      if (hours === 12 && minutes === 0 && seconds === 0) {
        meridiem = 'AM';
      }

      // 시간, 분을 두 자리 숫자로 포맷팅
      hours = hours < 10 ? '0' + hours : hours;
      minutes = minutes < 10 ? '0' + minutes : minutes;

      // 새로운 형식의 문자열 반환
      setTimeDate(meridiem + hours + ':' + minutes);
      return meridiem + hours + ':' + minutes;
    }
  }

  const repeatTypes = {
    REPEAT_DAILY: '매일',
    REPEAT_WEEKLY: '매주',
    REPEAT_MONTHLY: '매월',
    NONE_REPEAT: '반복 없음',
  };

  const weekNumber = {
    0: '일',
    1: '월',
    2: '화',
    3: '수',
    4: '목',
    5: '금',
    6: '토',
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

  const {categoryName, colorCode} = categoryContent;

  const [isCalendalState, setIsCalendarState] = useState(MarkOn);
  const [isFocused, setIsFocused] = useState(false);
  const [isTimeType, setTimeType] = useState('');
  const queryClient = useQueryClient();
  const {TodoAddDateCheck, TodoAddDate} = TodoDetail();

  //모달 state
  // Date, Time, Alarm,Repeat
  const [isDateModal, setIsDateModal] = useState(false);
  const [isTimeModal, setIsTimeModal] = useState(false);
  const [isRepeatModal, setIsRepeatModal] = useState(false);
  const [isAlarmModal, setAlarmModal] = useState(false);
  const [isCategoryModal, setCategoryModal] = useState(false);
  const [loading, setLoading] = useState(false);

  //추가하면 업데이트 시켜줘야하므로
  let today = new Date();
  today.setUTCHours(today.getUTCHours() + 9);
  const formattedToday = today.toISOString().split('T')[0];
  const month = formattedToday.substring(0, 7);

  const toastRef = useRef(); // toast ref 생성
  const navigation = useNavigation();

  const todoDateSetting = TodoDateSetting();

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

    if (formatData) formatData.editFrom = StartDate;

    console.log('modify', formatData);

    if (formatData.length === 0) {
      toastRef.current.show('추가된 날짜가 없습니다 날짜를 다시 확인해주세요');
    } else {
      setLoading(true);
      modifyTodo(TodoId, formatData).then(() => {
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
    console.log(typeof day === 'number'),
    (
      <View key={day} style={styles.pressable}>
        <Text style={{color: '#5F5F5F'}}>{day}</Text>
      </View>
    )
  );
  const numberrenderDay = day => (
    <View key={day} style={styles.pressable}>
      <Text style={{color: '#5F5F5F'}}>{weekNumber[day]}</Text>
    </View>
  );

  function toastModal() {
    toastRef.current.show('시간을 먼저 선택해주세요');
  }
  useEffect(() => {
    convertTimeFormat();
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

              {/* 날짜  시작 */}
              <View
                style={[
                  styles.todocontainer,
                  {
                    marginTop: '15%',
                  },
                  styles.rowcontainer,
                ]}>
                <TouchableOpacity
                  style={[styles.rowcontainer, {width: '50%'}]}
                  onPress={() => setIsDateModal(true)}
                  disabled={!!RepeatEndDate}>
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
                    <Text style={{color: RepeatEndDate ? '#B2B2B2' : 'black'}}>
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
                {RepeatType === 'NONE_REPEAT' || !RepeatType ? (
                  <Text style={styles.contetnColor}>반복</Text>
                ) : (
                  <View>
                    <View style={styles.rowcontainer}>
                      <View style={[styles.startandEnd, {marginBottom: '2%'}]}>
                        <Text style={{color: '#1DC2FF'}}>
                          {repeatTypes[RepeatType] === undefined
                            ? RepeatType
                            : repeatTypes[RepeatType]}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.rowcontainer,
                          {
                            display:
                              repeatTypes[RepeatType] === '매주' ||
                              RepeatType === '매주'
                                ? 'flex'
                                : 'none',
                          },
                        ]}>
                        {Array.isArray(RepeatWeek) &&
                        typeof RepeatWeek[0] === 'string'
                          ? RepeatWeek.map(renderDay)
                          : RepeatWeek.map(numberrenderDay)}
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
                        {typeof RepeatEndDate === 'string'
                          ? getDayOfWeek(RepeatEndDate)
                          : getDayOfWeek(RepeatEndDate.dateString)}
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
                {AlarmState && AlarmState !== 'NONE_ALERT' ? (
                  <Text>
                    {alarmTypesReverse[AlarmState]
                      ? alarmTypesReverse[AlarmState]
                      : AlarmState}
                  </Text>
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
