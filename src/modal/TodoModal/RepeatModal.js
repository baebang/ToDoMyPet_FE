import React, {useState} from 'react';
import {
  View,
  Modal,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
} from 'react-native';

import SubmitButton from '../../component/SubmitButton';
import RepeatDataModal from './RepeatDataModal';

const {width} = Dimensions.get('window');
const closeIconSize = width * 0.07;

export default function RepeatModal({visable, closeModal}) {

  const [selectedCycle, setSelectedCycle] = useState(null);
  const [repeatDetail, setRepeatDetail] = useState(false);

  const handleCycleSelect = cycle => {
    if (cycle == selectedCycle) {
      setSelectedCycle(null);
    } else {
      setSelectedCycle(cycle);
    }
  };

  function closeModalRepeat() {
    setRepeatDetail(false);
  }
  return (
    <View>
      <RepeatDataModal
        visible={repeatDetail}
        closeModal={closeModalRepeat}
        select={selectedCycle}
      />
      <Modal transparent={true} visible={visable}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{padding: '5%'}}>
              <View style={[styles.rowcontainer, {marginBottom: '5%'}]}>
                <Pressable
                  onPress={() => {
                    setSelectedCycle('');
                    closeModal();
                  }}>
                  <Image
                    style={{height: closeIconSize, width: closeIconSize}}
                    source={require('../../../assets/close.png')}
                  />
                </Pressable>

                <Text style={styles.titleStyle}>반복 선택</Text>
              </View>
              <Text
                style={{color: 'black', paddingTop: '4%', paddingBottom: '2%'}}>
                반복 주기를 선택해 주세요
              </Text>
              <Pressable
                style={[
                  styles.buttonStyle,
                  selectedCycle === '매일'
                    ? styles.selected
                    : styles.unselected,
                ]}
                onPress={() => handleCycleSelect('매일')}>
                <Text>매일</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.buttonStyle,
                  selectedCycle === '매주'
                    ? styles.selected
                    : styles.unselected,
                ]}
                onPress={() => handleCycleSelect('매주')}>
                <Text>매주</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.buttonStyle,
                  selectedCycle === '매월'
                    ? styles.selected
                    : styles.unselected,
                ]}
                onPress={() => handleCycleSelect('매월')}>
                <Text>매월</Text>
              </Pressable>
            </View>
            <View
              style={{
                height: 2,
                backgroundColor: '#F0F0F0',
                marginTop: '4%',
              }}
            />
            <View style={{padding: '5%'}}>
              <SubmitButton
                state={selectedCycle}
                comment={'다음'}
                onPress={() => {
                  setRepeatDetail(true);
                  closeModal();
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
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

    width: '100%',
    height: 'auto',
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
  rowcontainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  titleStyle: {
    flex: 0.9,
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 19,
    color: 'black',
  },
  buttonStyle: {
    padding: '3%',
    width: 'auto',
    borderWidth: 2,
    borderRadius: 10,
    marginTop: '2%',
  },
  selected: {borderColor: '#1DC2FF', backgroundColor: '#ECFBFF'},
  unselected: {borderColor: '#F0F0F0', backgroundColor: 'white'},
});
