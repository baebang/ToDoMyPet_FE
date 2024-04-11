import {useCallback, React, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ImageBackground,
} from 'react-native';
import * as Progress from 'react-native-progress';
import {UserFeedPetInfo} from '../store/Item';
import eggGrowth from './eggGrowth';

export function PetInformation({petInfo}) {
  const screenWidth = Dimensions.get('window').width;
  const iconSize = screenWidth * 0.17;
  const progressBarWidth = screenWidth * 0.5;
  const eggIconSize = screenWidth * 0.05;

  const {experience, grade, graduated, imageUrl, maxExperience, name} = petInfo;
  const progress = experience / maxExperience;
  const raising = maxExperience - experience; // 키우는중인지 체크
  const progressMax = maxExperience >= experience;

  const eggImage = eggGrowth(grade);

  return (
    <View
      style={styles.container}
      contentContainerStyle={styles.contentContainer}>
      <View
        style={[
          styles.petcontainer,
          {borderColor: raising || graduated ? '#1DC2FF' : '#F0F0F0'},
        ]}>
        <Image
          style={[styles.petIcon, {width: iconSize, height: iconSize}]}
          source={{uri: imageUrl}}
        />
        <View>
          <View style={{flexDirection: 'row', marginBottom: 8}}>
            <Image
              style={[
                styles.eggPetIcon,
                {width: eggIconSize, height: eggIconSize, marginRight: '3%'},
              ]}
              source={{uri: eggImage}}
            />
            <Text style={[styles.nametext, {fontSize: 18}]}>{name}</Text>
            <Text style={[styles.nametext, {fontSize: 14, marginLeft: 'auto'}]}>
              {progressMax
                ? `${experience} / ${maxExperience}`
                : `${maxExperience} / ${maxExperience}`}
            </Text>
          </View>
          <View>
            {experience < maxExperience  ? (
              <>
                <Progress.Bar
                  progress={progress}
                  height={16}
                  borderColor="#000"
                  borderWidth={2}
                  color="#FF2070"
                  width={progressBarWidth}
                  borderRadius={99}
                />
                <Text
                  style={[
                    styles.nametext,
                    {fontSize: 14, color: '#1DC2FF', marginTop: '5%'},
                  ]}>
                  키우는 중...
                </Text>
              </>
            ) : (
              <>
                <ImageBackground
                  source={require('../../assets/gaugeMax.png')}
                  style={{
                    height: 20,
                    overflow: 'hidden',
                    borderRadius: 99,
                    borderWidth: 2,
                    width: 200,
                    marginTop: '4%',
                  }}
                />
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

export function NonPetInformation() {
  const screenWidth = Dimensions.get('window').width;
  const iconSize = screenWidth * 0.17;

  return (
    <View
      style={styles.container}
      contentContainerStyle={styles.contentContainer}>
      <View style={[styles.nonpetcontainer]}>
        <Image
          style={[styles.petIcon, {width: iconSize, height: iconSize}]}
          source={require('../../assets/nonPetImage.png')}
        />
        <View style={{alignItems: 'center', paddingTop: '8%'}}>
          <Text style={[styles.nametext, {fontSize: 18, color: '#7E7E7E'}]}>
            진화가 필요해요
          </Text>
        </View>
      </View>
    </View>
  );
}

export function PetBoardImage({
  backgroundImageUrl,
  petImageUrl,
  petGrade,
  petName,
}) {
  const screenWidth = Dimensions.get('window').width;
  const iconSize = screenWidth * 0.22;
  const eggIconSize = screenWidth * 0.04;

  const eggImage = eggGrowth(petGrade);

  return (
    <View style={{overflow: 'hidden', borderRadius: 16}}>
      <ImageBackground
        style={{padding: '5%', borderRadius: 16}}
        source={{uri: backgroundImageUrl}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            style={{width: eggIconSize, height: eggIconSize, marginRight: '2%'}}
            source={{uri: eggImage}}
          />
          <Text style={styles.nametext}>{petName}</Text>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '5%',
          }}>
          <Image
            style={[styles.petIcon, {width: iconSize, height: iconSize}]}
            source={{uri: petImageUrl}}
          />
        </View>
      </ImageBackground>
    </View>
  );
}

export function PetFeedImage({petImage, backgroundImage}) {
  const screenWidth = Dimensions.get('window').width;
  const iconSize = screenWidth * 0.22;

  const {FeedPet, FeedPetInterior} = UserFeedPetInfo();

  return (
    <View style={{overflow: 'hidden', borderRadius: 16}}>
      <ImageBackground
        style={{paddingTop: '5%', borderRadius: 16}}
        source={{uri: FeedPetInterior.interiorURL}}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '5%',
          }}>
          {FeedPet ? (
            <Image
              style={[
                styles.petIcon,
                {width: iconSize, height: iconSize, margin: '4%'},
              ]}
              source={{uri: FeedPet.petURL}}
            />
          ) : (
            // Provide a default image source or handle the empty case
            <Text>No pet image available</Text>
          )}
        </View>
      </ImageBackground>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
  },
  contentContainer: {
    flexGrow: 1,
  },
  petcontainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    flexDirection: 'row',
    marginBottom: '6%',
  },
  nonpetcontainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    flexDirection: 'row',
    marginBottom: '6%',
  },
  petIcon: {
    width: 64,
    height: 64,
    marginRight: '10%',
  },
  eggPetIcon: {
    width: 16,
    height: 16,
  },
  nametext: {fontFamily: 'DungGeunMo'},
});
