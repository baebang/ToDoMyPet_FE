import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import {useQuery} from 'react-query';
import {blockFriendList} from '../../service/MyPageService';
import {FriendUnBlock} from '../../component/FriendInfo';

const BlockFriend = () => {
  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery('BlockFriendListKey', blockFriendList);

  if (isLoading) {
    return <Text>Loading...</Text>; // 로딩 중일 때 표시할 UI
  }

  if (isError) {
    return <Text>Error fetching data</Text>; // 에러 발생 시 표시할 UI
  }

  return (
    <View>
      <ScrollView>
        {userData.userList.map((friend, index) => (
          <FriendUnBlock key={index} friendInfo={friend} />
        ))}
      </ScrollView>
    </View>
  );
};

export default BlockFriend;
