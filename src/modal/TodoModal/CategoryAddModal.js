import React, {useState} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';
import SubmitButton from '../../component/SubmitButton';
import ColorSelectModal from './ColorSelectModal';

import {CategorySetting, RefetchSetting} from '../../store/Item';
import {
  categoryAdd,
  categoryDelete,
  categoryModify,
} from '../../service/TodoService';

import {useQueryClient} from 'react-query';

const {width} = Dimensions.get('window');
const closeIconSize = width * 0.07;
const arrowIconSize = width * 0.05;

export function CategoryAddModal({visable, closeModal}) {
  const [categoryTitle, setCategoryTitle] = useState(false);
  const [colorSelectModal, setColorSelectModal] = useState(false);
  const {setCategoryColor, CategoryColor} = CategorySetting();
  const queryClient = useQueryClient();
  return (
    <Modal transparent={true} visible={visable}>
      <ColorSelectModal
        visable={colorSelectModal}
        closeModal={() => setColorSelectModal(false)}
      />
      <KeyboardAvoidingView
        style={styles.centeredView}
        behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <TouchableWithoutFeedback>
          <View style={styles.modalView}>
            <View style={[styles.rowcontainer, {marginBottom: '5%'}]}>
              <Pressable onPress={closeModal}>
                <Image
                  style={{height: closeIconSize, width: closeIconSize}}
                  source={require('../../../assets/close.png')}
                />
              </Pressable>

              <Text style={styles.titleStyle}>카테고리 추가</Text>
            </View>

            <View style={[styles.rowcontainer, {marginBottom: '4%'}]}>
              <View
                style={[
                  styles.categorycontainer,
                  {backgroundColor: CategoryColor ? CategoryColor : '#CBCBCB'},
                ]}
              />
              <Text style={{fontSize: 16, fontWeight: 600}}>색상선택</Text>
              <TouchableOpacity onPress={() => setColorSelectModal(true)}>
                <Image
                  style={{
                    height: arrowIconSize,
                    width: arrowIconSize,
                    marginLeft: '10%',
                  }}
                  source={require('../../../assets/arrowRight.png')}
                />
              </TouchableOpacity>
            </View>
            <TextInput
              numberOfLines={1}
              maxLength={20}
              onChangeText={text => setCategoryTitle(text)}
              //   value={isContent}
              placeholder={'카테고리명을 입력해주세요.'}
              placeholderTextColor="#D1D1D2"
              // ref={inputRef}
              style={{height: 'auto'}}
              onKeyPress={e => {
                if (e.nativeEvent.key === 'Enter') {
                  e.preventDefault();
                }
              }}
            />
            <View
              style={{
                backgroundColor: '#F0F0F0',
                height: 1,
                marginBottom: '15%',
              }}
            />

            <SubmitButton
              state={categoryTitle}
              comment={'추가하기'}
              onPress={() => {
                const userDTO = {
                  name: categoryTitle,
                  colorCode: CategoryColor ? CategoryColor : '#CBCBCB',
                };
                console.log(userDTO);
                categoryAdd(userDTO).then(res => {
                  queryClient.refetchQueries('categoryListKey');
                  setCategoryTitle('');
                  setCategoryColor('');
                  closeModal();
                });
              }}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export function CategoryEditModal({visible, closeModal, categoryContent}) {
  const [categoryTitle, setCategoryTitle] = useState(false);
  const [colorSelectModal, setColorSelectModal] = useState(false);
  const {setCategoryColor, CategoryColor} = CategorySetting();
  const {setFetch} = RefetchSetting();
  const queryClient = useQueryClient();
  const {categoryId, categoryName, colorCode} = categoryContent;

  let today = new Date();
  today.setUTCHours(today.getUTCHours() + 9);
  const formattedToday = today.toISOString().split('T')[0];
  const month = formattedToday.substring(0, 7);

  return (
    <Modal transparent={true} visible={visible}>
      <ColorSelectModal
        visable={colorSelectModal}
        closeModal={() => setColorSelectModal(false)}
      />
      <KeyboardAvoidingView
        style={styles.centeredView}
        behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <TouchableWithoutFeedback>
          <View style={styles.modalView}>
            <View style={[styles.rowcontainer, {marginBottom: '5%'}]}>
              <Pressable
                onPress={() => {
                  closeModal(), setCategoryColor(false);
                }}>
                <Image
                  style={{height: closeIconSize, width: closeIconSize}}
                  source={require('../../../assets/close.png')}
                />
              </Pressable>

              <Text style={styles.titleStyle}>카테고리 편집</Text>
            </View>

            <View style={[styles.rowcontainer, {marginBottom: '4%'}]}>
              <View
                style={[
                  styles.categorycontainer,
                  {backgroundColor: CategoryColor ? CategoryColor : colorCode},
                ]}
              />
              <Text style={{fontSize: 16, fontWeight: 600}}>색상 선택</Text>
              <TouchableOpacity onPress={() => setColorSelectModal(true)}>
                <Image
                  style={{
                    height: arrowIconSize,
                    width: arrowIconSize,
                    marginLeft: '10%',
                  }}
                  source={require('../../../assets/arrowRight.png')}
                />
              </TouchableOpacity>
            </View>
            <TextInput
              multiline
              maxLength={20}
              onChangeText={text => setCategoryTitle(text)}
              //   value={isContent}
              placeholder={categoryName}
              placeholderTextColor="#D1D1D2"
              // ref={inputRef}
              style={{height: 'auto'}}
            />
            <View
              style={{
                backgroundColor: '#F0F0F0',
                height: 1,
                marginBottom: '5%',
              }}
            />

            <View
              style={[
                styles.rowcontainer,
                {
                  justifyContent: 'space-between',

                  marginBottom: '5%',
                },
              ]}>
              <Pressable
                onPress={() => {
                  categoryDelete(categoryId).then(res => {
                    //month,daily리스트도 갱신해주기
                    queryClient.refetchQueries('categoryListKey');
                    queryClient.refetchQueries('showDailyTodoKey');
                    queryClient.refetchQueries('showTodayTodoKey'),
                      closeModal();
                  });
                }}>
                <View style={[styles.opctionButton, {backgroundColor: 'red'}]}>
                  <Text style={[styles.opctionText, {color: 'white'}]}>
                    삭제하기
                  </Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => {
                  const userDTO = {
                    name: categoryTitle ? categoryTitle : null,
                    colorCode: CategoryColor ? CategoryColor : colorCode,
                  };

                  categoryModify(categoryId, userDTO)
                    .then(() => {
                      queryClient.refetchQueries('categoryListKey');
                      queryClient.refetchQueries('showDailyTodoKey');
                      queryClient.refetchQueries('showTodayTodoKey');
                      setFetch(new Date().getTime());
                      closeModal();
                    })
                    .catch(error => {
                      // 오류 처리
                      console.error(
                        '카테고리 수정 중 오류가 발생했습니다:',
                        error,
                      );
                    });
                  console.log('적용하기 카테고리 API', userDTO, categoryId);
                }}>
                <View
                  style={[styles.opctionButton, {backgroundColor: '#1DC2FF'}]}>
                  <Text style={[styles.opctionText, {color: 'white'}]}>
                    적용하기
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
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
    flex: 0.9,
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 19,
    color: 'black',
  },
  categorycontainer: {
    height: '100%',
    width: '2%',
    borderRadius: 2,
    marginRight: '3%',
    alignItems: 'center',
  },
  opctionButton: {
    justifyContent: 'flex-end',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    paddingHorizontal: '17%',
  },
});
