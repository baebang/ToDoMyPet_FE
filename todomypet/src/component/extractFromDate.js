export function getDayOfWeek(dateString) {
  if (dateString) {
    const formattedDateString = dateString.replace(/-/g, '.');
    const date = new Date(dateString);
    const daysOfWeek = ['(일)', '(월)', '(화)', '(수)', '(목)', '(금)', '(토)'];
    const dayOfWeekIndex = date.getDay();
    const dayOfWeek = daysOfWeek[dayOfWeekIndex];
    return formattedDateString + dayOfWeek;
  } else {
    console.log('dateString is null or undefined');
  }
}

export function convertTo12HourFormat(time) {
  // 시간을 나타내는 문자열을 Date 객체로 파싱합니다.
  const parsedTime = new Date(`2000-01-01T${time}:00`);

  // 시간을 12시간 형식으로 변환합니다.
  let hours = parsedTime.getHours();
  const minutes = parsedTime.getMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0시는 12시로 표기합니다.
  const formattedTime =
    period + hours + ':' + (minutes < 10 ? '0' : '') + minutes;

  return formattedTime;
}

function convertTimeTo24HourFormat(timeString) {
  if (!timeString) {
    return null;
  }

  let TimeStrings = timeString.includes(':')
    ? timeString.split(':').slice(0, 2).join(':')
    : timeString;

  let is24HourFormat = /^([01]\d|2[0-3]):[0-5]\d$/.test(TimeStrings);

  if (is24HourFormat) {
    return TimeStrings;
  }

  // 시간 문자열에서 시, 분, AM/PM을 추출합니다.
  var timeParts = TimeStrings.match(/^([APap])M?(\d{1,2}):(\d{2})$/);
  var period = timeParts[1].toUpperCase();
  var hours = parseInt(timeParts[2]);
  var minutes = parseInt(timeParts[3]);

  // PM일 경우 시간을 조정합니다.
  if (period === 'P' && hours < 12) {
    hours += 12;
  }
  // AM일 경우 12시는 0시로 변경합니다.
  else if (period === 'A' && hours === 12) {
    hours = 0;
  }

  // 시간을 2자리 숫자로 포맷합니다.
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;

  // 24시간 형식의 문자열로 반환합니다.

  return hours + ':' + minutes;
}

export function AlarmCalculateFormat(dateStr, timeStr, AlarmState) {
  console.log(dateStr, timeStr, AlarmState);

  const dateString = dateStr + ' ' + timeStr;

  const dateComponents = dateString.split(/[- :]/);
  const year = parseInt(dateComponents[0]);
  const month = parseInt(dateComponents[1]) - 1; // Month starts from 0
  const day = parseInt(dateComponents[2]);
  let hour = parseInt(dateComponents[3].slice(2)); // Removing 'PM', 'AM' and parsing hour
  if (dateComponents[3].toLowerCase().includes('pm')) {
    hour += 12; // Converting to 24-hour format if PM
  }
  const minute = parseInt(dateComponents[4]);
  const utcDate = new Date(Date.UTC(year, month, day, hour, minute));
  console.log(utcDate, 'utcDate');
  const result = subtractTime(utcDate, AlarmState);
  console.log(result);

  return result;
}

function subtractTime(dateTimeString, timeInterval) {
  console.log(dateTimeString, timeInterval, 'subtractTime pram');

  const intervals = {
    '이벤트 시간': 0,
    '5분 전': 5,
    '10분 전': 10,
    '15분 전': 15,
    '30분 전': 30,
    '1시간 전': 60,
    '2시간 전': 120,
    '1일 전': 1440,
    '2일 전': 2880,
    '1주 전': 10080, // 7일 * 24시간 * 60분
  };

  if (!(timeInterval in intervals)) {
    return null; // 잘못된 시간 간격인 경우 null 반환
  }

  const minutesToSubtract = intervals[timeInterval];

  const date = new Date(dateTimeString);
  const newDate = new Date(date.getTime() - minutesToSubtract * 60000); // 분을 밀리초로 변환

  console.log(newDate, 'newDate=========!!??');

  return newDate.toISOString();
}

// 주어진 기간에 해당하는 요일을 출력하는 함수
const printSelectedWeekdaysInRange = (startDate, endDate, selectedDays) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const result = [];

  // 요일을 나타내는 숫자와 해당 숫자에 대응하는 문자열을 매핑합니다.
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  // 만약 입력이 숫자로 주어졌다면 해당 숫자를 요일의 문자열로 변환합니다.
  if (selectedDays.length && typeof selectedDays[0] === 'number') {
    selectedDays = selectedDays.map(day => weekdays[day % 7]);
  }

  console.log('Selected Days:', selectedDays);

  // 주어진 기간 동안의 각 날짜를 확인하여 선택된 요일인 경우 결과 배열에 추가합니다.
  for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
    const dayOfWeek = date.getDay(); // 요일을 0(일요일)부터 6(토요일)까지의 숫자로 가져옵니다.
    const dayOfWeekString = weekdays[dayOfWeek]; // 숫자로 표현된 요일을 문자열로 변환합니다.
    if (selectedDays.includes(dayOfWeekString)) {
      const isoString = date.toISOString();
      if (isoString) {
        // toISOString()이 undefined가 아닌 경우에만 slice() 호출
        result.push(isoString.slice(0, 10));
      }
    }
  }
  console.log('Result:', result);
  return result;
};

function generateDateRange(startDate, endDate) {
  const dateArray = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dateArray.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
}

export function formatDataForAPI(
  TodoDateSetting,
  isCalendalState,
  isContent,
  TodoAddDateCheck,
  TodoAddDate,
) {
  const {
    StartDate, //기간(반복)) - 시작
    EndData, // 기간 - 종료
    TimeDate, // 기간 - 시작 이벤트 알림 시간
    EndTimData, // 기간 - 종료 이벤트 알림 시간
    RepeatEndDate, // 반복 - 종료
    RepeatType, //반복 - 타입(매일 매주 매월)
    RepeatWeek, // 반복 - 매주 리스트
    AlarmState, //알람 설정 시간
    PeriodDate, // 기간
    CategotyId, //카테고리 ID
  } = TodoDateSetting;

  const alarmTypes = {
    '이벤트 시간': 'EVENT_TIME',
    '5분 전': 'FIVE_MINUTE',
    '10분 전': 'TEN_MINUTE',
    '15분 전': 'FIFTEEN_MINUTE',
    '30분 전': 'THIRTY_MINUTE',
    '1시간 전': 'ONE_HOUR',
    '2시간 전': 'TWO_HOUR',
    '1일 전': 'ONE_DAY',
    '2일 전': 'TWO_DAY',
    '1주 전': 'ONE_WEEK',
  };

  const repeatTypes = {
    매일: 'REPEAT_DAILY',
    매주: 'REPEAT_WEEKLY',
    매월: 'REPEAT_MONTHLY',
    '반복 없음': 'NONE_REPEAT',
  };

  const weekNumber = {
    getWeekNumber: function (RepeatWeek) {
      if (RepeatWeek) {
        const convertedDays = RepeatWeek.map(day => {
          switch (day) {
            case '일':
              return 0;
            case '월':
              return 1;
            case '화':
              return 2;
            case '수':
              return 3;
            case '목':
              return 4;
            case '금':
              return 5;
            case '토':
              return 6;
            default:
              return day; // 잘못된 입력이 있을 경우 -1 반환
          }
        });
        return convertedDays;
      } else {
        return [];
      }
    },
  };

  let repeatType = RepeatType
    ? repeatTypes[RepeatType] || RepeatType
    : 'NONE_REPEAT';

  const receiveAlertState = !!AlarmState;
  //알림 타입

  const userDTOformat = {
    categoryId: CategotyId,
    content: isContent,
    startedAtDate: null,
    startedAtTime: null,
    endedAtDate: null,
    endedAtTime: null,
    receiveAlert: receiveAlertState,
    markOnTheCalenderOrNot: isCalendalState,
    alertAt: null,
    alertType: 'NONE_ALERT',
  };

 

  const newUserDTO = {
    todoInfos: [],

    repeatInfo: {
      repeatType: repeatType,
      repeatData: weekNumber.getWeekNumber(RepeatWeek),
      repeatStartDate: RepeatEndDate ? StartDate : null,
      repeatEndDate: RepeatEndDate ? RepeatEndDate.dateString : null,
    },
  };

  const todoArrPeriodDateAPIFormat = () => {
    // 시작
    // PeriodDate 배열의 첫 번째 요소를 startedAtDate로, 마지막 요소를 endedAtDate로 사용합니다.

    userDTOformat.startedAtDate = StartDate;
    userDTOformat.endedAtDate = EndData;
    if (!!AlarmState) {
      userDTOformat.alertAt = AlarmCalculateFormat(
        StartDate,
        TimeDate,
        AlarmState,
      );

      let alarm = alarmTypes[AlarmState] || 'NONE_ALERT';
      userDTOformat.alertType = alarm;
    }

    userDTOformat.endedAtTime = EndTimData
      ? convertTimeTo24HourFormat(EndTimData)
      : null;
    userDTOformat.startedAtTime = TimeDate
      ? convertTimeTo24HourFormat(TimeDate)
      : null;

    return Array(1)
      .fill(userDTOformat)
      .map(obj => ({...obj}));
  };

  const todoArrRepeatDateAPIFormat = daylist => {
    const usrDTORepeatForm = [];
    console.log(daylist, '??????????');

    daylist.forEach(value => {
      // userDTOformat 객체의 복제본을 생성합니다.
      const clonedDTOformat = {...userDTOformat};

      // 값 설정
      clonedDTOformat.startedAtDate = value;
      // clonedDTOformat.endedAtDate = value;

      // AlarmState에 따라 alertAt 설정
      if (!!AlarmState) {
        clonedDTOformat.alertAt = AlarmCalculateFormat(
          value,
          TimeDate,
          AlarmState,
        );

        let alarm = alarmTypes[AlarmState] || 'NONE_ALERT';

        clonedDTOformat.alertType = alarm;
      }
      // clonedDTOformat.endedAtTime = EndTimData
      //   ? convertTimeTo24HourFormat(EndTimData)
      //   : null;
      clonedDTOformat.startedAtTime = TimeDate
        ? convertTimeTo24HourFormat(TimeDate)
        : null;

      // 수정된 객체를 usrDTORepeatForm 배열에 추가합니다.
      usrDTORepeatForm.push(clonedDTOformat);
    });

    return usrDTORepeatForm;
  };

  // 기간일떄 (EndData 있을떄)
  // 배열의 길이만큼 반복하면서 데이터 가공해주기
  // 시작 (알림 및 시간 데이터 입력)
  // 중간 (일림 X시간 X)
  // 종료(시간O 알림 X)
  //반복 데이터가 있을 경우 무시하기
  if (EndData) {
    const result = todoArrPeriodDateAPIFormat();
    newUserDTO.todoInfos = result;

    return newUserDTO;
  } else {
    if (RepeatType && RepeatType !== 'NONE_REPEAT') {
      //반복
      //"매일"일 경우

      if (RepeatType === '매일' || RepeatType === 'REPEAT_DAILY') {
        const everyDayList = generateDateRange(
          StartDate,
          RepeatEndDate.dateString !== undefined
            ? RepeatEndDate.dateString
            : RepeatEndDate,
        );
        const result = todoArrRepeatDateAPIFormat(everyDayList);
        newUserDTO.todoInfos = result;

        return newUserDTO;
      }

      //"매주"반복일 경우 매주에 해당하는 날짜를 배열로 담아주기
      if (RepeatType === '매주' || RepeatType === 'REPEAT_WEEKLY') {
        const weekList = printSelectedWeekdaysInRange(
          StartDate,
          RepeatEndDate.dateString !== undefined
            ? RepeatEndDate.dateString
            : RepeatEndDate,
          RepeatWeek,
        );

        const result = todoArrRepeatDateAPIFormat(weekList);
        newUserDTO.todoInfos = result;

        return newUserDTO;
      }

      if (RepeatType === '매월' || RepeatType === 'REPEAT_MONTHLY') {
        const startDate = new Date(StartDate); // 시작하는 날짜
        const endDate = new Date(
          RepeatEndDate.dateString !== undefined
            ? RepeatEndDate.dateString
            : RepeatEndDate,
        ); // 끝나는 날짜

        // 시작 날짜의 연도와 월
        let year = startDate.getFullYear();
        let month = startDate.getMonth();
        const target = new Date(StartDate).getDate();
        let monthArr = [];
        const formattedDates = [];

        function getLastDayOfMonth(year, month) {
          return new Date(year, month + 1, 0).getDate();
        }

        // 시작 날짜부터 끝 날짜까지 모든 달을 출력
        while (
          year < endDate.getFullYear() ||
          (year === endDate.getFullYear() && month <= endDate.getMonth())
        ) {
          const formattedMonth = `${year}-${('0' + (month + 1)).slice(-2)}`;
          monthArr.push(formattedMonth);
          const lastDay = getLastDayOfMonth(year, month);
          const day = Math.min(target, lastDay); // 날짜는 각 달의 첫날이나 마지막 날 중 최소값으로 설정
          formattedDates.push(
            `${formattedMonth}-${day.toString().padStart(2, '0')}`,
          );
          month++;
          if (month > 11) {
            month = 0;
            year++;
          }
        }

        const result = todoArrRepeatDateAPIFormat(formattedDates);
        newUserDTO.todoInfos = result;

        return newUserDTO;
      }

      // console.log(weekdaysList);
      // 예시 사용: 2024-02-17부터 2024-02-28까지의 "목"과 "금"을 출력합니다.
    } else {
      //반복이 아닌 단일 설정인 경우

      if (TodoAddDateCheck) {
        const result = todoArrRepeatDateAPIFormat([TodoAddDate]);
        newUserDTO.todoInfos = result;
        return newUserDTO;
      } else {
        const result = todoArrRepeatDateAPIFormat([StartDate]);
        newUserDTO.todoInfos = result;
        return newUserDTO;
      }
    }
  }

  // 반복일떄 (EndData)
  //"매일"일때 시작날짜부터 종료날짜까지 형식 변환해서 배열로 저장하기
  //"매주"일때 시작날짜부터 종료 날짜까지 유저가 선택한 "주"에만 형식을 변환하여 배열에 저장하기
  //"매월"일때 시작날짜부터 종료 날짜까지 유저가 정한 "월"에 해당 날짜만 형식 변환에서 배열에 저장하기

  //알림의 경우 알림타입을 formatDataTimeForApi에 보내서 계산하여 alertAt에 넣어주기
  //시작날짜의 startedAtTime이 있는 경우만 실행
  //시작날짜와 시간 형변환 해주기 formatDateTime
}
