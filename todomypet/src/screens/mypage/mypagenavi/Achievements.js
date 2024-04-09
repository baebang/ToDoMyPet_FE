import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
  Modal,
} from 'react-native';
import {useQuery} from 'react-query';

import {Modaljournal} from '../../../modal/MypageModal/Modals';
import {achievementsList} from '../../../service/MyPageService';

//출석
const attendanceImage = require('../../../../assets/attendanceImage.png');
const nonattendanceImage = require('../../../../assets/nonattendanceImage.png');

//달성
const achievementImage = require('../../../../assets/achievementImage.png');
const nonachievementImage = require('../../../../assets/nonachievementImage.png');

//최종
const graduationImage = require('../../../../assets/graduationImage.png');
const nongraduationImage = require('../../../../assets/nongraduationImage.png');

//진화
const evolutionImage = require('../../../../assets/evolutionImage.png');
const nonevolutionImage = require('../../../../assets/nonevolutionImage.png');

//연속출석
const continueAttendanceImage = require('../../../../assets/continueattendanceImage.png');
const noncontinueAttendanceImage = require('../../../../assets/noncontinueattendanceImage.png');

const Achievements = () => {
  const [isModalVisable, setIsModalVisable] = useState(false);
  const [isModalInfo, setIsModalInfo] = useState('');
  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery(['achievmentsQueryKey'], achievementsList);

  if (isLoading) {
    return <Text>Loading...</Text>; // 로딩 중일 때 표시할 UI
  }

  if (isError) {
    return <Text>Error fetching data</Text>; // 에러 발생 시 표시할 UI
  }
  const {attendance, achievement, evolution, graduation, continueAttendance} =
    userData;

  const screenWidth = Dimensions.get('window').width;
  const iconSizeFactor = 3.6; // 화면 너비의 몇 배로 아이콘 크기를 설정할지 결정
  const iconSize = screenWidth / iconSizeFactor;

  const TruncatedText = ({text, maxLength}) => {
    if (text.length <= maxLength) {
      return <Text style={styles.achievementText}>{text}</Text>;
    } else {
      const truncatedText = text.substring(0, maxLength - 2) + '...';
      return <Text style={styles.achievementText}>{truncatedText}</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <Modaljournal
        visible={isModalVisable}
        closeModal={() => setIsModalVisable(false)}
        modalState={isModalVisable}
        achDataID={isModalInfo}
      />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.achievementTypeText}>출석</Text>
        <View
          style={{flexDirection: 'row', flexWrap: 'wrap', marginBottom: '6%'}}>
          {attendance.map((achData, id) => (
            <View key={id} style={{width: '33%', marginBottom: '6%'}}>
              {renderAchievement(
                achData,
                iconSize,
                attendanceImage,
                nonattendanceImage,
                'attendance',
              )}
            </View>
          ))}
        </View>
        <Text style={[styles.achievementTypeText, {marginTop: '2%'}]}>
          연속출석
        </Text>
        <View
          style={{flexDirection: 'row', flexWrap: 'wrap', marginBottom: '6%'}}>
          {continueAttendance.map((achData, id) => (
            <View key={id} style={{width: '33%', marginBottom: '6%'}}>
              {renderAchievement(
                achData,
                iconSize,
                continueAttendanceImage,
                noncontinueAttendanceImage,
                'continueAttendance',
              )}
            </View>
          ))}
        </View>

        <Text style={[styles.achievementTypeText, {marginTop: '2%'}]}>
          달성
        </Text>
        <View
          style={{flexDirection: 'row', flexWrap: 'wrap', marginBottom: '6%'}}>
          {achievement.map((achData, id) => (
            <View key={id} style={{width: '33%', marginBottom: '6%'}}>
              {renderAchievement(
                achData,
                iconSize,
                achievementImage,
                nonachievementImage,
                'achievement',
              )}
            </View>
          ))}
        </View>

        <Text style={[styles.achievementTypeText, {marginTop: '2%'}]}>
          진화
        </Text>
        <View
          style={{flexDirection: 'row', flexWrap: 'wrap', marginBottom: '6%'}}>
          {evolution.map((achData, id) => (
            <View key={id} style={{width: '33%', marginBottom: '6%'}}>
              {renderAchievement(
                achData,
                iconSize,
                evolutionImage,
                nonevolutionImage,
                'evolution',
              )}
            </View>
          ))}
        </View>

        <Text style={[styles.achievementTypeText, {marginTop: '2%'}]}>
          최종
        </Text>
        <View
          style={{flexDirection: 'row', flexWrap: 'wrap', marginBottom: '6%'}}>
          {graduation.map((achData, id) => (
            <View key={id} style={{width: '33%', marginBottom: '6%'}}>
              {renderAchievement(
                achData,
                iconSize,
                graduationImage,
                nongraduationImage,
                'graduation',
              )}
            </View>
          ))}
        </View>

        <View style={{marginBottom: '125%'}}></View>
      </ScrollView>
      <View
        style={{flex: 0.2, backgroundColor: 'rgba(255, 255, 255, 0)'}}></View>
    </View>
  );

  function renderAchievement(achData, iconSize, image, nonImage, type) {
    const {achName, achieved, id} = achData;
    const handlePress = () => {
      setIsModalVisable(true);

      setIsModalInfo([achData, type]);
    };

    return achieved ? (
      <Pressable style={styles.achievement} onPress={handlePress}>
        <Image style={{width: iconSize, height: iconSize}} source={image} />
        <TruncatedText text={achName} maxLength={6} />
      </Pressable>
    ) : (
      <View>
        <Image style={{width: iconSize, height: iconSize}} source={nonImage} />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    // paddingTop: 24,
    paddingBottom: 24,
    flex: 1,
  },
  contentContainer: {
    paddingTop: '7%',
    paddingHorizontal: '3%',
  },
  achievementTypeText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 16,
  },
  achievementRow: {
    flexDirection: 'row',
    marginBottom: '3%',
  },
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },

  achievementText: {
    fontSize: 12,
    position: 'absolute',
    fontFamily: 'DungGeunMo',
    color: 'white',
    left: '16%',
    top: '80%',
  }, //

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default Achievements;
