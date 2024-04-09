import React, {useState} from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Text,
  Dimensions,
  Pressable,
  Image,
  TouchableOpacity,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {TodoDateSetting} from '../../store/Item';

const {width} = Dimensions.get('window');
const closeIconSize = width * 0.07;

export function TimeSelectModal({visable, closeModal, timetype}) {
  const [joinDate, setJoinDate] = useState(new Date());
  const {setTimeDate, setEndTimData, setAlarmState} = TodoDateSetting();
  const minutes = joinDate.getMinutes();

  const handleCalculateTime = () => {
    const hours = joinDate.getHours();
    const minutes = String(joinDate.getMinutes()).padStart(2, '0');
    let period = 'AM';

    if (hours >= 12) {
      period = 'PM';
    }

    let formattedHours = hours % 12;
    formattedHours = formattedHours ? formattedHours : 12;

    const formattedTime = `${period}${formattedHours}:${minutes}`;

    if (timetype === 'end') {
      setEndTimData(formattedTime);
    } else {
      setTimeDate(formattedTime);
    }

    closeModal();
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

            <Text style={styles.titleStyle}>시간 선택</Text>
          </View>

          <View style={{alignItems: 'center', marginBottom: '3%'}}>
            <DatePicker
              date={joinDate}
              mode={'time'}
              minuteInterval={5}
              onDateChange={newDate => {
                setJoinDate(newDate);
              }}
              textColor="black"
            />
          </View>

          <View
            style={{
              height: 2,
              backgroundColor: '#F0F0F0',
              marginBottom: '4%',
            }}
          />
          <View
            style={[
              styles.rowcontainer,
              {
                justifyContent: 'space-between',
                marginHorizontal: '2%',
                marginBottom: '1%',
              },
            ]}>
            <TouchableOpacity
              onPress={() => {
                if (timetype === 'end') {
                  setEndTimData('');
                } else {
                  setTimeDate('');
                }
                setAlarmState('');
                closeModal();
              }}>
              <View
                style={[styles.opctionButton, {backgroundColor: '#ECFBFF'}]}>
                <Text style={[styles.opctionText, {color: '#1DC2FF'}]}>
                  설정하지 않기
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCalculateTime}
              disabled={minutes % 5 !== 0}>
              <View
                style={[
                  styles.opctionButton,
                  {backgroundColor: minutes % 5 !== 0 ? '#CBCBCB' : '#1DC2FF'},
                ]}>
                <Text style={[styles.opctionText, {color: 'white'}]}>
                  적용하기
                </Text>
              </View>
            </TouchableOpacity>
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
  opctionButton: {
    borderRadius: 8,
    padding: 20,
    paddingHorizontal: '10%',
    alignItems: 'center',
  },
  opctionText: {fontSize: 16},
  titleStyle: {
    flex: 0.9,
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 19,
    color: 'black',
  },
});
