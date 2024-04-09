import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Pressable,
  Image,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import Swiper from 'react-native-web-swiper';
import {useNavigation} from '@react-navigation/native';

const FeedImage = () => {
  const route = useRoute();

  const navigation = useNavigation();
  const {imageItem} = route.params;
  const screenWidth = Dimensions.get('window').width;

  const closeIconSize = screenWidth * 0.08;

  const SCREEN_HEIGHT = Dimensions.get('window').height;
  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={() => navigation.goBack()}>
        <Image
          source={require('../../../assets/closeImage.png')}
          style={{height: closeIconSize, width: closeIconSize}}
        />
      </Pressable>
      <Swiper loop>
        {imageItem.map(item => (
          <Image
            key={item} // 각 이미지에 고유한 키를 제공해야 합니다.
            source={{uri: item}}
            style={{flex: 1, resizeMode: 'contain'}}
          />
        ))}
      </Swiper>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    flex: 1,
    backgroundColor: 'black',
  },
});
export default FeedImage;
