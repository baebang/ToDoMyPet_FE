import React, {useRef, useState, useEffect} from 'react';
import {
  Modal,
  View,
  Image,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import SubmitButton from '../../component/SubmitButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tutorial_1 from '../../../assets/tutorial_1.png';
import tutorial_2 from '../../../assets/tutorial_2.png';
import tutorial_3 from '../../../assets/tutorial_3.png';
import tutorial_4 from '../../../assets/tutorial_4.png';
import tutorial_5 from '../../../assets/tutorial_5.png';

const {width, height} = Dimensions.get('window');
const closeIconSize = width * 0.91;
const arrowIconSize = height * 0.6;

//AsyncStorage.setItem('PermissionCheck', 'check');

export default function TutorialModal({visible, closeModal}) {
  console.log(visible, 'visible');
  const handleCloseModal = async () => {
    // 모달을 닫을 때 AsyncStorage에 'TutorialCheck' 키를 true로 설정
    try {
      await AsyncStorage.setItem('TutorialCheck', 'check');
      console.log('AsyncStorage에 값 설정완료');
      closeModal();
    } catch (error) {
      console.error('AsyncStorage에 값 설정 중 오류:', error);
    }
    // 부모 컴포넌트에서 전달된 closeModal 함수 호출하여 모달 닫기
  };

  const scrollViewRef = useRef();
  const [currentPage, setCurrentPage] = useState(0);

  const handleScroll = event => {
    const xOffset = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(xOffset / width);
    // 현재 인덱스 출력
    setCurrentPage(currentIndex);
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {[...Array(5).keys()].map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentPage === index && styles.activeDot]}
          />
        ))}
      </View>
    );
  };

  return (
    <Modal transparent={true} visible={visible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            ref={scrollViewRef}>
            {/* 각 페이지에 해당하는 View 추가 */}
            <View style={styles.page}>
              <Image
                source={tutorial_1}
                style={{height: arrowIconSize, width: closeIconSize}}
              />
            </View>
            <View style={styles.page}>
              <Image
                source={tutorial_2}
                style={{height: arrowIconSize, width: closeIconSize}}
              />
            </View>
            <View style={styles.page}>
              <Image
                source={tutorial_3}
                style={{height: arrowIconSize, width: closeIconSize}}
              />
            </View>
            <View style={styles.page}>
              <Image
                source={tutorial_4}
                style={{height: arrowIconSize, width: closeIconSize}}
              />
            </View>
            <View style={styles.page}>
              <Image
                source={tutorial_5}
                style={{height: arrowIconSize, width: closeIconSize}}
              />
            </View>
          </ScrollView>
          {renderDots()}
          <View style={{padding: 10, marginBottom: '20%'}}>
            <SubmitButton
              state={true}
              comment={'완료'}
              onPress={handleCloseModal}
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  activeDot: {
    backgroundColor: 'blue', // You can change the color of the active dot
  },
  page: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: '74%',
    right: '40%',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#000000', // You can change the color of the active dot
  },
});
