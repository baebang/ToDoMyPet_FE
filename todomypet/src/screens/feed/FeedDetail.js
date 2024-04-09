import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Pressable,
  TouchableOpacity,
  Modal,
  Keyboard,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {
  viewBoardDetail,
  replyView,
  relpyCommit,
} from '../../service/BoardService';
import {useQuery, useQueryClient} from 'react-query';

import {likeSetting, likeUndo} from '../../service/BoardService';

import {FeedSetting} from '../../modal/BorderModal/FeedModal';
import Toast from 'react-native-easy-toast';

import {ProfileImage} from '../../component/ProfilePick';
import {PetBoardImage} from '../../component/PetInformation';
import elapsedText from '../../component/elapsedText';
import {ImageSetting} from '../../component/FeedPreview';
import {ReplyForm} from '../../component/ReplyForm';
import {memberCheck} from '../../service/MyPageService';
import {declarationToast} from '../../store/Item';

export default function FeedDetail() {
  const screenWidth = Dimensions.get('window').width;
  const {width, height} = Dimensions.get('window');
  const community = screenWidth * 0.05;
  const iconSize = screenWidth * 0.07;
  const [isKeboardState, setIsKeboardState] = useState(false);
  const route = useRoute();
  const {FeedId} = route.params;

  const queryClient = useQueryClient();
  const [isLikeState, setLikeState] = useState(); //삭제해라
  const [isUserInfo, setIsUserInfo] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isReply, setIsReply] = useState('');
  const toastRef = useRef(); // toast ref 생성
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const {CommentDeclaration, setComment} = declarationToast();
  const [showModal, setShowModal] = useState(false);

  // memberCheck().then(response => {

  useEffect(() => {
    memberCheck().then(response => {
      setIsUserInfo(response);
    });
  }, []);

  useEffect(() => {
    if (CommentDeclaration) {
      Alert.alert(
        '해당 댓글의 신고접수가 완료되었습니다.',
        '운영진 검토 후 해당 댓글이 삭제 될 수 있습니다. \n검토까지는 최대 24시간이 소요됩니다.\n추가 문의는 \n[마이페이지]-[화면 우측상단 톱니버튼]-[문의하기]를 통해 문의해주세요.',
        [{text: '확인', onPress: () => setComment('')}],
      );
    }
  }, [CommentDeclaration]);

  const {
    data: boardData,
    isLoading: isBoardLoading,
    isError: isBoardError,
  } = useQuery('ViewBoardQueryKey', () => viewBoardDetail(FeedId));

  const {
    data: replyData,
    isLoading: isReplyLoading,
    isError: isReplyError,
  } = useQuery('ReplyViewQueryKey', () => replyView(FeedId));

  const LoadingIndicator = () => <Text>Loading...</Text>;
  const ErrorIndicator = () => <Text>Error fetching data</Text>;

  if (isBoardLoading || isReplyLoading) {
    return <LoadingIndicator />;
  }

  if (isBoardError || isReplyError) {
    return <ErrorIndicator />;
  }

  function modalFeed() {
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
  }

  const {
    id,
    backgroundImageUrl,
    content,
    likeCount,
    liked,
    petImageUrl,
    petName,
    replyCount,
    petGrade,
    createdAt,
    imageUrl,
  } = boardData.postInfo;

  const {myPost, nickname, profilePicUrl} = boardData.writer;

  const checkHandleFocus = () => {
    setIsKeboardState(true);
  };
  const checkHandleBlur = () => {
    setIsKeboardState(false);
  };
  let createdAtDate = new Date(createdAt);
  const currentDate = new Date();
  var elapsedTime = (currentDate.getTime() - createdAtDate.getTime()) / 1000;
  const createBoard = elapsedText(elapsedTime);

  function likeStateFunction() {
    if (liked === false) {
      likeSetting(id).then(() => {
        setLikeState(true);
        queryClient.refetchQueries('myPostListQueryKey');
        queryClient.refetchQueries('ViewBoardQueryKey');
        queryClient.refetchQueries('viewFeedKey');
      });
    } else {
      likeUndo(id).then(() => {
        setLikeState(false);
        queryClient.refetchQueries('myPostListQueryKey');
        queryClient.refetchQueries('ViewBoardQueryKey');
        queryClient.refetchQueries('viewFeedKey');
      });
    }
  }

  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: '#F5F5F5'}}
      behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <Toast
        ref={toastRef}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          position: 'absolute',
          right: width / 3,
        }}
        textStyle={{
          fontSize: 14,
          color: 'white',
          textAlign: 'center',
        }}
        positionValue={height * 0.5}
        fadeInDuration={200}
        fadeOutDuration={1000}
      />
      <View transparent={true} style={{display: showModal ? 'flex' : 'none'}}>
        <ActivityIndicator
          style={{marginTop: '5%', marginBottom: '5%'}}
          size="large"
        />
      </View>

      <ScrollView
        onScrollEndDrag={async event => {
          // 여기서 event.nativeEvent.contentOffset.y는 사용자가 스크롤을 끝까지 내린 후의 Y 좌표를 나타냅니다.
          if (event.nativeEvent.contentOffset.y <= 0) {
            try {
              setShowModal(true);
              await queryClient.refetchQueries('ViewBoardQueryKey');
              await queryClient.refetchQueries('ReplyViewQueryKey');
              setShowModal(false);
            } catch (error) {
              console.log('Error:', error);
            }
          }
        }}>
        <Modal transparent={true} visible={isModalVisible}>
          <FeedSetting
            state={isModalVisible}
            closeModal={closeModal}
            boardID={id}
            type="board"
          />
        </Modal>
        <View
          style={{
            padding: '5%',
            backgroundColor: 'white',
            marginBottom: '6%',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: '5%',

              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() => {
                  if (!myPost) {
                    navigation.navigate('MyFriendPage', {
                      friendInfo: boardData.writer.id,
                    });
                  }
                }}
                disabled={myPost}>
                <ProfileImage profilePicUrl={profilePicUrl} />
              </TouchableOpacity>

              <View style={{marginLeft: '9%'}}>
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                  {nickname}
                </Text>
                <Text style={{marginTop: '4%', color: '#CBCBCB'}}>
                  {createBoard}
                </Text>
              </View>
            </View>
            {myPost ? (
              <TouchableOpacity onPress={modalFeed}>
                <Image
                  source={require('../../../assets/more_vert.png')}
                  style={{height: iconSize, width: iconSize}}
                />
              </TouchableOpacity>
            ) : null}
          </View>

          <PetBoardImage
            backgroundImageUrl={backgroundImageUrl}
            petImageUrl={petImageUrl}
            petGrade={petGrade}
            petName={petName}
          />
          {ImageSetting(imageUrl, 'board')}
          <Text style={{lineHeight: 24, fontWeight: 500, marginTop: '5%'}}>
            {content}
          </Text>
          <View>
            <View style={{marginTop: '6%', flexDirection: 'row'}}>
              <View style={{flexDirection: 'row'}}>
                {liked ? (
                  <Pressable onPress={likeStateFunction}>
                    <Image
                      source={require('../../../assets/favorite.png')}
                      style={{height: community, width: community}}
                    />
                  </Pressable>
                ) : (
                  <Pressable onPress={likeStateFunction}>
                    <Image
                      source={require('../../../assets/nonfavorite.png')}
                      style={{height: community, width: community}}
                    />
                  </Pressable>
                )}
                <Text> {likeCount}</Text>
              </View>
              <View style={{flexDirection: 'row', marginHorizontal: '6%'}}>
                <Image
                  source={require('../../../assets/maps_ugc.png')}
                  style={{
                    height: community,
                    width: community,
                    marginRight: '9%',
                  }}></Image>
                <Text>{replyCount}</Text>
              </View>
            </View>
            <Pressable
              onPress={() => navigation.navigate('LikeList', {postID: id})}
              disabled={!likeCount}>
              <Text style={{marginTop: '3%', marginLeft: '1%'}}>
                {likeCount}명이 좋아요를 눌렀습니다.
              </Text>
            </Pressable>
          </View>
        </View>

        <ReplyForm postID={id} replyData={replyData} />
      </ScrollView>
      <View
        style={{
          paddingTop: '2%',
          paddingHorizontal: '5%',
          backgroundColor: 'white',
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: isKeboardState && Platform.OS === 'ios' ? '26%' : null,
          paddingBottom: '4%',
        }}>
        <ProfileImage profilePicUrl={isUserInfo.profilePicUrl} />
        <Modal transparent={true} visible={loading}>
          <ActivityIndicator style={{marginTop: '60%'}} size="large" />
        </Modal>
        <View style={[styles.textinput]}>
          <TextInput
            style={[styles.input, {width: '100%'}]}
            placeholder={`${isUserInfo.nickname}로댓글 달기...`}
            onFocus={checkHandleFocus}
            onBlur={checkHandleBlur}
            onChangeText={text => {
              setIsReply(text);
            }}
            value={isReply}
            maxLength={240}
            multiline={true}
          />
          <Pressable
            onPress={() => {
              setLoading(true);
              relpyCommit(id, {
                content: isReply,
              }).then(() => {
                setIsReply('');
                Keyboard.dismiss();
                queryClient.refetchQueries('ViewBoardQueryKey');
                queryClient.refetchQueries('ReplyViewQueryKey');
                queryClient.refetchQueries('viewFeedKey');
                setLoading(false);
              });
            }}
            disabled={isReply.trim() === ''}>
            <Text
              style={[
                styles.position,
                {color: isReply ? '#1DC2FF' : '#FFFFFF'},
              ]}>
              게시
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  textinput: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D0D1D3',
    paddingHorizontal: 15,
    marginBottom: 8,
    marginLeft: '5%',
    width: '85%',
    flexDirection: 'row',
    alignItems: 'center',
    height: '80%',
    paddingRight: '10%',
  },
  position: {},
});
