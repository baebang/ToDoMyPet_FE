import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  Dimensions,
  TextInput,
  StyleSheet,
  Text,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {FriendDelete} from '../../component/FriendInfo';

import {useQuery} from 'react-query';
import {friendsListCheck} from '../../service/MyPageService';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default function Friends({navigation}) {
  const [isFriendCode, setIsFriendCode] = useState('');
  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery('myFriendQueryKey', friendsListCheck);

  if (isLoading) {
    return <Text>Loading...</Text>; // 로딩 중일 때 표시할 UI
  }

  if (isError) {
    return <Text>Error fetching data</Text>; // 에러 발생 시 표시할 UI
  }
  const onPressEnter = () => {
    console.log(isFriendCode);
    //친구찾는거 넣기
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <TouchableOpacity onPress={onPressEnter}>
              <Image
                source={require('../../../assets/search.png')}
                style={styles.searchIcon}
              />
            </TouchableOpacity>

            <TextInput
              style={[styles.input, {color: 'black'}]}
              placeholder="친구 이름으로 검색하기"
              placeholderTextColor="#D1D1D2"
              onChangeText={text => {
                // Handle text change
                setIsFriendCode(text);
              }}
              onSubmitEditing={onPressEnter}
            />
          </View>
        </View>
      </View>

      <ScrollView>
        {userData.friends.map((friend, index) =>
          !isFriendCode || friend.nickname.includes(isFriendCode) ? (
            <FriendDelete key={index} friendInfo={friend} />
          ) : null,
        )}
      </ScrollView>
      <View style={[styles.bottomView, {height: 60}]}>
        <Pressable
          style={styles.textUnderLine}
          onPress={() => navigation.navigate('BlockFriend')}>
          <Text>차단된 친구</Text>
        </Pressable>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: '5%',
    paddingTop: '6%',
    paddingBottom: '9%',
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    padding: '4%',
    paddingHorizontal: '7%',
    borderRadius: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    height: height * 0.03,
    width: width * 0.05,
  },
  input: {
    marginLeft: '3%',
    fontSize: 16,
  },
  bottomView: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  textUnderLine: {borderBottomWidth: 1, borderBottomColor: '#5F5F5F'},
});
