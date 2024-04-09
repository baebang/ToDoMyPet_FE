import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {LocaleConfig, Calendar} from 'react-native-calendars';
import {useQuery} from 'react-query';
import {
  startOfDay,
  endOfDay,
  differenceInDays,
  addDays,
  format,
  isWithinInterval,
} from 'date-fns';
import {showMonthTodo} from '../../service/TodoService';
import {ko} from 'date-fns/locale';
import {holidayShow} from '../../service/TodoService';

LocaleConfig.locales['fr'] = {
  monthNames: [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ],
  monthNamesShort: [
    'Janv.',
    'Févr.',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juil.',
    'Août',
    'Sept.',
    'Oct.',
    'Nov.',
    'Déc.',
  ],
  dayNames: [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: "Aujourd'hui",
};

LocaleConfig.defaultLocale = 'fr';

export default function CalendarView({dailyShow, selectDay}) {
  const {width} = Dimensions.get('window');
  const buttonIcon = width * 0.07;

  const today = new Date();
  today.setUTCHours(today.getUTCHours() + 9);
  const formattedToday = today.toISOString().split('T')[0];
  const month = formattedToday.substring(0, 7);
  const [monthKey, setMonthKey] = useState(month);
  const [year, months] = monthKey.split('-');
  const [monthTodo, setMonthTodo] = useState(null);
  // const [holiday, setHoliday] = useState(null);
  // let transformedDataArray = [];

  // holidayShow(year, months).then(res => {
  //   const parsedData = JSON.parse(res);
  //   const bodyData = parsedData.response.body.items.item;

  //   // bodyData가 배열이 아니라면 단일 객체로 처리
  //   if (!Array.isArray(bodyData)) {
  //     transformedDataArray = {
  //       categoryBgColorCode: '#D6D6E7',
  //       categoryTextColorCode: '#171756',
  //       todoContent: bodyData.dateName,
  //       todoEndedAt: null,
  //       todoStartedAt: formatDate(bodyData.locdate),
  //     };

  //     // 변환된 데이터를 배열에 저장
  //     transformedDataArray = [transformedData];

  //     // 변환된 데이터 배열을 상태에 저장
  //     setHoliday([transformedData]);
  //     return;
  //   }

  //   const transformedData = bodyData.map(item => {
  //     return {
  //       categoryBgColorCode: '#D6D6E7',
  //       categoryTextColorCode: '#171756',
  //       todoContent: item.dateName,
  //       todoEndedAt: null,
  //       todoStartedAt: formatDate(item.locdate),
  //     };
  //   });

  //   // // 변환된 데이터를 배열에 저장
  //   transformedDataArray = transformedData;

  //   // // 변환된 데이터 배열을 상태에 저장
  //   setHoliday(transformedData);
  // });

  // function formatDate(locdate) {
  //   const year = String(locdate).slice(0, 4);
  //   const month = String(locdate).slice(4, 6);
  //   const day = String(locdate).slice(6, 8);
  //   return `${year}-${month}-${day}`;
  // }

  useQuery('showmonth', () => showMonthTodo(monthKey), {
    onSuccess: data => {
      setMonthTodo(data);
    },
  });

  const CustomHeaderComponent = ({date}) => {
    const dateObject = new Date(date);
    const formattedDate = `${dateObject.getFullYear()}년 ${
      dateObject.getMonth() + 1
    }월`;

    return (
      <View
        style={[
          styles.rowcontainer,
          {marginBottom: 24, justifyContent: 'space-between', marginTop: '4%'},
        ]}>
        <Text
          style={{fontSize: 17, fontWeight: 600, marginRight: width * 0.47}}>
          {formattedDate}
        </Text>
        <View style={[styles.rowcontainer]}>
          <TouchableOpacity
            style={{
              backgroundColor: '#ECFBFF',
              padding: '7%',
              borderRadius: 6,
              marginRight: '5%',
            }}
            onPress={() => setMonthKey(month)}>
            <Text style={{color: '#28C3EC'}}>오늘</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              selectDay(formattedToday);
              dailyShow();
            }}>
            <Image
              style={{height: buttonIcon, width: buttonIcon}}
              source={require('../../../assets/todayButton.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const parsedMarkers = useMemo(() => {
    const initialValue = {};
    const calendarResponse = {
      monthTodo,
    };

    return (
      calendarResponse.monthTodo
        ?.sort((a, b) => {
          const aStart = startOfDay(new Date(a.todoStartedAt));
          const aEnd = endOfDay(new Date(a.todoEndedAt));
          const bStart = startOfDay(new Date(b.startDate));
          const bEnd = endOfDay(new Date(b.todoStartedAt));
          return (
            differenceInDays(bEnd, bStart) - differenceInDays(aEnd, aStart)
          );
        })
        .reduce((prev, curr) => {
          const color = curr.categoryBgColorCode;
          const start = startOfDay(new Date(curr.todoStartedAt));
          const end = curr.todoEndedAt
            ? endOfDay(new Date(curr.todoEndedAt))
            : startOfDay(new Date(curr.todoStartedAt));
          const totalDays = differenceInDays(end, start) + 1;
          const content = curr.todoContent;
          const textColor = curr.categoryTextColorCode;

          let rowIndex = 0;
          let freeRowFound = false;
          while (!freeRowFound) {
            freeRowFound = true;
            for (let i = 0; i < totalDays; i++) {
              const date = addDays(start, i);
              const dateStr = format(date, 'yyyy-MM-dd', {
                locale: ko,
              });

              const period = prev[dateStr]?.periods?.[rowIndex];
              if (period) {
                if (isWithinInterval(date, {start, end})) {
                  rowIndex++;
                  freeRowFound = false;
                  break;
                }
              }
            }
          }

          for (let i = 0; i < totalDays; i++) {
            const date = addDays(start, i);
            const dateStr = format(date, 'yyyy-MM-dd', {
              locale: ko,
            });

            let marking = prev[dateStr];
            if (marking === undefined) {
              marking = {};
            }

            if (marking.periods === undefined) {
              marking.periods = [];
            }

            if (marking.periods.length <= rowIndex) {
              marking.periods = marking.periods.concat(
                [...Array(rowIndex + 1 - marking.periods.length)].map(() => ({
                  color: 'transparent',
                })),
              );
            }

            marking.periods[rowIndex] = {
              color: color,
              startingDay: i === 0,
              endingDay: i === totalDays - 1,
              content: content,
              textColor: textColor,
            };

            prev[dateStr] = marking;
          }

          return prev;
        }, initialValue) ?? initialValue
    );
  }, [monthTodo]);

  return (
    <Calendar
      renderHeader={date => CustomHeaderComponent({date})}
      initialDate={monthKey}
      markingType="multi-period"
      markedDates={parsedMarkers}
      onVisibleMonthsChange={newVisibleMonths => {
        setMonthKey(newVisibleMonths[0].dateString.substring(0, 7));
      }}
      hideArrows={true}
      onDayPress={day => {
        selectDay(day.dateString);
        dailyShow();
      }}
      enableSwipeMonths={true}
    />
  );
}

const styles = StyleSheet.create({
  rowcontainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
