import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    Text,
    Keyboard,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
} from 'react-native';
import ProfileImage from '../../component/ProfilePick';
import SubmitButton from '../../component/SubmitButton';

import { UserInfo } from '../../store/Item';

function Profile({ navigation }) {
    const [profileCheck, setProfileCheck] = useState(false);
    const [introduction, setIntroduction] = useState('');
    const [isKeyboard, setisKeyboard] = useState(false);
    const [isName, setName] = useState('');
    const [isintu, setinttu] = useState('');
    const maxCharacterCount = 80; // 최대 글자 수
    const { setUserNickNameState, setUserBioState } = UserInfo();

    const profileCommit = () => {
        const isNameEmpty = isName.trim() === '';
        const isinttuEmpty = isintu.trim() === '';
        setProfileCheck(!(isNameEmpty || isinttuEmpty));
    };

    const handleIntroductionChange = (text) => {
        if (text.length <= maxCharacterCount) {
            setIntroduction(text);
        }
        setinttu(text);
    };

    const profileSubmit = () => {
        //이름 소개 api 보내기
        setUserNickNameState(isName);
        setUserBioState(introduction);
        navigation.navigate('FinalSingUp');
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.component}>
            
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
                    <View style={[styles.textinput, { borderColor: '#D0D1D3', marginTop: 24 }]}>
                        <Text style={styles.label}>이름</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="이름을 입력해 주세요"
                            placeholderTextColor="#D1D1D2"
                            onChangeText={(text) => {
                                setName(text);
                                profileCommit();
                            }}
                            onFocus={() => setisKeyboard(true)} // 텍스트 입력 필드가 포커스되면 키보드가 열린 것으로 처리
                            onBlur={() => setisKeyboard(false)} // 텍스트 입력 필드가 포커스를 잃으면 키보드가 닫힌 것으로 처리
                        />
                    </View>
                    <View style={[styles.textinput, { borderColor: '#D0D1D3', height: 87 }]}>
                        <Text style={styles.label}>소개</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="소개말을 입력해 주세요"
                            placeholderTextColor="#D1D1D2"
                            onChangeText={(text) => {
                                handleIntroductionChange(text);
                                profileCommit();
                            }}
                            maxLength={maxCharacterCount} // 최대 글자 수 설정
                            multiline={true}
                            onFocus={() => setisKeyboard(true)} // 텍스트 입력 필드가 포커스되면 키보드가 열린 것으로 처리
                            onBlur={() => setisKeyboard(false)} // 텍스트 입력 필드가 포커스를 잃으면 키보드가 닫힌 것으로 처리
                        />
                        <Text style={styles.characterCount}>
                            {introduction.length}/{maxCharacterCount}
                        </Text>
                    </View>
                </KeyboardAvoidingView>
                <View style={{ marginBottom: isKeyboard  && Platform.OS === 'ios'? 360 : 24 }}>
                    <SubmitButton state={profileCheck} comment={'다음'} onPress={profileSubmit} />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    component: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 16,
    },
    textinput: {
        height: 63,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D0D1D3',
        marginBottom: 8,
        padding: 16,
    },
    label: {
        fontSize: 12,
        color: '#82858F',
        marginBottom: 6,
    },
    input: {
        fontSize: 15,
        color: 'black',
    },
    characterCount: {
        fontSize: 12,
        color: '#82858F',
        textAlign: 'right', // 숫자를 오른쪽 정렬
        position: 'absolute',
        bottom: 10,
        right: 16,
    },
});
export default Profile;
