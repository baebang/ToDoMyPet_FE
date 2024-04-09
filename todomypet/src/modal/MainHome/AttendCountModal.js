import React, {useEffect, useState} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';
import {
  attendanceContinue,
  attendanceUpdate,
  attendanceView,
} from '../../service/MyPageService';
import {useQuery, useQueryClient} from 'react-query';
import SubmitButton from '../../component/SubmitButton';
import {mainPageShow} from '../../service/MainService';
import {AdoptedList} from '../../service/MyPageService';

const {width, height} = Dimensions.get('window');
const closeIconSize = width * 0.07;
const arrowIconSize = width * 0.05;

export default function AttendCountModal({expImageToast}) {
  const [attendanceToToday, setAttendanceToToday] = useState(false);
  const queryClient = useQueryClient();
  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery('AttendanceCheckKey', attendanceView);

  useEffect(() => {
    try {
      setAttendanceToToday(lastAttendanceToToday);
    } catch {}
  }, [userData]);

  if (isLoading) {
    return <Text>MainPageShowQueryKey Loading...</Text>;
    // 로딩 중일 때 표시할 UI
  }

  if (isError) {
    return <Text>MainPageShowQueryKey Error fetching</Text>; // 에러 발생 시 표시할 UI
  }
  const {attendContinueCount, attendCount, lastAttendanceToToday} = userData;

  const sleeper = require('../../../assets/SleeperAccount.png');
  const first = require('../../../assets/FirstTimeAccount.png');
  const countinus = require('../../../assets/ContinuasAccount.png');

  return (
    <Modal transparent={true} visible={!!attendanceToToday}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={[styles.titleStyle, {fontSize: 15}]}>
            {attendCount === 1 ? '우리는 오늘' : '우리가 만난지 어느덧'}
            {'\n'} {attendCount}일째
          </Text>

          <Image
            source={
              attendCount === 1 && attendContinueCount === 1
                ? first
                : lastAttendanceToToday >= 10
                ? sleeper
                : countinus
            }
            style={{
              width: width * 0.85,
              height: height * 0.33,
              transform: [{scale: 0.7}],
              position: 'absolute',
              top: '15%',
              left: '-7%',
            }}
          />
          <View
            style={{
              backgroundColor: '#ECFBFF',
              alignItems: 'center',
              padding: '2%',
              borderRadius: 5,
              width: '50%',
              marginHorizontal: '25%',
              marginBottom: '4%',
              marginTop: '55%',
            }}>
            <Text style={{color: '#1DC2FF', fontWeight: 600}}>
              {attendContinueCount}일째 연속 출석
            </Text>
          </View>

          <SubmitButton
            state={true}
            comment={'출석 보상 받기'}
            onPress={() => {
              attendanceUpdate().then(res => {
                queryClient.refetchQueries('AttendanceCheckKey');
                queryClient.fetchQuery('MainPageShowQueryKey', mainPageShow);
                setAttendanceToToday(false);
                expImageToast('10');
              });
              attendanceContinue();
            }}
          />
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '3%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: '50%',
    width: '80%',
    paddingHorizontal: '5%',
    paddingTop: '7%',
  },
  rowcontainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 'auto',
  },
  titleStyle: {
    flex: 0.9,
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 19,
    color: 'black',
    fontFamily: 'DungGeunMo',
  },
});
