import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import {useQuery} from 'react-query';

import {showLikeList} from '../../service/BoardService';
import {useRoute, useNavigation} from '@react-navigation/native';

import {ProfileImage} from '../../component/ProfilePick';

const LikeList = () => {
  const route = useRoute();
  const {postID} = route.params;
  const navigation = useNavigation();

  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery('showLikeQueryKey', () => showLikeList(postID));

  if (isLoading || isError) {
    return <Text>loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {userData.likeList.map((item, index) => {
        const {bio, nickname, profilePicUrl, id, myLike} = item;

        return (
          <View
            key={index}
            style={{
              backgroundColor: 'white',
              height: 90,
              paddingHorizontal: '4%',
              alignItems: 'center',
              flexDirection: 'row',
              borderBottomWidth: 2,
              borderBottomColor: '#F0F0F0',
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('MyFriendPage', {
                  friendInfo: id,
                });
              }}
              disabled={myLike}>
              <ProfileImage profilePicUrl={profilePicUrl} />
            </TouchableOpacity>

            <View
              style={{
                marginLeft: '4%',
              }}>
              <Text style={{color: 'black', fontSize: 15, fontWeight: 400}}>
                {nickname}
              </Text>

              <Text style={{color: '#B2B2B2', fontSize: 11, marginTop: '10%'}}>
                {bio}
              </Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  inner: {
    padding: 15,

    backgroundColor: 'white',
  },
  header: {
    fontSize: 36,
    marginBottom: 48,
  },
  textInput: {
    height: 40,
    borderColor: '#000000',
    borderBottomWidth: 1,
    marginBottom: 36,
  },
  btnContainer: {
    backgroundColor: 'white',
    marginTop: 12,
  },
});

export default LikeList;
