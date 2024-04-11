import React, {useState, useEffect} from 'react';
import {Text} from 'react-native';

import {useQuery} from 'react-query';

import MainHomePage from './MainHomePage';

import {callGetMainPet} from '../../service/PetService';
import {useNavigation} from '@react-navigation/native';

const InitMainHomePage = () => {
  const navigation = useNavigation();
  const {
    data: userMainPetData,
    isMainPetLoading,
    isMainPetError,
  } = useQuery('getMainPetKey', callGetMainPet);

  useEffect(() => {
    if (userMainPetData != null) {
      // 메인펫이 있으면 MainHomePage로 이동
      navigation.navigate('BottomNavigation');
    } else {
      // 메인펫이 없으면 SelectEggPage로 이동
      navigation.navigate('SelectEggPage');
    }
  }, [userMainPetData, navigation]);

  if (isMainPetLoading) {
    return <Text>MainPageShowQueryKey Loading...</Text>;
  }

  if (isMainPetError) {
    return <Text>MainPageShowQueryKey Error fetching</Text>;
  }

  // 이 부분은 실제로 실행되지 않습니다.
  return <></>;
};

export default InitMainHomePage;
