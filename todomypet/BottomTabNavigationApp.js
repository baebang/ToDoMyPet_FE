import React, {useRef, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  StatusBar,
  Image,
  View,
  Dimensions,
  Pressable,
  Text,
} from 'react-native';
import Toast from 'react-native-easy-toast';

import Mypage from './src/screens/mypage/Mypage';
import FeedBoard from './src/screens/feed/FeedBoard';
import TodoListHome from './src/screens/todolist/TodoListHome';
import InitMainHomePage from './src/screens/main/InitMainHomePage';

import {useQuery} from 'react-query';
import {callGetMainPet} from './src/service/PetService';

import MainHomePage from './src/screens/main/MainHomePage';
import TodoDetailModel from './src/modal/TodoModal/TodoDetailModel';
import {TodoDetail} from './src/store/Item';

const Tab = createBottomTabNavigator();

function BottomTabNavigationApp() {
  const pet_icon = require('./assets/myPetIcon.png');
  const non_pet_icon = require('./assets/nonMyPetIcon.png');
  const my_icon = require('./assets/myPageIcon.png');
  const non_my_icon = require('./assets/nonMyPageIcon.png');
  const feed_icon = require('./assets/feedIcon.png');
  const non_feed_icon = require('./assets/nonFeedIcon.png');
  const todo_icon = require('./assets/toDoIcon.png');
  const non_todo_icon = require('./assets/nonToDoIcon.png');

  const toastRef = useRef(); // toast ref 생성
  const {setTodoId, TodoId} = TodoDetail();

  const {
    data: userMainPetData,
    isMainPetLoading,
    isMainPetError,
  } = useQuery('getMainPetKey', callGetMainPet);
  if (isMainPetLoading) {
    return <Text>MainPageShowQueryKey Loading...</Text>;
    // 로딩 중일 때 표시할 UI
  }

  if (isMainPetError) {
    return <Text>MainPageShowQueryKey Error fetching</Text>; // 에러 발생 시 표시할 UI
  }

  const {width, height} = Dimensions.get('window');

  return (
    <>
      <TodoDetailModel visible={TodoId} closeModal={() => setTodoId('')} />

      <Toast
        ref={toastRef}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          position: 'absolute',
          right: width / 3,
        }}
        textStyle={{
          fontSize: 14,
          color: 'white',
          textAlign: 'center',
        }}
        positionValue={height * 0.5}
        fadeInDuration={200}
        fadeOutDuration={1000}
      />
      <Tab.Navigator
        initialRouteName="마이 펫"
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, size}) => {
            let iconSource;
            let disabled = false; // 버튼 비활성화 여부

            // userMainPetData가 null이면 disabled를 true로 설정
            if (!userMainPetData) {
              disabled = true;
            }

            switch (route.name) {
              case '마이 펫':
                iconSource = focused ? pet_icon : non_pet_icon;

                break;
              case '투두리스트':
                iconSource = focused ? todo_icon : non_todo_icon;

                break;
              case '피드':
                iconSource = focused ? feed_icon : non_feed_icon;

                break;
              case '마이페이지':
                iconSource = focused ? my_icon : non_my_icon;

                break;

              default:
                break;
            }

            // Render the icon
            return (
              <Image source={iconSource} style={{width: size, height: size}} />
            );
          },
          tabBarActiveTintColor: '#1DC2FF',
        })}>
        <Tab.Screen
          name="마이 펫"
          component={InitMainHome}
          gestureEnabled={false}
          options={{headerShown: false, gestureEnabled: false}}
        />

        <Tab.Screen
          name="투두리스트"
          component={TodoList}
          options={{headerShown: false}}
        />
        <Tab.Screen
          name="피드"
          component={Feed}
          options={{headerShown: false}}
        />
        <Tab.Screen
          name="마이페이지"
          component={MypageBoard}
          options={{headerShown: false}}
        />
      </Tab.Navigator>
      {userMainPetData === null ? (
        <Pressable
          style={{
            height: height,
            position: 'absolute',
            width: width,
            top: height * 0.8,
            zIndex: 20,
          }}
          onPress={() => toastRef.current.show('알을 터치해주세요')}
        />
      ) : null}
    </>
  );
}

function TodoList() {
  return <TodoListHome />;
}

function Feed() {
  return <FeedBoard />;
}

function MypageBoard() {
  return <Mypage />;
}

function InitMainHome() {
  return <MainHomePage />;
}

export default BottomTabNavigationApp;
