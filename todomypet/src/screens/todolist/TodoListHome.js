import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Pressable,
} from 'react-native';
import {useQuery} from 'react-query';
import * as Progress from 'react-native-progress';

import DailyView from './DailyView';
import CalendarView from './CalendarView';

import AddToDoModal from '../../modal/TodoModal/AddToDoModal';
import Toast from 'react-native-easy-toast';

const {width, height} = Dimensions.get('window');
const petPortraitIconSize = width * 0.09;
const progressBarWidth = width * 0.76;
const checkIcon = width * 0.07;

const TodoListHome = () => {
  const toastRef = useRef();
  const [isDailySelected, setisDailySelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTodoModalVisable, setIsTodoModalVisable] = useState(false);
  const [isSelectedDay, setIsSelectedDay] = useState('');
  const {data} = useQuery('MainPageShowQueryKey');

  const toggleIsDailySelected = () => {
    setisDailySelected(prevState => !prevState);
  };

  function todoModalClose() {
    setIsTodoModalVisable(false);
  }

  function expImageToast(num) {
    if (num === '5') {
      toastRef.current.show(
        <View style={{marginTop: '1%'}}>
          <Image
            source={require('../../../assets/exp_5.png')}
            style={{width: checkIcon + 60, height: checkIcon + 60, zIndex: 100}} // 이미지 크기를 조정합니다.
          />
        </View>,
      );
    }
  }

  const {petExperiencePoint, petMaxExperiencePoint, petPortraitImage} = data;

  const progress = petExperiencePoint / petMaxExperiencePoint;

  return (
    <SafeAreaView style={styles.container}>
      <AddToDoModal visable={isTodoModalVisable} closeModal={todoModalClose} />

      <View
        style={{
          flexDirection: 'row',
          padding: '4%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          style={{
            height: petPortraitIconSize,
            width: petPortraitIconSize,
            marginRight: '3%',
          }}
          source={{uri: petPortraitImage}}
        />

        {petExperiencePoint < petMaxExperiencePoint ? (
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

      <ScrollView
        style={[
          styles.calendarContainer,
          {display: isDailySelected ? 'flex' : 'none'},
        ]}>
        <DailyView
          date={isSelectedDay}
          dailyShow={toggleIsDailySelected}
          selectDay={setIsSelectedDay}
          expImageToast={expImageToast}
        />
      </ScrollView>

      <ScrollView
        style={[
          styles.calendarContainer,
          {display: isDailySelected ? 'none' : 'flex'},
        ]}>
        <CalendarView
          dailyShow={toggleIsDailySelected}
          selectDay={setIsSelectedDay}
        />
      </ScrollView>

      <TouchableOpacity
        style={styles.boardwrite}
        onPress={() => setIsTodoModalVisable(true)}>
        <Image
          source={require('../../../assets/add.png')}
          style={styles.imageSize}></Image>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECFBFF',
  },
  rowcontainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 25,
    fontWeight: '500',
  },
  imageSize: {width: 24, height: 24},
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
  calendarContainer: {
    flex: 1,
    backgroundColor: 'white',
    // Set flex to 1 to make it fill the remaining space
  },
});

export default TodoListHome;
