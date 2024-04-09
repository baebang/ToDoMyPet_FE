import React, {useState} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
} from 'react-native';
import SubmitButton from '../../component/SubmitButton';
import eggGrowth from '../../component/eggGrowth';
import {petAdopt, setEvolution} from '../../service/PetService';
import {useQueryClient} from 'react-query';
import {useNavigation} from '@react-navigation/native';
import {
  countIncreaseEvovle,
  achievementCondition,
} from '../../service/MyPageService';
import {mainPageShow} from '../../service/MainService';

const {width} = Dimensions.get('window');
const closeIconSize = width * 0.07;
const eggIconSize = width * 0.04;
const petIconSize = width * 0.24;

//GetavailablePetKey

export default function PetEvolveInSelect({
  visable,
  closeModal,
  petdata,
  initialized,
  setEvolveInfo,
}) {
  const [selectedPetIndex, setSelectedPetIndex] = useState(null);
  const [selectedPetInfo, setselectedPetInfo] = useState(null);
  const [renameModal, setRenameModal] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [renameContetn, setRenameContetn] = useState('');
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  const petList = (pet, index) => {
    const isSelected = selectedPetIndex === index;
    return (
      <TouchableOpacity
        key={pet.id}
        style={{
          borderColor: isSelected ? '#1DC2FF' : '#F0F0F0',
          borderRadius: 20,
          borderWidth: 2,
          backgroundColor: isSelected ? '#ECFBFF' : '#FAFAFA',
          marginRight: 10,
          padding: 20,
        }}
        onPress={() => setSelectedPetIndex(index)}>
        <View style={{flexDirection: 'row', position: 'absolute', padding: 6}}>
          <Image
            style={{height: eggIconSize, width: eggIconSize, marginRight: 10}}
            source={{
              uri: isSelected
                ? eggGrowth(pet.petGrade, 'blue')
                : eggGrowth(pet.petGrade, 'gray'),
            }}
          />
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'DungGeunMo',
              color: isSelected ? '#1DC2FF' : '#B2B2B2',
            }}>
            {/* 스타팅펫 하는 중이거나 이미 펫을 가지고 있는 경우 */}
            {initialized || pet.getOrNot ? pet.petName : '???'}
          </Text>
        </View>
        <Image
          source={{uri: pet.petImageUrl}}
          style={{
            width: petIconSize,
            height: petIconSize,
            tintColor: initialized || pet.getOrNot ? null : '#CBCBCB',
          }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Modal transparent={true} visible={visable}>
        <View
          style={[
            styles.centeredView,
            {display: renameModal ? 'none' : 'flex'},
          ]}>
          <View style={styles.modalView}>
            <View style={[styles.rowcontainer, {marginBottom: '5%'}]}>
              <Text style={styles.titleStyle}>펫 선택하기</Text>
            </View>
            <View style={{alignItems: 'center', marginBottom: '5%'}}>
              {initialized ? (
                <Text style={styles.subTitleStyle}>
                  함께 성장하고 기뻐할 {'\n'}당신의 펫을 선택해주세요!
                </Text>
              ) : (
                <Text style={styles.subTitleStyle}>
                  당신의 펫, 어떤 모습으로 {'\n'}진화하게 될까요?
                </Text>
              )}
            </View>

            <ScrollView horizontal={true} style={{marginBottom: '5%'}}>
              {petdata && petdata.length > 0 ? (
                petdata.map((pet, index) => petList(pet, index))
              ) : (
                <Text>펫 데이터가 없습니다.</Text>
              )}
            </ScrollView>

            <SubmitButton
              state={selectedPetIndex !== null}
              comment={'선택하기'}
              onPress={() => {
                if (initialized) {
                  //초기펫 선택일경우
                  setselectedPetInfo(petdata[selectedPetIndex]);
                  setRenameModal(true);
                } else {
                  //진화일경우
                  const EvolveInfoDTO = {
                    seq: setEvolveInfo.petSeq,
                    signatureCode: setEvolveInfo.petSignatureCode,
                    selectedPetId: petdata[selectedPetIndex].id,
                    petName: setEvolveInfo.petName,
                  };
                  console.log(EvolveInfoDTO);

                  setEvolution(EvolveInfoDTO)
                    .then(res => {
                      //진화하기

                      countIncreaseEvovle().then(res => {
                        const userDTO = {
                          type: 'EVOLUTION',
                          condition: res,
                        };
                        achievementCondition(userDTO);
                      });
                      queryClient.refetchQueries('AdoptedPetListQueryKey');
                      //여기에
                      queryClient.fetchQuery(
                        'MainPageShowQueryKey',
                        mainPageShow,
                      );
                      navigation.navigate('EvolutionFinal', {
                        petInfo: res,
                        petGrade: petdata[0].petGrade,
                        petMaxExperiencePoint: 10,
                      });
                      closeModal();
                    })
                    .catch(error => console.error(error));
                }
              }}
            />
          </View>
        </View>

        {/* 이름정하기 */}
        {selectedPetInfo ? (
          <View
            style={[
              styles.centeredView,
              {display: renameModal ? 'flex' : 'none'},
            ]}>
            <KeyboardAvoidingView
              style={styles.modalView}
              behavior={Platform.OS === 'ios' ? 'padding' : null}>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View>
                  <View style={[styles.rowcontainer, {marginBottom: '5%'}]}>
                    <Pressable
                      onPress={() => {
                        setRenameModal(false);
                        Keyboard.dismiss();
                      }}>
                      <Image
                        style={{height: closeIconSize, width: closeIconSize}}
                        source={require('../../../assets/arrow_back.png')}
                      />
                    </Pressable>

                    <Text style={styles.titleStyle}>펫 이름 설정하기</Text>
                  </View>
                  <View style={{alignItems: 'center'}}>
                    <View
                      style={{
                        paddin: '20',
                        backgroundColor: '#FAFAFA',
                        borderRadius: 20,
                        alignItems: 'center',
                        width: '70%',
                      }}>
                      <Image
                        style={{width: petIconSize, height: petIconSize}}
                        source={{
                          uri: selectedPetInfo.petImageUrl,
                        }}
                      />
                    </View>
                    <View
                      style={{
                        marginTop: '4%',
                        marginBottom: '4%',
                        width: '50%',
                      }}>
                      <TextInput
                        style={[
                          styles.input,
                          {borderColor: isFocused ? 'black' : '#CBCBCB'},
                        ]}
                        placeholder={selectedPetInfo.petName}
                        placeholderTextColor="#CBCBCB"
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onChangeText={text => setRenameContetn(text)}
                        value={renameContetn}
                        maxLength={7}
                      />
                      <Pressable
                        style={{
                          position: 'absolute',
                          left: '85%',
                          top: '30%',
                          display: renameContetn ? 'flex' : 'none',
                        }}
                        onPress={() => setRenameContetn('')}>
                        <Image
                          style={{
                            height: eggIconSize,
                            width: eggIconSize,
                          }}
                          source={require('../../../assets/close.png')}
                        />
                      </Pressable>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: Platform.OS ? '7%' : null,
                }}>
                <TouchableOpacity
                  style={[
                    styles.buttonStyle,
                    {
                      borderColor: '#1DC2FF',
                      borderWidth: 2,
                      backgroundColor: '#ECFBFF',
                    },
                  ]}
                  onPress={async () => {
                    const userDto = {
                      petId: selectedPetInfo.id,
                      name: selectedPetInfo.petName,
                      renameOrNot: false,
                    };

                    console.log(userDto);

                    try {
                      const res = await petAdopt(userDto);
                      queryClient.refetchQueries('getMainPetKey');
                      queryClient.fetchQuery(
                        'MainPageShowQueryKey',
                        mainPageShow,
                      );
                      queryClient.refetchQueries('myPageQueryKey');
                      navigation.navigate('BottomNavigation');
                      closeModal();
                    } catch (error) {
                      // 에러 처리
                      console.error('Error adopting pet:', error);
                    }
                  }}>
                  <Text style={[styles.sudmittext, {color: '#1DC2FF'}]}>
                    건너뛰기
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.buttonStyle,
                    {
                      backgroundColor: renameContetn ? '#1DC2FF' : '#CBCBCB',
                    },
                  ]}
                  disabled={!renameContetn}
                  onPress={async () => {
                    const userDto = {
                      petId: selectedPetInfo.id,
                      name: renameContetn,
                      renameOrNot: false,
                    };

                    console.log(userDto);

                    try {
                      const res = await petAdopt(userDto);
                      queryClient.refetchQueries('getMainPetKey');
                      queryClient.fetchQuery(
                        'MainPageShowQueryKey',
                        mainPageShow,
                      );
                      queryClient.refetchQueries('myPageQueryKey');
                      navigation.navigate('BottomNavigation');
                      closeModal();
                    } catch (error) {
                      // 에러 처리
                      console.error('Error adopting pet:', error);
                    }
                  }}>
                  <Text style={[styles.sudmittext, {color: 'white'}]}>
                    적용하기
                  </Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        ) : null}
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',

    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',

    padding: '5%',
    width: '100%',
    height: 'auto',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  rowcontainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  titleStyle: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 19,
    color: 'black',
  },
  input: {
    borderWidth: 2,

    padding: 10,

    borderRadius: 4,
    fontFamily: 'DungGeunMo',
    width: '100%',
  },
  buttonStyle: {
    height: width / 7,
    width: width / 2.4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sudmittext: {
    // 원하는 버튼 텍스트 색상으로 변경
    fontSize: 18,
  },
  subTitleStyle: {fontSize: 19, fontFamily: 'DungGeunMo', textAlign: 'center'},
});
