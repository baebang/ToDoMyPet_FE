import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';

import SubmitButton from '../../component/SubmitButton';

import {UserInfo} from '../../store/Item';
import {useRoute} from '@react-navigation/native';
import {passwordChange} from '../../service/MyPageService';

function PassWord({navigation}) {
  const [isFocused, setIsFocused] = useState('#D0D1D3');
  const [password, setPassword] = useState('');
  const [isSecondFocused, setIsSecondFocused] = useState('#D0D1D3');
  const [keyboardState, setKeyboardState] = useState(false);

  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isCheckFocused, setIsCheckFocused] = useState(false);
  const [isCheckMessage, setIsCheckMessage] = useState('');
  const [doubleCheck, setDoubleCheck] = useState(false);

  const [isChecked, setIsChecked] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSucess] = useState('');

  const {setUserPasswordState, UserEmail} = UserInfo();
  const route = useRoute();

  const {type} = route.params;

  const handleFocus = () => {
    setIsFocused('black');
    setKeyboardState(true);
  };
  const handleBlur = () => {
    setKeyboardState(false);
  };

  const validatePassword = text => {
    const isValid =
      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[~?!@#$%^&*])[A-Za-z0-9~?!@#$%^&*]{8,20}$/.test(
        text,
      );
    if (isValid) {
      setPasswordError('');
      setPasswordSucess('사용할 수 있는 비밀번호입니다!');
      setIsFocused('#00B2F3');
      setIsChecked(true);
    } else {
      setPasswordError(
        '비밀번호는 영어, 숫자, 특수문자를 조합하여 8~20자로 입력해야 합니다.',
      );
      setIsFocused('red');
      setIsChecked(false);
      setPasswordSucess('');
    }
  };

  const checkHandleFocus = () => {
    setIsSecondFocused('black');
    setKeyboardState(true);
  };
  const checkHandleBlur = () => {
    setKeyboardState(false);
  };
  const checkPassword = text => {
    if (password == text && password !== '') {
      if (isFocused == 'red') {
        setIsSecondFocused('red');
        setDoubleCheck(false);
        setIsCheckMessage('비밀번호 형식을 다시 확인해주세요');
      } else {
        setIsSecondFocused('#00B2F3');
        setDoubleCheck(true);
        setIsCheckMessage('비밀번호가 일치합니다!');
      }
    } else {
      setIsSecondFocused('red');
      setDoubleCheck(false);
      setIsCheckMessage('비밀번호가 일치하지 않습니다. 다시 입력해주세요');
    }
  };

  const passwordSCommit = () => {
    // 서버로 비번 보내기 API넣기

    // passwordChange;

    if (type === 'Login') {
      setUserPasswordState(password);
      navigation.navigate('Profile');
    } else {
      //비밀버호를 잃어버린 경우!
      const userDTO = {
        email: UserEmail,
        passwordToChange: password,
      };
      console.log(userDTO, type);
      navigation.navigate('Home');
      passwordChange(userDTO).then((res) => {
        console.log(res)
        navigation.navigate('Home');
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <TouchableWithoutFeedback style={{flex: 10}} onPress={Keyboard.dismiss}>
        <View style={{flex: 8}}>
          <View style={[styles.textinput, {borderColor: isFocused}]}>
            <Text style={styles.label}>비밀번호</Text>
            <TextInput
              style={[styles.input, {color: 'black'}]}
              placeholder="비밀번호를 입력해주세요"
              onFocus={handleFocus}
              onChangeText={text => {
                validatePassword(text);
                setPassword(text);
              }}
              value={password}
              secureTextEntry={true}
              keyboardType="url"
              onBlur={handleBlur}
              placeholderTextColor="#D1D1D2"
            />
          </View>
          {!passwordError && !passwordSuccess && (
            <Text style={{color: '#D0D1D3'}}>
              영어, 숫자, 특수문자를 조합하여 8~20자로 입력해주세요
            </Text>
          )}

          {(passwordError || passwordSuccess) && (
            <Text style={{color: passwordError ? 'red' : '#00B2F3'}}>
              {passwordError || passwordSuccess}
            </Text>
          )}

          <View
            style={[
              styles.textinput,
              {marginTop: 16, borderColor: isSecondFocused},
            ]}>
            <Text style={styles.label}>비밀번호 확인</Text>
            <TextInput
              style={[styles.input, {color: isFocused ? 'black' : '#D0D1D3'}]}
              placeholder="비밀번호를 한 번 더 입력해주세요."
              placeholderTextColor="#D1D1D2"
              onFocus={checkHandleFocus}
              onChangeText={text => checkPassword(text)}
              secureTextEntry={true}
              keyboardType="url"
              onBlur={checkHandleBlur}

            />
          </View>
          <Text style={{color: isSecondFocused}}>{isCheckMessage}</Text>
        </View>
      </TouchableWithoutFeedback>

      <View
        style={{
          marginBottom: keyboardState && Platform.OS === 'ios' ? 120 : 24,
        }}>
        <SubmitButton
          state={doubleCheck}
          comment={'다음'}
          onPress={passwordSCommit}
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
});

export default PassWord;
