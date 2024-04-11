import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Text,
  Pressable,
  Image,
  Dimensions,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

import {
  deleteBoard,
  replyDelete,
  relpyModify,
} from '../../service/BoardService';
import {useQueryClient} from 'react-query';
import {useNavigation} from '@react-navigation/native';
import {ProfileImage} from '../../component/ProfilePick';
import {declarationBoard,declarationReplyId} from '../../service/BoardService';
import {declarationToast} from '../../store/Item';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const tropyViewSize = screenWidth * 0.6;
const closeIconSize = screenWidth * 0.07;
const buttonIconSize = screenWidth * 0.05;
const buttonView = screenHeight / 15;

export function FeedSetting({closeModal, state, boardID, type, flag}) {
  const isModalVisible = state;
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const {setBoard} = declarationToast();
  console.log(flag);
  function FeedDeleteFunction() {
    deleteBoard(boardID)
      .then(() => {
        queryClient.invalidateQueries('myPostListQueryKey');
        queryClient.refetchQueries('viewFeedKey');

        if (type) {
          navigation.goBack();
        }
      })
      .catch(res => {
        console.log(res);
      });

    closeModal();
  }

  function FeedWriteFunction() {
    closeModal();
    navigation.navigate('FeedReWrite', {boardID: boardID});
  }

  function DeclarationFun() {
    console.log('다원아 신고하기 ', boardID);
    declarationBoard(boardID);
    setBoard(boardID);
    closeModal();
  }

  return (
    <View style={{flex: 1, justifyContent: 'flex-end'}}>
      <Modal
        // animationType="slide" 할까말까 고민중
        transparent={true}
        visible={isModalVisible}>
        {!isDeleteModalVisible ? (
          <View style={styles.bottomView}>
            <View style={styles.modalView}>
              <Pressable style={{flexDirection: 'row', marginBottom: '7%'}}>
                <Pressable onPress={closeModal}>
                  <Image
                    style={{height: closeIconSize, width: closeIconSize}}
                    source={require('../../../assets/close.png')}></Image>
                </Pressable>

                <Text style={styles.titleStyle}>
                  {flag ? '게시글 신고하기' : '게시글 설정'}
                </Text>
              </Pressable>
              {!flag ? (
                <>
                  <Pressable
                    style={[styles.button, styles.buttonModify]}
                    onPress={FeedWriteFunction}>
                    <Image
                      style={{height: buttonIconSize, width: buttonIconSize}}
                      source={require('../../../assets/pencil.png')}></Image>
                    <Text style={styles.textStyle}>수정하기</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.buttonDelete]}
                    onPress={() => setDeleteModalVisible(true)}>
                    <Image
                      style={{height: buttonIconSize, width: buttonIconSize}}
                      source={require('../../../assets/trash.png')}></Image>
                    <Text style={[styles.textStyle, {color: 'white'}]}>
                      삭제하기
                    </Text>
                  </Pressable>
                </>
              ) : (
                <Pressable
                  style={[
                    styles.button,
                    styles.buttonModify,
                    {marginTop: '15%'},
                  ]}
                  onPress={DeclarationFun}>
                  <Image
                    style={{height: buttonIconSize, width: buttonIconSize}}
                    source={require('../../../assets/flag.png')}></Image>
                  <Text style={styles.textStyle}>신고하기</Text>
                </Pressable>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.centeredView}>
            <View style={styles.deleteModalView}>
              <View style={{alignItems: 'center'}}>
                <Text style={[styles.deleteTitleStyle]}>
                  게시글을 삭제하시겠습니까?
                </Text>
                <Text style={[styles.contentText, {color: '#7E7E7E'}]}>
                  게시글을 비롯한 댓글이 모두 삭제됩니다.
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
                    <Text style={[styles.textStyle, {color: 'white'}]}>
                      취소
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.button,
                      styles.buttonDelete,
                      {width: screenWidth / 3},
                    ]}
                    onPress={FeedDeleteFunction}>
                    <Text style={[styles.textStyle, {color: 'white'}]}>
                      삭제
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
}

export function ReplySetting({
  closeModal,
  state,
  boardID,
  postID,
  content,
  time,
  profileImage,
  name,
  type,
}) {
  const isModalVisible = state;
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isModify, setIsModify] = useState(false);
  const [count, seycount] = useState(0);
  const [isContent, setIsContent] = useState(content);
  const queryClient = useQueryClient();
  const {setComment} = declarationToast();

  const inputRef = useRef(null);

  function FeedDeleteFunction() {
    replyDelete(postID, boardID)
      .then(() => {
        queryClient.invalidateQueries('ReplyViewQueryKey');

        setDeleteModalVisible(false);
      })
      .catch(res => {
        console.log(res);
      });

    closeModal();
  }

  function FeedModifyFunction() {
    const userDTO = {content: isContent};
    relpyModify(postID, boardID, userDTO)
      .then(() => {
        queryClient.invalidateQueries('ReplyViewQueryKey');
        setIsModify(false);
        setDeleteModalVisible(false);

        closeModal();
      })
      .catch(res => {
        console.log(res);
      });
  }

  function FeedWriteFunction() {
    setIsModify(true);
    setDeleteModalVisible(true);
    seycount(count + 1);
  }

  const handleLayout = () => {
    // onLayout 이벤트에서 input에 자동으로 포커스를 맞춥니다.
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  function DeclarationFun() {
    console.log('다원아 신고하기 ', boardID, postID);
    declarationReplyId(boardID);
    setComment(boardID);
    closeModal();
  }

  useEffect(() => {
    handleLayout();
  }, [count]);

  return (
    <View style={{flex: 1, justifyContent: 'flex-end'}}>
      <Modal
        // animationType="slide" 할까말까 고민중
        transparent={true}
        visible={isModalVisible}>
        {!isDeleteModalVisible ? (
          <View style={styles.bottomView}>
            <View style={styles.modalView}>
              <Pressable style={{flexDirection: 'row', marginBottom: '7%'}}>
                <Pressable
                  onPress={() => {
                    seycount(count + 1);
                    closeModal();
                  }}>
                  <Image
                    style={{height: closeIconSize, width: closeIconSize}}
                    source={require('../../../assets/close.png')}
                  />
                </Pressable>

                <Text style={styles.titleStyle}>
                  {type ? '댓글 신고하기' : '댓글 설정'}
                </Text>
              </Pressable>
              {type ? (
                <Pressable
                  style={[styles.button, styles.buttonModify]}
                  onPress={() => {
                    DeclarationFun();
                  }}>
                  <Image
                    style={{height: buttonIconSize, width: buttonIconSize}}
                    source={require('../../../assets/flag.png')}></Image>
                  <Text style={styles.textStyle}>신고하기</Text>
                </Pressable>
              ) : (
                <>
                  <Pressable
                    style={[styles.button, styles.buttonModify]}
                    onPress={() => {
                      FeedWriteFunction();
                      handleLayout();
                      setIsContent(content);
                    }}>
                    <Image
                      style={{height: buttonIconSize, width: buttonIconSize}}
                      source={require('../../../assets/pencil.png')}></Image>
                    <Text style={styles.textStyle}>수정하기</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.buttonDelete]}
                    onPress={() => {
                      setDeleteModalVisible(true);
                      setIsModify(false);
                    }}>
                    <Image
                      style={{height: buttonIconSize, width: buttonIconSize}}
                      source={require('../../../assets/trash.png')}></Image>
                    <Text style={[styles.textStyle, {color: 'white'}]}>
                      삭제하기
                    </Text>
                  </Pressable>
                </>
              )}
            </View>
          </View>
        ) : isModify ? (
          <KeyboardAvoidingView
            style={styles.bottomView}
            behavior={Platform.OS === 'ios' ? 'padding' : null}>
            <View style={styles.modifymodalView}>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View>
                  <Pressable style={{flexDirection: 'row'}}>
                    <Pressable
                      onPress={() => {
                        closeModal();
                        setIsModify(false);
                        setDeleteModalVisible(false);
                      }}>
                      <Image
                        style={{height: closeIconSize, width: closeIconSize}}
                        source={require('../../../assets/close.png')}></Image>
                    </Pressable>

                    <Text style={styles.titleStyle}>댓글 수정하기</Text>
                  </Pressable>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: '4%',
                      marginBottom: '4%',
                    }}>
                    <ProfileImage profilePicUrl={profileImage} />

                    <View style={{marginLeft: '2%', marginRight: 'auto'}}>
                      <Text style={{fontSize: 13, fontWeight: 600}}>
                        {name}
                      </Text>
                      <Text style={{marginTop: '4%', color: '#CBCBCB'}}>
                        {time}
                      </Text>
                    </View>
                  </View>

                  <TextInput
                    multiline
                    maxHeight={'35%'} //ios
                    numberOfLines={4}
                    maxLength={240}
                    onChangeText={text => setIsContent(text)}
                    value={isContent}
                    ref={inputRef}
                    style={{height: 'auto'}}
                  />
                  <View
                    style={{
                      backgroundColor: '#F0F0F0',
                      height: 1,
                      marginBottom: '4%',
                    }}
                  />
                </View>
              </TouchableWithoutFeedback>

              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Pressable
                  style={[
                    styles.button,
                    styles.buttonModifyCommit,
                    {width: '100%'},
                  ]}
                  onPress={FeedModifyFunction}>
                  <Text style={[styles.textStyle, {color: 'white'}]}>수정</Text>
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        ) : (
          <View style={styles.centeredView}>
            <View style={styles.deleteModalView}>
              <View style={{alignItems: 'center'}}>
                <Text style={[styles.deleteTitleStyle]}>
                  댓글을 삭제하시겠습니까?
                </Text>
                <Text style={[styles.contentText, {color: '#7E7E7E'}]}>
                  선택한 댓글이 영구적으로 삭제됩니다.
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
                    onPress={() => {
                      closeModal();
                      setDeleteModalVisible(false);
                    }}>
                    <Text style={[styles.textStyle, {color: 'white'}]}>
                      취소
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.button,
                      styles.buttonDelete,
                      {width: screenWidth / 3},
                    ]}
                    onPress={FeedDeleteFunction}>
                    <Text style={[styles.textStyle, {color: 'white'}]}>
                      삭제
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        )}
      </Modal>
    </View>
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
    borderRadius: 20,
    paddingTop: '8%',
    paddingHorizontal: '6%',
    width: screenWidth,
    height: tropyViewSize,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  modifymodalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: '8%',
    paddingHorizontal: '6%',
    width: screenWidth,
    height: 'auto',

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
  buttonModifyCommit: {
    backgroundColor: '#1DC2FF',
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
