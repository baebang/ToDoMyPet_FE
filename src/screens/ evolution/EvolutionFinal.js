import {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import SubmitButton from '../../component/SubmitButton';
import Confetti from 'react-native-confetti';
import {useRoute} from '@react-navigation/native';
import {useQueryClient} from 'react-query';
import FastImage from 'react-native-fast-image';
import {PetLineEvolution} from '../PetLine';

const {width, height} = Dimensions.get('window');
const finalIcon = width * 0.15;
const petImage = width * 0.23;
const speechBubbleSize = width * 0.7;

export default function EvolutionFinal({navigation}) {
  const confettiViewRef = useRef(null);
  const [fadeAnim] = useState(new Animated.Value(0)); // 초기값 0으로 설정하여 처음에 보이지 않게 함
  const route = useRoute();
  const {petInfo, petGrade, petMaxExperiencePoint} = route.params;
  const queryClient = useQueryClient();
  const animation = useRef(new Animated.Value(0)).current;

  const refreshPetData = async () => {
    await queryClient.invalidateQueries('getMainPetKey');
    await queryClient.invalidateQueries('getGetavailablStartPetKey');
    await queryClient.invalidateQueries('MainPageShowQueryKey');
  };
  if (!petInfo || !petGrade || !petMaxExperiencePoint) {
    console.log(
      'petInfo=====',
      petInfo,
      'petGrade=====',
      petGrade,
      'petMaxExperiencePoint=====',
      petMaxExperiencePoint,
    );
    return <Text>Loading</Text>;
  }

  console.log(
    'petInfo=====',
    petInfo,
    'petGrade=====',
    petGrade,
    'petMaxExperiencePoint=====',
    petMaxExperiencePoint,
  );

  useEffect(() => {
    if (confettiViewRef.current) {
      confettiViewRef.current.startConfetti();
    }
    // 이미지 페이드인 애니메이션
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000, // 2초간 페이드인
      useNativeDriver: true, // 네이티브 애니메이션 사용
    }).start();
  }, []);

  return (
    <ImageBackground
      source={require('../../../assets/singup_end.png')}
      style={styles.backgroundImage}>
      <Confetti ref={confettiViewRef} />
      <View style={styles.container}>
        <Text style={styles.complete}>
          {petGrade === 'ADULT' && petMaxExperiencePoint === 600
            ? 'Graduation'
            : 'LEVEL UP'}
        </Text>

        <View style={styles.asset}>
          {petGrade === 'ADULT' && petMaxExperiencePoint === 600 ? (
            Platform.OS === 'ios' ? (
              <Animated.Image
                style={{
                  height: finalIcon,
                  width: finalIcon,
                  left: '-3%',
                  opacity: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0], // GIF가 재생되는 동안 투명도가 감소하여 사라짐
                  }),
                }}
                source={{
                  uri: 'https://todomypet.s3.ap-northeast-2.amazonaws.com/graduation-gif.gif',
                }}
              />
            ) : (
              <FastImage
                style={{
                  height: finalIcon,
                  width: finalIcon,
                  left: '-2%',
                }}
                source={{
                  uri: 'https://todomypet.s3.ap-northeast-2.amazonaws.com/graduation-gif.gif',
                }}
              />
            )
          ) : (
            <ImageBackground
              style={{
                height: speechBubbleSize / 2.5,
                width: speechBubbleSize,
                padding: '5%',
                display: 'flex',
                alignItems: 'center',
                marginBottom: '4%',
              }}
              source={require('../../../assets/speechBubble.png')}>
              <Text
                style={[
                  {
                    fontSize: 15,
                    fontFamily: 'DungGeunMo',
                    color: 'black',
                  },
                ]}>
                {'\n'}
                {PetLineEvolution(petInfo.petPersonalityType)}
              </Text>
            </ImageBackground>
          )}
          <Image
            style={{width: petImage, height: petImage}}
            source={{uri: petInfo.petImageUrl}}
          />
        </View>
        {petGrade === 'ADULT' && petMaxExperiencePoint === 600 ? (
          <View style={styles.comment}>
            <Text
              style={[
                styles.commentText,
                {marginBottom: 10, textAlign: 'center'},
              ]}>
              {petInfo.renameOrNot
                ? `${petInfo.currentName}(은)는\n완전한 성장을 이루고\n독립합니다!`
                : `${petInfo.petName}(은)는\n완전한 성장을 이루고\n독립합니다!`}
            </Text>
          </View>
        ) : petInfo.renameOrNot ? (
          <View style={styles.comment}>
            <Text
              style={[
                styles.commentText,
                {marginBottom: 10, textAlign: 'center'},
              ]}>
              {petInfo.currentName}(은)는{'\n'}
              성장했습니다!
            </Text>
          </View>
        ) : (
          <View style={styles.comment}>
            <Text
              style={[
                styles.commentText,
                {marginBottom: 10, textAlign: 'center'},
              ]}>
              {petInfo.currentName}(은)는 {'\n'}
              {petInfo.selectPetOriginName}으로{'\n'}성장했습니다.
            </Text>
          </View>
        )}
      </View>
      <View style={{paddingHorizontal: 16, marginBottom: 24}}>
        <SubmitButton
          state={true}
          comment={
            petGrade === 'ADULT' && petMaxExperiencePoint === 600
              ? '새로운 펫 얻으러 가기'
              : '확인'
          }
          onPress={() => {
            refreshPetData();
            if (petGrade === 'ADULT' && petMaxExperiencePoint === 600) {
              queryClient.refetchQueries('AdoptedPetListQueryKey');

              queryClient.refetchQueries('collectionQueryKey');
              queryClient.refetchQueries('myPageQueryKey');
              navigation.navigate('SelectEggPage');
            } else {
              //일지 갱신하기
              queryClient.refetchQueries('AdoptedPetListQueryKey');
              queryClient.refetchQueries('collectionQueryKey');
              queryClient.refetchQueries('myPageQueryKey');
              navigation.navigate('BottomNavigation');
            }
          }}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {flex: 10, resizeMode: 'cover'},
  container: {
    flex: 10,
    marginTop: 115,
    marginHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  complete: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#00B2F3',
    flex: 1.5,
    marginTop: 18,
    fontFamily: 'VCRosdNEUE',
    fontWeight: '600', // 문자열로 변경
  },
  asset: {flex: 3, alignItems: 'center'},
  comment: {flex: 2, alignItems: 'center'},
  commentText: {fontFamily: 'DungGeunMo', fontSize: 20, lineHeight: 30},
});
