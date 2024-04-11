import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Pressable,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from 'react-native';

import {ProfileImage} from '../../component/ProfilePick';
import {memberCheck} from '../../service/MyPageService';
import {FeedWriteState, FeedImageArray} from '../../store/Item';

import {FeedImageModal} from '../../modal/ImageSetModal/ImageModal';

import {useNavigation, useRoute} from '@react-navigation/native';

import {PetFeedImage} from '../../component/PetInformation';

import {UserFeedPetInfo} from '../../store/Item';
import {viewBoardDetail} from '../../service/BoardService';

const {width, height} = Dimensions.get('window');

export const dismissKeyboard = () => {
  Keyboard.dismiss();
};

export function FeedWrite() {
  const [isUserInfo, setIsUserInfo] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const {setFeedContent} = FeedWriteState();
  const [isImageModal, setIsImageModal] = useState(false);
  const {FeedImage, setCleanUpImage, removeImage} = FeedImageArray();
  const navigation = useNavigation();
  const {FeedPet, setCleanUP} = UserFeedPetInfo();

  useEffect(() => {
    memberCheck().then(response => {
      setIsUserInfo(response);
    });
    setCleanUpImage(); // 이미지 초기화
    setFeedContent(''); // 글내용 초기화
    setCleanUP(); //펫 초기화
    console.log('글쓰기 화면 랜더링');
  }, []);

  function ImageModalClose() {
    setIsImageModal(false);
  }

  const {nickname, profilePicUrl} = isUserInfo;

  return (
    <View style={styles.container}>
      <Pressable onPress={dismissKeyboard} style={{height: '100%'}}>
        <View>
          <FeedImageModal closeModal={ImageModalClose} state={isImageModal} />
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <ProfileImage profilePicUrl={profilePicUrl} />
              <Text style={styles.nickname}>{nickname}</Text>
            </View>
            <Pressable onPress={() => setIsImageModal(true)}>
              <Image
                style={styles.icon}
                source={require('../../../assets/image.png')}
              />
            </Pressable>
          </View>

          <TouchableOpacity
            style={[styles.imageContainer, {marginBottom: '5%'}]}
            onPress={() => {
              navigation.navigate('FeedPetAdd');
            }}>
            {FeedPet.petID.trim() !== '' ? (
              <PetFeedImage />
            ) : (
              <Image
                style={[styles.image]}
                source={require('../../../assets/assets_feednonpet.png')}
              />
            )}
          </TouchableOpacity>

          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            {FeedImage.map((base64, index) => (
              <View style={{position: 'relative'}} key={index}>
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: '0.9%',
                    zIndex: 1,
                  }}
                  onPress={() => removeImage(index)}>
                  <Image
                    style={[styles.icon]}
                    source={require('../../../assets/delete.png')}
                  />
                </TouchableOpacity>

                <Image
                  key={index} // 각 이미지에 고유한 키 할당
                  style={{
                    width: width * 0.2,
                    height: width * 0.2,
                    borderRadius: 16,
                    marginRight: '4%',
                    marginBottom: '3%',
                  }}
                  source={{uri: `data:image/png;base64,${base64}`}}
                />
              </View>
            ))}
          </View>
        </View>
        <TextInput
          style={{height: isFocused ? '17%' : 'auto'}}
          placeholder="글을 작성해주세요 부적절하거나 불쾌감을 줄 수 있는 컨텐츠는 제재를 받을 수 있습니다"
          placeholderTextColor="#D1D1D2"
          multiline={true}
          onChangeText={text => setFeedContent(text)}
          maxLength={2000}
          textAlignVertical="top"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </Pressable>
    </View>
  );
}

export function FeedReWrite() {
  const route = useRoute();
  const {boardID} = route.params;

  const [isUserInfo, setIsUserInfo] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const {setFeedContent, FeedContent} = FeedWriteState();
  const [isImageModal, setIsImageModal] = useState(false);
  const {FeedImage, removeImage, setFeedImage, setCleanUpImage, setFeedId} =
    FeedImageArray();

  const {FeedPet, setFeedPet, setFeedPetInterior} = UserFeedPetInfo();

  const uristr = 'https';

  useEffect(() => {
    // 이전 이미지 초기화
    setCleanUpImage();
    viewBoardDetail(boardID).then(res => {
      const {
        petId,
        petImageUrl,
        backgroundId,
        backgroundImageUrl,
        content,
        imageUrl,
        id,
      } = res.postInfo;

      console.log(id, '=========');

      //게시글 수정 시, 필요정보인 postId 저장
      setFeedId(id);
      //유저 정보
      setIsUserInfo(res.writer);
      // 글내용 동기화
      setFeedContent(content);
      //펫 동기화
      setFeedPet(petImageUrl, petId);
      setFeedPetInterior(backgroundImageUrl, backgroundId);
      // 이미지 동기화
      imageUrl.map(item => {
        setFeedImage(item);
      });
    });
  }, []);

  console.log(FeedContent);

  function ImageModalClose() {
    setIsImageModal(false);
  }

  function isBase64(str) {
    return str && typeof str === 'string' && str.startsWith('https');
  }

  const {nickname, profilePicUrl} = isUserInfo;

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={dismissKeyboard} style={{height: '100%'}}>
        <FeedImageModal closeModal={ImageModalClose} state={isImageModal} />
        <View style={[styles.header, {marginBottom: '5%'}]}>
          <View style={styles.userInfo}>
            <ProfileImage profilePicUrl={profilePicUrl} />
            <Text style={styles.nickname}>{nickname}</Text>
          </View>
          <Pressable onPress={() => setIsImageModal(true)}>
            <Image
              style={styles.icon}
              source={require('../../../assets/image.png')}
            />
          </Pressable>
        </View>
        <View style={{marginBottom: '5%'}}>
          {FeedPet.petID.trim() !== '' ? <PetFeedImage /> : null}
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          {FeedImage.map((base64, index) => (
            <View style={{position: 'relative'}} key={index}>
              <TouchableOpacity
                style={{position: 'absolute', top: 0, right: '0.9%', zIndex: 1}}
                onPress={() => removeImage(index)}>
                <Image
                  style={[styles.icon]}
                  source={require('../../../assets/delete.png')}
                />
              </TouchableOpacity>

              <Image
                key={index}
                style={{
                  width: width * 0.2,
                  height: width * 0.2,
                  borderRadius: 16,
                  marginRight: '2%',
                }}
                source={{
                  //base64형태가 uri type인지 base64 type인지
                  uri: isBase64(base64)
                    ? base64
                    : `data:image/png;base64,${base64}`,
                }}
              />
            </View>
          ))}
        </View>
        <TextInput
          style={{height: isFocused ? '17%' : 'auto'}}
          placeholder="글을 작성해주세요 부적절하거나 불쾌감을 줄 수 있는 컨텐츠는 제재를 받을 수 있습니다"
          placeholderTextColor="#D1D1D2"
          onChangeText={text => setFeedContent(text)}
          value={FeedContent}
          maxLength={2000}
          multiline={true}
          textAlignVertical="top"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: '6%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nickname: {
    marginLeft: '2%',
    fontWeight: '500',
  },
  icon: {
    width: 24,
    height: 24,
  },
  imageContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    // width: '100%',
    // height: '40%',
    marginTop: '6%', // Adjust this margin as needed
  },
  image: {
    borderRadius: 8,
    width: '100%',
    height: 140,
    overflow: 'hidden',
  },
  textcontainer: {
    flex: 1,
  },
  textscrollView: {
    flexGrow: 1,
    padding: 20,
  },
});

export function ReFeedWrite() {}
