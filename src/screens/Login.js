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
  ActivityIndicator,
  Modal,
} from 'react-native';

import {userLogin} from '../service/SingUp';

import SubmitButton from '../component/SubmitButton';
import {petContent} from './PetLine';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {saveToken} from '../service/NotificationService';
import {callGetMainPet} from '../service/PetService';

function Login({navigation}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [loading,setLoading] = useState(false)

  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const [email, setEmail] = useState('');
  const [passWord, setPassWord] = useState('');
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    if (email.trim() !== '' || passWord.trim() !== '') {
      petContent;
    }
    setIsChecked(email.trim() !== '' && passWord.trim() !== '');
  }, [email, passWord]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const passwordhandleFocus = () => {
    setIsPasswordFocused(true);
  };

  const validateEmail = () => {
    //로그인 API

    const userLog = {
      email: email,
      password: passWord,
    };
    setLoading(true)
    userLogin(userLog)
      .then(async res => {
        const token = await AsyncStorage.getItem('FCMToken');
        const userDTO = {
          fcmToken: token,
        };
        callGetMainPet().then(res => {
          if (res) {
            //알이 있음
            saveToken(userDTO)
              .then(() => {
                setLoading(false)
                navigation.navigate('BottomNavigation');
              })
              .catch(error => {
                setErrorText(error.message);
              });
          } else {
            //알이 없음
            saveToken(userDTO)
              .then(() => {
                setLoading(false)
                navigation.navigate('SelectEggPage');
              })
              .catch(error => {
                setLoading(false)
                setErrorText(error.message);
              });
          }
        });
      })
      .catch(error => {
        setLoading(false)
        console.log(error);
        setErrorText(error.message);
      });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <Modal transparent={true} visible={loading}>
        <ActivityIndicator style={{marginTop: '60%'}} size="large" />
      </Modal>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={{flex: 1}}>
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
              // onBlur={handleBlur}
              onChangeText={text => setEmail(text)}
              keyboardType={'email-address'}
            />
          </View>

          <View
            style={[
              styles.textinput,
              {borderColor: isPasswordFocused ? 'black' : '#D0D1D3'},
            ]}>
            <Text style={styles.label}>비밀번호</Text>
            <TextInput
              style={[
                styles.input,
                {color: isPasswordFocused ? 'black' : '#D0D1D3'},
              ]}
              placeholder="비밀번호를 입력해 주세요"
              placeholderTextColor="#D1D1D2"
              onFocus={passwordhandleFocus}
              onChangeText={text => setPassWord(text)}
              secureTextEntry={true}
            />
          </View>
          {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
        </SafeAreaView>
      </TouchableWithoutFeedback>

      <View style={{marginBottom: isFocused || isPasswordFocused ? 20 : 24}}>
        <Pressable
          style={{
            marginBottom: '4%',
            justifyContent: 'flex-end', // 오른쪽 정렬
            alignItems: 'flex-end',
          }}
          onPress={() => navigation.navigate('LossPassword')}>
          <Text style={{textDecorationLine: 'underline', color: '#989898'}}>
            비밀번호를 잊어버리셨나요?
          </Text>
        </Pressable>

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

export default Login;
