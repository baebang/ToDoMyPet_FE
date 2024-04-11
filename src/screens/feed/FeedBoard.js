import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import {viewFeed} from '../../service/BoardService';
import FeedPreview from '../../component/FeedPreview';
import {useNavigation} from '@react-navigation/native';
import {useQuery, useQueryClient} from 'react-query';
import Toast from 'react-native-easy-toast';
import {declarationToast, NextPostId} from '../../store/Item';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const {width, height} = Dimensions.get('window');
const refreshThreshold = 100; // 스크롤이 얼마나 올라가야 새로고침이 될지에 대한 임계값

export default function FeedBoard() {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [bottomModal, setBottomModal] = useState(false);
  const queryClient = useQueryClient();
  const toastRef = useRef(); // toast ref 생성
  const {BoardDeclaration, setBoard} = declarationToast();

  const {setNextPostIndex, NextPostIndex} = NextPostId();

  const [value, setValue] = useState(null);

  useEffect(() => {
    if (userData && userData.pagingInfo) {
      queryClient.refetchQueries('viewFeedKey');
    }
  }, [userData?.pagingInfo?.nextIndex]);

  useEffect(() => {
    if (BoardDeclaration) {
      Alert.alert(
        '해당 게시글의 신고접수가 완료되었습니다.',
        '운영진 검토 후 해당 게시글이 삭제 될 수 있습니다. \n검토까지는 최대 24시간이 소요됩니다.\n추가 문의는 \n[마이페이지]-[화면 우측상단 톱니버튼]-[문의하기]를 통해 문의해주세요.',
        [{text: '확인', onPress: () => setBoard('')}],
      );
    }
  }, [BoardDeclaration]);

  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery('viewFeedKey', () => viewFeed(null));



  const Skeleton = () => {
    return (
      <View style={styles.feedcontainer}>
        <View style={{flexDirection: 'row'}}>
          <SkeletonPlaceholder speed={2500} backgroundColor={'#E7E7E7'}>
            <View
              style={{
                width: width * 0.12,
                height: width * 0.12,
                borderRadius: 60,
              }}
            />
          </SkeletonPlaceholder>

          <View style={{justifyContent: 'center', marginLeft: '3%'}}>
            <View
              style={{
                width: width * 0.15,
                height: width * 0.02,
                borderRadius: 60,
                backgroundColor: '#E7E7E7',
                marginBottom: '10%',
              }}
            />
            <View
              style={{
                width: width * 0.12,
                height: width * 0.02,
                borderRadius: 60,
                backgroundColor: '#E7E7E7',
              }}
            />
          </View>
        </View>
        <SkeletonPlaceholder speed={900} backgroundColor={'#E7E7E7'}>
          <View
            style={{
              height: width * 0.23,
              backgroundColor: '#E7E7E7',
              borderRadius: 7,
              marginTop: '5%',
            }}
          />
        </SkeletonPlaceholder>
        <SkeletonPlaceholder speed={900} backgroundColor={'#E7E7E7'}>
          <View
            style={{
              height: width * 0.05,

              backgroundColor: '#E7E7E7',
              borderRadius: 7,
              marginTop: '5%',
            }}
          />
        </SkeletonPlaceholder>
        <SkeletonPlaceholder speed={900} backgroundColor={'#E7E7E7'}>
          <View
            style={{
              height: width * 0.05,
              width: width * 0.6,
              backgroundColor: '#E7E7E7',
              borderRadius: 7,
              marginTop: '5%',
            }}
          />
        </SkeletonPlaceholder>
        <SkeletonPlaceholder speed={900} backgroundColor={'#E7E7E7'}>
          <View
            style={{
              height: width * 0.05,
              width: width * 0.18,
              backgroundColor: '#E7E7E7',
              borderRadius: 7,
              marginTop: '5%',
            }}
          />
        </SkeletonPlaceholder>
      </View>
    );
  };
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 16,
            justifyContent: 'space-between',
          }}>
          <Text style={styles.textStyle}>Feed</Text>
          <View style={{flexDirection: 'row'}}>
            <Pressable
              style={{marginRight: 10}}
              onPress={() => navigation.navigate('AddFriend')}>
              <Image
                source={require('../../../assets/frien_add.png')}
                style={styles.imageSize}></Image>
            </Pressable>

            <Pressable onPress={() => navigation.navigate('AlarmFeed')}>
              <Image
                source={require('../../../assets/alarm.png')}
                style={styles.imageSize}></Image>
            </Pressable>
          </View>
        </View>
        <View style={styles.textUnderLine} />
        <View style={{padding: '4%'}}>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </View>
      </SafeAreaView>
    ); // 로딩 중일 때 표시할 UI
  }

  if (isError) {
    return <Text>Error fetching data</Text>; // 에러 발생 시 표시할 UI
  }

  const handleRefresh = () => {
    // 이미 새로고침이 진행 중이면 함수 종료
    if (refreshing) {
      return;
    }
    setNextPostIndex(null);

    // 새로고침 로직을 여기에 추가
    // 예: API 호출, 데이터 재로딩 등

    setRefreshing(false); // 새로고침 완료 후 refreshing 상태를 false로 변경

    setShowModal(true); // 대기 모달 표시
    setTimeout(() => {
      queryClient.fetchQuery('viewFeedKey', () => viewFeed(null));
      setShowModal(false); // 5초 후 대기 모달 숨김
    }, 1000); // 5초 대기
  };

  const bottomRefresh = async () => {
    setBottomModal(true);
    setTimeout(() => {
      setBottomModal(false); // 5초 후 대기 모달 숨김
    }, 1000); // 5초 대기

    const nextIndex = userData.pagingInfo.nextIndex;
    if (nextIndex) {
      const newData = await queryClient.fetchQuery('BackviewFeedKey', () =>
        viewFeed(nextIndex),
      );
      const existingData = queryClient.getQueryData('viewFeedKey');

      // newData의 첫 번째 데이터를 제외한 postList
      const newDataPostList = newData.postList.slice(1);

      const mergedData = {
        pagingInfo: {
          hasNextPage: newData.pagingInfo.hasNextPage,
          nextIndex: newData.pagingInfo.nextIndex,
        },
        postList: [...existingData.postList, ...newDataPostList],
      };

      queryClient.setQueryData('viewFeedKey', mergedData);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
        fadeOutDuration={5000}
      />

      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 16,
          justifyContent: 'space-between',
        }}>
        <Text style={styles.textStyle}>Feed</Text>
        <View style={{flexDirection: 'row'}}>
          <Pressable
            style={{marginRight: 10}}
            onPress={() => navigation.navigate('AddFriend')}>
            <Image
              source={require('../../../assets/frien_add.png')}
              style={styles.imageSize}></Image>
          </Pressable>

          <Pressable onPress={() => navigation.navigate('AlarmFeed')}>
            <Image
              source={require('../../../assets/alarm.png')}
              style={styles.imageSize}></Image>
          </Pressable>
        </View>
      </View>

      <View style={styles.textUnderLine} />
      {/* 무한 스크롤 구현 */}

      <ScrollView
        style={{flex: 1, padding: '4%'}}
        onScrollEndDrag={event => {
          // 여기서 event.nativeEvent.contentOffset.y는 사용자가 스크롤을 끝까지 내린 후의 Y 좌표를 나타냅니다.
          if (event.nativeEvent.contentOffset.y <= 0) {
            handleRefresh();
          } else if (
            Math.floor(
              event.nativeEvent.contentOffset.y +
                event.nativeEvent.layoutMeasurement.height,
            ) >= Math.floor(event.nativeEvent.contentSize.height)
          ) {
            bottomRefresh();
          }
        }}
        scrollEventThrottle={100} // 스크롤 이벤트 발생 간격 조절
        overScrollMode={'always'}
        contentContainerStyle={styles.scrollViewContent}>
        {showModal && (
          <View style={{marginBottom: '10%'}}>
            <ActivityIndicator size="large" />
          </View>
        )}
        {userData.postList.length === 0 ? (
          <View style={{alignItems: 'center'}}>
            <Text style={{color: '#7E7E7E'}}>작성한 피드가 없습니다.</Text>
          </View>
        ) : (
          userData.postList.map((post, index) => (
            <FeedPreview key={index} feedcontent={post} />
          ))
        )}
      </ScrollView>
      {bottomModal && <ActivityIndicator size="large" />}
      <TouchableOpacity
        style={styles.boardwrite}
        onPress={() => navigation.navigate('FeedWrite')}>
        <Image
          source={require('../../../assets/board_write.png')}
          style={styles.imageSize}></Image>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  textStyle: {fontFamily: 'DungGeunMo', fontSize: 24},
  imageSize: {width: 24, height: 24},
  textUnderLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: '5%',
    marginTop: '5%',
  },
  boardwrite: {
    backgroundColor: '#1DC2FF',
    borderRadius: 16,
    alignItems: 'center',
    width: 56,
    height: 56,
    justifyContent: 'center',

    position: 'absolute', // 절대 위치 설정
    bottom: 16, // 하단 여백 조절
    right: 16, // 우측 여백 조절
  },
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
});
