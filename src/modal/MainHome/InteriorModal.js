import React, {useEffect, useState} from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  Pressable,
  ScrollView,

} from 'react-native';
import {useQuery, useQueryClient} from 'react-query';

import SubmitButton from '../../component/SubmitButton';
import {backgroundList} from '../../service/PetService';
import {renderBackList} from '../../screens/feed/petadd/InteriorPetRomm';
import {backgroundChange} from '../../service/MainService';

const {width, height} = Dimensions.get('window');

const closeIconSize = width * 0.07;

export function InteriorModal({visable, closeModal, backgroundId}) {
  const [selectedBackId, setSelectedBacktId] = useState(null);
  const queryClient = useQueryClient();
  useEffect(() => {
    setSelectedBacktId(backgroundId);
  }, [userData]);
  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery(['backgroundQueryKey'], backgroundList);
  if (isLoading) {
    return <Text>Loading...</Text>; // 로딩 중일 때 표시할 UI
  }

  if (isError) {
    return <Text>Error fetching data</Text>; // 에러 발생 시 표시할 UI
  }

  async function petRoomChange() {
    try {
      await backgroundChange(selectedBackId);
      // MainPageShowQueryKey에 대한 새로고침
      queryClient.refetchQueries('MainPageShowQueryKey');
      closeModal();
    } catch (error) {
      // 오류 처리 코드를 추가하거나 필요에 따라 적절하게 다루세요.
      console.error('petRoomChange error:', error);
    }
  }

 

  return (
    <Modal
      // animationType="slide" 할까말까 고민중
      transparent={true}
      visible={visable}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={[styles.rowView, {marginBottom: '6%'}]}>
            <Pressable
              onPress={() => {
                closeModal(), setSelectedBacktId(backgroundId);
              }}>
              <Image
                style={{height: closeIconSize, width: closeIconSize}}
                source={require('../../../assets/close.png')}
              />
            </Pressable>

            <Text style={styles.titleStyle}>인테리어 설정</Text>
          </View>
          <ScrollView>
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
              {userData.map(({id, backgroundImageUrl}) => (
                <View key={id} style={{width: '50%', marginBottom: '6%'}}>
                  {renderBackList(
                    id,
                    backgroundImageUrl,
                    selectedBackId,
                    setSelectedBacktId,
                    null,
                    'mianhome',
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
          <SubmitButton
            state={selectedBackId}
            comment={'선택'}
            onPress={petRoomChange}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',

    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',

    padding: '5%',
    width: '100%',
    height: '50%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  titleStyle: {
    flex: 0.9,
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 19,
    color: 'black',
  },
  rowView: {
    flexDirection: 'row',

    alignItems: 'center',
  },
});
