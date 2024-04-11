import React, {useState} from 'react';
import {
  View,
  Modal,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import SubmitButton from '../../component/SubmitButton';
import {TodoDateSetting} from '../../store/Item';

const {width} = Dimensions.get('window');
const closeIconSize = width * 0.07;

export function SelectTodoDateModal({
  visable,
  closeModal,
  selectDayFunction,
  selectDay,
}) {
  const dateString = new Date();
  const todayDate = dateString.toISOString().split('T')[0];

  const [isStartDate, setIsStartDate] = useState('');
  const [isEndDate, setIsEndDate] = useState('');
  const [isDateRange, setIsDateRange] = useState('');
  // State to store the visible dates
  // 상태관리 function
  const {setStartDate, setEndData, setPeriodDate, repeatCleanUp} =
    TodoDateSetting();

  const CustomHeaderComponent = ({date}) => {
    const dateObject = new Date(date);
    const formattedDate = `${dateObject.getFullYear()}년 ${
      dateObject.getMonth() + 1
    }월`;

    return (
      <View>
        <Text style={{fontSize: 17, fontWeight: 600}}>{formattedDate}</Text>
      </View>
    );
  };

  const OneDayCoustom = {
    [isStartDate]: {
      customStyles: {
        container: {
          backgroundColor: '#1DC2FF',
        },
        text: {
          color: 'white',
        },
      },
    },
  };

  const CoustomMarkedDate = {
    [isStartDate]: {
      startingDay: true,
      color: '#1DC2FF',
      textColor: 'white',
    },

    [isEndDate]: {
      endingDay: true,
      color: '#1DC2FF',
      textColor: 'white',
    },
  };

  if (isDateRange) {
    isDateRange.forEach(date => {
      CoustomMarkedDate[date] = {color: '#ECFBFF'};
    });
  }

  const resetState = () => {
    setIsStartDate('');
    setIsEndDate('');
    setIsDateRange('');
    repeatCleanUp();
  };

  function generateDateRange(startDate, endDate) {
    const dateArray = [];
    let currentDate = new Date(startDate);

    currentDate.setDate(currentDate.getDate() + 1); // 시작일은 포함하지 않도록 수정

    while (currentDate < new Date(endDate)) {
      // 종료일은 포함하지 않도록 수정
      dateArray.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setIsDateRange(dateArray);
  }

  function selectDayFunction(day) {
    // isStartDate가 비어있을때 Day삽입
    // 만약에 있다면 isEndDate로 삽입
    // 이떄 isStartDate가 입력한 데이랑 같을경우 isStartDate 다시 입력
    // 이떄 isStartDate가보다 작은 날짜를 선택한 경우
    // isStartDate를 비워주고 해당 날짜를 삽입

    //모든 날짜 설정이 끝났다면 generateDateRange에 매게값 추가해서 보내주기
    //return값은 isDateRange로!

    if (isStartDate === '') {
      setIsStartDate(day);
    } else {
      if (day < isStartDate) {
        setIsStartDate(day);
      } else if (day === isStartDate) {
        setIsStartDate(day);
      } else {
        setIsEndDate(day);
        generateDateRange(isStartDate, day);
      }
    }

    if (isEndDate) {
      setIsStartDate('');
      setIsEndDate('');
      setIsDateRange('');
      setIsStartDate(day);
    }
  }

  // Loop through a range of dates and mark weekends
  // For example, mark weekends for the next 30 days
  return (
    <Modal transparent={true} visible={visable}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={[styles.rowcontainer, {marginBottom: '5%'}]}>
            <Pressable
              onPress={() => {
                closeModal();
              }}>
              <Image
                style={{height: closeIconSize, width: closeIconSize}}
                source={require('../../../assets/close.png')}
              />
            </Pressable>

            <Text style={styles.titleStyle}>날짜 선택</Text>
          </View>

          <Calendar
            onDayPress={day => {
              selectDayFunction(day.dateString);
            }}
            renderHeader={date => CustomHeaderComponent({date})}
            theme={{
              todayTextColor: '#1DC2FF',
              'stylesheet.calendar.header': {
                dayTextAtIndex0: {
                  color: '#FF0F3A',
                },
                dayTextAtIndex6: {
                  color: '#007CEE',
                },
              },
            }}
            markingType={isEndDate ? 'period' : 'custom'}
            markedDates={isEndDate ? CoustomMarkedDate : OneDayCoustom}
          />
          <View
            style={{
              height: 2,
              backgroundColor: '#F0F0F0',
              marginTop: '4%',
            }}
          />
          <View style={{paddingTop: '4%'}}>
            <SubmitButton
              state={isStartDate}
              comment={'추가하기'}
              onPress={() => {
                try {
                  setStartDate(isStartDate);
                  setEndData(isEndDate);
                  console.log(isEndDate,"=====isEndDate")
                  setPeriodDate(isDateRange);

                  resetState();
                  closeModal();
                } catch {
                  console.log('할일 세부 추가모달에서 에러나요');
                }
              }}
      
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

    padding: '5%',
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
});
