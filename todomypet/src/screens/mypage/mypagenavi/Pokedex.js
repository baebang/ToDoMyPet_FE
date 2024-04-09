import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  ImageBackground,
  Pressable,
  Modal,
} from 'react-native';

import {ModalPokedex} from '../../../modal/MypageModal/Modals';

import {collectionList} from '../../../service/PetService';

import {useQuery} from 'react-query';

const iconSizeFactor = 3.6; // 화면 너비의 몇 배로 아이콘 크기를 설정할지 결정

const screenWidth = Dimensions.get('window').width;
const iconSize = screenWidth / iconSizeFactor;
const petSize = screenWidth * 0.17;

function Pokedex() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isPetInfo, setPetInfo] = useState('');
  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery(['collectionQueryKey'], collectionList);

  if (isLoading) {
    return (
      <Image
        style={{height: '100%', width: '100%',bottom:200}}
        source={require('../../../../assets/Logind_screen.png')}></Image>
    ); // 로딩 중일 때 표시할 UI
  }

  if (isError) {
    return <Text>Error fetching data</Text>; // 에러 발생 시 표시할 UI
  }

  const {
    BREAD,
    GHOST,
    CREAM,
    OVERCOOKED_BREAD,
    COOKIE,
    ZOMBIE,
    CURSE,
    SLASHER,
    GANG,
    CUP,
    DUST,
    MELON,
    PUDDING,
    HOT_CAKE,
    CHRISTMAS,
    FIRE,
    ICE,
    RAINBOW,
    MILLIONAIRE,
    GOLD,
    SLEEPY,
    DEVIL,
    ANGEL,
    FAIRY,
    MAGICAL_GIRL,
    CLOVER,
    CHERRY_BLOSSOM,
  } = userData.collectionList;



  function closeModalFunction() {
    setModalVisible(false);
  }
  function openModalFunction(petName, imageUrl, describe, grade, personality) {
    const petInfo = {petName, imageUrl, describe, grade, personality};
    setPetInfo(petInfo);
    setModalVisible(true);
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {renderPetType(
          '따끈따끈 베이커리',
          BREAD,
          openModalFunction,
          closeModalFunction,
        )}
        {renderPetType(
          '도전, 파티시에',
          CREAM,
          openModalFunction,
          closeModalFunction,
        )}
        {renderPetType(
          '얼렁뚱땅 베이커리',
          OVERCOOKED_BREAD,
          openModalFunction,
          closeModalFunction,
        )}
        {renderPetType(
          '마녀의 집에서 탈출한',
          COOKIE,
          openModalFunction,
          closeModalFunction,
        )}
        {renderPetType(
          '유령의 집',
          GHOST,
          openModalFunction,
          closeModalFunction,
        )}
        {renderPetType(
          '아포칼립스',
          ZOMBIE,
          openModalFunction,
          closeModalFunction,
        )}
        {renderPetType(
          '오늘의 저주',
          CURSE,
          openModalFunction,
          closeModalFunction,
        )}
        {renderPetType(
          '슬래셔 무비',
          SLASHER,
          openModalFunction,
          closeModalFunction,
        )}
        {renderPetType(
          '우리 가족',
          GANG,
          openModalFunction,
          closeModalFunction,
        )}
        {renderPetType(
          '빙글빙글 찻잔',
          CUP,
          openModalFunction,
          closeModalFunction,
        )}
        {renderPetType('언클리닝', DUST, openModalFunction, closeModalFunction)}
        {renderPetType(
          '음악이 필요할 때...',
          MELON,
          openModalFunction,
          closeModalFunction,
        )}
        {renderPetType(
          '부드럽구 달콤하구',
          PUDDING,
          openModalFunction,
          closeModalFunction,
        )}
        {renderPetType(
          '최고의 브런치',
          HOT_CAKE,
          openModalFunction,
          closeModalFunction,
        )}
        {renderPetType(
          '울면 안 돼',
          CHRISTMAS,
          openModalFunction,
          closeModalFunction,
        )}
        {renderPetType(
          '불꽃 카리스마',
          FIRE,
          openModalFunction,
          closeModalFunction,
        )}
        {renderPetType('얼음왕국', ICE, openModalFunction, closeModalFunction)}
        {renderPetType(
          '레인보우 스타',
          RAINBOW,
          openModalFunction,
          closeModalFunction,
        )}
        {renderPetType(
          '상속자들',
          MILLIONAIRE,
          openModalFunction,
          closeModalFunction,
        )}
        {renderPetType(
          '황금의 아이',
          GOLD,
          openModalFunction,
          closeModalFunction,
        )}
        {renderPetType('슬리피', SLEEPY, openModalFunction, closeModalFunction)}
        {renderPetType(
          '죄악의 맛',
          DEVIL,
          openModalFunction,
          closeModalFunction,
        )}
        {renderPetType(
          '신의 가호가 있기를',
          ANGEL,
          openModalFunction,
          closeModalFunction,
        )}
        {renderPetType(
          '신비의 존재',
          FAIRY,
          openModalFunction,
          closeModalFunction,
        )}
        {renderPetType(
          '지구를 지켜라!',
          MAGICAL_GIRL,
          openModalFunction,
          closeModalFunction,
        )}
        {renderPetType(
          '행운의 상징',
          CLOVER,
          openModalFunction,
          closeModalFunction,
        )}
        {renderPetType(
          '핑크빛 설렘',
          CHERRY_BLOSSOM,
          openModalFunction,
          closeModalFunction,
        )}

        {/* {renderPetType('펫 유형 3', CREAM, openModalFunction, closeModalFunction)} */}
        <View style={{marginBottom: '115%'}}></View>
      </ScrollView>
      <View
        style={{flex: 0.2, backgroundColor: 'rgba(255, 255, 255, 0)'}}></View>
      {isPetInfo && (
        <ModalPokedex
          display={isModalVisible}
          closemodal={closeModalFunction}
          petinfo={isPetInfo}
        />
      )}
    </View>
  );
}

function renderPetType(type, petArray, openModalFunction, closeModalFunction) {
  return (
    <React.Fragment>
      <Text style={styles.achievementTypeText}>{type}</Text>
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {petArray.map(
          ({
            id,
            collected,
            petName,
            imageUrl,
            describe,
            grade,
            personality,
          }) => (
            <View key={id} style={{width: '33%', marginBottom: '6%'}}>
              {renderAchievement(
                iconSize,
                collected,
                petName,
                imageUrl,
                closeModalFunction,
                openModalFunction,
                describe,
                grade,
                personality,
              )}
            </View>
          ),
        )}
      </View>
    </React.Fragment>
  );
}

function renderAchievement(
  iconSize,
  collected,
  petName,
  imageUrl,
  closeModalFunction,
  openModalFunction,
  describe,
  grade,
  personality,
) {
  return (
    <ImageBackground
      source={require('../../../../assets/pokedexcontainer.png')}
      style={{width: iconSize, height: iconSize}}>
      {collected ? (
        <Pressable
          onPress={() => {
            openModalFunction(petName, imageUrl, describe, grade, personality);
          }}>
          <Image
            style={[styles.petIcon, {width: petSize, height: petSize}]}
            source={{uri: imageUrl}}
          />
          <Text style={styles.petName}>{petName}</Text>
        </Pressable>
      ) : (
        <Image
          style={{width: iconSize, height: iconSize}}
          source={require('../../../../assets/nonpokedex.png')}></Image>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    paddingBottom: 24,
    flex: 1,
  },
  contentContainer: {
    paddingTop: '7%',
    paddingHorizontal: '3%',
  },
  achievementTypeText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 16,
  },
  petIcon: {
    marginTop: '10%',
    marginHorizontal: '18%',
  },
  petName: {
    fontFamily: 'DungGeunMo',
    color: 'white',
    left: 0,
    right: 0,
    textAlign: 'center',
    bottom: '-8%', // 하단에 여백 조절
  },
});

export default Pokedex;
