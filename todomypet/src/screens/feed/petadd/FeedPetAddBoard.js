import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import TopNavigationPet from './TopNavigationPet';
import {PetFeedImage} from '../../../component/PetInformation';

export default function FeedPetAdd() {
  const {width, height} = Dimensions.get('window');

  return (
    <View style={styles.container}>
      <View style={{paddingHorizontal: '4%'}}>
        <PetFeedImage />
      </View>

      <View style={{alignItems: 'center'}}>
        <View>
          <View style={{height: '3%', width}}></View>
          <TopNavigationPet />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: '10%',
  },
});
