import React, {useState, useEffect} from 'react';
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
import {communityPetList} from '../../../service/PetService';
import {useQuery} from 'react-query';

import {UserFeedPetInfo} from '../../../store/Item';

const iconSizeFactor = 3.6; // 화면 너비의 몇 배로 아이콘 크기를 설정할지 결정

const screenWidth = Dimensions.get('window').width;
const iconSize = screenWidth / iconSizeFactor;
const petSize = screenWidth * 0.17;

function PetList() {
  const [selectedPetId, setSelectedPetId] = useState(null);

  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery(['communityPetListQueryKey'], communityPetList);
  const {setFeedPet, FeedPet} = UserFeedPetInfo();

  useEffect(() => {
    if (
      userData &&
      userData.length > 0 &&
      selectedPetId === null &&
      FeedPet !== ''
    ) {
      setSelectedPetId(userData[0].id);
      setFeedPet(userData[0].petImageUrl, userData[0].id);
    }
  }, [userData, selectedPetId]);

  if (isLoading) {
    return <Text>Loading...</Text>; // 로딩 중일 때 표시할 UI
  }

  if (isError) {
    return <Text>Error fetching data</Text>; // 에러 발생 시 표시할 UI
  }

  //선택 됐을때 아이디를 보내주면 된다.
  //board

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {userData.map(({id, petImageUrl, petName}) => (
            <View key={id} style={{width: '33%', marginBottom: '6%'}}>
              {renderPetList(
                id,
                petImageUrl,
                petName,
                selectedPetId,
                setSelectedPetId,
                setFeedPet,
              )}
            </View>
          ))}
        </View>

        <View style={{marginBottom: '115%'}}></View>
      </ScrollView>
      <View
        style={{flex: 0.2, backgroundColor: 'rgba(255, 255, 255, 0)'}}></View>
    </View>
  );
}

function renderPetList(
  id,
  petImageUrl,
  petName,
  selectedPetId,
  setSelectedPetId,
  setFeedPet,
) {
  const isSelected = id === selectedPetId;

  const onPressHandler = () => {
    setSelectedPetId(isSelected ? null : id);
    setFeedPet(petImageUrl, id);
  };
  return (
    <Pressable onPress={onPressHandler}>
      <ImageBackground
        source={
          isSelected
            ? require('../../../../assets/pokedexcontainer.png')
            : require('../../../../assets/nonpokedexcontainer.png')
        }
        style={[
          {width: iconSize, height: iconSize},
          !isSelected && {tintColor: 'gray', opacity: 0.4},
        ]}>
        <View>
          <Image
            style={[styles.petIcon, {width: petSize, height: petSize}]}
            source={{uri: petImageUrl}}
          />
          <Text style={styles.petName}>{petName}</Text>
        </View>
      </ImageBackground>
    </Pressable>
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
  achievementRow: {
    flexDirection: 'row',
    marginBottom: '3%',
  },
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  nonAchievement: {
    width: iconSizeFactor + '%', // 아이콘 크기와 동일한 너비를 가짐
  },
  achievementText: {
    fontSize: 12,
    position: 'absolute',
    fontFamily: 'DungGeunMo',
    color: 'white',
    left: '29%',
    top: '83%',
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

export default PetList;
