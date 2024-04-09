import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, Dimensions} from 'react-native';
import {ProfileImage} from './ProfilePick';
import elapsedText from './elapsedText';
import {ReplySetting} from '../modal/BorderModal/FeedModal';
import {useNavigation} from '@react-navigation/native';
import { declarationToast } from '../store/Item';

export function ReplyForm({postID, replyData}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isBoardID, setIsBoardID] = useState('');
  const [isReplyContent, setIsReplyConten] = useState('');
  const [isReplyCreateTime, setIsReplyCreateTime] = useState('');
  const [isReplyImage, setIsRepltImage] = useState('');
  const [isReplyName, setIsRepltName] = useState('');
  const [typeContetn, setTypeContent] = useState('');
  const screenWidth = Dimensions.get('window').width;
  const navigation = useNavigation();
  const {setComment} = declarationToast()

  const iconSize = screenWidth * 0.07;
  function timeElapsed(createdAtDate) {
    let currentDate = new Date();
    currentDate.setUTCHours(currentDate.getUTCHours() + 9);
    let createdAtDates = new Date(createdAtDate);
    createdAtDates.setUTCHours(createdAtDates.getUTCHours() + 9);

    var elapsedTime = (currentDate.getTime() - createdAtDates.getTime()) / 1000;
    const createBoard = elapsedText(elapsedTime);
    return createBoard;
  }
  function closeModal() {
    setIsModalVisible(false);
  }
  function openModal(boardnum, content, time, profileImage, name) {
    setIsModalVisible(true);
    setIsBoardID(boardnum);
    setIsReplyConten(content);
    setIsReplyCreateTime(time);
    setIsRepltImage(profileImage);
    setIsRepltName(name);
  }



  return (
    <View style={{backgroundColor: '#FFFFFF'}}>
      <ReplySetting
        state={isModalVisible}
        closeModal={closeModal}
        boardID={isBoardID}
        postID={postID}
        content={isReplyContent}
        time={isReplyCreateTime}
        profileImage={isReplyImage}
        name={isReplyName}
        type={typeContetn}
      />
      {replyData &&
        replyData.replyList.map((item, index) => (
          <View key={index} style={{paddingHorizontal: '5%'}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: '4%',
              }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('MyFriendPage', {
                    friendInfo: item.writer.id,
                  });
                }}
                disabled={item.writer.myPost}>
                <ProfileImage profilePicUrl={item.writer.profilePicUrl} />
              </TouchableOpacity>

              <View style={{marginLeft: '2%', marginRight: 'auto'}}>
                <Text style={{fontSize: 13, fontWeight: 600}}>
                  {item.writer.nickname}
                </Text>
                <Text style={{marginTop: '4%', color: '#CBCBCB'}}>
                  {timeElapsed(item.replyInfo.createdAt)}
                </Text>
              </View>
              {item.writer.myPost ? (
                <TouchableOpacity
                  onPress={() => {
                    openModal(
                      item.replyInfo.id,
                      item.replyInfo.content,
                      timeElapsed(item.replyInfo.createdAt),
                      item.writer.profilePicUrl,
                      item.writer.nickname,
                    );
                    setTypeContent('');
                  }}>
                  <Image
                    source={require('../../assets/more_vert.png')}
                    style={{height: iconSize, width: iconSize}}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    openModal(
                      item.replyInfo.id,
                      item.replyInfo.content,
                      timeElapsed(item.replyInfo.createdAt),
                      item.writer.profilePicUrl,
                      item.writer.nickname,
                    );
             
                    setTypeContent('flag');
                  }}>
                  <Image
                    source={require('../../assets/flag.png')}
                    style={{height: iconSize, width: iconSize}}
                  />
                </TouchableOpacity>
              )}
            </View>
            <Text style={{paddingTop: '5%'}}>{item.replyInfo.content}</Text>
            <View
              style={{
                backgroundColor: '#F0F0F0',
                height: 1,
                marginTop: '4%',
              }}
            />
          </View>
        ))}
    </View>
  );
}
