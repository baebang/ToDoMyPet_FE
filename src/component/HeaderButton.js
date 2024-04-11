import {useState, useRef, useEffect} from 'react';
import {
  Text,
  View,
  TouchableNativeFeedback,
  Dimensions,
  Modal,
  Image,
  Pressable,
  ActivityIndicator,
} from 'react-native';

import {SettingOutModal} from '../modal/MypageModal/Setting';
import {useNavigation} from '@react-navigation/native';
import {
  UserSetting,
  FeedWriteState,
  UserFeedPetInfo,
  FeedImageArray,
} from '../store/Item';
import Toast from 'react-native-easy-toast';
import {useQueryClient} from 'react-query';

import {profileSetting} from '../service/MyPageService';
import {createBoard, modifyBoard} from '../service/BoardService';

export function SettingHeaderButton() {
  const [isChange, setIsChange] = useState(false);
  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const toastRef = useRef();
  const height = Dimensions.get('window').height;
  const width = Dimensions.get('window').width;
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  const {UserRename, UsreReBio, UserPrivate, UserImage} = UserSetting();
  const useChingInfo = {
    bio: UsreReBio,
    nickname: UserRename,
    profilePicUrl: UserImage,
    protect: UserPrivate,
  };

  const mySettingQuery = queryClient.getQueryData('mySettingQueryKey');
  const copiedDatamySettingQuery = {...mySettingQuery};

  useEffect(() => {
    console.log(useChingInfo, 'useChingInfo-----');
    if (copiedDatamySettingQuery) {
      delete copiedDatamySettingQuery.personalCode;
      copiedDatamySettingQuery.profilePicUrl =
        copiedDatamySettingQuery.profilePicUrl === '' ? 'unwavering' : null;

      const setting = Object.keys(copiedDatamySettingQuery).every(
        key => copiedDatamySettingQuery[key] === useChingInfo[key],
      );

      // isChange 값에 따라 추가적인 로직 수행 가능
      if (useChingInfo.profilePicUrl === null) {
        useChingInfo.profilePicUrl = 'unwavering';
      }

      setIsChange(setting);
    }
  }, [copiedDatamySettingQuery, useChingInfo]);

  const showToast = message => {
    toastRef.current.show(message);
  };

  const handleProfileSetting = async () => {
    setLoading(true);
    try {
      await profileSetting(useChingInfo);
      await queryClient.refetchQueries('myPageQueryKey');
      await queryClient.refetchQueries('mySettingQueryKey');
      await queryClient.refetchQueries('myPostListQueryKey');
      await queryClient.refetchQueries('viewFeedKey');

      setLoading(false);
      navigation.goBack();
    } catch (error) {
      console.error('profileSetting 실패:', error);
      showToast('수정사항을 적용하는 데 실패했습니다.');
    }
  };

  return (
    <View style={{marginRight: 20.43}}>
      <Modal transparent={true} visible={loading}>
        <ActivityIndicator style={{marginTop: '60%'}} size="large" />
      </Modal>
      <View style={{position: 'relative', width: '100%'}}>
        <Toast
          ref={toastRef}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            position: 'absolute',
            right: width / 8,
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
      </View>

      {isChange ? (
        <Text style={{color: '#CBCBCB'}}>적용</Text>
      ) : (
        <TouchableNativeFeedback onPress={handleProfileSetting}>
          <Text style={{color: '#1DC2FF'}}>적용</Text>
        </TouchableNativeFeedback>
      )}
    </View>
  );
}

export function SettingBackButton() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {width} = Dimensions.get('window');

  function ModalClose() {
    setIsModalVisible(false);
  }
  return (
    <View>
      <Modal transparent={true} visible={isModalVisible}>
        <SettingOutModal
          closeModal={ModalClose}
          state={isModalVisible}
          pathName={'설정'}
        />
      </Modal>
      <Pressable
        onPress={() => setIsModalVisible(true)}
        style={{marginLeft: 20.43}}>
        <Image
          style={{height: width * 0.07, width: width * 0.07}}
          source={require('../../assets/arrow_back.png')}></Image>
      </Pressable>
    </View>
  );
}

export function FeedBackButton() {
  const {width} = Dimensions.get('window');
  const navigation = useNavigation();

  return (
    <View>
      <Pressable
        onPress={() => navigation.goBack()}
        style={{marginLeft: 20.43}}>
        <Image
          style={{height: width * 0.07, width: width * 0.07}}
          source={require('../../assets/arrow_back.png')}></Image>
      </Pressable>
    </View>
  );
}

export function FeedHaderButton() {
  const [isChange, setIsChange] = useState(false);
  const [loading, setLoading] = useState(false);
  const {FeedContent} = FeedWriteState();
  const {FeedPet, FeedPetInterior} = UserFeedPetInfo();
  const {FeedImage, FeedId} = FeedImageArray();
  const {width, height} = Dimensions.get('window');
  const toastRef = useRef();
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (FeedContent !== '') {
      setIsChange(true);
    } else {
      setIsChange(false);
    }
  }, [FeedContent]);

  const showToast = message => {
    toastRef.current.show(message);
  };

  const handleFeedSetting = async () => {
    //isChange 가 true일때 마이펫 선택을 하지 않았디먄 토스트 모달
    // 마이펫을 선택했다면 등록으로 연결 (이미지가 있을경우 이미지도 넘겨주기)

    if (isChange) {
      if (FeedPet.petID == '') {
        //못지나감
        showToast('펫을 등록해주세요');
      } else {
        setLoading(true);

        const userDTO = {
          content: FeedContent,
          imageUrls: FeedImage,
          petId: FeedPet.petID,
          backgroundId: FeedPetInterior.interiorID,
        };
        if (FeedId) {
          console.log(FeedId, userDTO);
          setLoading(true);

          modifyBoard(FeedId, userDTO).then(() => {
            navigation.goBack();
            // 등록하고 내가쓴 글 보기 쿼리 업데이트 시켜주기 + 피드도!
            queryClient.refetchQueries('myPostListQueryKey');
            queryClient.refetchQueries('ViewBoardQueryKey');
            queryClient.refetchQueries('viewFeedKey');
            setLoading(false);
          });
        } else {
          setLoading(true);
          try {
            await createBoard(userDTO);
            await queryClient.refetchQueries('myPostListQueryKey');
            await queryClient.refetchQueries('viewFeedKey');
            navigation.goBack();

            setLoading(false);
          } catch (error) {
            console.error('profileSetting 실패:', error);
          }
        }
      }
    }
  };

  return (
    <View style={{marginRight: 20.43}}>
      <Modal transparent={true} visible={loading}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <ActivityIndicator
            color="#1DC2FF"
            style={{marginTop: '60%'}}
            size="large"
          />
        </View>
      </Modal>
      <View style={{position: 'relative', width: '100%'}}>
        <Toast
          ref={toastRef}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            position: 'absolute',
            right: width / 5,
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
      </View>

      {isChange ? (
        <TouchableNativeFeedback onPress={handleFeedSetting}>
          <Text style={{color: '#1DC2FF'}}>적용</Text>
        </TouchableNativeFeedback>
      ) : (
        <Text style={{color: '#CBCBCB'}}>적용</Text>
      )}
    </View>
  );
}
