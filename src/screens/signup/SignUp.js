import React, {useState, useEffect} from 'react';

import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  AppState
} from 'react-native';

import {emailChecks} from '../../service/SingUp';

import SubmitButton from '../../component/SubmitButton';

import {CheckCode, UserInfo} from '../../store/Item';

function SignUp({navigation}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isEmailCheck, setEmailCheck] = useState(false);
  const [email, setEmail] = useState('');
  const [errorText, setErrorText] = useState('');

  const {setCheckCodeState} = CheckCode();
  const {setUserEmailState} = UserInfo();

  console.log(isChecked);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleEmailChange = text => {
    // 이메일 중복 체크
    setEmail(text);
    //이게 트루면 보내주기 & pass
  };

  // 이메일 유효성 검사 함수
  function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }

  const validateEmail = async () => {
    if (!isChecked) {
      return; // isChecked가 false이면 함수 종료
    }

    if (!email || !isValidEmail(email)) {
      setEmailCheck(true);
      setErrorText('이메일 형식이 올바르지 않습니다.');
      return; // 이메일이 공백이거나 유효한 형식이 아닌 경우 함수 종료
    }

    try {
      // 이메일 중복 체크
      const isEmailDuplicate = await emailChecks(email);

      if (!isEmailDuplicate.data.duplicationOrNot ) {
        // 응답 처리
        // sendEmail(email).then(response => {
        //   console.log(response);
        //   setCheckCodeState(response.data.checkCode);
        // });

        setUserEmailState(email);
        setEmailCheck(false);
        navigation.navigate('AuthForm', {type: 'Login'});
      } else {
        // 이메일이 중복되는 경우
        setErrorText('이미 중복된 이메일 입니다.');
        setEmailCheck(true);
      }
    } catch (error) {
      // 오류 처리
      console.log(error);
      setErrorText('이메일 중복 확인 중 오류가 발생했습니다.');
      setEmailCheck(true);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{flex: 1}}>
          <View
            style={[
              styles.textinput,
              {borderColor: isFocused ? 'black' : '#D0D1D3'},
            ]}>
            <Text style={styles.label}>이메일</Text>
            <TextInput
              style={[styles.input, {color: isFocused ? 'black' : '#D0D1D3'}]}
              placeholder="이메일을 입력해 주세요"
              placeholderTextColor="#D1D1D2"
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChangeText={handleEmailChange}
              keyboardType={'email-address'}
            />
          </View>
          {isEmailCheck ? (
            <Text style={styles.errorText}>{errorText}</Text>
          ) : null}
        </View>
      </TouchableWithoutFeedback>

      <View style={{marginBottom: !isFocused ? 24 : 120}}>
        <TouchableOpacity style={styles.checkboxContainer}>
          <BouncyCheckbox
            style={styles.checkbox}
            unfillColor="#FAFAFA"
            fillColor="#1DC2FF"
            onPress={isChecked => {
              setIsChecked(isChecked);
            }}
            color={isChecked ? 'black' : undefined}
          />
          <View style={styles.infomation}>
            <Text style={styles.infoText}>
              <Text
                style={{color: 'rgba(29, 194, 255, 1)'}}
                onPress={() =>
                  navigation.navigate('Terms', {type: '이용약관'})
                }>
                이용약관
              </Text>
              <Text> 및 </Text>
              <Text
                style={{color: 'rgba(29, 194, 255, 1)'}}
                onPress={() =>
                  navigation.navigate('Terms', {type: '개인정보정책'})
                }>
                개인정보정책
              </Text>
              <Text>에 동의합니다.</Text>
            </Text>
          </View>
        </TouchableOpacity>

        <SubmitButton
          state={isChecked}
          comment={'이메일 인증하기'}
          onPress={validateEmail}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
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
  errorText: {
    color: 'red',
  },
  emailAuthButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  emailAuthButtonText: {
    color: 'white',
    fontSize: 18,
  },
  buttonContainer: {
    borderRadius: 8,
    backgroundColor: 'black',
    marginTop: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 31,
  },
  checkbox: {borderRadius: 10},
  infomation: {
    flexDirection: 'row',
    marginLeft: 6,
  },
  infoText: {fontSize: 16, fontWeight: '400'}, // fontWeight 값을 문자열로 변경
});

export default SignUp;
