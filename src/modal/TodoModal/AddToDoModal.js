import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  Modal,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {TodoDateSetting, RefetchSetting, TodoDetail} from '../../store/Item';
import {useQueryClient} from 'react-query';
import CategorySelectModal from './CategorySelectModal';
import {todoAdd} from '../../service/TodoService';

import {formatDataForAPI} from '../../component/extractFromDate';

const {width, height} = Dimensions.get('window');
const closeIconSize = width * 0.07;
const arrowIconSize = width * 0.05;

export default function AddToDoModal({visable, closeModal}) {
  const [isCalendalState, setIsCalendarState] = useState(false);
  const [isCategoryModal, setCategoryModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const {setFetch} = RefetchSetting();
  const {
    setCategoryId,
    categoryContent,
    setNewContent,
    setMarkOn,
    todoDateSettingCleanup,
    NewContent,
    CategotyId,
  } = TodoDateSetting();
  const categoryList = queryClient.getQueryData('categoryListKey');
  const {TodoAddDateCheck, TodoAddDate} = TodoDetail();
  let defaultCategoryID = '';

  //추가하면 업데이트 시켜줘야하므로
  let today = new Date();
  today.setUTCHours(today.getUTCHours() + 9);
  const formattedToday = today.toISOString().split('T')[0];
  const month = formattedToday.substring(0, 7);

  let {categoryName, colorCode} = categoryContent;
  const todoDateSetting = TodoDateSetting();

  async function cleanUp() {
    await todoDateSettingCleanup();
    if (categoryList) {
      const defaultCategory = categoryList.categoryList.find(
        category => category.categoryName === '미분류',
      );
      const defaultCategoryID = defaultCategory
        ? defaultCategory.categoryId
        : null;

      setCategoryId(defaultCategoryID);
    }
    console.log(CategotyId, 'cleanUp이후 적용이되는지 확인');
  }

  function categoryinit() {
    if (categoryList && !!!categoryName) {
      defaultCategoryID = categoryList.categoryList.find(
        category => category.categoryName === '미분류',
      )?.categoryId;
      setCategoryId(defaultCategoryID);
    }
  }

  useEffect(() => {
    categoryinit();
    if (CategotyId && !visable) {
      return () => {
        cleanUp();
      };
    }
  }, [categoryList, visable]);

  const handleLayout = () => {
    // onLayout 이벤트에서 input에 자동으로 포커스를 맞춥니다.
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  const calendarStatetoggle = () => {
    setIsCalendarState(previousState => !previousState);
  };

  const completeButton = () => {
    const formatData = formatDataForAPI(
      todoDateSetting,
      isCalendalState,
      NewContent,
      TodoAddDateCheck,
      TodoAddDate,
    );

    console.log('TodoModal', formatData);

    if (formatData.length === 0) {
      console.log('error 데이터 없음');
    } else {
      setLoading(true);
      todoAdd(formatData)
        .then(res => {
          console.log(res, '할일등록 완료 및 cleanUP');
          queryClient.refetchQueries('showmonth');
          queryClient.refetchQueries('showTodayTodoKey');
          setFetch(new Date().getTime());
          setLoading(false);
          cleanUp();
          closeModal();
        })

        .catch(error => {
          setLoading(false);
          Alert.alert('네트워크를 확인해주세요', '', [
            {
              text: '확인',
              onPress: () => closeModal(),
            },
          ]);
        });
    }
  };

  return (
    <View style={[styles.centeredView, {display: visable ? 'flex' : 'none'}]}>
      <Modal transparent={true} visible={loading}>
        <ActivityIndicator style={{marginTop: '60%'}} size="large" />
      </Modal>
      <Modal transparent={true} visible={visable} animationType="slide">
        <CategorySelectModal
          visable={isCategoryModal}
          closeModal={() => setCategoryModal(false)}
          setCategoryId={setCategoryId}
        />
        <View style={styles.containerView}>
          <KeyboardAvoidingView
            style={styles.modalView}
            behavior={Platform.OS === 'ios' ? 'padding' : null}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View>
                <View style={[styles.rowcontainer, {marginBottom: '5%'}]}>
                  <Pressable
                    onPress={() => {
                      cleanUp();
                      closeModal();
                    }}>
                    <Image
                      style={{height: closeIconSize, width: closeIconSize}}
                      source={require('../../../assets/close.png')}
                    />
                  </Pressable>

                  <Text style={styles.titleStyle}>할일 추가하기</Text>
                </View>

                <Pressable
                  style={[styles.rowcontainer, {marginBottom: '4%'}]}
                  onPress={() => setCategoryModal(true)}>
                  <View
                    style={[
                      styles.categorycontainer,
                      {backgroundColor: colorCode ? colorCode : '#CBCBCB'},
                    ]}
                  />
                  <Text style={{fontSize: 16, fontWeight: 600}}>
                    {categoryName ? categoryName : '미분류'}
                  </Text>
                  <Pressable onPress={() => setCategoryModal(true)}>
                    <Image
                      style={{
                        height: arrowIconSize,
                        width: arrowIconSize,
                        marginLeft: '10%',
                      }}
                      source={require('../../../assets/arrowRight.png')}
                    />
                  </Pressable>
                </Pressable>

                <TextInput
                  multiline
                  maxHeight={'25%'} //ios
                  maxLength={100}
                  onChangeText={text => setNewContent(text)}
                  //   value={isContent}
                  placeholder={'새 할일을 입력해주세요'}
                  placeholderTextColor="#D1D1D2"
                  ref={inputRef}
                  style={{height: 'auto'}}
                />

                <View
                  style={{
                    backgroundColor: '#F0F0F0',
                    height: 1,
                    marginBottom: '4%',
                  }}
                />
                <TouchableOpacity
                  style={[
                    styles.rowcontainer,
                    {
                      backgroundColor: isCalendalState ? '#ECFBFF' : '#FAFAFA',
                      borderRadius: 6,
                      width: '50%',
                      padding: '2%',
                      borderWidth: 2,
                      borderColor: isCalendalState ? '#1DC2FF' : 'white',
                      marginBottom: '4%',
                    },
                  ]}
                  onPress={calendarStatetoggle}>
                  {!isCalendalState ? (
                    <Image
                      source={require('../../../assets/calendarUnCheck.png')}
                      style={{
                        height: arrowIconSize,
                        width: arrowIconSize,
                        marginRight: '2%',
                      }}
                    />
                  ) : (
                    <Image
                      source={require('../../../assets/calendarCheck.png')}
                      style={{
                        height: arrowIconSize,
                        width: arrowIconSize,
                        marginRight: '2%',
                      }}
                    />
                  )}

                  <Text
                    style={{color: !isCalendalState ? '#7E7E7E' : '#3F3F3F'}}>
                    이 할일을 캘린더에 표시
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>

            <View
              style={[
                styles.rowcontainer,
                {
                  justifyContent: 'space-between',
                  marginHorizontal: '2%',
                  marginBottom: '5%',
                },
              ]}>
              <Pressable
                onPress={() => {
                  setMarkOn(isCalendalState);
                  navigation.navigate('AddTodoDetail', {
                    CategotyId: CategotyId,
                  });
                  closeModal();
                }}>
                <View
                  style={[styles.opctionButton, {backgroundColor: '#ECFBFF'}]}>
                  <Text style={[styles.opctionText, {color: '#1DC2FF'}]}>
                    세부옵션 설정
                  </Text>
                </View>
              </Pressable>
              <Pressable onPress={completeButton} disabled={!NewContent}>
                <View
                  style={[
                    styles.opctionButton,
                    {backgroundColor: !NewContent ? '#CBCBCB' : '#1DC2FF'},
                  ]}>
                  <Text style={[styles.opctionText, {color: 'white'}]}>
                    추가하기
                  </Text>
                </View>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    position: 'absolute',
    height: height,
    width: width,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  containerView: {flex: 1, justifyContent: 'flex-end', alignItems: 'center'},
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
    height: '120%',
    width: '2%',
    borderRadius: 2,
    marginRight: '3%',
    alignItems: 'center',
  },
  opctionButton: {
    justifyContent: 'flex-end',
    borderRadius: 8,
    padding: 20,
    paddingHorizontal: '10%',
    alignItems: 'center',
  },
  opctionText: {fontSize: 16},
});
