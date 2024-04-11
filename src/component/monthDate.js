function fucjupMobth(startDate,endDate) {

  let year = startDate.getFullYear();
  let month = startDate.getMonth();
  let monthArr = [];

  function getLastDaysOfMonth(months) {
    return months.map(yearMonth => {
      const [year, month] = yearMonth.split('-').map(Number);
      return new Date(year, month, 0).getDate();
    });
  }

  // 시작 날짜부터 끝 날짜까지 모든 달을 출력
  while (
    year < endDate.getFullYear() ||
    (year === endDate.getFullYear() && month <= endDate.getMonth())
  ) {
    console.log(year + '-' + ('0' + (month + 1)).slice(-2)); // 월은 0부터 시작하므로 1을 더해줍니다.
    monthArr.push(year + '-' + ('0' + (month + 1)).slice(-2));

    // 다음 달로 이동
    month++;
    if (month > 11) {
      month = 0;
      year++;
    }
  }

  function combineArrays(monthArr, lastDays) {
    return months.map((month, index) => ({
      month,
      endDay: lastDays[index],
    }));
  }
  const months = monthArr;

  const lastDays = getLastDaysOfMonth(monthArr);
  const combinedArray = combineArrays(monthArr, lastDays);
  console.log(combinedArray);

  const day = new Date(StartDate).getDate(); // You can change this to any day you want

  const formattedDates = combinedArray.map(date => {
    // Extract year and month from the date string
    const [year, month] = date.month.split('-');
    if (day <= date.endDay) {
      // Construct the date string with the dynamic day
      return `${year}-${month.padStart(2, '0')}-${day
        .toString()
        .padStart(2, '0')}`;
    } else {
      return `${year}-${month.padStart(2, '0')}-${date.endDay}`;
    }
  });
}
