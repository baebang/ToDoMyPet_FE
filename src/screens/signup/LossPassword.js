import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  SafeAreaView,
  Pressable,
} from 'react-native';

import {emailChecks, sendEmail} from '../../service/SingUp';

import SubmitButton from '../../component/SubmitButton';
import {CheckCode, UserInfo} from '../../store/Item';

function LossPassword({navigation}) {
  const [isFocused, setIsFocused] = useState(false);

  const [email, setEmail] = useState('');

  const [errorText, setErrorText] = useState('');
  const {setCheckCodeState} = CheckCode();
  const {setUserEmailState} = UserInfo();

  const handleFocus = () => {
    setIsFocused(true);
  };

  const validateEmail = () => {
    //로그인 API

    emailChecks(email)
      .then(res => {
        if (!res.duplicationOrNot) {
          setErrorText(res.data.response);
          sendEmail(email).then(response => {
            console.log(response);
            setUserEmailState(email);
            setCheckCodeState(response.data.checkCode);
          });
          navigation.navigate('PassWordAuthForm', {type: 'passWord'});
        } else {
          setErrorText('가입이 확인되지 않는 이메일 주소입니다. ');
        }

        // 홈으로 갑시당
      })
      .catch(error => {
        // Handle any errors

        setErrorText('에러가 발생하였습니다 관리자에게 문의 주세요');
      });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={{flex: 1}}>
          <View
            style={[
              styles.textinput,
              {
                borderColor: isFocused
                  ? 'black'
                  : !errorText
                  ? '#D0D1D3'
                  : 'red',
              },
            ]}>
            <Text style={styles.label}>이메일</Text>
            <TextInput
              style={[styles.input, {color: isFocused ? 'black' : '#D0D1D3'}]}
              placeholder="이메일을 입력해 주세요"
              onFocus={handleFocus}
              onBlur={() => setIsFocused(false)}
              onChangeText={text => setEmail(text)}
              keyboardType={'email-address'}
              placeholderTextColor="#D1D1D2"
            />
          </View>

          {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
        </SafeAreaView>
      </TouchableWithoutFeedback>
      <View
        style={{
          justifyContent: 'flex-end',
          marginBottom:
            isFocused && Platform.OS === 'ios'
              ? '35%'
              : !isFocused && Platform.OS === 'ios'
              ? '10%'
              : null,
        }}>
        <SubmitButton state={true} comment={'다음'} onPress={validateEmail} />
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

export default LossPassword;
