import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import {ProfileImage} from './ProfilePick';
import {FriendDeleteModal} from '../modal/MypageModal/Setting';
import {AddfriendCode, friendsDeleteCheck} from '../service/BoardService';
import {useQueryClient} from 'react-query';
import {useNavigation} from '@react-navigation/native';
import {unblockFriend} from '../service/MyPageService';

export function FriendDelete({friendInfo}) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  console.log(friendInfo);

  const {id, nickname, bio, profilePicUrl, friendOrNot} = friendInfo;
  const navigation = useNavigation();

  function CloseModal() {
    setIsModalVisible(false);
  }
  return (
    <View style={styles.container}>
      <Modal transparent={true} visible={isModalVisible}>
        <FriendDeleteModal
          closeModal={CloseModal}
          state={isModalVisible}
          friendID={id}
        />
      </Modal>
      <View style={styles.friendContainer}>
        <Pressable
          onPress={() =>
            navigation.navigate('MyFriendPage', {
              friendInfo: id,
            })
          }>
          <ProfileImage profilePicUrl={profilePicUrl} />
        </Pressable>

        <View style={styles.infoContainer}>
          <Text style={styles.nameText}>{nickname}</Text>
          <Text style={styles.descriptionText}>{bio}</Text>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            setIsModalVisible(true);
          }}>
          <Text style={styles.deleteButtonText}>삭제</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.separator} />
    </View>
  );
}

export function FriendUnBlock({friendInfo}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const queryClient = useQueryClient();

  const {id, nickname, bio, profilePicUrl, friendOrNot} = friendInfo;
  const navigation = useNavigation();

  function repeatFunctoin() {
    queryClient.refetchQueries('myFrinedPageQueryKey');
    queryClient.refetchQueries('myPageQueryKey');
    queryClient.refetchQueries('viewFeedKey');
    queryClient.refetchQueries('ReplyViewQueryKey');
    queryClient.refetchQueries('myFriendQueryKey');
    queryClient.refetchQueries('BlockFriendListKey');
  }

  return (
    <View style={styles.container}>
      <View style={styles.friendContainer}>
        <Pressable
          onPress={() =>
            navigation.navigate('MyFriendPage', {
              friendInfo: id,
            })
          }>
          <ProfileImage profilePicUrl={profilePicUrl} />
        </Pressable>

        <View style={styles.infoContainer}>
          <Text style={styles.nameText}>{nickname}</Text>
          <Text style={styles.descriptionText}>{bio}</Text>
        </View>

        <TouchableOpacity
          style={styles.unblockButton}
          onPress={async () => {
            await unblockFriend(id);
            await repeatFunctoin();
          }}>
          <Text style={styles.unblockButtonText}>차단해제</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.separator} />
    </View>
  );
}

export function FrinedFind({Key}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const cachedData = queryClient.getQueryData(['FriendAddQueryKey', Key]);

  let {bio, nickname, profilePicUrl, id, friendOrNot} = cachedData;
  const friendNickName = nickname;
  const friendBio = bio;
  const maxBioLength = 22;

  const truncatedBio =
    friendBio.length > maxBioLength
      ? friendBio.substring(0, maxBioLength) + '...'
      : friendBio;

  function handelRelationFriend() {
    if (friendOrNot) {
      setIsModalVisible(true);
    } else {
      setIsLoading(true);
      AddfriendCode(id)
        .then(() => {
          queryClient.refetchQueries(['FriendAddQueryKey', Key]);
          queryClient.refetchQueries('myFriendQueryKey');
          queryClient.refetchQueries('myPageQueryKey');
          queryClient.refetchQueries('viewFeedKey');
          setIsLoading(false);
        })
        .catch(console.error);
    }
  }

  function CloseModal() {
    setIsModalVisible(false);
  }

  return (
    <View style={{marginTop: '5%'}}>
      <Modal transparent={true} visible={isModalVisible}>
        <FriendDeleteModal
          closeModal={CloseModal}
          state={isModalVisible}
          friendID={id}
          Key={Key}
        />
      </Modal>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <ProfileImage profilePicUrl={profilePicUrl} />
          <View style={{marginLeft: '8%'}}>
            <Text style={{fontSize: 15, fontWeight: 500}}>
              {friendNickName}
            </Text>
            <Text style={{fontSize: 12, color: '#7E7E7E'}}>{truncatedBio}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: friendOrNot
              ? '#F7F7F7'
              : isLoading
              ? '#F7F7F7'
              : '#1DC2FF',
            alignItems: 'center',
            padding: '4%',
            paddingHorizontal: '5%',
            borderRadius: 16,
          }}
          onPress={handelRelationFriend}>
          {friendOrNot ? (
            <Text style={{color: 'red'}}>삭제</Text>
          ) : isLoading ? (
            <Text style={{color: 'black'}}>요청중</Text>
          ) : (
            <Text
              style={{color: 'white', display: isLoading ? 'none' : 'flex'}}>
              추가
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  friendContainer: {
    flexDirection: 'row',
    paddingHorizontal: '5%',
    alignItems: 'center',
    marginTop: '4%',
  },
  infoContainer: {
    flex: 1,
    marginHorizontal: '3%',
  },
  nameText: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: '2%',
  },
  descriptionText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#7E7E7E',
  },
  deleteButton: {
    backgroundColor: '#F7F7F7',
    padding: '3%',
    paddingHorizontal: '5%',
    borderRadius: 6,
  },
  unblockButton: {
    backgroundColor: '#ECFBFF',
    padding: '3%',
    paddingHorizontal: '5%',
    borderRadius: 6,
  },
  deleteButtonText: {
    color: 'red',
    fontWeight: '500',
    fontSize: 15,
  },
  unblockButtonText: {
    color: '#1DC2FF',
    fontWeight: '500',
    fontSize: 15,
  },

  separator: {
    width: '100%',
    backgroundColor: '#F0F0F0',
    height: 1,
    marginTop: '4%',
  },
});
