import React, {useState, useEffect, useRef} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {KeyboardUp, UserInfo, CheckCode} from '../store/Item';
import Toast from 'react-native-easy-toast';

import {sendEmail} from '../service/SingUp';

function EmailAuthentication(route) {
  const initialTime = 300;
  const [time, setTime] = useState(initialTime);
  const [isFocused, setIsFocused] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const {setKeyboardTrue, setKeyboardFalse} = KeyboardUp();
  const {
    setCheckCodeState,
    CheckCodeState,
    setUserCodeState,
    setRemoveCheckCode,
  } = CheckCode();
  const {UserEmail} = UserInfo();
  const toastRef = useRef(); // toast ref 생성
  const errorText = route.state;

  const handleFocus = () => {
    setIsFocused(true);
    setKeyboardTrue();
  };

  const handleBlur = () => {
    setIsFocused(false);
    setKeyboardFalse();
  };
  useEffect(() => {
    let timer;
    // 1초마다 시간을 1초씩 감소
    if (time > 0) {
      timer = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    }

    // 타이머가 종료되면 clearInterval로 타이머를 정지
    if (time === 0) {
      clearInterval(timer);
      setRemoveCheckCode();
    }

    return () => clearInterval(timer); // 컴포넌트가 언마운트될 때 타이머 정리
  }, [time]);

  useEffect(() => {
    const getEmailAndSetCheckCodeState = async () => {
      console.log('이메일 보내기');
      setUserCodeState('');
  
      try {
        const response = await sendEmail(UserEmail);
        setCheckCodeState(response.data.checkCode);
      } catch (error) {
        // 오류 처리
      }
    };
  
    getEmailAndSetCheckCodeState();
  }, []);
  

  const resetTimer = () => {
    if (buttonDisabled) {
      return toastRef.current.show(
        '연속으로 인증받기를 클릭할 수 없습니다. 잠시만 기다려주세요',
      );
    }
    clearInterval(time);
    setTime(initialTime);
    // 버튼 비활성화
    setButtonDisabled(true);
    //인증코드 날리는 api추가해야함
    setUserCodeState('');
    sendEmail(UserEmail)
      .then(code => {
        console.log(code, '여기서도 잘 받는지 확인');
        setCheckCodeState(code.data.checkCode);
        // 버튼 활성화
        setButtonDisabled(false);
      })
      .catch(err => {
        console.log(err, '======');
        // 버튼 활성화
        setButtonDisabled(false);
      });
    setRemoveCheckCode();
    toastRef.current.show(
      '이메일로 인증코드가 재발급 되었습니다! \n 인증코드를 다시 입력해 주세요',
    );
    // 토스트 팝업 등장
  };
  // 초를 분:초 형식으로 변환
  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  console.log(UserEmail, 'UserEmail');

  return (
    <View>
      <Toast
        ref={toastRef}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }}
        textStyle={{
          fontSize: 14,
          color: 'white',
          textAlign: 'center',
        }}
        positionValue={useWindowDimensions().height * 0.7}
        fadeInDuration={200}
        fadeOutDuration={1000}>
        <Text style={{fontSize: 14, color: 'white', textAlign: 'center'}}>
          이메일로 인증코드가 재발급 되었습니다!{'\n'}인증코드를 다시 입력해
          주세요
        </Text>
      </Toast>

      <Text style={styles.example}>
        이메일이 "{UserEmail}"로 전송되었습니다. 이메일 내 인증코드를 입력한 후
        아래 "인증하기" 버튼을 눌러주세요. {'\n'}이메일이 가지 않았을 경우
        [스팸함]을 확인해주세요
      </Text>
      <View
        style={[
          styles.textinput,
          {borderColor: isFocused ? 'black' : '#D0D1D3'},
        ]}>
        <Text style={styles.label}>인증코드</Text>
        <TextInput
          style={[styles.input, {color: isFocused ? 'black' : '#D0D1D3'}]}
          placeholder="인증코드를 입력해주세요"
          placeholderTextColor="#D1D1D2"
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={text => setUserCodeState(text)}
        />
        <Text style={[styles.timeset]}>{formatTime(time)}</Text>
      </View>
      {errorText ? null : (
        <Text style={{color: 'red'}}>
          인증코드가 일치하지 않습니다ㅠㅠ 다시 작성하거나 인증코드 재발급을
          진행해주세요.
        </Text>
      )}

      <View style={{alignItems: 'flex-end'}}>
        <TouchableOpacity
          style={[styles.reissuance, {backgroundColor: '#F1F1F1'}]}
          onPress={resetTimer}
          disabled={buttonDisabled}>
          <Text style={{fontSize: 15, color: '#757B7D'}}>인증코드 재발급</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  example: {fontSize: 15, color: '#757B7D', marginBottom: 24},
  timeset: {color: '#B1B1B1', position: 'absolute', top: '110%', left: '95%'},
  textinput: {
    height: 70,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D0D1D3',
    padding: 14,
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: '#82858F',
  },
  input: {
    fontSize: 17,
  },
  errortext: {color: '#FF002E', display: 'none'},
  reissuance: {
    height: 45,
    width: 161,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
});
export default EmailAuthentication;
