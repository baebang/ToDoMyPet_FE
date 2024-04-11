import {useEffect, useRef} from 'react';

import {View, Text, ImageBackground, StyleSheet, Image} from 'react-native';
import SubmitButton from '../../component/SubmitButton';
import {UserInfo} from '../../store/Item';
import {userSingUp} from '../../service/SingUp';
import Confetti from 'react-native-confetti';

export default function FinalSingUp({navigation}) {
  const {UserEmail, UserPassword, UserNickName, UserBio} = UserInfo();
  const confettiViewRef = useRef(null);

  useEffect(() => {
    const saneAPI = {
      email: UserEmail,
      password: UserPassword,
      nickname: UserNickName,
      bio: UserBio,
      profilePic: null,
    };
    console.log(saneAPI);

    userSingUp(saneAPI);

    if (confettiViewRef.current) {
      confettiViewRef.current.startConfetti();
    }
  }, []);

  return (
    <ImageBackground
      source={require('../../../assets/singup_end.png')} // 이미지 파일 경로 설정
      style={styles.backgroundImage}>
      <Confetti ref={confettiViewRef} />
      <View style={styles.container}>
        <Text style={styles.complete}>회원가입이 완료되었습니다!</Text>

        <View style={styles.asset}>
          <Image
            style={{width: 140, height: 140}}
            source={require('../../../assets/symbol.png')}
          />
        </View>
        <View style={styles.coment}>
          <Text style={[styles.comemttext, {marginBottom: 10}]}>
            이제 작은 계획들을 세우고 하나씩 이뤄가며
          </Text>
          <Text style={styles.comemttext}>자신만의 펫을 키우러 가볼까요?</Text>
        </View>
      </View>
      <View style={{paddingHorizontal: 16, marginBottom: 24}}>
        <SubmitButton
          state={true}
          comment={'좋아요'}
          onPress={() => navigation.navigate('Home')}
        />
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  backgroundImage: {flex: 10, resizeMode: 'cover'}, // 배경 이미지 스타일
  container: {
    flex: 10,
    marginTop: 115,
    marginHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  complete: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00B2F3',
    flex: 2.6,
    marginTop: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: {width: 0, height: 4},
    textShadowRadius: 4,
  },
  asset: {flex: 3, alignItems: 'center'},
  coment: {flex: 2, alignItems: 'center'},
  comemttext: {fontFamily: 'DungGeunMo', fontSize: 15},
});
