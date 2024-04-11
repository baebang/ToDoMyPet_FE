import {React} from 'react';

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import FeedPreview from '../../../component/FeedPreview';
import {friendPostList} from '../../../service/BoardService';
import {useQuery} from 'react-query';
import {useNavigation} from '@react-navigation/native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const {width} = Dimensions.get('window');

export function FriendFeed({friendId}) {
  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery('friendPostListQueryKey', () => friendPostList(friendId));
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
      <View style={{padding: '4%'}}>
        <Skeleton />
        <Skeleton />
      </View>
    ); // 로딩 중일 때 표시할 UI
  }

  if (isError) {
    return <Text>Error fetching data</Text>; // 에러 발생 시 표시할 UI
  }



  return (
    <View style={{flex: 1}}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        {userData.postList.length === 0 ? (
          <View style={{alignItems: 'center'}}>
            <Text style={{color: '#7E7E7E'}}>작성한 피드가 없습니다.</Text>
          </View>
        ) : (
          userData.postList.map((post, index) => (
            <FeedPreview key={index} feedcontent={post} friendView={true} />
          ))
        )}

        <View style={{marginBottom: '100%'}}></View>
      </ScrollView>
      <View
        style={{flex: 0.2, backgroundColor: 'rgba(255, 255, 255, 0)'}}></View>
    </View>
  );
}

export function NonFriendRelationship() {
  const {width} = Dimensions.get('window');
  const navigation = useNavigation();

  return (
    <View style={{flex: 1, backgroundColor: '#F5F5F5'}}>
      <View style={{alignItems: 'center'}}>
        <Image
          style={{width: width * 0.2, height: width * 0.2, marginTop: '10%'}}
          source={require('../../../../assets/nonFriendLock.png')}
        />
        <Text style={{fontWeight: 400, fontSize: 17, marginTop: '7%'}}>
          친구 관계가 아닌 사용자에게는 {'\n'} 공개되지 않는 페이지입니다.
        </Text>
        <Text
          style={{
            fontWeight: 400,
            fontSize: 13,
            marginTop: '2%',
            color: '#7E7E7E',
          }}>
          친구 초대코드를 받아 친구로 등록해주세요.
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddFriend')}>
          <Image
            style={{
              width: width * 0.7,
              height: width * 0.2,
              transform: [{scale: 0.5}],
              marginTop: '5%',
            }}
            source={require('../../../../assets/addFriendButton.png')}
          />
        </TouchableOpacity>
      </View>

      <View
        style={{flex: 0.2, backgroundColor: 'rgba(255, 255, 255, 0)'}}></View>
    </View>
  );
}

export function BlockFriendRelationship() {
  const {width} = Dimensions.get('window');
  const navigation = useNavigation();

  return (
    <View style={{flex: 1, backgroundColor: '#F5F5F5'}}>
      <View style={{alignItems: 'center'}}>
        <Image
          style={{width: width * 0.2, height: width * 0.2, marginTop: '10%'}}
          source={require('../../../../assets/nonFriendLock.png')}
        />
        <Text
          style={{
            fontWeight: 400,
            fontSize: 17,
            marginTop: '7%',
            textAlign: 'center'
          }}>
          사용자에 의해 차단된 유저이며 {'\n'} 보호조치에 따라 공개되지 않는
          페이지입니다.
        </Text>
      </View>

      <View
        style={{flex: 0.2, backgroundColor: 'rgba(255, 255, 255, 0)'}}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    flex: 1,
  },
  fontSize: {
    fontSize: 17,
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

export default FriendFeed;
