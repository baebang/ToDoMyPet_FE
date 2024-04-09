import {React} from 'react';

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
  ImageBackground,
} from 'react-native';
import * as Progress from 'react-native-progress';
import {useNavigation} from '@react-navigation/native';

import {AdoptedList} from '../../../service/MyPageService';
import {useQuery} from 'react-query';
import eggGrowth from '../../../component/eggGrowth';

const screenWidth = Dimensions.get('window').width;
const iconSize = screenWidth * 0.17;
const progressBarWidth = screenWidth * 0.5;
const eggIconSize = screenWidth * 0.05;

function Journal() {
  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery(['AdoptedPetListQueryKey'], AdoptedList);

  if (isLoading) {
    return <Text>Loading...</Text>; // 로딩 중일 때 표시할 UI
  }

  if (isError) {
    return <Text>Error fetching data</Text>; // 에러 발생 시 표시할 UI
  }

  const {petList} = userData;

  return (
    <View style={{flex: 1}}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        {petList.map((pet, index) => {
          if (pet.grade === 'ADULT' && pet.graduated) {
            return <Graduate key={index} pet={pet} />;
          } else {
            return <Attending key={index} pet={pet} />;
          }
        })}

        <View style={{marginBottom: '100%'}}></View>
      </ScrollView>
      <View
        style={{flex: 0.2, backgroundColor: 'rgba(255, 255, 255, 0)'}}></View>
    </View>
  );
}

function Attending(petInfo) {
  const {
    name,
    imageUrl,
    grade,
    experiencePoint,
    maxExperiencePoint,
    signatureCode,
  } = petInfo.pet;

  const progress = experiencePoint / maxExperiencePoint;
  const navigation = useNavigation();
  const eggImage = eggGrowth(grade);
  const progressMax = maxExperiencePoint >= experiencePoint;
  return (
    <Pressable
      style={[styles.petcontainer, {borderColor: '#1DC2FF'}]}
      onPress={() =>
        navigation.navigate('PetInfo', {signatureCode: signatureCode})
      }>
      <Image
        style={[styles.petIcon, {width: iconSize, height: iconSize}]}
        source={{uri: imageUrl}}
      />

      <View>
        <View style={{flex: 1, flexDirection: 'row', marginBottom: 8}}>
          <Image
            style={[
              styles.eggPetIcon,
              {width: eggIconSize, height: eggIconSize, marginRight: '4%'},
            ]}
            source={{uri: eggImage}}></Image>
          <Text style={[styles.nametext, {fontSize: 18}]}>{name}</Text>
          <Text style={[styles.nametext, {fontSize: 14, marginLeft: 'auto'}]}>
            {progressMax
              ? `${experiencePoint} / ${maxExperiencePoint}`
              : `${maxExperiencePoint} / ${maxExperiencePoint}`}
          </Text>
        </View>

        <View style={{flex: 1}}>
          {experiencePoint <= maxExperiencePoint ? (
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
              source={require('../../../../assets/gaugeMax.png')}
              style={{
                height: 21,
                overflow: 'hidden',
                borderRadius: 99,
                borderWidth: 2,
                width: progressBarWidth,
              }}
            />
          )}

          <Text
            style={[
              styles.nametext,
              {fontSize: 14, color: '#1DC2FF', marginTop: '5%'},
            ]}>
            키우는 중...
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function Graduate(petInfo) {
  const {name, imageUrl, signatureCode} = petInfo.pet;
  const navigation = useNavigation();
  return (
    <Pressable
      style={[styles.petcontainer, {borderColor: '#D0D1D3'}]}
      onPress={() =>
        navigation.navigate('PetInfo', {signatureCode: signatureCode})
      }>
      <Image
        style={[styles.petIcon, {width: iconSize, height: iconSize}]}
        source={{uri: imageUrl}}></Image>

      <View>
        <View style={{flexDirection: 'row', marginBottom: '5%'}}>
          <Image
            style={[
              styles.eggPetIcon,
              {width: eggIconSize, height: eggIconSize},
            ]}
            source={require('../../../../assets/egg_pixel_icon_final.png')}></Image>
          <Text style={[styles.nametext, {fontSize: 18, marginLeft: '3%'}]}>
            {name}
          </Text>
        </View>
        <View style={{width: progressBarWidth}}></View>

        <View style={{flex: 1}}>
          <Text style={[styles.nametext, {fontSize: 14, color: '#1DC2FF'}]}>
            졸업했습니다!
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1, // 내용을 스크롤 가능하게 만듭니다.
  },
  petcontainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,

    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    flexDirection: 'row',
    marginBottom: '3%',
  },
  petIcon: {
    width: 64, // 원하는 크기로 조정하세요.
    height: 64,
    marginRight: '10%',
  },
  eggPetIcon: {
    width: 16, // Set the width to the desired size (one pixel less)
    height: 16,
  },
  nametext: {fontFamily: 'DungGeunMo'},
  pixelatedView: {
    width: 100,
    height: 100,
    borderWidth: 1, // 1픽셀 라인
    borderColor: 'black', // 선의 색상
    borderRadius: 0,
  },
});

export default Journal;
