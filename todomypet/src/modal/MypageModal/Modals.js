import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Text,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';
import eggGrowth from '../../component/eggGrowth';
import {achievementsDetail} from '../../service/MyPageService';

const screenWidth = Dimensions.get('window').width;
const iconSize = screenWidth / 3.5;
const star = screenWidth / 20;
const tropyViewSize = screenWidth * 0.4;
const modalView = screenWidth * 0.83;
const eggIconSize = screenWidth * 0.04;

export function Modaljournal({closeModal, modalState, achDataID}) {
  const [isAchData, setIsAchData] = useState();
  const [isAchievementsDetail, SetAchievementsDetail] = useState(null);
  const [numStars, setNumStars] = useState(0);
  //isModalInfo로 정보 불러오기

  // console.log(achDataID[0].id);
  useEffect(() => {
    if (achDataID) {
      achievementsDetail(achDataID[0].id).then(res => {
        SetAchievementsDetail(res);
        setNumStars(res.achDiff);
      });
    }
  }, [modalState]);
  console.log(achDataID, 'achDataID======');
  const attendance = require('../../../assets/attendancetropi.png');
  const achievement = require('../../../assets/achievementtropi.png');
  const evolution = require('../../../assets/evolutiontropi.png');
  const graduation = require('../../../assets/graduationtropi.png');
  const continueattendance = require('../../../assets/continueattendancetropi.png');

  function returnImage() {
    switch (achDataID[1]) {
      case 'attendance':
        return attendance;
      case 'achievement':
        return achievement;
      case 'evolution':
        return evolution;
      case 'graduation':
        return graduation;
      case 'continueAttendance':
        return continueattendance;
      default:
        // 기본 이미지가 없을 경우 null 또는 다른 이미지 반환
        return null;
    }
  }

  const numNonStars = 5 - numStars; // "nonstar" 컴포넌트 개수

  const StarImage = () => (
    <Image
      style={{height: star, width: star}}
      source={require('../../../assets/star.png')}></Image>
  );
  const NonStarImage = () => (
    <Image
      style={{height: star, width: star}}
      source={require('../../../assets/nonstar.png')}></Image>
  );

  const starComponents = Array.from({length: numStars}, (_, i) => (
    <StarImage key={`star${i}`} />
  ));
  const nonStarComponents = Array.from({length: numNonStars}, (_, i) => (
    <NonStarImage key={`nonstar${i}`} />
  ));

  return (
    <View>
      <Modal transparent={true} visible={modalState}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{fontFamily: 'DungGeunMo'}}>
              {achDataID && achDataID[0].achName}
            </Text>
            <View style={styles.tropyView}>
              <Image
                style={{width: iconSize, height: iconSize}}
                source={returnImage()}></Image>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <View style={styles.textContainer}>
                  <Text style={{color: '#1DC2FF'}}>달성일자</Text>
                </View>

                <Text>
                  {isAchievementsDetail &&
                    isAchievementsDetail.achievedAt.split('T')[0]}
                </Text>
              </View>

              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <View style={styles.textContainer}>
                  <Text style={{color: '#1DC2FF'}}>난이도</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  {starComponents}
                  {nonStarComponents}
                </View>
              </View>
            </View>
            <View style={styles.tropycontent}>
              <Text>
                {isAchievementsDetail && isAchievementsDetail.achDescribe}
              </Text>
            </View>

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={closeModal}>
              <Text style={styles.textStyle}>닫기</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export function ModalPokedex({display, closemodal, petinfo}) {
  const gradeTexts = {
    BABY: '아기',
    CHILDREN: '어린이',
    TEENAGER: '청소년',
    ADULT: '성인',
  };

  const personalityTexts = {
    CALM: '덤덤',
    CHEERFUL: '명랑',
    GLUTTON: '먹보',
    PROTEIN: '프로틴',
    CUTE: '귀여움',
    PURE_EVIL: '순수악',
  };

  const getGradeIcon = eggGrowth(petinfo.grade);
  const getGradeText = grade => gradeTexts[grade] || 'Unknown Grade';
  const getPersonalityText = personality =>
    personalityTexts[personality] || 'Unknown Personality';

  return (
    <Modal transparent={true} visible={display}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={{flexDirection: 'row'}}>
            <Image
              style={{
                height: eggIconSize,
                width: eggIconSize,
                marginRight: '3%',
              }}
              source={{uri: getGradeIcon}}
            />
            <Text style={{fontFamily: 'DungGeunMo'}}>{petinfo.petName}</Text>
          </View>

          <View style={styles.tropyView}>
            <Image
              style={{width: iconSize, height: iconSize}}
              source={{
                uri: petinfo.imageUrl,
              }}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <View style={styles.textContainer}>
                <Text style={{color: '#1DC2FF'}}>성장단계</Text>
              </View>
              <Text>{getGradeText(petinfo.grade)}</Text>
            </View>

            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <View style={styles.textContainer}>
                <Text style={{color: '#1DC2FF'}}>성격</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text>{getPersonalityText(petinfo.personality)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.tropycontent}>
            <Text>{petinfo.describe}</Text>
          </View>

          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={closemodal}>
            <Text style={styles.textStyle}>닫기</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: '5%',
    width: modalView,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  tropyView: {
    height: tropyViewSize,

    backgroundColor: '#FAFAFA',
    borderRadius: 20,
    marginTop: '4%',
    marginBottom: '4%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    borderRadius: 6,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#1DC2FF',
  },
  buttonClose: {
    backgroundColor: '#1DC2FF',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textContainer: {
    backgroundColor: '#ECFBFF',
    paddingHorizontal: 10, // 테두리 둥글기를 보여주기 위해 여백 추가
    paddingVertical: 5,
    borderRadius: 4,
  },

  tropycontent: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    padding: '6%',
    marginTop: '7%',
    marginBottom: '7%',
  },
});
