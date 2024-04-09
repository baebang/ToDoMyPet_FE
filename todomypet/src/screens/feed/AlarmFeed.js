import React from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {alamList} from '../../service/NotificationService';
import {useQuery} from 'react-query';
import elapsedText from '../../component/elapsedText';
import {ProfileImage} from '../../component/ProfilePick';

const TimeElapsed = (createdAt, currentDate) => {
  let createdAtDate = new Date(createdAt);
  createdAtDate.setUTCHours(createdAtDate.getUTCHours() + 9);
  var elapsedTime = (currentDate.getTime() - createdAtDate.getTime()) / 1000;
  const alamTime = elapsedText(elapsedTime);
  return alamTime;
};

const AlarmFeed = () => {
  let currentDate = new Date();
  currentDate.setUTCHours(currentDate.getUTCHours() + 9);
  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery('alamListQueryKey', alamList);

  if (isLoading || isError) {
    return <Text>loading...</Text>;
  }



  let yesterdayContent = [];
  let todayContent = [];

  userData.forEach((item, index) => {
    const {createdAt} = item;
    const elapsedText = TimeElapsed(createdAt, currentDate);
    const isYesterday = elapsedText.includes('일 전');

    if (isYesterday) {
      yesterdayContent.push(item);
    } else {
      todayContent.push(item);
    }
  });

  return (
    <View>
      <ScrollView>
        <Text style={{textAlign: 'center', marginTop: '5%', color: '#7E7E7E'}}>
          매월 1일에 모든 알림이 삭제 됩니다.
        </Text>
        {todayContent.length > 0 && (
          <View style={styles.inner}>
            <Text style={{color: 'black', fontSize: 15, fontWeight: '500'}}>
              오늘
            </Text>
          </View>
        )}

        {todayContent.map((item, index) => (
          <NotificationItem key={index} item={item} currentDate={currentDate} />
        ))}
        {yesterdayContent.length > 0 && (
          <View style={styles.inner}>
            <Text style={{color: 'black', fontSize: 15, fontWeight: '500'}}>
              지난알림
            </Text>
          </View>
        )}

        {yesterdayContent.map((item, index) => (
          <NotificationItem key={index} item={item} currentDate={currentDate} />
        ))}
      </ScrollView>
    </View>
  );
};

const NotificationItem = ({item, currentDate}) => {
  const {
    createdAt,
    notificationContent,
    notificationDataId,
    senderName,
    senderProfilePicUrl,
    type,
  } = item;

  return (
    <View
      style={{
        backgroundColor: 'white',
        height: 90,
        paddingHorizontal: '4%',
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderBottomColor: '#F0F0F0',
      }}>
      <TouchableOpacity onPress={() => console.log('???', notificationDataId)}>
        <ProfileImage profilePicUrl={senderProfilePicUrl} />
      </TouchableOpacity>

      <View style={{marginLeft: '4%'}}>
        <Text style={{color: 'black', fontSize: 16}}>
          {type === 'FRIEND'
            ? `${senderName}님과 친구가 되었습니다.`
            : `${senderName}님이 댓글을 남겼습니다.`}
        </Text>
        {type !== 'FRIEND' && (
          <Text style={{color: '#7E7E7E', fontSize: 15}}>
            {notificationContent}
          </Text>
        )}
        <Text style={{color: '#B2B2B2', fontSize: 11, marginTop: '3%'}}>
          {TimeElapsed(createdAt, currentDate)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inner: {
    padding: 15,
    marginTop: '5%',
  },
});

export default AlarmFeed;
