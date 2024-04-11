import React, {useState, useEffect} from 'react';
import {
  View,
  Modal,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Alert,
  AppState,
} from 'react-native';
import SubmitButton from '../../component/SubmitButton';
import {openSettings, checkNotifications} from 'react-native-permissions';

import {TodoDateSetting} from '../../store/Item';

const {width} = Dimensions.get('window');
const closeIconSize = width * 0.07;
const arrowIconSize = width * 0.05;

export default function AlarmTodoModal({visable, closeModal}) {
  const [alarmType, setAlarmType] = useState('');
  const {setAlarmState, EndData} = TodoDateSetting();
  const [isAlarmEnabled, setIsAlarmEnabled] = useState(false);
  const [isactive, setActive] = useState('');

  useEffect(() => {
    checkNotifications().then(({status}) => {
      if (status === 'granted') {
        setIsAlarmEnabled(true);
      } else {
        setIsAlarmEnabled(false);
      }
    });

    const handleAppStateChange = nextAppState => {
      setActive(nextAppState);
    };

    AppState.addEventListener('change', handleAppStateChange);

    // clean-up 함수
  }, [isactive]);

  const alarmToggleSwitch = async () => {
    // setIisAlarmEnabled(previousState => !previousState);
    // setUaerAlarm(isAlarmEnabled);

    if (isAlarmEnabled) {
      // 권한이 허용된 경우에만 특정 동작을 수행
      Alert.alert(
        '알림 권한 활성화',
        '현재 알림 권한은 활성화 되어있습니다. 수정을 원하실경우 [환경]앱으로 이동합니다.',
        [
          {
            text: '확인',
            onPress: () => openSettings(),
          },
          {
            text: '취소',
            onPress: () => console.log('취소되었습니다.'),
            style: 'cancel',
          },
        ],
      );
    } else {
      // 권한이 거부된 경우 알림 메시지 표시
      Alert.alert(
        '알림 권한 활성화',
        '현재 알림 권한은 비활성화 되어있습니다. 수정을 원하실경우 [환경]앱으로 이동합니다.',
        [
          {
            text: '확인',
            onPress: () => openSettings(),
          },
          {
            text: '취소',
            onPress: () => console.log('취소되었습니다.'),
            style: 'cancel',
          },
        ],
      );
    }
  };

  const alarmList = [
    '이벤트 시간',
    '5분 전',
    '10분 전',
    '15분 전',
    '30분 전',
    '1시간 전',
    '2시간 전',
    '1일 전',
    '2일 전',
    '1주 전',
  ];

  const isAlarmType = value => alarmType.includes(value);

  const alarmView = value => (
    <TouchableOpacity
      key={value}
      style={[styles.todocontainer, isAlarmType(value) && styles.selected]}
      onPress={() => setAlarmType(value)}>
      <Text>{value}</Text>
    </TouchableOpacity>
  );
  useEffect(() => {
    return () => {
      setAlarmType('');
    };
  }, []);

  return (
    <Modal transparent={true} visible={visable}>
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

              <Text style={styles.titleStyle}>알림 선택</Text>
            </View>
            {EndData ? (
              <Text style={{color: '#7E7E7E', fontWeight: 500}}>
                알림은 시작시간을 기준으로 합니다.
              </Text>
            ) : null}
            <View
              style={[
                styles.rowcontainer,
                {paddingTop: '4%', marginBottom: '5%'},
              ]}>
              <Text style={{color: 'black', fontWeight: 500}}>반복 주기 </Text>
              <Text
                style={{
                  color: isAlarmEnabled ? '#1DC2FF' : 'red',
                  fontWeight: 600,
                  marginRight: 3,
                }}>
                {isAlarmEnabled ? '알람 켜짐' : '알람 꺼짐'}
              </Text>

              <TouchableOpacity onPress={alarmToggleSwitch}>
                <Image
                  style={{
                    height: arrowIconSize,
                    width: arrowIconSize,
                  }}
                  source={require('../../../assets/arrowRight.png')}
                />
              </TouchableOpacity>
            </View>
            <ScrollView style={{height: 200}}>
              {alarmList.map(alarmView)}
            </ScrollView>
          </View>
          <View
            style={{
              height: 2,
              backgroundColor: '#F0F0F0',
            }}
          />
          <View style={{padding: '5%'}}>
            <SubmitButton
              state={alarmType}
              comment={'추가하기'}
              onPress={() => {
                setAlarmState(alarmType);
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
  todocontainer: {
    borderWidth: 2,
    borderColor: '#F0F0F0',
    borderRadius: 6,
    padding: '4%',
    marginBottom: '4%',
  },
  selected: {
    borderWidth: 2,
    borderColor: '#1DC2FF',
    borderRadius: 6,
    padding: '4%',
    marginBottom: '4%',
    backgroundColor: '#ECFBFF',
  },
});
