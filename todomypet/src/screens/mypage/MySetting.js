import {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Switch,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Pressable,
  Modal,
  Alert,
  AppState,
  ScrollView,
  Image,
  Linking,
} from 'react-native';
import {ProfilePick} from '../../component/ProfilePick';
import Toast from 'react-native-easy-toast';
//클립보드
import Clipboard from '@react-native-clipboard/clipboard';

import {LogoutModal} from '../../modal/MypageModal/Setting';
import {UserSetting} from '../../store/Item';
import {settingUserCheck} from '../../service/MyPageService';
import {useQuery} from 'react-query';
import {
  checkNotifications,
  requestNotification,
  openSettings,
} from 'react-native-permissions';
import Hyperlink from 'react-native-hyperlink';

const maxCharacterCount = 80; // 최대 글자 수
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const QnAURL =
  'https://docs.google.com/forms/d/e/1FAIpQLScXVeeHh2cygE6OP_gsP_o018D6jpe-LKo9I5iia-l8R7yJVw/viewform?usp=sf_link';

export default function MySetting({navigation}) {
  const [introduction, setIntroduction] = useState('');
  const [isPrivateEnabled, setIsPrivateEnabled] = useState(protect); //유저의 상태로 초기화 시키기
  const [isAlarmEnabled, setIsAlarmEnabled] = useState(false);
  const [isactive, setActive] = useState('');

  const [isLogoutModalVisible, setsLogoutModalVisible] = useState(false);
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

  // const handleAppStateChange = nextAppState => {
  //   setActive(nextAppState);
  // };
  // AppState.addEventListener('change', handleAppStateChange);

  const {
    setUserRename,
    setUsreReBio,
    setUserPrivate,

    setUserImage,
  } = UserSetting();

  const toastRef = useRef();

  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery('mySettingQueryKey', settingUserCheck, {
    onSuccess: data => {
      // 성공적으로 데이터를 받아왔을 때 실행되는 부분
      const {nickname, bio, protect, profilePicUrl} = data;
      const sanitizedProfilePicUrl = profilePicUrl !== '' ? 'unwavering' : null;

      setUserRename(nickname);
      setUsreReBio(bio);
      setUserImage(sanitizedProfilePicUrl);
      setIsPrivateEnabled(protect);
      setUserPrivate(protect);
    },
  });

  if (isLoading) {
    return <Text>Loading...</Text>; // 로딩 중일 때 표시할 UI
  }

  if (isError) {
    return <Text>Error fetching data</Text>; // 에러 발생 시 표시할 UI
  }

  const {nickname, bio, personalCode, profilePicUrl, protect} = userData;

  const privateToggleSwitch = async () => {
    await setIsPrivateEnabled(!isPrivateEnabled);

    await setUserPrivate(!isPrivateEnabled);
  };
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

  const handleIntroductionChange = text => {
    if (text.length <= maxCharacterCount) {
      setIntroduction(text);
      setUsreReBio(text);
    } else {
      toastRef.current.show('80자 이내로 작성해주세요');
    }
  };

  const handleNameChange = text => {
    if (text.length < 15) {
      setUserRename(text);
    } else {
      toastRef.current.show('15자 이내로 작성해주세요');
    }
  };

  function LogoutModalFeed() {
    setsLogoutModalVisible(true);
  }

  function LogoutcloseModal() {
    setsLogoutModalVisible(false);
  }

  const inviteFriend = async () => {
    try {
      await Clipboard.setString(personalCode);
      toastRef.current.show('초대 코드 복사가 완료되었습니다!');
    } catch (e) {
      toastRef.current.show(
        '초대 코드 복사에 실패했습니다. \n 관리자에게 문의해주세요',
      );
    }
  };

  return (
    <View style={{flex: 10}}>
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
        positionValue={height * 0.7}
        fadeInDuration={200}
        fadeOutDuration={1000}
      />
      <Modal transparent={true} visible={isLogoutModalVisible}>
        <LogoutModal closeModal={LogoutcloseModal} navi={navigation} />
      </Modal>

      <View style={{flex: 7}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.profileContainer, styles.container]}>
            <Text style={styles.textStyle}>프로필 설정</Text>
            <ProfilePick profilePicUrl={profilePicUrl} />
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.container}>
          <View style={[styles.textinput]}>
            <Text style={styles.label}>이름</Text>
            <TextInput
              style={[styles.input, {color: 'black'}]}
              placeholder={nickname}
              // // onFocus={handleFocus}
              maxLength={15}
              onChangeText={text => {
                handleNameChange(text);
              }}
              placeholderTextColor="#D1D1D2"
            />
          </View>
          <View style={[styles.textinput, {height: height / 8}]}>
            <Text style={styles.label}>소개</Text>
            <TextInput
              style={[styles.input, {color: 'black'}]}
              placeholder={bio}
              // onFocus={handleFocus}
              maxLength={81}
              onChangeText={text => {
                handleIntroductionChange(text);
              }}
              multiline={true}
              placeholderTextColor="#D1D1D2"
            />
            <Text style={styles.characterCount}>
              {introduction.length}/{maxCharacterCount}
            </Text>
          </View>
        </View>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView>
            <View style={styles.barStyle}></View>
            <View style={[styles.container, {marginBottom: '6%'}]}>
              <Text style={styles.textStyleMargin}>친구초대 코드</Text>
              <TouchableOpacity onPress={inviteFriend}>
                <ImageBackground
                  style={styles.copyIcon}
                  source={require('../../../assets/content_copy.png')}>
                  <Text style={{color: '#3F3F3F'}}>{personalCode}</Text>
                </ImageBackground>
              </TouchableOpacity>
            </View>
            <View style={styles.barStyle}></View>
            <View style={styles.container}>
              <Text style={styles.textStyleMargin}>설정</Text>

              <View style={styles.centerStyle}>
                <View style={{marginBottom: '3%'}}>
                  <Text style={{fontSize: 16, fontWeight: '600'}}>
                    비공개 설정
                  </Text>
                  <Text style={{color: '#7E7E7E', marginTop: '3%'}}>
                    친구가 아닌 사용자가 내 프로필을 볼 수 없습니다.
                  </Text>
                </View>
                <Switch
                  trackColor={{false: '#E4E4E4', true: '#000000'}}
                  thumbColor={isPrivateEnabled ? '#f4f3f4' : '#f4f3f4'}
                  ios_backgroundColor="#E4E4E4"
                  onValueChange={privateToggleSwitch}
                  value={isPrivateEnabled}
                />
              </View>
            </View>
            <View
              style={{
                width: width,
                height: 1,
                backgroundColor: '#F0F0F0',
              }}></View>
            <View style={styles.container}>
              <View style={{marginBottom: '3%', marginTop: '3%'}}>
                <View style={styles.centerStyle}>
                  <View>
                    <Text style={{fontSize: 16, fontWeight: '600'}}>
                      알림 설정
                    </Text>
                    <Text style={{color: '#7E7E7E', marginTop: '3%'}}>
                      푸시 메시지 알림을 받습니다.
                    </Text>
                  </View>

                  <Switch
                    trackColor={{false: '#E4E4E4', true: '#000000'}}
                    thumbColor={isAlarmEnabled ? '#f4f3f4' : '#f4f3f4'}
                    ios_backgroundColor="#E4E4E4"
                    onValueChange={alarmToggleSwitch}
                    value={isAlarmEnabled}
                  />
                </View>
              </View>
            </View>
            <View
              style={{
                width: width,
                height: 1,
                backgroundColor: '#F0F0F0',
              }}></View>
            <Pressable
              style={styles.container}
              onPress={() => Linking.openURL(QnAURL)}>
              <View style={{marginBottom: '13%', marginTop: '3%'}}>
                <View style={[styles.centerStyle]}>
                  <View>
                    <Text style={{fontSize: 16, fontWeight: '600'}}>
                      문의하기
                    </Text>
                  </View>

                  <Image
                    style={{height: 20, width: 20}}
                    source={require('../../../assets/arrowRight.png')}
                  />
                </View>
              </View>
            </Pressable>
          </ScrollView>
        </TouchableWithoutFeedback>
      </View>

      <View style={[styles.bottomView, {height: 60}]}>
        <Pressable
          style={styles.textUnderLine}
          onPress={() => navigation.navigate('Secession')}>
          <Text>탈퇴하기</Text>
        </Pressable>

        <Pressable style={styles.textUnderLine} onPress={LogoutModalFeed}>
          <Text>로그아웃</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {paddingTop: 11, paddingHorizontal: 12},
  profileContainer: {marginTop: '3%'},
  textinput: {
    height: 70,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D0D1D3',
    padding: 14,
    marginBottom: '3%',
  },
  textStyle: {fontSize: 14, fontWeight: 'bold'},
  textStyleMargin: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: '3%',
    marginBottom: '3%',
  },
  label: {
    fontSize: 12,
    color: '#82858F',
  },
  input: {
    fontSize: 17,
  },
  barStyle: {
    width: width,
    height: '5%',
    backgroundColor: '#FAFAFA',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  centerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomView: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  copyIcon: {height: height * 0.058, paddingTop: '4%', paddingHorizontal: 20},
  characterCount: {
    fontSize: 12,
    color: '#82858F',
    textAlign: 'right', // 숫자를 오른쪽 정렬
    position: 'absolute',
    bottom: 10,
    right: 16,
  },
  textUnderLine: {borderBottomWidth: 1, borderBottomColor: '#5F5F5F'},
});
