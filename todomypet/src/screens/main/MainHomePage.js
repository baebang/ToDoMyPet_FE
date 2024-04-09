import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ImageBackground,
  Image,
  Dimensions,
  Platform,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {InteriorModal} from '../../modal/MainHome/InteriorModal';

import {mainPageShow} from '../../service/MainService';
import {useQuery} from 'react-query';
import eggGrowth from '../../component/eggGrowth';
import * as Progress from 'react-native-progress';
import {AchievementsModal} from '../../modal/MypageModal/AchievementsModal';

import {TodoFrameSummary} from '../../component/TodoFrame';
import AddToDoModal from '../../modal/TodoModal/AddToDoModal';
import AttendCountModal from '../../modal/MainHome/AttendCountModal';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-easy-toast';

import {
  categoryColorList,
  showMonthTodo,
  categoryList,
  showDailyTodo,
} from '../../service/TodoService';
import {TodoDateSetting} from '../../store/Item';

import {useNavigation} from '@react-navigation/native';

import {petExpUP} from '../../service/PetService';
import {PetLineMain, PetLineFirst} from '../PetLine';

const {height} = Dimensions.get('window');

const MainHomePage = () => {
  const [isModalVisible, setIsModalvisible] = useState(false);
  const [isPetModalVisible, setIsPetModalvisible] = useState(false);
  const [isTodoModalVisable, setIsTodoModalVisable] = useState(false);
  const navigation = useNavigation();
  const [randomProteinLine, setRandomProteinLine] = useState('');
  const [changePetComent, setChangePetComent] = useState(false);
  const {setStartDate} = TodoDateSetting();

  const toastRef = useRef(); // toast ref 생성

  //추가하면 업데이트 시켜줘야하므로
  let today = new Date();

  // 한국 시간대로 변경합니다.
  today.setUTCHours(today.getUTCHours() + 9);
  let formattedToday = today.toISOString().split('T')[0];

  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery('MainPageShowQueryKey', mainPageShow);

  useEffect(() => {
    kdskd();
    if (userData && !userData.petExperiencePoint) {
      setRandomProteinLine(PetLineFirst(petPersonality));
    } else {
      setRandomProteinLine(PetLineMain(petPersonality));
    }
  }, [userData, changePetComent]);

  //할일
  useQuery('categoryListKey', categoryList);
  useQuery('categoryColorListKey', categoryColorList);
  const {data: showDailyTodoQuery} = useQuery('showTodayTodoKey', () =>
    showDailyTodo(formattedToday),
  ); //오늘할일 전용 쿼리
  useQuery('showDailyTodoKey', () => showDailyTodo(formattedToday)); //할 일 자세히 보기 쿼리

  if (isLoading) {
    return <Text>MainPageShowQueryKey Loading...</Text>;
    // 로딩 중일 때 표시할 UI
  }

  if (isError) {
    return <Text>MainPageShowQueryKey Error fetching</Text>; // 에러 발생 시 표시할 UI
  }

  async function kdskd() {
    // await messaging().registerForRemoteNotifications();
    await messaging().getAPNSToken();
    const token = await messaging().getToken();
  }

  const {
    backgroundImage,
    petExperiencePoint,
    petGif,
    petGrade,
    petMaxExperiencePoint,
    petName,
    petPersonality,
    petSeq,
    petSignatureCode,
    petPortraitImage,
    backgroundId,
    petId,
  } = userData;

  console.log(petSeq, 'petSeq!');

  const {width} = Dimensions.get('window');
  const petIconSize = width * 0.28;
  const petPortraitIconSize = width * 0.12;
  const speechBubbleSize = width * 0.7;
  const eggIconSize = width * 0.05;
  const progressBarWidth = width * 0.76;
  const checkIcon = width * 0.07;

  const progress = petExperiencePoint / petMaxExperiencePoint;
  const Evolution = petExperiencePoint >= petMaxExperiencePoint;

  function closeModal() {
    setIsModalvisible(false);
  }

  function closePetModal() {
    setIsPetModalvisible(false);
  }

  function todoModalClose() {
    setIsTodoModalVisable(false);
  }

  function toggleComment() {
    setChangePetComent(prev => prev + 1);
  }

  function expImageToast(num) {
    if (num === '5') {
      toastRef.current.show(
        <View style={{marginTop: '3%'}}>
          <Image
            source={require('../../../assets/exp_5.png')}
            style={{width: checkIcon + 60, height: checkIcon + 60, zIndex: 2}} // 이미지 크기를 조정합니다.
          />
        </View>,
      );
    } else {
      {
        toastRef.current.show(
          <View style={{marginTop: '3%'}}>
            <Image
              source={require('../../../assets/exp_10.png')}
              style={{width: checkIcon + 60, height: checkIcon + 60, zIndex: 2}} // 이미지 크기를 조정합니다.
            />
          </View>,
        );
      }
    }
  }

  return (
    <>
      <AddToDoModal visable={isTodoModalVisable} closeModal={todoModalClose} />
      <AttendCountModal expImageToast={expImageToast} />

      <AchievementsModal
        state={isPetModalVisible}
        closeModal={closePetModal}
        seqnumber={petSeq}
        signature={petSignatureCode}
      />
      <InteriorModal
        visable={isModalVisible}
        closeModal={closeModal}
        backgroundId={backgroundId}
      />
      <ImageBackground
        style={styles.backgroundImage} // Apply the style directly here
        source={{uri: backgroundImage}} // Use source instead of src
      >
        <SafeAreaView></SafeAreaView>
        <View style={{padding: '5%'}}>
          <View
            style={{
              flexDirection: 'row',

              alignItems: 'center',
            }}>
            <Pressable onPress={() => setIsPetModalvisible(true)}>
              <Image
                style={{
                  height: petPortraitIconSize,
                  width: petPortraitIconSize,
                  marginRight: '3%',
                }}
                source={{uri: petPortraitImage}}
              />
            </Pressable>

            <View>
              <View style={{flexDirection: 'row', marginBottom: '2%'}}>
                <Image
                  style={{
                    height: eggIconSize,
                    width: eggIconSize,
                    marginRight: '3%',
                  }}
                  source={{uri: eggGrowth(petGrade)}}></Image>

                <Text style={{fontFamily: 'DungGeunMo', color: 'black'}}>
                  {petName}
                </Text>

                <Text
                  style={[
                    styles.nametext,
                    {
                      fontSize: 14,
                      marginLeft: 'auto',
                      fontFamily: 'DungGeunMo',
                      color: 'black',
                    },
                  ]}>
                  {petExperiencePoint <= petMaxExperiencePoint
                    ? `${petExperiencePoint} / ${petMaxExperiencePoint}`
                    : `${petMaxExperiencePoint} / ${petMaxExperiencePoint}`}
                </Text>
              </View>
              {!Evolution ? (
                <Progress.Bar
                  progress={progress}
                  height={16} // 프로그레스 바의 높이
                  borderColor="#000"
                  borderWidth={2}
                  color="#FF2070"
                  width={progressBarWidth}
                  borderRadius={99}
                  backgroundColor="white"
                />
              ) : (
                <ImageBackground
                  source={require('../../../assets/gaugeMax.png')}
                  style={{
                    height: 21,
                    overflow: 'hidden',
                    borderRadius: 99,
                    borderWidth: 2,
                    width: progressBarWidth,
                  }}
                />
              )}
            </View>
            <Toast
              ref={toastRef}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0)',
              }}
              textStyle={{
                fontSize: 14,
                color: 'white',
                textAlign: 'center',
              }}
              positionValue={height}
              fadeInDuration={200}
              fadeOutDuration={1000}
            />
          </View>
          <Pressable onPress={() => setIsModalvisible(true)}>
            <Image
              style={{
                height: eggIconSize,
                width: eggIconSize,
                marginBottom: '1%',
                marginLeft: 'auto',
                marginTop: '3%',
              }}
              source={require('../../../assets/InteriorButton.png')}
            />
          </Pressable>

          <View
            style={{
              justifyContent: 'center',
              display: 'flex',
              alignItems: 'center',
            }}>
            <ImageBackground
              style={{
                height: speechBubbleSize / 2.5,
                width: speechBubbleSize,
                transform: [{scale: 0.8}],
                padding: '5%',
                display: 'flex',
                alignItems: 'center',
                display: Evolution ? 'none' : 'flex',
                marginBottom: '7%',
              }}
              source={require('../../../assets/speechBubble.png')}>
              <Text
                style={[
                  {
                    fontSize: 15,
                    fontFamily: 'DungGeunMo',
                    color: 'black',
                    marginTop: '9%',
                  },
                ]}>
                {randomProteinLine}
              </Text>
            </ImageBackground>
            <TouchableOpacity
              style={{
                padding: '5%',
                backgroundColor: '#FF2070',
                borderRadius: 8,
                display: Evolution ? 'flex' : 'none',
                marginTop: '10%',
                marginBottom: '11%',
                width: '30%',
                alignItems: 'center',
              }}
              onPress={() =>
                navigation.navigate('EvolveInProgress', {
                  petName: petName,
                  petSeq: petSeq,
                  petSignatureCode: petSignatureCode,
                  petId: petId,
                  petGrade: petGrade,
                  petMaxExperiencePoint: petMaxExperiencePoint,
                })
              }>
              <Text style={{color: 'white'}}>
                {petGrade === 'ADULT' ? '졸업하기' : '진화하기'}
              </Text>
            </TouchableOpacity>

            {Platform.OS === 'ios' ? (
              <Pressable
                style={{position: 'absolute', top: '75%'}}
                onPress={() => toggleComment()}>
                <Image
                  style={{
                    height: petIconSize,
                    width: petIconSize,
                  }}
                  source={{uri: petGif}}></Image>
              </Pressable>
            ) : (
              <Pressable
                style={{position: 'absolute', top: '75%'}}
                onPress={() => toggleComment()}>
                <FastImage
                  style={{
                    height: petIconSize,
                    width: petIconSize,
                  }}
                  source={{uri: petGif}}
                />
              </Pressable>
            )}
          </View>
        </View>
      </ImageBackground>
      <View
        style={{
          backgroundColor: 'white',
          width: '100%',
          height: '50%',
          borderTopRightRadius: 16,
          borderTopLeftRadius: 16,
          position: 'absolute',
          top: '50%',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 6,
          elevation: 5,
          padding: '6%',
        }}>
        <View style={[styles.rowView, {marginBottom: '4%'}]}>
          <Image
            style={{height: checkIcon, width: checkIcon}}
            source={require('../../../assets/checkBox.png')}></Image>
          <Text style={styles.TodoTiiletext}>오늘의 할 일은?</Text>
        </View>

        <ScrollView>
          {/* 여기서 투두 조작해주기 */}
          <TodoFrameSummary
            TodoQuery={showDailyTodoQuery}
            expImageToast={expImageToast}
          />
        </ScrollView>
      </View>
      <TouchableOpacity
        style={styles.boardwrite}
        onPress={() => {
          setIsTodoModalVisable(true);
          setStartDate(formattedToday);
        }}>
        <Image
          source={require('../../../assets/add.png')}
          style={styles.imageSize}></Image>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 25,
    fontWeight: '500',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%', // Set width to 100% to cover the entire screen
    height: '52%', // Set height to 100% to cover the entire screen
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  TodoTiiletext: {
    fontSize: 18,
    fontWeight: '700',
    color: 'black',
    marginLeft: 6,
  },
  boardwrite: {
    backgroundColor: '#1DC2FF',
    borderRadius: 16,
    alignItems: 'center',
    width: 56,
    height: 56,
    justifyContent: 'center',

    position: 'absolute', // 절대 위치 설정
    bottom: 16, // 하단 여백 조절
    right: 16, // 우측 여백 조절
  },

  imageSize: {width: 24, height: 24},
});

export default MainHomePage;
