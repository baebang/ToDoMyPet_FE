import React, {useEffect} from 'react';
import {Dimensions, Image, BackHandler} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';

import {createStackNavigator} from '@react-navigation/stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {
  SettingHeaderButton,
  SettingBackButton,
  FeedBackButton,
  FeedHaderButton,
} from './src/component/HeaderButton';

import BottomTabNavigationApp from './BottomTabNavigationApp';

import Home from './src/screens/Home';
import Login from './src/screens/Login';

import SelectEggPage from './src/screens/main/SelectEggPage';

import EvolveInProgress from './src/screens/ evolution/EvolveInProgress';

import SignUp from './src/screens/signup/SignUp';
import AuthForm from './src/screens/signup/AuthForm';
import Terms from './src/screens/signup/Terms';
import PassWord from './src/screens/signup/PassWord';
import Profile from './src/screens/signup/Profile';
import FinalSingUp from './src/screens/signup/FinalSingUp';

import MySetting from './src/screens/mypage/MySetting';
import PetInfo from './src/screens/mypage/mypagenavi/PetInfo';
import Friends from './src/screens/mypage/Friends';
import BlockFriend from './src/screens/mypage/BlockFriend';
import MyFriendPage from './src/screens/mypage/MyFriendPage';

import FeedBoard from './src/screens/feed/FeedBoard';
import {FeedWrite, FeedReWrite} from './src/screens/feed/FeedWrite';
import AddFriend from './src/screens/feed/AddFriend';
import AlarmFeed from './src/screens/feed/AlarmFeed';
import FeedDetail from './src/screens/feed/FeedDetail';
import FeedPetAdd from './src/screens/feed/petadd/FeedPetAddBoard';
import FeedImage from './src/screens/feed/FeedImage';
import LikeList from './src/screens/feed/LikeList';

import AddTodoDetail from './src/screens/todolist/AddTodoDetail';
import ModifyTodoDetail from './src/screens/todolist/ModifyTodoDetail';
import EvolutionFinal from './src/screens/ evolution/EvolutionFinal';
import InitMainHomePage from './src/screens/main/InitMainHomePage';

import LossPassword from './src/screens/signup/LossPassword';
import Secession from './src/screens/mypage/Secession';
import SecessionPassword from './src/screens/mypage/SecessionPassword';

const {width} = Dimensions.get('window');

export default function NavigationContainerComponent() {
  // const Stack = createNativeStackNavigator();
  const Stack = createStackNavigator();
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      // 백 버튼 누름을 처리하는 사용자 정의 로직
      // 기본 동작(예: 앱 종료)을 방지하려면 true를 반환
      // 기본 동작을 허용하려면 false를 반환
      return true;
    });
    return () => {
      // 이벤트 리스너 제거됨
      BackHandler.removeEventListener('hardwareBackPress', () => true);
    };
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer
        theme={{
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            background: 'white',
          },
        }}
        independent={true}>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={Home}
            gestureEnabled={false}
            options={{headerShown: false, gestureEnabled: false}}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={headerOptions('로그인')}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={headerOptions('회원가입')}
          />
          <Stack.Screen
            name="AuthForm"
            component={AuthForm}
            options={headerOptions('인증하기')}
          />
          <Stack.Screen
            name="PassWordAuthForm"
            component={AuthForm}
            options={headerOptions('내 계정 찾기')}
          />

          <Stack.Screen
            name="Terms"
            component={Terms}
            options={headerOptions('약관')}
          />

          <Stack.Screen
            name="PassWord"
            component={PassWord}
            options={headerOptions('회원가입')}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={headerOptions('프로필 설정')}
          />

          <Stack.Screen
            name="FinalSingUp"
            component={FinalSingUp}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="BottomNavigation"
            component={BottomTabNavigationApp}
            options={{headerShown: false, gestureEnabled: false}}
          />
          <Stack.Screen
            name="PetInfo"
            component={PetInfo}
            options={headerOptions('내 펫 정보')}
          />
          <Stack.Screen
            name="MySetting"
            component={MySetting}
            options={headerButtonOptions('설정', 'setting')}
          />
          <Stack.Screen
            name="Friends"
            component={Friends}
            options={headerOptions('친구')}
          />
          <Stack.Screen
            name="BlockFriend"
            component={BlockFriend}
            options={headerOptions('차단된 친구')}
          />

          <Stack.Screen
            name="FeedBoard"
            component={FeedBoard}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="EvolveInProgress"
            component={EvolveInProgress}
            gestureEnabled={false}
            options={{headerShown: false, gestureEnabled: false}}
          />
          <Stack.Screen
            name="FeedWrite"
            component={FeedWrite}
            options={headerButtonOptions('글쓰기', 'feed')}
          />
          <Stack.Screen
            name="FeedReWrite"
            component={FeedReWrite}
            options={headerButtonOptions('수정하기', 'feed')}
          />
          <Stack.Screen
            name="AddFriend"
            component={AddFriend}
            options={headerOptions('친구추가')}
          />
          <Stack.Screen
            name="AlarmFeed"
            component={AlarmFeed}
            options={headerOptions('알림')}
          />
          <Stack.Screen
            name="FeedDetail"
            component={FeedDetail}
            options={headerOptions('게시글 상세 보기')}
          />

          <Stack.Screen
            name="FeedPetAdd"
            component={FeedPetAdd}
            options={headerOptions('펫 추가하기', 'feed')}
          />
          <Stack.Screen
            name="FeedImage"
            component={FeedImage}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="AddTodoDetail"
            component={AddTodoDetail}
            options={headerOptions('할일 추가하기')}
          />

          <Stack.Screen
            name="ModifyTodoDetail"
            component={ModifyTodoDetail}
            options={headerOptions('할일 수정하기')}
          />

          <Stack.Screen
            name="EvolutionFinal"
            component={EvolutionFinal}
            options={{headerShown: false, gestureEnabled: false}}
          />

          <Stack.Screen
            name="InitMainHomePage"
            component={InitMainHomePage}
            options={{headerShown: false, gestureEnabled: false}}
          />

          <Stack.Screen
            name="MyFriendPage"
            component={MyFriendPage}
            options={headerOptions('친구 프로필')}
          />

          <Stack.Screen
            name="LossPassword"
            component={LossPassword}
            options={headerOptions('내 계정 찾기')}
          />
          <Stack.Screen
            name="PassWordComplete"
            component={PassWord}
            options={headerOptions('내 계정 찾기')}
          />

          <Stack.Screen
            name="Secession"
            component={Secession}
            options={headerOptions('탈퇴하기')}
          />

          <Stack.Screen
            name="SecessionPassword"
            component={SecessionPassword}
            options={headerOptions('탈퇴하기')}
          />

          <Stack.Screen
            name="LikeList"
            component={LikeList}
            options={headerOptions('좋아요')}
          />

          <Stack.Screen
            name="SelectEggPage"
            component={SelectEggPage}
            options={{headerShown: false, gestureEnabled: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
    // 페이지 모션으로 넘기는거 QA단에서 뺄지 말지 결정하기
  );
}

const headerOptions = title => ({
  title,
  headerStyle: {
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 2,
    shadowOpacity: 1,
  },
  headerTitleStyle: {
    fontWeight: '700',
    fontSize: 17,
  },
  headerBackTitleVisible: false,
  headerBackImage: () => (
    <Image
      source={require('./assets/arrow_back.png')} // Replace with your arrow icon path
      style={{marginLeft: 20.43, height: width * 0.07, width: width * 0.07}}
    />
  ),
});

const headerButtonOptions = (title, type) => {
  let leftButtonComponent;
  let RightButtonComponent;

  // Conditionally set the left button based on the type
  if (type === 'setting') {
    leftButtonComponent = <SettingBackButton />;
    RightButtonComponent = <SettingHeaderButton />;
  } else if (type === 'feed') {
    leftButtonComponent = <FeedBackButton />;
    RightButtonComponent = <FeedHaderButton />;
  }

  return {
    title,
    headerStyle: {
      backgroundColor: '#FFFFFF',
      shadowColor: 'rgba(0, 0, 0, 0.08)',
      shadowOffset: {width: 0, height: 2},
      shadowRadius: 2,
      shadowOpacity: 1,
    },
    headerTitleStyle: {
      fontWeight: '700',
      fontSize: 17,
    },
    headerBackTitleVisible: false,
    headerLeft: () => leftButtonComponent,
    headerRight: () => RightButtonComponent,
  };
};
