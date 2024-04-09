import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Modal,
  Pressable,
} from 'react-native';
import TopTabNavigationApp from './mypagenavi/TopTabNavigationApp';
import {useQuery, useQueryClient} from 'react-query';
import {ProfileImage} from '../../component/ProfilePick';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  profileFriend,
  blockFriend,
  unblockFriend,
} from '../../service/MyPageService';
import {
  FriendFeed,
  NonFriendRelationship,
  BlockFriendRelationship,
} from './mypagenavi/FriendFeed';

function MyFriendPage() {
  const {width, height} = Dimensions.get('window');
  const closeIconSize = width * 0.07;
  const [modalVisable, setModalVisable] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const {friendInfo} = route.params;
  const queryClient = useQueryClient();

  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery('myFrinedPageQueryKey', () => profileFriend(friendInfo));
  if (isLoading) {
    return <Text>Loading...</Text>; // 로딩 중일 때 표시할 UI
  }

  if (isError) {
    return <Text>Error fetching data</Text>; // 에러 발생 시 표시할 UI
  }

  const {
    id,
    nickname,
    profilePicUrl,
    bio,
    collectionCount,
    achCount,
    friendCount,
    friendRelationship,
    blockOrNot,
  } = userData;

  console.log(blockOrNot, 'blockOrNot');

  function repeatFunctoin() {
    queryClient.refetchQueries('myFrinedPageQueryKey');
    queryClient.refetchQueries('myPageQueryKey');
    queryClient.refetchQueries('viewFeedKey');
    queryClient.refetchQueries('ReplyViewQueryKey');
    queryClient.refetchQueries('myFriendQueryKey');
    queryClient.refetchQueries('BlockFriendListKey');
  }

  return (
    <SafeAreaView style={styles.container}>
      <Modal transparent={true} visible={modalVisable}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={[styles.rowView, {marginBottom: '6%'}]}>
              <Pressable
                onPress={() => {
                  setModalVisable(false);
                }}>
                <Image
                  style={{height: closeIconSize, width: closeIconSize}}
                  source={require('../../../assets/close.png')}
                />
              </Pressable>
            </View>
            <Text style={{textAlign: 'center', fontWeight: 600, fontSize: 16}}>
              {nickname}님을{'\n'}차단하시겠습니까?
            </Text>
            <View style={{paddingHorizontal: '10%', marginTop: '6%'}}>
              <View style={[styles.rowView, {marginBottom: '3%'}]}>
                <Image
                  style={{
                    height: closeIconSize,
                    width: closeIconSize,
                    marginRight: '4%',
                  }}
                  source={require('../../../assets/block.png')}
                />
                <Text style={{flex: 1}}>
                  차단된 사용자는 당신의 게시글, 프로필을 확인할 수 없습니다.
                </Text>
              </View>
              <View style={[styles.rowView, {marginBottom: '3%'}]}>
                <Image
                  style={{
                    height: closeIconSize,
                    width: closeIconSize,
                    marginRight: '4%',
                  }}
                  source={require('../../../assets/search_off.png')}
                />
                <Text style={{flex: 1}}>
                  차단된 경우 친구 코드를 입력해도 검색되지 않습니다.
                </Text>
              </View>
              <View style={[styles.rowView, {marginBottom: '3%'}]}>
                <Image
                  style={{
                    height: closeIconSize,
                    width: closeIconSize,
                    marginRight: '4%',
                  }}
                  source={require('../../../assets/delete_history.png')}
                />
                <Text style={{flex: 1}}>
                  차단 해제를 원하는 경우 친구 목록 - 하단의 차단된 친구 혹은
                  차단된 사용자의 프로필에서 차단을 해제할 수 있습니다.
                </Text>
              </View>
            </View>
            <View style={{marginTop: 'auto'}}>
              <Pressable
                style={{
                  backgroundColor: '#FFE9EF',
                  padding: '4%',
                  borderRadius: 10,
                }}
                onPress={async () => {
                  await blockFriend(id);
                  await repeatFunctoin();
                  setModalVisable(false);
                }}>
                <Text style={{textAlign: 'center', color: '#FF2070'}}>
                  차단하기
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.assets}>
        <ProfileImage profilePicUrl={profilePicUrl} />
      </View>

      <TouchableOpacity
        style={{
          position: 'absolute',
          backgroundColor: blockOrNot ? '#ECFBFF' : '#FFE9EF',
          paddingHorizontal: 10,
          right: '5%',
          top: '2%',
          borderRadius: 10,
          paddingTop: 5,
          paddingBottom: 5,
        }}
        onPress={async () => {
          if (blockOrNot) {
            //차단해제하기
            await unblockFriend(id);
            repeatFunctoin();
          } else {
            //차단하기
            setModalVisable(true);
          }
        }}>
        <Text
          style={{color: blockOrNot ? '#1DC2FF' : '#FF2070', fontWeight: 600}}>
          {blockOrNot ? '차단해제' : '차단'}
        </Text>
      </TouchableOpacity>

      <Text style={{marginTop: 8, fontWeight: '500', fontSize: 15}}>
        {nickname}
      </Text>
      <Text
        style={{
          marginTop: 6,
          marginBottom: 16,
          fontWeight: '400',
          fontSize: 13,
          paddingHorizontal: '10%',
        }}>
        {bio}
      </Text>

      <View style={styles.userhistory}>
        <View style={{alignItems: 'center'}}>
          <Text style={{fontWeight: '500', fontSize: 20}}>
            {blockOrNot ? '0' : collectionCount}
          </Text>
          <Text style={{color: 'gray'}}>도감</Text>
        </View>
        <View
          style={{
            backgroundColor: '#D9D9D9',
            height: '120%',
            width: 1,
            marginHorizontal: '10%',
          }}></View>
        <View style={{alignItems: 'center'}}>
          <Text style={{fontWeight: '500', fontSize: 20}}>
            {blockOrNot ? '0' : achCount}
          </Text>
          <Text style={{color: 'gray'}}>업적</Text>
        </View>
        <View
          style={{
            backgroundColor: '#D9D9D9',
            height: '120%',
            width: 1,
            marginHorizontal: '10%',
          }}></View>
        <View
          style={{alignItems: 'center'}}
          onPress={() => navigation.navigate('Friends')}>
          <Text style={{fontWeight: '500', fontSize: 20}}>
            {blockOrNot ? '0' : friendCount}
          </Text>
          <Text style={{color: 'gray'}}>친구</Text>
        </View>
      </View>
      <View style={{borderBottomWidth: 1}}>
        <View style={{height: '3%', width, backgroundColor: '#F5F5F5'}}></View>
        {friendRelationship ? (
          <FriendFeed friendId={friendInfo} />
        ) : blockOrNot ? (
          <BlockFriendRelationship />
        ) : (
          <NonFriendRelationship />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    alignItems: 'center', // 화면 가운데 정렬
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',

    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  assets: {
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'row',
    marginTop: 20,
  },
  profileImage: {
    width: 68,
    height: 68,
    borderRadius: 100,
    alignSelf: 'center', // 가운데 정렬
  },
  settingsButton: {
    position: 'absolute',
    left: '46%',
    width: 20,
    height: 20,
  },
  userinfo: {marginTop: 8, marginBottom: 16},
  userhistory: {
    width: '100%',
    height: 66,
    borderColor: '#D9D9D9',
    borderWidth: 1,
    paddingHorizontal: 87,
    paddingVertical: 16,

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  mynavigation: {
    height: 43,
    width: '100%',
    borderColor: '#D9D9D9',
    borderWidth: 1,
    paddingHorizontal: 87,
    paddingVertical: 16,

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9',
  },
  modalView: {
    backgroundColor: 'white',

    padding: '5%',
    width: '100%',
    height: '55%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default MyFriendPage;
