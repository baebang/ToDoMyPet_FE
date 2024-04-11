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

import {useQueryClient} from 'react-query';

import {UserFeedPetInfo} from '../../../store/Item';

const iconSizeFactor = 3.6; // 화면 너비의 몇 배로 아이콘 크기를 설정할지 결정

const screenWidth = Dimensions.get('window').width;
const iconSize = screenWidth / iconSizeFactor;
const backgroundSize = screenWidth / 2.5;

function InteriorPetRomm() {
  const [selectedBackId, setSelectedBacktId] = useState(null);
  const queryClient = useQueryClient();
  const mySettingQuery = queryClient.getQueryData('backgroundQueryKey');

  const {setFeedPetInterior} = UserFeedPetInfo();

  useEffect(() => {
    if (
      mySettingQuery &&
      mySettingQuery.length > 0 &&
      selectedBackId === null
    ) {
      setSelectedBacktId(mySettingQuery[0].id);
      setFeedPetInterior(
        mySettingQuery[0].backgroundImageUrl,
        mySettingQuery[0].id,
      );
    }
  }, [mySettingQuery, selectedBackId]);

  //선택 됐을때 아이디를 보내주면 된다.
  //board

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {mySettingQuery.map(({id, backgroundImageUrl}) => (
            <View key={id} style={{width: '50%', marginBottom: '6%'}}>
              {renderBackList(
                id,
                backgroundImageUrl,
                selectedBackId,
                setSelectedBacktId,
                setFeedPetInterior,
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

export function renderBackList(
  id,
  backgroundImageUrl,
  selectedBackId,
  setSelectedBacktId,
  setFeedPetInterior,
  type,
) {
  const isSelected = id === selectedBackId;

  const onPressHandler = () => {
    if (type) {
      setSelectedBacktId(isSelected ? null : id);
      
    } else {
      setSelectedBacktId(isSelected ? null : id);
      setFeedPetInterior(backgroundImageUrl, id);
    }
  };
  return (
    <Pressable onPress={onPressHandler}>
      <View
        style={[
          isSelected ? styles.blueBorder : null,
          {borderRadius: 9, width: backgroundSize, height: iconSize},
        ]}>
        <ImageBackground
          source={{uri: backgroundImageUrl}}
          style={[
            {overflow: 'hidden'},
            !isSelected && {tintColor: 'gray', opacity: 0.4},
            {width: '100%', height: '100%', borderRadius: 6},
          ]}></ImageBackground>
      </View>
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
    color: 'black',
  },
  blueBorder: {
    borderWidth: 2,
    borderColor: '#1DC2FF',
  },
});

export default InteriorPetRomm;
