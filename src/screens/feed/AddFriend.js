import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import {FrinedFind} from '../../component/FriendInfo';
import {SerachFriendCode} from '../../service/BoardService';
import {useQuery, useQueryClient} from 'react-query';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const {width, height} = Dimensions.get('window');
export default function AddFriend() {
  const [isFriendCode, setIsFriendCode] = useState('');
  const [inputText, setInputText] = useState('');
  const queryClient = useQueryClient();

  const {
    data: friendData,
    isLoading: isfriendLoading,
    isError: isfriendError,
    refetch: refetchFriendData,
  } = useQuery(
    ['FriendAddQueryKey', isFriendCode],
    () => SerachFriendCode(isFriendCode),
    {
      enabled: isFriendCode.trim() !== '',
    },
  );

  if (isfriendLoading) {
    return (
      <View>
        <View style={styles.container}>
          <View style={styles.textinput}>
            <TextInput
              style={[styles.input]}
              placeholder="친구 추가 코드를 입력해주세요."
              placeholderTextColor="#D1D1D2"
              onChangeText={text => setInputText(text)}
              onSubmitEditing={handleTextSubmit}
            />
          </View>
          <View>
            <View>
              <View style={{flexDirection: 'row'}}>
                <SkeletonPlaceholder speed={2500} backgroundColor={'#E7E7E7'}>
                  <View
                    style={{
                      width: width * 0.12,
                      height: width * 0.12,
                      borderRadius: 60,
                    }}
                  />
                </SkeletonPlaceholder>

                <View style={{justifyContent: 'center', marginLeft: '3%'}}>
                  <View
                    style={{
                      width: width * 0.15,
                      height: width * 0.02,
                      borderRadius: 60,
                      backgroundColor: '#E7E7E7',
                      marginBottom: '10%',
                    }}
                  />
                  <View
                    style={{
                      width: width * 0.12,
                      height: width * 0.02,
                      borderRadius: 60,
                      backgroundColor: '#E7E7E7',
                    }}
                  />
                </View>
              </View>
             
            </View>
          </View>
        </View>
      </View>
    );
  }

  if (isfriendError) {
    return <Text>Error fetching data</Text>; // 에러 발생 시 표시할 UI
  }

  const handleTextSubmit = async () => {
    if (inputText.trim() !== '') {
      setIsFriendCode(inputText);
      queryClient.invalidateQueries(['FriendAddQueryKey', inputText]);
    }
  };
  //QU938347594

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.textinput}>
          <TextInput
            style={[styles.input]}
            placeholder="친구 추가 코드를 입력해주세요."
            onChangeText={text => setInputText(text)}
            onSubmitEditing={handleTextSubmit}
          />
        </View>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex: 1}}>
          <View>
           {!inputText && <Text style={styles.textStyle}>
              친구 초대 코드는 [마이페이지 - 친구 초대 코드]의 고유 코드번호를
              받아 입력 후, 엔터를 눌러주세요.
            </Text>}
            {friendData ? (
              <FrinedFind Key={isFriendCode} />
            ) : !isFriendCode? null : (
              <Text style={styles.textStyle}>
                해당 코드를 가진 친구가 없습니다. 코드를 확인해주세요.
              </Text>
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: '5%',
  },
  textinput: {
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
    backgroundColor: '#FAFAFA',
  },
  textStyle: {marginTop: '4%', color: '#989898'},
});
