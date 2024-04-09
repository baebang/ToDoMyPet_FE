import axios from 'axios';

export async function HolidayFunction() {
  try {
    const response = await axios.get(
      `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?serviceKey=Rw4YdrK6RwpxZQhjWXfaqUybySBDQUaLQqR9xLLfEkqeTwqgDbuU7gzQpapJCbtnBOJN9zE%2BbJux9Jj5QYibZg%3D%3D&solYear=2024&solMonth=02&_type=json`,
    );
    console.log(response.data.response.body.items);
  } catch (error) {
 
    console.error('Error fetching data:', error.message); // 에러 메시지 출력
    console.error('Error response:', error.response); // 응답 내용 출력
    console.error('Error request:', error.request); // 요청 내용 출력
    console.error('Error config:', error.config); // 요청 구성 출력
    console.error('Error code:', error.code); // 에러 코드 출력
  }
}
