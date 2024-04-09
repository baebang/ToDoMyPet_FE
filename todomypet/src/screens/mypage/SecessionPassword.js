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

import {deleteAccount, checkPassword} from '../../service/MyPageService';

import SubmitButton from '../../component/SubmitButton';
import {AccountDeleteModal} from '../../modal/MypageModal/Setting';

function SecessionPassword({navigation}) {
  const [isFocused, setIsFocused] = useState(false);
  const [modal, setModal] = useState(false);

  const [email, setEmail] = useState('');

  const [errorText, setErrorText] = useState('');

  const handleFocus = () => {
    setIsFocused(true);
  };

  const NextButton = () => {
    const passWord = {
      password: email,
    };
    checkPassword(passWord)
      .then(res => {
        if (!res) {
          setErrorText('비밀번호가 일치하지 않습니다.');
        } else {
          setErrorText(res);
          setModal(true);
        }
      })
      .catch(err =>
        setErrorText('오류가 발생하였습니다. 관리자에게 요청해주세요'),
      );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <AccountDeleteModal closeModal={() => setModal(false)} state={modal} />
      <Text style={{color: '#7E7E7E', marginBottom: '5%'}}>
        탈퇴 처리를 위해 비밀번호를 입력해주세요. 입력 후 아래 ‘탈퇴하기’ 버튼을
        누르면 최종 탈퇴가 진행됩니다.
      </Text>
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
            <Text style={styles.label}>비밀번호</Text>
            <TextInput
              style={[styles.input, {color: isFocused ? 'black' : '#D0D1D3'}]}
              placeholder="비밀번호 입력해 주세요"
              placeholderTextColor="#D1D1D2"
              onFocus={handleFocus}
              onBlur={() => setIsFocused(false)}
              onChangeText={text => setEmail(text)}
              secureTextEntry={true}
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
        <SubmitButton state={true} comment={'다음'} onPress={NextButton} />
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

export default SecessionPassword;
