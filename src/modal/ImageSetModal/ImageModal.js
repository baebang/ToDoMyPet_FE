import React, {useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Text,
  Pressable,
  Image,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';

import ImagePicker, {
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

import {
  check,
  request,
  openSettings,
  RESULTS,
  PERMISSIONS,
} from 'react-native-permissions';

import {FeedImageArray, UserSetting} from '../../store/Item';
import Toast from 'react-native-easy-toast';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const closeIconSize = screenWidth * 0.07;
const buttonView = screenHeight / 15;

const options = {
  includeBase64: true, // includeBase64를 true로 설정
};

const settingModal = type => {
  Alert.alert(
    `${type} 권한 활성화`,
    `현재 ${type} 권한은 비활성화되어 있습니다. 수정을 원하시면 [환경] 앱으로 이동하십시오.`,
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
};

const requestCameraPermission = async () => {
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') return;
  const platformPermissions =
    Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;

  const result = await request(platformPermissions);
  if (result != RESULTS.GRANTED) {
    settingModal('카메라');
  } else {
    return true;
  }
};

const requestImagePermission = async () => {
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') return;
  const platformPermissions =
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.PHOTO_LIBRARY
      : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

  const result = await request(platformPermissions);
  if (result != RESULTS.GRANTED) {
    settingModal('사진첩');
  } else {
    return true;
  }
};

const FilmingUser = async (setFeedImage, closeModal, FeedImage, toastRef) => {
  if (FeedImage.length >= 4) {
    closeModal();
    toastRef.current.show('사진은 최대 4장까지 가능합니다.');
    return;
  }

  const Filminoptions = {
    includeBase64: true,
  };
  const hasPermission = await requestCameraPermission();
  if (hasPermission) {
    launchCamera(Filminoptions, response => {
      if (response.error) {
        console.log('LaunchCamera Error: ', response.error);
      } else {
        console.log(response, '=response=');
        if (response) {
          if (
            response &&
            response.assets &&
            response.assets.length > 0 &&
            response.assets[0].base64
          ) {
            setFeedImage(response.assets[0].base64);
          } else {
            // 예외 처리: response.assets 배열이 비어있거나 base64 값이 정의되지 않은 경우
            console.log('Cannot convert undefined value to object');
            // 또는 다른 처리를 수행할 수 있습니다.
          }

          closeModal();
        }
      }
    });
  }
};

const SelectImages = async (setFeedImage, closeModal, FeedImage, toastRef) => {
  //이미지 다중선택

  if (FeedImage.length >= 4) {
    closeModal();
    toastRef.current.show('사진은 최대 4장까지 가능합니다.');
    return;
  }

  const selectoptions = {
    includeBase64: true,
    selectionLimit: 4 - FeedImage.length, //최대 4장까지만 선택 가능하게 limit을 현재 사진 셀렉갯수를 감안하여 임의로 조정
  };

  const hasPermission = await requestImagePermission();
  if (hasPermission) {
    launchImageLibrary(selectoptions, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else if (response.assets) {
        const selectedImages = response.assets.map(asset => ({
          uri: asset.uri,
          base64: asset.base64,
        }));

        console.log('Selected Images: ', selectedImages.length);

        selectedImages.forEach(item => {
          setFeedImage(item.base64);
        });

        // Handle the selected images as needed
      }
    });
  }
};

async function CameraCapture(closeModal, setUserImage, userImage) {
  const hasPermission = await requestCameraPermission();
  if (hasPermission) {
    launchCamera(options, response => {
      if (
        response &&
        response.assets &&
        response.assets.length > 0 &&
        response.assets[0].base64
      ) {
        userImage(response.assets[0].uri);
        closeModal();
        setUserImage(response.assets[0].base64);
      } else {
        console.log('LaunchCamera Error: ', response.error);
      }
    });
  }
}

async function SingleImage(closeModal, setUserImage, userImage) {
  //이미지 단일 선택
  const hasPermission = await requestImagePermission();
  if (hasPermission) {
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        userImage(imageUri);
        setUserImage(response.assets[0].base64);
        closeModal();
      }
    });
  }
}

function DefaultImage(closeModal, setUserImage, userImage) {
  //기본이미지 변경
  userImage('');
  setUserImage('clear');
  closeModal();
}

export function FeedImageModal({closeModal, state}) {
  const isModalVisible = state;
  const {setFeedImage, FeedImage} = FeedImageArray();

  const toastRef = useRef();

  return (
    <>
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
        positionValue={screenHeight * 0.7}
        fadeInDuration={200}
        fadeOutDuration={1000}
      />
      <Modal
        // animationType="slide" 할까말까 고민중
        transparent={true}
        visible={isModalVisible}>
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <View style={styles.bottomView}>
            <View style={styles.modalView}>
              <Pressable style={{flexDirection: 'row', marginBottom: '7%'}}>
                <Pressable onPress={closeModal}>
                  <Image
                    style={{height: closeIconSize, width: closeIconSize}}
                    source={require('../../../assets/close.png')}></Image>
                </Pressable>

                <Text style={styles.titleStyle}>사진 첨부 선택</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonModify]}
                onPress={() =>
                  FilmingUser(setFeedImage, closeModal, FeedImage, toastRef)
                }>
                <Text style={styles.textStyle}>카메라로 촬영하기</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonModify]}
                onPress={() =>
                  SelectImages(setFeedImage, closeModal, FeedImage, toastRef)
                }>
                <Text style={styles.textStyle}>사진 선택하기</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

export function ProfileImageModal({closeModal, state, userImage}) {
  const isModalVisible = state;
  const {setUserImage} = UserSetting();

  return (
    <>
      <Modal
        // animationType="slide" 할까말까 고민중
        transparent={true}
        visible={isModalVisible}>
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <View style={styles.bottomView}>
            <View style={styles.modalView}>
              <Pressable style={{flexDirection: 'row', marginBottom: '7%'}}>
                <Pressable onPress={closeModal}>
                  <Image
                    style={{height: closeIconSize, width: closeIconSize}}
                    source={require('../../../assets/close.png')}></Image>
                </Pressable>

                <Text style={styles.titleStyle}>프로필 사진 선택</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonModify]}
                onPress={() =>
                  CameraCapture(closeModal, setUserImage, userImage)
                }>
                <Text style={styles.textStyle}>카메라로 촬영하기</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonModify]}
                onPress={() =>
                  SingleImage(closeModal, setUserImage, userImage)
                }>
                <Text style={styles.textStyle}>사진 선택하기</Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.buttonModify]}
                onPress={() =>
                  DefaultImage(closeModal, setUserImage, userImage)
                }>
                <Text style={styles.textStyle}>기본이미지 변경</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  bottomView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: '13%',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: '8%',
    paddingHorizontal: '6%',
    paddingBottom: '3%',
    width: screenWidth,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  deleteModalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingTop: '15%',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: screenWidth * 0.87,
    height: screenHeight * 0.26,
  },
  button: {
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '4%',
    height: buttonView,
  },
  buttonModify: {
    backgroundColor: '#F0F0F0',
  },
  buttonDelete: {
    backgroundColor: 'red',
  },
  textStyle: {
    color: '#7E7E7E',
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: '3%',
  },
  titleStyle: {
    flex: 0.9,
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 19,
  },
  deleteTitleStyle: {
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 19,
  },
  contentText: {marginTop: '5%', marginBottom: '9%', textAlign: 'center'},
  textContainer: {
    backgroundColor: '#ECFBFF',
    paddingHorizontal: 10, // 테두리 둥글기를 보여주기 위해 여백 추가
    paddingVertical: 5,
    borderRadius: 4,
  },

  tropycontent: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    padding: '6%',
    marginTop: '7%',
    marginBottom: '7%',
  },
});
