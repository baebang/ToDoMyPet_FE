import React, {useState} from 'react';
import {
  View,
  Modal,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
} from 'react-native';
import SubmitButton from '../../component/SubmitButton';
import {Calendar} from 'react-native-calendars';
import {TodoDateSetting} from '../../store/Item';

const {width} = Dimensions.get('window');
const closeIconSize = width * 0.07;

export default function RepeatLastDateModal({visible, closeModal}) {
  const [selectDay, setSelectDay] = useState('');
  const {setRepeatEndDate, StartDate} = TodoDateSetting();

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
    [selectDay.dateString]: {
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
  return (
    <Modal transparent={true} visible={visible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={{padding: '5%'}}>
            <View style={[styles.rowcontainer, {marginBottom: '5%'}]}>
              <Pressable onPress={closeModal}>
                <Image
                  style={{height: closeIconSize, width: closeIconSize}}
                  source={require('../../../assets/close.png')}
                />
              </Pressable>

              <Text style={styles.titleStyle}>날짜 선택</Text>
            </View>
            <Calendar
              onDayPress={day => {
                setSelectDay(day);
              }}
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
              renderHeader={date => CustomHeaderComponent({date})}
              markingType={'custom'}
              markedDates={OneDayCoustom}
              minDate={StartDate}
            />
          </View>

          <View
            style={{
              height: 2,
              backgroundColor: '#F0F0F0',
            }}
          />
          <View style={{padding: '5%'}}>
            <SubmitButton
              state={selectDay}
              comment={'추가하기'}
              onPress={() => {
                setRepeatEndDate(selectDay);
                closeModal();
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
});
