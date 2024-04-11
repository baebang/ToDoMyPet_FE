import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  Text,
  Platform,
} from 'react-native';
import AuthEmail from '../../component/EmailAuthentication';
import SubmitButton from '../../component/SubmitButton';
import {KeyboardUp, CheckCode} from '../../store/Item';
import {useRoute} from '@react-navigation/native';

function AuthForm({navigation}) {

  const {KeyboardState} = KeyboardUp();
  const {CheckCodeState, UserCodeState} = CheckCode();
  const [codeValid, setCodeValid] = useState(true);
  const route = useRoute();

  const {type} = route.params;


  const AuthEmailCheck = () => {
    console.log(type,"=======")
    if (type === 'Login') {
      
      // 인증코드랑 유저 작성 코드 맞는지 대조
      if (CheckCodeState == UserCodeState) {
        navigation.navigate('PassWord',{type: 'Login'});
      } else {
        setCodeValid(false);
      }
    } else {
      // 인증코드랑 유저 작성 코드 맞는지 대조
      if (CheckCodeState == UserCodeState) {
        navigation.navigate('PassWordComplete',{type: 'passWord'});
      } else {
        setCodeValid(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          <AuthEmail state={codeValid} />
        </View>
      </TouchableWithoutFeedback>

      <TouchableOpacity
        style={{
          flex: 0,
          marginBottom: KeyboardState && Platform.OS === 'ios' ? 120 : 24,
        }}>
        <SubmitButton
          state={CheckCodeState}
          comment={'인증하기'}
          onPress={AuthEmailCheck}
        />
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  content: {
    flex: 1,
  },
  example: {fontSize: 15, color: '#757B7D'},
  reorder: {},
});

export default AuthForm;
