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
  ScrollView,
} from 'react-native';
import {CategoryAddModal, CategoryEditModal} from './CategoryAddModal';
import {useQueryClient} from 'react-query';
import {TodoDateSetting} from '../../store/Item';

const {width} = Dimensions.get('window');
const closeIconSize = width * 0.07;
const arrowIconSize = width * 0.05;

const CategoryDetail = ({
  date,
  setCategoryContent,
  setCategoryModal,
  closeModal,
}) => {
  const {setCategoryId, setcategoryContent} = TodoDateSetting();
  const {categoryName, colorCode, categoryId} = date;
  return (
    <TouchableOpacity
      key={date}
      style={[
        styles.rowcontainer,
        styles.categoryContainer,
        {justifyContent: 'space-between'},
      ]}
      onPress={() => {
        setCategoryId(categoryId);
        setcategoryContent(categoryName, colorCode);

        closeModal();
      }}>
      <View style={[styles.rowcontainer]}>
        <View
          style={[
            styles.categoryContent,
            {
              backgroundColor: date.colorCode,
            },
          ]}
        />

        <Text style={{fontSize: 16, fontWeight: 600, color: 'black'}}>
          {date.categoryName}
        </Text>
      </View>

      {categoryName !== '미분류' ? (
        <View style={[styles.rowcontainer]}>
          <TouchableOpacity
            onPress={() => {
              setCategoryModal(true);
              setCategoryContent(date);
            }}>
            <Image
              style={{
                height: arrowIconSize,
                width: arrowIconSize,
              }}
              source={require('../../../assets/arrowRight.png')}
            />
          </TouchableOpacity>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

export default function CategorySelectModal({visable, closeModal}) {
  const [isAddModal, setAddModal] = useState(false);
  const [isCategoryModify, setCategoryModify] = useState(false);
  const [categoryContent, setCategoryContent] = useState('');
  const queryClient = useQueryClient();
  const categoryList = queryClient.getQueryData('categoryListKey');

  const renderCategories = () => {
    return categoryList.categoryList.map(category => (
      <CategoryDetail
        key={category.categoryId}
        date={category}
        setCategoryContent={setCategoryContent}
        setCategoryModal={setCategoryModify}
        closeModal={closeModal}
      />
    ));
  };

  return (
    <View>
      <Modal transparent={true} visible={visable}>
        <CategoryEditModal
          visible={isCategoryModify}
          closeModal={() => setCategoryModify(false)}
          categoryContent={categoryContent}
        />
        <CategoryAddModal
          visable={isAddModal}
          closeModal={() => setAddModal(false)}
        />

        <View
          style={[
            styles.centeredView,
            {display: isAddModal || isCategoryModify ? 'none' : 'flex'},
          ]}>
          <View style={[styles.modalView]}>
            <View style={[styles.rowcontainer, {marginBottom: '7%'}]}>
              <Pressable onPress={closeModal}>
                <Image
                  style={{height: closeIconSize, width: closeIconSize}}
                  source={require('../../../assets/close.png')}
                />
              </Pressable>

              <Text style={styles.titleStyle}>카테고리 선택</Text>
            </View>
            <ScrollView style={{height: '30%'}}>
              {renderCategories()}
            </ScrollView>

            <TouchableOpacity
              style={[styles.categoryAdd]}
              onPress={() => {
                setAddModal(true);
                // closeModal();
              }}>
              <Text style={{fontSize: 16, fontWeight: 600, color: '#5F5F5F'}}>
                + 새 카테고리 추가하기
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
  categoryContainer: {
    borderColor: '#F0F0F0',
    padding: '5%',
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: '3%',
  },
  categoryAdd: {
    borderColor: '#F0F0F0',
    padding: '5%',
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    marginTop: '3%',
  },
  categoryContent: {
    width: 10, // 고정된 너비 값
    height: '10%', // 부모 요소의 높이에 대한 상대적인 크기
    aspectRatio: 0.5, // 가로 세로 비율 유지
    borderRadius: 2,
    marginRight: '5%',
  },
});
