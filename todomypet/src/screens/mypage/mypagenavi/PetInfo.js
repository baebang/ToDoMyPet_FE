import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Modal,
  Dimensions,
  Pressable,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {
  PetInformation,
  NonPetInformation,
} from '../../../component/PetInformation';
import {AchievementsModal} from '../../../modal/MypageModal/AchievementsModal';
import {AdoptedPetInfo} from '../../../service/PetService';
import {useQuery} from 'react-query';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
export default function PetInfo() {
  const route = useRoute();
  const {signatureCode} = route.params;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSeqNumber, setSeqNumber] = useState('');

  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery('AdoptedPetInfoKey', () => AdoptedPetInfo(signatureCode));

  if (isLoading) {
    return <Text>Loading...</Text>; // 로딩 중일 때 표시할 UI
  }

  if (isError) {
    return <Text>AdoptedPetInfoKey Error fetching data</Text>; // 에러 발생 시 표시할 UI
  }
  const {petInfoList} = userData;

  function closeSet() {
    setIsModalVisible(false);
  }
  function petInfoDetail(seq) {
    console.log(seq);
    setSeqNumber(seq);
    setIsModalVisible(true);
  }

  return (
    <View
      style={{
        height: screenHeight,
        width: screenWidth,
        backgroundColor: '#F5F5F5',
        paddingTop: '10%',
      }}>
      {isSeqNumber ? (
        <AchievementsModal
          state={isModalVisible}
          closeModal={closeSet}
          seqnumber={isSeqNumber}
          signature={signatureCode}
        />
      ) : null}

      {petInfoList.map((item, index) => (
        <Pressable onPress={() => petInfoDetail(item.seq)} key={index}>
          <PetInformation petInfo={item} />
        </Pressable>
      ))}
      {[...Array(Math.max(4 - petInfoList.length, 0))].map((_, index) => (
        <NonPetInformation key={petInfoList.length + index} />
      ))}
    </View>
  );
}
