import {create} from 'zustand';

export const KeyboardUp = create(set => ({
  KeyboardState: false,
  setKeyboardTrue: () => set({KeyboardState: true}),
  setKeyboardFalse: () => set({KeyboardState: false}),
}));

export const CheckCode = create(set => ({
  CheckCodeState: '',
  UserCodeState: '',
  setCheckCodeState: code => set({CheckCodeState: code}),
  setUserCodeState: code => set({UserCodeState: code}),
  setRemoveCheckCode: () => set({CheckCodeState: ''}),
}));

export const UserInfo = create(set => ({
  UserEmail: '',
  UserPassword: '',
  UserNickName: '',
  UserImage: null,
  UserBio: '',
  setUserEmailState: email => set({UserEmail: email}),
  setUserPasswordState: password => set({UserPassword: password}),
  setUserNickNameState: nickname => set({UserNickName: nickname}),
  setUserImageState: Image => set({UserImage: Image}),
  setUserBioState: Bio => set({UserBio: Bio}),

  setRemoveUserEmail: () => set({UserEmail: ''}),
}));

export const UserSetting = create(set => ({
  UserRename: 'default',
  UsreReBio: 'default',
  UserPrivate: 'default',
  UaerAlarm: 'default',
  UserImage: null,
  setUserRename: name => set({UserRename: name}),
  setUsreReBio: Bio => set({UsreReBio: Bio}),
  setUserPrivate: state => set({UserPrivate: state}),
  setUaerAlarm: state => set({UaerAlarm: state}),
  setUserImage: state => set({UserImage: state}),
}));

// 피드
export const FeedWriteState = create(set => ({
  FeedContent: '',
  setFeedContent: content => set({FeedContent: content}),
}));

export const FeedImageArray = create(set => ({
  FeedImage: [],
  FeedId: '',
  setFeedImage: base64 =>
    set(state => ({FeedImage: [...state.FeedImage, base64]})),
  setCleanUpImage: () => set({FeedImage: [], FeedId: ''}), // 초기화 함수 추가
  removeImage: indexToRemove => {
    set(state => ({
      FeedImage: state.FeedImage.filter((_, index) => index !== indexToRemove),
    }));
  },
  setFeedId: Id => set({FeedId: Id}),
}));

export const UserFeedPetInfo = create(set => ({
  FeedPet: {petURL: '', petID: ''},
  FeedPetInterior: {interiorURL: '', interiorID: ''},
  setFeedPet: (content, petId) =>
    set({FeedPet: {petURL: content, petID: petId}}),
  setFeedPetInterior: (content, interiorID) =>
    set({FeedPetInterior: {interiorURL: content, interiorID: interiorID}}),
  setCleanUP: () =>
    set({
      FeedPet: {petURL: '', petID: ''},
      FeedPetInterior: {interiorURL: '', interiorID: ''},
    }),
}));

//카테고리 추가하기
export const CategorySetting = create(set => ({
  CategoryColor: '',
  setCategoryColor: color => set({CategoryColor: color}),
}));

//로딩
export const LodingSetting = create(set => ({
  Loding: true,
  setLoding: data => set({Loding: data}),
}));

//postIDnext
export const NextPostId = create(set => ({
  NextPostIndex: null,
  setNextPostIndex: data => set({NextPostIndex: data}),
}));

//데이터 새로 불러오기 fetchData
export const RefetchSetting = create(set => ({
  FetchData: true,
  checkTodo: '',
  setFetch: data => set({FetchData: data}),
  setUpdateTodo: data => set({checkTodo: data}),
}));

//일정 디테일 확인하기
export const TodoDetail = create(set => ({
  TodoId: '',
  TodoAddDateCheck: false,
  TodoAddDate: '',
  setTodoAdd: (check, date) =>
    set({TodoAddDateCheck: check, TodoAddDate: date}),
  setTodoId: data => set({TodoId: data}),
}));

//신고하기
export const declarationToast = create(set => ({
  BoardDeclaration: '',
  CommentDeclaration: '',

  setBoard: check => set({BoardDeclaration: check}),
  setComment: data => set({CommentDeclaration: data}),
  cleanUP: () => set({BoardDeclaration: '', CommentDeclaration: ''}),
}));

//휴일리스트
export const HoliyDayList = create(set => ({
  holiyDayArry: [],

  setholiyDayArry: data => {
    set(state => ({
      holiyDayArry: [data],
    }));
  },
}));

//투두 날짜 세팅하기
export const TodoDateSetting = create(set => {
  let today = new Date();
  today.setUTCHours(today.getUTCHours() + 9);

  const formattedToday = today.toISOString().split('T')[0];

  return {
    //시작하는 날짜
    StartDate: formattedToday,
    //끝나는 날짜
    EndData: '',
    //기간 period
    PeriodDate: [],
    //시간
    TimeDate: '',
    //종료시간
    EndTimData: '',
    //반복하는 종료날짜
    RepeatEndDate: '',
    //반복하는 타입
    RepeatType: '',
    //반복하는 요일
    RepeatWeek: '',
    //알람타입
    AlarmState: '',
    //카테고리ID
    CategotyId: '',
    //카테고리 이름
    //카테코리 컬러
    categoryContent: {categoryName: '', colorCode: ''},
    //새 할일 입력 Content
    NewContent: '',
    //할일 캘린더에 표시
    MarkOn: false,
    //투두아이디
    TodoId: '',

    setStartDate: data => set({StartDate: data}),
    setEndData: data => set({EndData: data}),
    setPeriodDate: data => set({PeriodDate: [data]}),
    setTimeDate: data => set({TimeDate: data}),
    setEndTimData: data => set({EndTimData: data}),
    setCategoryId: data => set({CategotyId: data}),
    setTodoId: data => set({TodoId: data}),
    setRepeatEndDate: data => set({RepeatEndDate: data}),
    setRepeatType: data => set({RepeatType: data}),
    setRepeatWeek: data => set({RepeatWeek: data}),
    setAlarmState: data => set({AlarmState: data}),
    setNewContent: data => set({NewContent: data}),
    setMarkOn: data => set({MarkOn: data}),
    setcategoryContent: (name, color) =>
      set({categoryContent: {categoryName: name, colorCode: color}}),

    repeatCleanUp: () =>
      set({RepeatEndDate: '', RepeatType: '', RepeatWeek: ''}),
    todoDateSettingCleanup: () =>
      set({
        StartDate: formattedToday,
        EndData: '',
        PeriodDate: [],
        TimeDate: '',
        RepeatEndDate: '',
        RepeatType: '',
        RepeatWeek: '',
        AlarmState: '',
        markOnTheCalender: false,
        categoryContent: {categoryName: '', colorCode: ''},
        // CategotyId: '',
        NewContent: '',
        MarkOn: false,
      }),
  };
});
