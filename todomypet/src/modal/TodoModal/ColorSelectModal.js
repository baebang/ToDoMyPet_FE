import React, {useState} from 'react';
import {
  View,
  Modal,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import SubmitButton from '../../component/SubmitButton';
import {useQueryClient} from 'react-query';
import {CategorySetting} from '../../store/Item';

const {width} = Dimensions.get('window');
const closeIconSize = width * 0.07;
const arrowIconSize = width * 0.05;

export default function ColorSelectModal({visable, closeModal}) {
  const [selected, setSelected] = useState('');
  const {setCategoryColor} = CategorySetting();
  const queryClient = useQueryClient();

  const CircleView = () => {
    //categoryColorListKey

    const categoryColorList = queryClient.getQueryData('categoryColorListKey');

    const circleRows = [];
    for (let i = 0; i < 40; i += 8) {
      circleRows.push(categoryColorList.colorCodes.slice(i, i + 8));
    }

    return (
      <View style={styles.container}>
        {circleRows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.rowContainer}>
            {row.map((color, index) => (
              <TouchableOpacity key={index} onPress={() => setSelected(color)}>
                <View style={[selected === color ? styles.circles : null]} />
                <View
                  style={[
                    styles.circle,
                    {backgroundColor: color},
                    selected === color ? styles.selectedCircle : null,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    );
  };
  return (
    <Modal transparent={true} visible={visable}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={[styles.rowcontainer, {marginBottom: '5%'}]}>
            <Pressable onPress={closeModal}>
              <Image
                style={{height: closeIconSize, width: closeIconSize}}
                source={require('../../../assets/close.png')}
              />
            </Pressable>

            <Text style={styles.titleStyle}>카테고리 추가</Text>
          </View>
          {CircleView()}

          <View style={{marginTop: '10%'}}>
            <SubmitButton
              state={selected}
              comment={'추가하기'}
              onPress={() => {
                setSelected();
                setCategoryColor(selected);
                closeModal();
              }}
            />
          </View>
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
  },
  modalView: {
    backgroundColor: 'white',

    padding: '5%',
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
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5, // 각 행 간의 간격
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 99,
    marginHorizontal: 5,
  },
  selectedCircle: {
    borderWidth: 4,
    borderColor: 'white',
  },

  circles: {
    width: 35,
    height: 35,
    borderRadius: 99,
    marginHorizontal: 5,
    position: 'absolute',
    borderWidth: 6,
    right: -2.3,
    top: -2.3,
    borderColor: '#7E7E7E',
  },
});
