import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  Image,
  View,
  Dimensions,
  ActionSheetIOS,
  StyleSheet,
} from 'react-native';

import {ProfileImageModal} from '../modal/ImageSetModal/ImageModal';

const screenWidth = Dimensions.get('window').width;
const iconSize = screenWidth * 0.12;

export function ProfilePick({profilePicUrl}) {
  const [image, setImage] = useState(profilePicUrl);
  const [modalVisible, setModalVisible] = useState(false);

  function modalClose() {
    setModalVisible(false);
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    setModalVisible(true);
  };

  return (
    <View style={{alignItems: 'center', justifyContent: 'center'}}>
      <ProfileImageModal closeModal={modalClose} state={modalVisible} userImage={setImage}/>
      {image ? (
        <Image source={{uri: image}} style={styles.profileImage} />
      ) : (
        <Image
          source={require('../../assets/profile_pic.png')}
          style={styles.profileImage}
        />
      )}
      <TouchableOpacity style={styles.changeImage} onPress={pickImage}>
        <Image source={require('../../assets/camera.png')} />
      </TouchableOpacity>
    </View>
  );
}
export function ProfileImage(profilePicUrl) {
  const ImagesProfile = profilePicUrl.profilePicUrl;
  return (
    <View>
      {ImagesProfile ? (
        <Image source={{uri: ImagesProfile}} style={styles.profileImage} />
      ) : (
        <Image
          source={require('../../assets/profile_pic.png')}
          style={styles.profileImage}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  profileImage: {
    width: iconSize,
    height: iconSize,
    borderRadius: 100,
  },
  changeImage: {
    position: 'absolute',

    height: 14,
    left: 195,
    top: 30,
  },
});
