import React, {useState} from 'react';
import {
  Platform,
  Pressable,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Image,
  View,
  Text,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import PetEvolveInSelect from '../../modal/MainHome/PetEvolveInSelect';
import {useQuery} from 'react-query';

import {
  AdoptedPet,
  callGetMainPet,
  callGetavailableStartPet,
} from '../../service/PetService';

import TutorialModal from '../../modal/MainHome/TutorialModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width} = Dimensions.get('window');
const petIconSize = width * 0.6;
const speechBubbleSize = width * 0.7;
const petGif =
  'https://todomypet.s3.ap-northeast-2.amazonaws.com/egg-backet.gif';

const SelectEggPage = ({navigation}) => {
  const [isEvolveInModlal, setEvolveInModal] = useState(false);
  const [isTutorialChecked, setIsTutorialChecked] = useState(false);
  const {
    data: userMainPetData,
    isMainPetLoading,
    isMainPetError,
  } = useQuery('getMainPetKey', callGetMainPet);
  const {data: useGetavailable} = useQuery(
    'getGetavailablStartPetKey',
    callGetavailableStartPet,
  );

  const checkTutorial = async () => {
    const tutorialCheck = await AsyncStorage.getItem('TutorialCheck');
    try {
      //펫을 졸업 시킨경우
      AdoptedPet().then(res => {
        if (tutorialCheck === 'check' || res.petList.length) {
          setIsTutorialChecked(false);
        } else {
          setIsTutorialChecked(true);
        }
      });
    } catch (error) {
      // 에러가 발생한 경우 튜토리얼을 보여주도록 설정
      setIsTutorialChecked(true);
    }
  };
  checkTutorial();

  return (
    <ImageBackground
      style={styles.backgroundImage}
      source={require('../../../assets/SelectEggBackground.png')}>
      <TutorialModal
        visible={isTutorialChecked}
        closeModal={() => setIsTutorialChecked(false)}
      />
      <PetEvolveInSelect
        visable={isEvolveInModlal}
        closeModal={() => setEvolveInModal(false)}
        petdata={useGetavailable}
        initialized={true}
      />
      
      <View style={{paddingHorizontal: '20%', paddingTop: '50%'}}>
        <ImageBackground
          style={{
            height: speechBubbleSize / 2.5,
            width: speechBubbleSize,
            padding: '5%',
            alignItems: 'center',
            marginLeft: '-7%',
          }}
          source={require('../../../assets/speechBubble.png')}>
          <Text
            style={[
              {
                fontSize: 15,
                fontFamily: 'DungGeunMo',
                color: 'black',
              },
            ]}>
            {'\n'}
            알을 터치해주세요
          </Text>
        </ImageBackground>
        {Platform.OS === 'ios' ? (
          <Pressable onPress={() => setEvolveInModal(true)}>
            <Image
              style={{
                height: petIconSize,
                width: petIconSize,
              }}
              source={{uri: petGif}}></Image>
          </Pressable>
        ) : (
          <Pressable onPress={() => setEvolveInModal(true)}>
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
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  backgroundImage: {flex: 10, resizeMode: 'cover'},
  text: {
    fontSize: 24,
    color: 'black',
    textAlign: 'center',
    fontFamily: 'DungGeunMo',
  },
});

export default SelectEggPage;
