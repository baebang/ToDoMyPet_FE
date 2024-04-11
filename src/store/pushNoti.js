import {AppState} from 'react-native';
import notifee, {AndroidImportance, AndroidColor} from '@notifee/react-native';

const displayNotification = async message => {
  const channelAnoucement = await notifee.createChannel({
    id: 'default',
    name: '카테고리 이름',
    importance: AndroidImportance.HIGH,
  });

 
  await notifee.displayNotification({
    title: message.notification.title,
    body: message.notification.body,
    android: {
      channelId: channelAnoucement,
      smallIcon: 'ic_launcher', //
    },
  });
};

export default {
  displayNoti: remoteMessage => displayNotification(remoteMessage),
};
