import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Dimensions,
  Platform,
  Pressable,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import {mainPageShow} from '../../service/MainService';
import {useQuery} from 'react-query';

import {useNavigation} from '@react-navigation/native';

import {PetResign} from '../PetLine';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import SubmitButton from '../../component/SubmitButton';

const Secession = () => {
  const navigation = useNavigation();
  const [randomProteinLine, setRandomProteinLine] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery('MainPageShowQueryKey', mainPageShow);

  useEffect(() => {
    setRandomProteinLine(PetResign(petPersonality));
  }, [userData]);

  if (isLoading) {
    return <Text>MainPageShowQueryKey Loading...</Text>;
    // 로딩 중일 때 표시할 UI
  }

  if (isError) {
    return <Text>MainPageShowQueryKey Error fetching</Text>; // 에러 발생 시 표시할 UI
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

    petId,
  } = userData;

  console.log(petSeq);

  const {width} = Dimensions.get('window');
  const petIconSize = width * 0.28;

  const speechBubbleSize = width * 0.7;

  const checkIcon = width * 0.07;

  const Evolution = petExperiencePoint >= petMaxExperiencePoint;

  return (
    <>
      <ImageBackground
        style={styles.backgroundImage} // Apply the style directly here
        source={{uri: backgroundImage}} // Use source instead of src
      >
        <View style={{padding: '5%'}}>
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
                marginTop: '5%',
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

            {Platform.OS === 'ios' ? (
              <View style={{position: 'absolute', top: '75%'}}>
                <Image
                  style={{
                    height: petIconSize,
                    width: petIconSize,
                  }}
                  source={{uri: petGif}}></Image>
              </View>
            ) : (
              <View style={{position: 'absolute', top: '75%'}}>
                <FastImage
                  style={{
                    height: petIconSize,
                    width: petIconSize,
                  }}
                  source={{uri: petGif}}
                />
              </View>
            )}
          </View>
        </View>
      </ImageBackground>
      <View
        style={{
          backgroundColor: 'white',
          width: '100%',
          height: '100%',
          borderTopRightRadius: 16,
          borderTopLeftRadius: 16,
          position: 'absolute',
          top: '35%',
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
          <Text style={styles.TodoTiiletext}>탈퇴 전, 확인해주세요!</Text>
        </View>
        <Text style={styles.TodoContenttext}>
          - 탈퇴 후 재가입은 다음 달 1일부터 가능합니다.
        </Text>
        <Text style={styles.TodoContenttext}>
          - 탈퇴 후에도 작성한 글과 댓글은 삭제되지 않으니,{'\n'} 원치않는
          데이터는 삭제 후 탈퇴를 진행해주세요.
        </Text>
        <Text style={styles.TodoContenttext}>
          - 할 일(투두리스트)의 경우 모두 폐기되며, 복구는 불가합니다.
        </Text>
        <View style={{justifyContent: 'flex-end', flex: 0.5}}>
          <View style={[styles.rowView, {marginBottom: '3%'}]}>
            <BouncyCheckbox
              style={styles.checkbox}
              unfillColor="#FAFAFA"
              fillColor="#1DC2FF"
              onPress={isChecked => {
                setIsChecked(isChecked);
              }}
              color={isChecked ? 'black' : undefined}
            />
            <Text style={[styles.TodoContenttext]}>
              유의사항을 모두 확인하였으며, 상기 내용에 {'\n'}동의합니다.
            </Text>
          </View>
          <SubmitButton
            state={isChecked}
            comment={'다음'}
            onPress={() => navigation.navigate('SecessionPassword')}
          />
        </View>
      </View>
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
    height: '36%', // Set height to 100% to cover the entire screen
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
  TodoContenttext: {
    fontSize: 15,
    fontWeight: '400',
    color: 'black',
    marginLeft: 6,
    marginTop: 10,
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

export default Secession;
