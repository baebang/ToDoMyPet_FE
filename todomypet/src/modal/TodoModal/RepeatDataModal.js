import React, {useState, useEffect} from 'react';
import {
  View,
  Modal,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
  TouchableOpacity,
} from 'react-native';
TodoDateSetting;
import SubmitButton from '../../component/SubmitButton';
import RepeatLastDateModal from './RepeatLastDateModal';
import {getDayOfWeek} from '../../component/extractFromDate';

import {TodoDateSetting} from '../../store/Item';

const {width} = Dimensions.get('window');
const closeIconSize = width * 0.07;
const arrowIconSize = width * 0.05;

export default function RepeatDataModal({visible, closeModal, select}) {
  const [selectCycle, setSelectCycle] = useState(select); // 반복주기Text state
  const [selectedDays, setSelectedDays] = useState([]); //반복요일 변경 state
  const [isSelect, setSelect] = useState(false); //반복주기 변경 togle state
  const [lastDayModal, setLastDayModal] = useState(false); //종료 날짜 선택하는 모달
  const calculateInitialValue = () => {
    console.log(select, selectCycle);
    if (selectCycle != '') {
      if (selectCycle === '매주') {
        return selectedDays.length;
      } else {
        return true;
      }
    } else {
      if (select === '매주') {
        return selectedDays.length;
      } else {
        return true;
      }
    }
  };

  // 상태 state에 입력해주기
  const {RepeatEndDate, setRepeatEndDate, setRepeatType, setRepeatWeek} =
    TodoDateSetting();

  useEffect(() => {
    // Cleanup 함수 정의

    return () => {
      // 컴포넌트가 언마운트될 때 상태 초기화
      setSelectCycle('');
      setSelectedDays('');
      setSelect(false);
    };
  }, []);

  let cycle = ['매일', '매주', '매월'];
  const newCycle =
    selectCycle === null
      ? [...cycle.filter(item => item !== select)]
      : [...cycle.filter(item => item !== selectCycle)];

  const days = ['월', '화', '수', '목', '금', '토', '일'];

  const handlePress = day => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(selectedDay => selectedDay !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const isDaySelected = day => selectedDays.includes(day);

  const renderDay = day => (
    <TouchableOpacity
      key={day}
      style={[styles.pressable, isDaySelected(day) && styles.selected]}
      onPress={() => handlePress(day)}>
      <Text style={[isDaySelected(day) && styles.selectedText]}>{day}</Text>
    </TouchableOpacity>
  );

  const cycleView = arr => (
    <TouchableOpacity
      key={arr}
      onPress={() => {
        setSelectCycle(arr);
        setSelect(false);
      }}
      style={{marginRight: 7}}>
      <Text style={{color: '#B2B2B2', fontWeight: 600}}>{arr}</Text>
    </TouchableOpacity>
  );

  function completeButton() {
    if (selectCycle) {
      setRepeatType(selectCycle);
    } else {
      setRepeatType(select);
    }
    setRepeatWeek(selectedDays);
    closeModal();
  }

  function stateCleanUp() {
    setSelectCycle('');
    setSelectedDays([]);
    // setRepeatEndDate('');
    closeModal();
  }

  return (
    <Modal transparent={true} visible={visible}>
      <RepeatLastDateModal
        visible={lastDayModal}
        closeModal={() => setLastDayModal(false)}
      />
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={{padding: '5%'}}>
            <View style={[styles.rowcontainer, {marginBottom: '5%'}]}>
              <Pressable onPress={stateCleanUp}>
                <Image
                  style={{height: closeIconSize, width: closeIconSize}}
                  source={require('../../../assets/close.png')}
                />
              </Pressable>

              <Text style={styles.titleStyle}>반복 선택</Text>
            </View>

            {/* 반복주기 */}
            <View style={[styles.rowcontainer, {paddingTop: '4%'}]}>
              <Text style={{color: 'black', fontWeight: 500}}>반복 주기 </Text>
              <Text style={{color: '#1DC2FF', fontWeight: 600, marginRight: 3}}>
                {!selectCycle ? select : selectCycle}
              </Text>
              <View
                style={[
                  styles.rowcontainer,
                  {display: !isSelect ? 'none' : 'flex'},
                ]}>
                {newCycle.map(cycleView)}
              </View>
              <Pressable
                onPress={() => setSelect(previousState => !previousState)}>
                <Image
                  style={[
                    isSelect ? styles.mirror : null,
                    {
                      height: arrowIconSize,
                      width: arrowIconSize,
                    },
                  ]}
                  source={require('../../../assets/arrowRight.png')}
                />
              </Pressable>
            </View>

            {/* 반복요일 */}
            <View
              style={{
                display:
                  selectCycle === '' || selectCycle === null
                    ? select === '매주'
                      ? 'flex'
                      : 'none'
                    : selectCycle === '매주'
                    ? 'flex'
                    : 'none',
                marginTop: '8%',
              }}>
              <Text style={{color: 'black', fontWeight: 500}}>반복요일</Text>
              <View style={[styles.container]}>{days.map(renderDay)}</View>
            </View>

            {/* 종료일 */}
            <View style={{marginTop: '8%', marginBottom: '4%'}}>
              <Text style={{color: 'black', fontWeight: 500}}>종료일</Text>
              <View style={[styles.todocontainer, {marginTop: 10}]}>
                <TouchableOpacity
                  style={[styles.rowcontainer]}
                  onPress={() => {
                    setLastDayModal(true);
                  }}>
                  <Image
                    source={require('../../../assets/calendarMonth.png')}
                    style={{
                      height: arrowIconSize,
                      width: arrowIconSize,
                      marginRight: '2%',
                    }}
                  />
                  {RepeatEndDate ? (
                    <Text style={{color: 'black'}}>
                      {getDayOfWeek(RepeatEndDate.dateString)}
                    </Text>
                  ) : (
                    <Text style={styles.contetnColor}>
                      종료일을 선택하세요.
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View
            style={{
              height: 2,
              backgroundColor: '#F0F0F0',
            }}
          />
          <View style={{padding: '5%'}}>
            <SubmitButton
              //"매주"타입의 경우 요일을 선택하지 않을경우 비활성화 처리하기
              state={RepeatEndDate && calculateInitialValue()}
              comment={'추가하기'}
              onPress={completeButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
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
    flex: 0.9,
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 19,
    color: 'black',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  pressable: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: '#F0F0F0',
  },
  selected: {
    backgroundColor: '#ECFBFF', // 선택된 요일의 배경색
    borderColor: '#1DC2FF',
  },
  selectedText: {
    color: '#1DC2FF', // 선택된 요일의 글자색
  },
  todocontainer: {
    borderWidth: 2,
    borderColor: '#F0F0F0',
    borderRadius: 10,
    padding: '4%',
  },
  contetnColor: {color: '#B2B2B2'},
  mirror: {
    transform: [{scaleX: -1}], // 거울 모드로 반전
  },
});
