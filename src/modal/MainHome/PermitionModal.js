import React, {useState, useEffect} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  Platform,
  Image,
  Dimensions,
  Alert,
  PermissionsAndroid,
  NativeModules,
} from 'react-native';
import SubmitButton from '../../component/SubmitButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import pushNoti from '../../store/pushNoti';
import {checkNotifications} from 'react-native-permissions';

const {width} = Dimensions.get('window');
const closeIconSize = width * 0.14;

export default function PermissionModal() {
  const [isVisible, setVisible] = useState(false);
  const [isDisplay, setDisplay] = useState(true);

  useEffect(() => {
    const fetchPermissionStatus = async () => {
      const permissionStatus = await AsyncStorage.getItem('PermissionCheck');
      setVisible(permissionStatus !== 'check');
    };

    fetchPermissionStatus();

    return () => {
      fetchPermissionStatus();
    };
  }, []);
  // ios 사용자에게 알림권한 요청
  const iosRequestPermission = async () => {
    try {
      const authorizationStatus = await messaging().requestPermission();
      const apnsToken = await messaging().getAPNSToken();
      const fcmToken = await messaging().getToken();

      // 알림 권한이 허용되면 authorizationStatus 값에 대한 안내는 상단에 작성되어 있습니다.
      // authorizationStatus 값이 AUTHORIZED 일 때,
      if (authorizationStatus === 1) {
        // APNs 토큰이 등록되어 있지 않으면 getToken() 함수가 실패합니다.
        // FCM토큰을 가져오기 전에 APNs 토큰이 등록되어있는지 먼저 확인합니다.
        if (apnsToken) {
          // 와이즈트래커 SDK가 토큰을 수집합니다.
          storeFCMToken(fcmToken);
        }
      } else {
        console.log('알림권한 비 활성화:', fcmToken);
      }
    } catch (error) {
      console.log('ios error::', error);
    }
  };

  // Android 사용자에게 알림권한 요청
  const androidRequestPermission = async () => {
    const authorizationStatus = await messaging().requestPermission();
    console.log('authorizationStatus:', authorizationStatus);
    try {
      const fcmToken = await messaging().getToken();

      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            if (fcmToken) {
              return storeFCMToken(fcmToken);
              //토큰 수집
            }
          }
        }
        // API 레벨 32 이하일 때
        try {
          if (fcmToken) {
            //토큰 수집
            return storeFCMToken(fcmToken);
          }
        } catch (e) {
          console.log('android token API level 32 이하 error:', e);
        }
      }
    } catch (error) {
      console.log('Android error:', error);
    }
  };

  const storeFCMToken = async token => {
    try {
      await AsyncStorage.setItem('FCMToken', token);
      console.log('FCMToken 저장 성공:', token);
    } catch (error) {
      console.log('FCMToken 저장 실패:', error);
    }
  };

  const completeModal = async () => {
    try {
      await AsyncStorage.setItem('PermissionCheck', 'check');
      setVisible(false);
      Platform.OS === 'android'
        ? androidRequestPermission()
        : iosRequestPermission();
    } catch (error) {
      console.error('Error completing modal:', error);
    }
  };

  return (
    <Modal transparent={true} visible={isVisible}>
      <View
        style={[styles.centeredView, {display: isDisplay ? 'flex' : 'none'}]}>
        <View style={styles.modalView}>
          <Text style={styles.titleStyle}>앱 접근 권한 안내</Text>
          <Text
            style={{
              paddingTop: '10%',
              color: '#00B2F3',
              fontWeight: '600',
              fontSize: 15,
            }}>
            선택적 접근권한
          </Text>
          <View style={styles.rowcontainer}>
            <Image
              style={styles.contentContainer}
              source={require('../../../assets/permission_n.png')}
            />
            <View>
              <Text style={styles.contentTitle}>알림</Text>
              <Text style={{color: '#989898'}}>
                이벤트 알림, 피드 알림 푸시 메세지 발송
              </Text>
            </View>
          </View>
          <View style={styles.rowcontainer}>
            <Image
              style={styles.contentContainer}
              source={require('../../../assets/permission_c.png')}
            />
            <View>
              <Text style={styles.contentTitle}>사진/카메라</Text>
              <Text style={{color: '#989898'}}>
                프로필 및 피드 등록시 사진 첨부 및 {'\n'}사진 촬영
              </Text>
            </View>
          </View>
          <Text
            style={{
              marginTop: 'auto',
              textAlign: 'center',
              color: '#989898',
              marginBottom: '5%',
            }}>
            * 선택적 접근 권한은 해당 기능 사용시 허용이 필요하며, 비허용시에도
            해당 기능 외 서비스 이용은 가능합니다.
          </Text>
          <SubmitButton state={true} comment={'확인'} onPress={completeModal} />
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: '5%',
  },
  modalView: {
    backgroundColor: 'white',
    padding: '5%',
    width: '100%',
    height: '60%',
    borderRadius: 10,
  },
  rowcontainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  titleStyle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 19,
    color: 'black',
  },
  contentContainer: {
    height: closeIconSize,
    width: closeIconSize,
    marginRight: '4%',
    marginTop: '4%',
    marginBottom: '4%',
  },
  contentTitle: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 16,
    marginBottom: '2%',
  },
});
