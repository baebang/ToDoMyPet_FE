import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Text,
  Pressable,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {useQueryClient} from 'react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  logoutUser,
  deleteAccount,
  friendsDeleteCheck,
} from '../../service/MyPageService';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const buttonView = screenHeight / 15;

export function LogoutModal({closeModal, state}) {
  const isModalVisible = state;
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const clearAllStorage = async () => {
    try {
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('accessToken');

      console.log('스토리지가 성공적으로 비워졌습니다.');
    } catch (error) {
      console.error('스토리지 비우기 실패:', error);
    }
  };

  async function LogoutFunction() {
    const token = await AsyncStorage.getItem('FCMToken');
    console.log(token, '로그아웃 토큰');
    const userDTO = {
      fcmToken: 'string',
    };
    clearAllStorage();
    closeModal();
    logoutUser(userDTO);
    navigation.navigate('Home');
    queryClient.removeQueries();
  }

  return (
    <View style={{flex: 1, justifyContent: 'flex-end'}}>
      <Modal transparent={true} visible={isModalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.deleteModalView}>
            <View style={{alignItems: 'center'}}>
              <Text style={[styles.deleteTitleStyle]}>
                로그아웃 하시겠습니까?
              </Text>
              <Text style={[styles.contentText, {color: '#7E7E7E'}]}>
                투두마이펫 계정에서 로그아웃되며, {'\n'}회원가입-로그인 화면으로
                돌아갑니다.
              </Text>
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Pressable
                  style={[
                    styles.button,
                    {
                      backgroundColor: '#CBCBCB',
                      width: screenWidth / 3,
                      marginRight: screenWidth / 30,
                    },
                  ]}
                  onPress={closeModal}>
                  <Text style={[styles.textStyle, {color: 'white'}]}>취소</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.button,
                    styles.buttonDelete,
                    {width: screenWidth / 3},
                  ]}
                  onPress={LogoutFunction}>
                  <Text style={[styles.textStyle, {color: 'white'}]}>
                    로그아웃
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export function SettingOutModal({closeModal, state, pathName}) {
  const isModalVisible = state;
  const navigation = useNavigation();

  function LogoutFunction() {
    closeModal();
    navigation.goBack();
  }

  return (
    <View style={{flex: 1, justifyContent: 'flex-end'}}>
      <Modal transparent={true} visible={isModalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.deleteModalView}>
            <View style={{alignItems: 'center'}}>
              <Text style={[styles.deleteTitleStyle]}>
                {pathName}에서 나가시겠습니까?
              </Text>
              <Text style={[styles.contentText, {color: '#7E7E7E'}]}>
                우측 상단의 ‘적용' 버튼을 누르지 않으면
                {'\n'}작성 중인 내용이 저장되지 않습니다.
              </Text>
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Pressable
                  style={[
                    styles.button,
                    {
                      backgroundColor: '#CBCBCB',
                      width: screenWidth / 3,
                      marginRight: screenWidth / 30,
                    },
                  ]}
                  onPress={closeModal}>
                  <Text style={[styles.textStyle, {color: 'white'}]}>취소</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.button,
                    styles.buttonSettingOut,
                    {width: screenWidth / 3},
                  ]}
                  onPress={LogoutFunction}>
                  <Text style={[styles.textStyle, {color: 'white'}]}>
                    나가기
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export function FriendDeleteModal({closeModal, state, friendID, Key}) {
  const isModalVisible = state;
  const queryClient = useQueryClient();

  async function DeleteFunction() {
    await friendsDeleteCheck(friendID);
    if (Key) {
      queryClient.refetchQueries(['FriendAddQueryKey', Key]);
    }
    await queryClient.refetchQueries('myFriendQueryKey');
    await queryClient.refetchQueries('myPageQueryKey');
    await queryClient.refetchQueries('BlockFriendListKey');
    closeModal();
  }

  return (
    <View style={{flex: 1, justifyContent: 'flex-end'}}>
      <Modal transparent={true} visible={isModalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.deleteModalView}>
            <View style={{alignItems: 'center'}}>
              <Text style={[styles.deleteTitleStyle]}>
                친구에서 삭제하시겠습니까?
              </Text>
              <Text style={[styles.contentText, {color: '#7E7E7E'}]}>
                삭제하는 경우 상대방의 친구 목록에서{'\n'}
                사라지게됩니다.
              </Text>
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Pressable
                  style={[
                    styles.button,
                    {
                      backgroundColor: '#CBCBCB',
                      width: screenWidth / 3,
                      marginRight: screenWidth / 30,
                    },
                  ]}
                  onPress={closeModal}>
                  <Text style={[styles.textStyle, {color: 'white'}]}>취소</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.button,
                    styles.buttonDelete,
                    {width: screenWidth / 3},
                  ]}
                  onPress={DeleteFunction}>
                  <Text style={[styles.textStyle, {color: 'white'}]}>삭제</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export function AccountDeleteModal({closeModal, state}) {
  const isModalVisible = state;
  const navigation = useNavigation();
  const clearAllStorage = async () => {
    try {
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('accessToken');
      console.log('스토리지가 성공적으로 비워졌습니다.');
    } catch (error) {
      console.error('스토리지 비우기 실패:', error);
    }
  };

  function LogoutFunction() {
    clearAllStorage();
    closeModal();
    deleteAccount();
    navigation.navigate('Home');
  }

  return (
    <Modal transparent={true} visible={isModalVisible}>
      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <View style={styles.centeredView}>
          <View style={styles.deleteModalView}>
            <View style={{alignItems: 'center'}}>
              <Text style={[styles.deleteTitleStyle]}>탈퇴 하시겠습니까?</Text>
              <Text style={[styles.contentText, {color: '#7E7E7E'}]}>
                탈퇴하시는 경우 {'\n'}재가입은 다음 달 1일부터 가능합니다.
              </Text>
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Pressable
                  style={[
                    styles.button,
                    {
                      backgroundColor: '#CBCBCB',
                      width: screenWidth / 3,
                      marginRight: screenWidth / 30,
                    },
                  ]}
                  onPress={closeModal}>
                  <Text style={[styles.textStyle, {color: 'white'}]}>취소</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.button,
                    styles.buttonDelete,
                    {width: screenWidth / 3},
                  ]}
                  onPress={LogoutFunction}>
                  <Text style={[styles.textStyle, {color: 'white'}]}>
                    탈퇴하기
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export function EndRepeatTodoModal({
  closeModal,
  state,
  content,
  modalFunction,
  startedAtDate,
}) {
  const isModalVisible = state;

  console.log(startedAtDate);

  let additionalText;
  if (content === '수정') {
    additionalText = `${startedAtDate} 부터 \n 수정사항이 적용됩니다.`;
  } else if (content === '삭제') {
    additionalText = '반복옵션일 경우 적용된 \n 모든 할일이 삭제됩니다';
  } else if (content === '종료') {
    additionalText = `${startedAtDate} 부터 \n 모든 할일이 삭제됩니다.`;
  }

  return (
    <Modal transparent={true} visible={isModalVisible}>
      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <View style={styles.centeredView}>
          <View style={styles.deleteModalView}>
            <View style={{alignItems: 'center'}}>
              <Text style={[styles.deleteTitleStyle]}>
                할일을 {content} 하시겠습니까?
              </Text>
              <Text style={[styles.contentText, {color: '#7E7E7E'}]}>
                {additionalText}
              </Text>
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Pressable
                  style={[
                    styles.button,
                    {
                      backgroundColor: '#CBCBCB',
                      width: screenWidth / 3,
                      marginRight: screenWidth / 30,
                    },
                  ]}
                  onPress={closeModal}>
                  <Text style={[styles.textStyle, {color: 'white'}]}>취소</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.button,
                    styles.buttonDelete,
                    {
                      width: screenWidth / 3,
                      backgroundColor: content === '수정' ? '#1DC2FF' : 'red',
                    },
                  ]}
                  onPress={() => {
                    modalFunction();
                    closeModal();
                  }}>
                  <Text style={[styles.textStyle, {color: 'white'}]}>
                    {content}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
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
    paddingHorizontal: '13%',
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
  buttonDelete: {
    backgroundColor: 'red',
  },
  buttonSettingOut: {backgroundColor: '#1DC2FF'},
  textStyle: {
    color: '#7E7E7E',
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: '3%',
  },
  deleteTitleStyle: {
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 19,
  },
  contentText: {
    marginTop: '5%',
    marginBottom: '9%',
    textAlign: 'center',
  },
});
