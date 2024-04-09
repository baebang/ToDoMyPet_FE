import {React} from 'react';

import {View, Text, ScrollView, StyleSheet} from 'react-native';
import FeedPreview from '../../../component/FeedPreview';
import {myPostList} from '../../../service/BoardService';
import {useQuery} from 'react-query';

function MyFeed() {
  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery('myPostListQueryKey', myPostList);

  if (isLoading) {
    return <Text>Loading...</Text>; // 로딩 중일 때 표시할 UI
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
            <FeedPreview key={index} feedcontent={post} />
          ))
        )}

        <View style={{marginBottom: '100%'}}></View>
      </ScrollView>
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
});

export default MyFeed;
