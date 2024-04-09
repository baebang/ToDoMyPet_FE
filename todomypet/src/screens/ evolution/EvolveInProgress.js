import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ImageBackground, Text} from 'react-native';
import PetEvolveInSelect from '../../modal/MainHome/PetEvolveInSelect';
import {useRoute, useNavigation} from '@react-navigation/native';
import {callGetavailablePet, graduatePet} from '../../service/PetService';
import {useQuery, useQueryClient} from 'react-query';
import {
  countIncreaseComplete,
  achievementCondition,
} from '../../service/MyPageService';



const EvolveInProgress = () => {
  const [isEvolveInModal, setEvolveInModal] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const text = '...'; // 출력할 텍스트
  const {
    petName,
    petSeq,
    petSignatureCode,
    petId,
    petGrade,
    petMaxExperiencePoint,
  } = route.params;
  const queryClient = useQueryClient();

  useEffect(() => {
    animateText();
    return () => clearInterval(interval);
  }, []);

  let interval;

  const animateText = () => {
    let currentIndex = 0;
    interval = setInterval(() => {
      setDisplayedText(prevText => prevText + text[currentIndex]);
      currentIndex++;
      if (currentIndex === text.length) {
        clearInterval(interval);
        setEvolveInModal(true);
        if (petGrade === 'ADULT') {
          const userDTO = {
            petSeq: petSeq,
          };
          graduatePet(userDTO).then(res => {
            //졸업하기
            countIncreaseComplete().then(res => {
              console.log(res);
              const userDTO = {
                type: 'GRADUATION',
                condition: res,
              };
              achievementCondition(userDTO);
            });
          
            navigation.navigate('EvolutionFinal', {
              petInfo: res,
              petGrade: petGrade,
              petMaxExperiencePoint: petMaxExperiencePoint,
            });
          });
        }
      }
    }, 500); // 각 글자를 표시하는 간격 (밀리초)
  };

  const {data: useGetavailable} = useQuery(
    'getGetavailablPetKey',
    () => callGetavailablePet(petId),
    {
      // enabled 옵션을 사용하여 쿼리 실행 여부를 조건부로 설정
      enabled: petGrade !== 'ADULT',
    },
  );

  const petDataComponent = petGrade && petGrade !== 'ADULT' && (
    <PetEvolveInSelect
      visable={isEvolveInModal}
      closeModal={() => setEvolveInModal(false)}
      petdata={useGetavailable}
      initialized={false}
      setEvolveInfo={route.params}
      petGrade={petGrade}
    />
  );

  return (
    <ImageBackground
      style={styles.backgroundImage}
      source={require('../../../assets/levelUP_Page.png')}>
      {petDataComponent}
      <View style={{paddingTop: '60%'}}>
        <Text style={styles.text}>{petName}(이)가</Text>
        <Text style={styles.text}>
          {petGrade === 'ADULT'
            ? `독립을 준비합니다${displayedText}`
            : `진화하고 있습니다${displayedText}`}
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {flex: 10, resizeMode: 'cover'},
  text: {
    fontSize: 24,
    color: 'black',
    textAlign: 'center',
    fontFamily: 'DungGeunMo',
  },
});

export default EvolveInProgress;
