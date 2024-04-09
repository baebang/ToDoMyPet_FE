import React, {useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import TopTabNavigationApp from './mypagenavi/TopTabNavigationApp';
import {useQuery} from 'react-query';
import {ProfileImage} from '../../component/ProfilePick';
import {useNavigation} from '@react-navigation/native';
import {memberCheck} from '../../service/MyPageService';

function Mypage() {
  const {width, height} = Dimensions.get('window');
  const navigation = useNavigation();

  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery('myPageQueryKey', memberCheck);
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
  } = userData;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.assets}>
        <ProfileImage profilePicUrl={profilePicUrl} />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('MySetting');
          }}
          style={styles.settingsButton}>
          <Image
            style={styles.settingsButton}
            source={require('../../../assets/settings.png')}
          />
        </TouchableOpacity>
      </View>

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
            {collectionCount}
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
          <Text style={{fontWeight: '500', fontSize: 20}}>{achCount}</Text>
          <Text style={{color: 'gray'}}>업적</Text>
        </View>
        <View
          style={{
            backgroundColor: '#D9D9D9',
            height: '120%',
            width: 1,
            marginHorizontal: '10%',
          }}></View>
        <TouchableOpacity
          style={{alignItems: 'center'}}
          onPress={() => navigation.navigate('Friends')}>
          <Text style={{fontWeight: '500', fontSize: 20}}>{friendCount}</Text>
          <Text style={{color: 'gray'}}>친구</Text>
        </TouchableOpacity>
      </View>
      <View style={{borderBottomWidth: 1}}>
        <View style={{height: '3%', width, backgroundColor: '#F5F5F5'}}></View>
        <View style={{marginTop: '3%'}}>
          <TopTabNavigationApp />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    alignItems: 'center', // 화면 가운데 정렬
  },
  assets: {
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'row',
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
});

export default Mypage;
