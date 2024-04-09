import {useState, useEffect, memo} from 'react'; // memo 추가
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {TodoFrameSummary} from '../../component/TodoFrame';
import {SelectDateModal} from '../../modal/TodoModal/SelectDateModal';
import {useQueryClient} from 'react-query';
import {showDailyTodo} from '../../service/TodoService';
import {RefetchSetting, TodoDetail, TodoDateSetting} from '../../store/Item';
import {useIsFocused} from '@react-navigation/native';
import monthButtonImage from '../../../assets/monthButton.png';

const {width} = Dimensions.get('window');

const buttonIcon = width * 0.07;
// 1. Date 객체 생성

// CustomDayHeaderComponent를 React.memo로 감싸서 최적화
const CustomDayHeaderComponent = memo(
  ({setIsModalVisable, dailyShow, selectDayFunction, date}) => {
    console.log(date);
    const dateObject = new Date(date);
    const {setStartDate} = TodoDateSetting();

    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1; // 월은 0부터 시작하기 때문에 1을 더합니다.
    const day = dateObject.getDate();
    const formattedDate = `${year}년 ${month}월 ${day}일`;
    const formattedDateButton = `${year}-${month}-${day}`;

    let today = new Date();
    today.setUTCHours(today.getUTCHours() + 9);
    const formattedToday = today.toISOString().split('T')[0];
    console.log(formattedToday);

    return (
      <View
        style={[
          styles.rowcontainer,
          {
            marginBottom: '3%',
            justifyContent: 'space-between',
            marginTop: '5%',
            marginLeft: '6%',
          },
        ]}>
        <View style={[styles.rowcontainer]}>
          <Text style={{fontSize: 17, fontWeight: 600}}>{formattedDate}</Text>
          <TouchableOpacity
            onPress={() => {
              setIsModalVisable(true);
            }}
            style={{marginLeft: '3%'}}>
            <Image
              style={{height: buttonIcon, width: buttonIcon}}
              source={require('../../../assets/chevronRight.png')}
            />
          </TouchableOpacity>
        </View>

        <View style={[styles.rowcontainer, {marginLeft: '26.5%'}]}>
          <TouchableOpacity
            style={{
              backgroundColor: '#ECFBFF',
              padding: '8%',
              borderRadius: 6,
              marginRight: '5%',
            }}
            onPress={() => {
              selectDayFunction(formattedToday);
            }}>
            <Text style={{color: '#28C3EC'}}>오늘</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              dailyShow();
              setStartDate('2024-03-17');
            }}>
            <Image
              style={{height: buttonIcon, width: buttonIcon}}
              source={monthButtonImage}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  },
);

export default function DailyView({
  date,
  dailyShow,
  selectDay,
  setIsSelectedDay,
  expImageToast,
}) {
  const [isModalVisable, setIsModalVisable] = useState(false);
  const [showDailyTodoQuery, setShowDailyTodoQuery] = useState('');
  const [dayState, setDayState] = useState(null);
  const queryClient = useQueryClient();
  const {FetchData} = RefetchSetting();
  const {setTodoAdd} = TodoDetail();
  const {setStartDate} = TodoDateSetting();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (date) {
      setStartDate(date);

      const fetchData = async () => {
        try {
          await queryClient.fetchQuery('showDailyTodoKey', () =>
            showDailyTodo(date),
          );
          const getTodoData = queryClient.getQueryData('showDailyTodoKey');
          setShowDailyTodoQuery(getTodoData);
        } catch (error) {
          console.error('Error fetching daily todo data:', error);
        }
      };

      if (isFocused) {
        setTodoAdd(true, date);
      } else {
        setTodoAdd(false, '');
      }

      fetchData();
    }

    return () => {
      setTodoAdd(false, '');
    };
  }, [FetchData, setTodoAdd, date, isFocused]);

  function closeModalFunction() {
    setIsModalVisable(false);
  }

  return (
    <View>
      <SelectDateModal
        visable={isModalVisable}
        closeModal={closeModalFunction}
        selectDayFunction={selectDay}
        selectDay={date}
        setIsSelectedDay={setIsSelectedDay}
      />
      {/* 최적화된 CustomDayHeaderComponent 사용 */}
      <CustomDayHeaderComponent
        setIsModalVisable={setIsModalVisable}
        dailyShow={dailyShow}
        selectDayFunction={selectDay}
        date={date}
      />

      <View style={{paddingHorizontal: '6%'}}>
        <TodoFrameSummary
          todoData={showDailyTodoQuery}
          expImageToast={expImageToast}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rowcontainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },

  categorycontainer: {
    height: '120%',
    width: '2%',
    borderRadius: 2,
    marginRight: '3%',
    alignItems: 'center',
  },
});
