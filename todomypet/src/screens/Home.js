import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Platform,
  Alert,
  Pressable,
  Vibration,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {reissueToken} from '../service/SingUp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PermissionModal from '../modal/MainHome/PermitionModal';
import {HolidayFunction} from './HolidayArr';
import {callGetMainPet} from '../service/PetService';
import {useQueryClient} from 'react-query';
import {viewFeed} from '../service/BoardService';
import {holidayShow} from '../service/TodoService';

import messaging from '@react-native-firebase/messaging';
import pushNoti from '../store/pushNoti';

export default function Home() {
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  useEffect(() => {
    refreshTokenSetting();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage.data.type === 'FRIEND') {
        //친구일때 갱신해야하는 값 (친구 리스트, 피드)
        queryClient.refetchQueries('myPageQueryKey');
        queryClient.fetchQuery('viewFeedKey', () => viewFeed(null));
      } else if (remoteMessage.data.type === 'ACHIEVE') {
        //업적일때 갱신해야하는 값
        queryClient.refetchQueries('myPageQueryKey');
        queryClient.refetchQueries('achievmentsQueryKey');

        //achievmentsQueryKey
      } else if (remoteMessage.data.type === 'REPLY') {
        //댓글일때 갱신해야하는 값
      }

      pushNoti.displayNoti(remoteMessage); // 위에서 작성한 함수로 넘겨준다
      Vibration.vibrate([400]);
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('백그라운드에서 푸시 알림 수신:', remoteMessage);
      pushNoti.displayNoti(remoteMessage);
    });

    return unsubscribe;
  }, []);

  async function refreshTokenSetting() {
    //자동로그인
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    console.log('refreshToken: ', refreshToken);

    try {
      const res = await reissueToken(refreshToken);
      console.log(res, '성공');
      callGetMainPet().then(res => {
        if (res) {
          navigation.navigate('BottomNavigation');
        } else {
          navigation.navigate('SelectEggPage');
        }
      });

      // 성공한 경우 실행할 코드를 여기에 추가합니다.
    } catch (err) {
      // 실패한 경우 실행할 코드를 여기에 추가합니다.
      if (err.response && err.response.status === 401) {
        console.log('토큰만료');
      }
    }
  }

  return (
    <ImageBackground
      source={require('../../assets/homeground.png')} // 이미지 파일 경로 설정
      style={styles.backgroundImage}>
      <PermissionModal />
      <View style={styles.title}>
        <Text style={{fontSize: 14, fontWeight: 400, color: '#5F5F5F'}}>
          내 손으로 키우는 나의 하루, 투두 마이펫
        </Text>
        <Text style={[styles.titlefont, {fontFamily: 'VCRosdNEUE'}]}>
          To Do My Pet
        </Text>
      </View>

      <View style={styles.asset}>
        <Image
          style={{width: 140, height: 140}}
          source={require('../../assets/symbol.png')}
        />
      </View>

      <View style={styles.buttoncontainer}>
        <View style={styles.singframe}>
          <Text
            style={styles.singup}
            onPress={() => navigation.navigate('SignUp')}>
            시작하기
          </Text>
        </View>
        <View style={styles.startframe}>
          <Text
            style={[styles.start, {color: 'black'}]}
            onPress={() => navigation.navigate('Login')}>
            이미 계정이 있어요
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}
//InitMainHomePage

const styles = StyleSheet.create({
  backgroundImage: {flex: 10, resizeMode: 'cover'}, // 배경 이미지 스타일
  // 나머지 스타일
  title: {flex: 4, justifyContent: 'center', alignItems: 'center'},
  titlefont: {fontSize: 36, fontWeight: 600, color: '#00B2F3', marginTop: 8},
  asset: {flex: 1.8, alignItems: 'center'},
  buttoncontainer: {flex: 1.6, padding: 17},
  singframe: {
    flex: 0.3,
    borderRadius: 8,
    height: 20,
    marginBottom: 8,
    backgroundColor: '#00B2F3',
    borderColor: '#00B2F3',
    borderWidth: 1,
    justifyContent: 'center',
  },
  startframe: {
    flex: 0.3,
    height: 20,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    borderColor: '#CBCBCB',
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
  },

  singup: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 16,
  },
  start: {textAlign: 'center', fontWeight: '500', fontSize: 16},
});
