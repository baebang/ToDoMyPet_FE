import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Text,
  Pressable,
  Image,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';

import {AdoptedPetInfoDetail} from '../../service/PetService';

import SubmitButton from '../../component/SubmitButton';
import {petRename} from '../../service/PetService';
import {useQueryClient, useQuery} from 'react-query';
import eggGrowth from '../../component/eggGrowth';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const iconSize = screenWidth / 3.5;

const tropyViewSize = screenWidth * 0.4;
const modalView = screenWidth * 0.83;
const eggIconSize = screenWidth * 0.04;

const closeIconSize = screenWidth * 0.07;

export function AchievementsModal({state, closeModal, seqnumber, signature}) {
  const [isModifyModal, setIsModifyModal] = useState(false);
  const [isRemane, setIsRename] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const queryClient = useQueryClient();
  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery(['AdoptedPetInfoDetailKey', seqnumber], () =>
    AdoptedPetInfoDetail(seqnumber),
  );

  // useEffect(() => {
  //   // 사용자 데이터를 가져오는 useEffect
  // }, [seqnumber]);

  if (isLoading) {
    return <Text>Loading...</Text>; // 로딩 중일 때 표시할 UI
  }

  if (isError) {
    return <Text>Error fetching data</Text>; // 에러 발생 시 표시할 UI
  }
  const {description, grade, imageUrl, name, personality, type, petOriginName} =
    userData;

  function ModifyModalFunction() {
    setIsModifyModal(true);
  }

  function closeModalButtion() {
    closeModal();
    setIsModifyModal(false);
  }

  function renameCommit() {
    const renameDTO = {
      signatureCode: signature,
      rename: isRemane,
    };
    console.log('===renameDTO', renameDTO);

    petRename(renameDTO)
      .then(() => {
        queryClient
          .refetchQueries('MainPageShowQueryKey')
          .then(closeModalButtion);
        queryClient.refetchQueries('AdoptedPetInfoKey');
        queryClient.refetchQueries('AdoptedPetListQueryKey');
        queryClient.refetchQueries('myPostListQueryKey');
        queryClient.refetchQueries('viewFeedKey');
        queryClient.refetchQueries(['AdoptedPetInfoDetailKey', seqnumber]);
      })
      .catch(() => console.error);
  }

  const personalityTexts = {
    CALM: '덤덤',
    CHEERFUL: '명랑',
    GLUTTON: '먹보',
    PROTEIN: '프로틴',
    PURE_EVIL: '순수악',
  };

  const gradeTexts = {
    BABY: '아기',
    CHILDREN: '어린이',
    TEENAGER: '청소년',
    ADULT: '성인',
  };

  const petType = {
    BREAD: '반죽반죽',
    GHOST: '유령',
    CREAM: '크림',
    OVERCOOKED_BREAD: '과발효된 빵',
    COOKIE: '쿠키',
    ZOMBIE: '좀비',
    CURSE: '저주',
    SLASHER: '슬래셔',
    GANG: '갱단',
    CUP: '컵',
    DUST: '먼지',
    MELON: '멜론',
    PUDDING: '푸딩',
    HOT_CAKE: '핫케이크',
    CHRISTMAS: '크리스마스',
    FIRE: '불꽃',
    ICE: '얼음',
    RAINBOW: '무지개',
    MILLIONAIRE: '백만장자',
    GOLD: '황금',
    SLEEPY: '슬리피',
    DEVIL: '악마',
    ANGEL: '천사',
    FAIRY: '요정',
    MAGICAL_GIRL: '마법소녀',
    CLOVER: '클로버',
    CHERRY_BLOSSOM: '벚꽃',
  };

  const eggImage = eggGrowth(grade);
  const getGradeText = gradeTexts[grade] || 'Unknown Grade';
  const getPersonalityText =
    personalityTexts[personality] || 'Unknown Personality';

  const getPetType = petType[type] || 'Unknown Type';

  return (
    <Modal
      // animationType="slide" 할까말까 고민중
      transparent={true}
      visible={state}>
      {!isModifyModal ? (
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{flexDirection: 'row'}}>
              <Image
                style={{
                  height: eggIconSize,
                  width: eggIconSize,
                  marginRight: '3%',
                }}
                source={{uri: eggImage}}></Image>
              <Text style={{fontFamily: 'DungGeunMo'}}>{name}</Text>
              <TouchableOpacity
                style={{marginLeft: '3%'}}
                onPress={ModifyModalFunction}>
                <Image
                  style={{
                    height: eggIconSize,
                    width: eggIconSize,
                    marginRight: '3%',
                  }}
                  source={require('../../../assets/modifyname.png')}></Image>
              </TouchableOpacity>
            </View>

            <View style={styles.tropyView}>
              <Image
                style={{width: iconSize, height: iconSize}}
                source={{
                  uri: imageUrl,
                }}></Image>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <View style={styles.textContainer}>
                  <Text style={{color: '#1DC2FF'}}>개체</Text>
                </View>

                <Text>{petOriginName}</Text>
              </View>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <View style={styles.textContainer}>
                  <Text style={{color: '#1DC2FF'}}>성장단계</Text>
                </View>

                <Text>{getGradeText}</Text>
              </View>

              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <View style={styles.textContainer}>
                  <Text style={{color: '#1DC2FF'}}>성격</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text>{getPersonalityText}</Text>
                </View>
              </View>
            </View>
            <View style={styles.tropycontent}>
              <Text>{description}</Text>
            </View>

            <SubmitButton
              state={true}
              comment={'닫기'}
              onPress={closeModalButtion}
            />
          </View>
        </View>
      ) : (
        <KeyboardAvoidingView
          style={styles.bottomView}
          behavior={Platform.OS === 'ios' ? 'padding' : null}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.bottomModal}>
              <View style={{flexDirection: 'row', marginBottom: '7%'}}>
                <Pressable onPress={closeModalButtion}>
                  <Image
                    style={{height: closeIconSize, width: closeIconSize}}
                    source={require('../../../assets/close.png')}></Image>
                </Pressable>

                <Text style={styles.titleStyle}>펫 이름 수정하기</Text>
              </View>

              <View style={styles.tropyView}>
                <Image
                  style={{width: iconSize, height: iconSize}}
                  source={{
                    uri: imageUrl,
                  }}></Image>
              </View>
              <TextInput
                style={[
                  styles.input,
                  {borderColor: isFocused ? 'black' : '#CBCBCB'},
                ]}
                placeholder="펫 이름을 7자 이내로 지어주세요"
                placeholderTextColor="#D1D1D2"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChangeText={text => {
                  setIsRename(text);
                }}
                maxLength={7}
              />

              <View style={{marginBottom: !isFocused ? 24 : 12}}>
                <SubmitButton
                  state={isRemane}
                  comment={'결정'}
                  onPress={renameCommit}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: '5%',
    width: modalView,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  tropyView: {
    height: tropyViewSize,
    backgroundColor: '#FAFAFA',
    borderRadius: 20,
    marginTop: '3%',
    marginBottom: '4%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    borderRadius: 6,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#1DC2FF',
  },
  buttonClose: {
    backgroundColor: '#1DC2FF',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textContainer: {
    backgroundColor: '#ECFBFF',
    paddingHorizontal: 10, // 테두리 둥글기를 보여주기 위해 여백 추가
    paddingVertical: 5,
    borderRadius: 4,
    marginBottom: '10%',
  },

  tropycontent: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    padding: '6%',
    marginTop: '7%',
    marginBottom: '7%',
  },
  titleStyle: {
    flex: 0.9,
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 19,
  },
  bottomView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomModal: {
    backgroundColor: 'white',
    width: '100%',
    height: 'auto',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,

    paddingTop: '6%',
    paddingHorizontal: '5%',
  },
  input: {
    borderWidth: 2,

    padding: 10,

    borderRadius: 4,
    fontFamily: 'DungGeunMo',
    width: '100%',
    marginTop: '5%',
    marginBottom: '5%',
  },
});
