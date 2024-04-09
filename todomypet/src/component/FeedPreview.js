import React, {useState} from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  View,
  Dimensions,
  ImageBackground,
  Modal,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import {ProfileImage} from './ProfilePick';
import {FeedSetting} from '../modal/BorderModal/FeedModal';

import {
  likeSetting,
  likeUndo,
  viewBoardDetail,
  replyView,
  relpyCommit,
} from '../service/BoardService';

import {useQueryClient} from 'react-query';
import {useNavigation} from '@react-navigation/native';
import elapsedText from './elapsedText';

import eggGrowth from './eggGrowth';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const screenWidth = Dimensions.get('window').width;
const iconSize = screenWidth * 0.07;
const pet_room = screenWidth * 0.3;
const petIconSize = screenWidth * 0.2;
const eggIconSize = screenWidth * 0.04;
const community = screenWidth * 0.05;

function FeedPreview({feedcontent, friendView}) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLikeState, setLikeState] = useState(liked);
  const [typeContetn, setTypeContent] = useState('');


  const queryClient = useQueryClient();
  const navigation = useNavigation();

  function modalFeed() {
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
  }

  const {
    backgroundImageUrl,
    content,
    createdAt,
    imageUrl,
    likeCount,
    liked,
    petGrade,
    petImageUrl,
    petName,
    replyCount,
    id,
  } = feedcontent.postInfo;



  const {nickname, profilePicUrl, myPost} = feedcontent.writer;

  let createdAtDate = new Date(createdAt);
  const currentDate = new Date();
  var elapsedTime = (currentDate.getTime() - createdAtDate.getTime()) / 1000;
  const createBoard = elapsedText(elapsedTime);

  const eggImage = eggGrowth(petGrade);

  function likeStateFunction() {
    if (liked === false) {
      likeSetting(id).then(res => {
        setLikeState(true);
        queryClient.refetchQueries('myPostListQueryKey');
        queryClient.refetchQueries('viewFeedKey');
      });
    } else {
      likeUndo(id).then(() => {
        setLikeState(false);
        queryClient.refetchQueries('myPostListQueryKey');
        queryClient.refetchQueries('viewFeedKey');
      });
    }
  }

  return (
    <Pressable
      style={[styles.feedcontainer]}
      onPress={() => {
        try {
          queryClient.fetchQuery('ViewBoardQueryKey', () =>
            viewBoardDetail(id),
          );
          queryClient.fetchQuery('ReplyViewQueryKey', () => replyView(id));
          navigation.navigate('FeedDetail', {FeedId: id});
        } catch {
          console.log('피드 디테일 가기 에러');
        }
      }}>
      <Modal transparent={true} visible={isModalVisible}>
        <FeedSetting
          state={isModalVisible}
          closeModal={closeModal}
          boardID={id}
          flag={typeContetn}
        />
      </Modal>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Pressable
            onPress={() => {
              if (!myPost) {
                navigation.navigate('MyFriendPage', {
                  friendInfo: feedcontent.writer.id,
                });
              }
            }}>
            <ProfileImage profilePicUrl={profilePicUrl} />
          </Pressable>

          <View style={{marginLeft: '9%'}}>
            <Text style={{fontSize: 15, fontWeight: 'bold'}}>{nickname}</Text>
            <Text style={{marginTop: '4%', color: '#CBCBCB'}}>
              {createBoard}
        
            </Text>
          </View>
        </View>

        {myPost && !friendView ? (
          <TouchableOpacity
            onPress={() => {
              modalFeed();
              setTypeContent('');
            }}>
            <Image
              source={require('../../assets/more_vert.png')}
              style={{height: iconSize, width: iconSize}}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              modalFeed();
              setTypeContent('flag');
            }}>
            <Image
              source={require('../../assets/flag.png')}
              style={{height: iconSize, width: iconSize}}
            />
          </TouchableOpacity>
        )}
      </View>

      <ImageBackground
        style={{
          height: pet_room,
          borderRadius: 8,
          overflow: 'hidden',
          marginTop: '5%',
          marginBottom: '3%',
          paddingTop: '5%',
          paddingHorizontal: '6%',
        }}
        source={{uri: backgroundImageUrl}}>
        <View>
          <View style={{flexDirection: 'row'}}>
            <Image
              source={{uri: eggImage}}
              style={{
                height: eggIconSize,
                width: eggIconSize,
                marginRight: '3%',
              }}></Image>
            <Text style={{fontFamily: 'DungGeunMo'}}>{petName}</Text>
          </View>
          <Image
            source={{uri: petImageUrl}}
            style={{
              height: petIconSize,
              width: petIconSize,
              marginHorizontal: '35%',
            }}></Image>
        </View>
      </ImageBackground>
      {ImageSettingpreView(imageUrl)}

      <Text numberOfLines={2} style={{lineHeight: 22}}>
        {content}
      </Text>
      <View style={{marginTop: '6%', flexDirection: 'row'}}>
        <View style={{flexDirection: 'row'}}>
          {liked ? (
            <Pressable onPress={likeStateFunction}>
              <Image
                source={require('../../assets/favorite.png')}
                style={{height: community, width: community}}
              />
            </Pressable>
          ) : (
            <Pressable onPress={likeStateFunction}>
              <Image
                source={require('../../assets/nonfavorite.png')}
                style={{height: community, width: community}}
              />
            </Pressable>
          )}
          <Text> {likeCount}</Text>
        </View>
        <View style={{flexDirection: 'row', marginHorizontal: '7%'}}>
          <Image
            source={require('../../assets/maps_ugc.png')}
            style={{height: community, width: community}}
          />
          <Text> {replyCount}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export function ImageSetting(imageUrl, type) {
  const navigation = useNavigation();

  function imageDetailView() {
    navigation.navigate('FeedImage', {imageItem: imageUrl});
  }
  {
    return imageUrl.length ? (
      <Pressable onPress={type ? imageDetailView : null}>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: '2%',
            marginTop: type ? '4%' : null,
          }}>
          <Image
            style={{
              height: imageUrl.length === 1 ? petIconSize * 2 : petIconSize,
              width: imageUrl.length === 1 ? '100%' : '50%',
              borderTopRightRadius: imageUrl.length === 1 ? 8 : 0,
              borderBottomRightRadius: imageUrl.length === 1 ? 8 : 0,
              borderRadius: 8,
              overflow: 'hidden',
            }}
            source={{uri: imageUrl[0]}}
          />
          {imageUrl.length === 1 ? null : (
            <View
              style={{
                borderRadius: 8,
                borderBottomLeftRadius: 0,
                borderTopLeftRadius: 0,
                overflow: 'hidden',
                width: '50%',
              }}>
              <Image
                style={{
                  height: petIconSize,
                }}
                source={{uri: imageUrl[1]}}
              />

              {imageUrl.length > 2 ? (
                <View
                  style={{
                    ...StyleSheet.absoluteFillObject,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 흑백으로 만들기 위한 배경색
                    tintColor: 'gray', // 흑백 효과를 만드는 tintColor
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: 'white',
                      fontWeight: 800,
                    }}>
                    +{imageUrl.length - 1}
                  </Text>
                </View>
              ) : null}
            </View>
          )}
        </View>
      </Pressable>
    ) : null;
  }
}

export function ImageSettingpreView(imageUrl, type) {
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  console.log(loading);

  function imageDetailView() {
    navigation.navigate('FeedImage', {imageItem: imageUrl});
  }
  {
    return imageUrl.length ? (
      <Pressable onPress={type ? imageDetailView : null} disabled={!loading}>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: '2%',
            marginTop: type ? '4%' : null,
          }}>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="gray" />
            </View>
          )}
          <Image
            style={{
              height: imageUrl.length === 1 ? petIconSize * 2 : petIconSize,
              width: imageUrl.length === 1 ? '100%' : '50%',
              borderTopRightRadius: imageUrl.length === 1 ? 8 : 0,
              borderBottomRightRadius: imageUrl.length === 1 ? 8 : 0,
              borderRadius: 8,
              overflow: 'hidden',
            }}
            source={{uri: imageUrl[0]}}
            onLoad={() => setLoading(false)}
          />
          {imageUrl.length === 1 ? null : (
            <View
              style={{
                borderRadius: 8,
                borderBottomLeftRadius: 0,
                borderTopLeftRadius: 0,
                overflow: 'hidden',
                width: '50%',
              }}>
              <Image
                style={{
                  height: petIconSize,
                }}
                source={{uri: imageUrl[1]}}
              />

              {imageUrl.length > 2 ? (
                <View
                  style={{
                    ...StyleSheet.absoluteFillObject,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 흑백으로 만들기 위한 배경색
                    tintColor: 'gray', // 흑백 효과를 만드는 tintColor
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: 'white',
                      fontWeight: 800,
                    }}>
                    +{imageUrl.length - 1}
                  </Text>
                </View>
              ) : null}
            </View>
          )}
        </View>
      </Pressable>
    ) : null;
  }
}

const styles = StyleSheet.create({
  feedcontainer: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 5,
    shadowOpacity: 1,
    elevation: 5, // Android에서 그림자를 적용합니다
    marginBottom: '5%',
  },

  sudmittext: {
    color: 'white', // 원하는 버튼 텍스트 색상으로 변경
    fontSize: 18,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: '36%',
  },
});
export default FeedPreview;
