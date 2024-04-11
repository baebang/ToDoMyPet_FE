import React, {useState} from 'react';
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
import {Calendar} from 'react-native-calendars';
import {RefetchSetting} from '../../store/Item';

const {width} = Dimensions.get('window');
const closeIconSize = width * 0.07;

export function SelectDateModal({
  visable,
  closeModal,
  selectDayFunction,
  selectDay,
}) {
  let dateObject = new Date();
  dateObject.setUTCHours(dateObject.getUTCHours() + 9);

  const {setFetch} = RefetchSetting();

  const selectedDayStyle = {
    [selectDay]: {
      selected: true,
      selectedColor: '#1DC2FF',
    },
  };

  const CustomHeaderComponent = ({date}) => {
    let dateObject = new Date(date);
    dateObject.setUTCHours(dateObject.getUTCHours() + 9);
    const formattedDate = `${dateObject.getFullYear()}년 ${
      dateObject.getMonth() + 1
    }월`;
    return (
      <View>
        <Text style={{fontSize: 17, fontWeight: 600}}>{formattedDate}</Text>
      </View>
    );
  };

  return (
    <Modal transparent={true} visible={visable}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
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
            markedDates={selectedDayStyle}
            onDayPress={day => {
              closeModal();
              selectDayFunction(day.dateString);
              console.log(day.dateString);
              setFetch(new Date().getTime());
            }}
            renderHeader={date => CustomHeaderComponent({date})}
          />
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
