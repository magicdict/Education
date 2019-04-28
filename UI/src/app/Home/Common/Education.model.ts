export const nationopt = [
  { label: '满族', value: '满族' },
  { label: '苗族', value: '苗族' },
  { label: '土家族', value: '土家族' },
  { label: '回族', value: '回族' },
  { label: '朝鲜族', value: '朝鲜族' },
  { label: '畲族', value: '畲族' },
]

export const policyopt = [
  { label: '少先队员', value: '少先队员' },
  { label: '一般', value: '一般' },
  { label: '共产党党员', value: '共产党党员' },
  { label: '民主党派', value: '民主党派' },
]

export const classopt = [
  {
    label: '高一',
    items: [
      { label: '东-高一(01)', value: '926' },
      { label: '东-高一(02)', value: '927' },
      { label: '东-高一(03)', value: '928' },
      { label: '东-高一(04)', value: '929' },
      { label: '东-高一(05)', value: '930' },
      { label: '东-高一(06)', value: '931' },
      { label: '东-高一(07)', value: '932' },
      { label: '东-高一(08)', value: '933' },

      { label: '白-高一(01)', value: '934' },
      { label: '白-高一(02)', value: '935' },
      { label: '白-高一(03)', value: '936' },
      { label: '白-高一(04)', value: '937' },
      { label: '白-高一(05)', value: '938' },
      { label: '白-高一(06)', value: '939' },
      { label: '白-高一(07)', value: '940' },
      { label: '白-高一(08)', value: '941' },

      { label: '东-高一(09)-IB', value: '942' },
      { label: '东-高一(10)-IB', value: '943' },
      { label: '高一未分班', value: '944' },
    ]
  },
  {
    label: '高二',
    items: [
      { label: '白-高二(01)', value: '901' },
      { label: '白-高二(02)', value: '902' },
      { label: '白-高二(03)', value: '903' },
      { label: '白-高二(04)', value: '904' },
      { label: '白-高二(05)', value: '905' },
      { label: '白-高二(06)', value: '906' },
      { label: '白-高二(07)', value: '907' },
      { label: '白-高二(08)', value: '908' },
      { label: '白-高二(09)', value: '909' },
      { label: '白-高二(10)', value: '910' },
      { label: '白-高二(11)', value: '911' },
      { label: '白-高二(12)', value: '912' },
      { label: '高二(13)IB', value: '913' },
      { label: '高二未分班', value: '945' },
    ]
  },
  {
    label: '高三',
    items: [
      { label: '高三(01)', value: '921' },
      { label: '高三(02)', value: '916' },
      { label: '高三(03)', value: '917' },
      { label: '高三(04)', value: '918' },
      { label: '高三(05)', value: '922' },
      { label: '高三(06)', value: '924' },
      { label: '高三(07)', value: '919' },
      { label: '高三(08)', value: '920' },
      { label: '高三(09)', value: '923' },
      { label: '高三(10)', value: '925' },
      { label: '高三(11)IB', value: '914' },
      { label: '高三(12)IB', value: '915' },
      { label: '高三未分班', value: '947' },
    ]
  }
]

export interface IStudent {
  id: string;
  name: string;
  sex: string;
  nation: string;
  bornDate: string;
  className: string;
  nativePlace: string;
  residenceType: string;
  policy: string;
  classId: string;
  classTerm: string;
  liveAtSchool: boolean;
  leaveSchool: boolean;
  liveRoomNo: string;
  optionCourse: string[];
  grade: string;
}

export interface ICompareStudentInfo {
  first: IStudent;
  second: IStudent;
  examResult: IChengjiSimple[];
  subResult: { name: string, value: number }[];
}

export interface IStudentInfo {
  baseInfo: IStudent;
  consumptions: IConsumption[];
  monthlyConsumptions: IStudentMonthlyConsumption[];
  kaoqins: IKaoqin[];
  chengjis: IScore[];
  consumptionCnt: number;
  chengjiCnt: number;
  teachers: ITeacher[];
  roommate: IStudent[];
}

export interface ITeacher {
  id: string;
  name: string;
  term: string;
  classId: string;
  className: string;
  graName: string;
  subId: string;
  subName: string;
}

export interface ITeacherInfo {
  groupByTerm: { [key: string]: string[] };
  records: ITeacher[];
  classExams: IClassExam[];
}

export interface IClassExam {
  record: IScore,
  allCnt: number,
  funnelDic: { [key: string]: number },
  avilibleCnt: number,
  maxScore: number,
  minScore: number,
  avgScore: number
  std: number;
  var: number;
  mid: number;
}

export interface IExamList {
  [key: string]:
  {
    grade: string,
    number: string,
    numberName: string,
    subNameList: string[]
  }[];
}

export interface IExamInfoForNumberAndSubName {
  classExamInfoList: IClassExam[];
  top10: IScore[];
  low10: IScore[];
  gradeInfo: IClassExam;
  teacherExamInfoList: IClassExam[];
}

export interface IConsumption {
  dealTime: string;
  dealTimeYear: string;
  dealTimeMonth: string;
  dealTimeDay: string;
  dealTimeHour: number;
  monDeal: number;
  studentID: string;
  accName: string;
  perSex: string;
  consumpStudent: IStudent;
  weather: IWeather;
  dayOfWeek: number;
}

export interface IStudentMonthlyConsumption {
  id: string;
  name: string;
  sex: string;
  className: string;
  liveAtSchool: boolean;
  month: string;
  amount: number;
}

export interface IChengjiSimple {
  idForGradeExam: string;
  subId: string;
  subName: string;
  number: string;
  numberName: string;
  score: number;
  compareToScore: number;
  result: string;
  resultText: string;
}

export interface IScore {
  id: string;
  idForClass: string;
  className: string;
  grade: string;
  number: string;
  numberName: string;
  subId: string;
  subName: string;
  term: string;
  type: string;
  typeName: string;
  sdate: string;
  sdateYear: string;
  sdateMonth: string;
  sdateDay: string;
  studentID: string;
  studentName: string;
  score: number;
  fullScore: number;
  scorePercent: number;
  zScore: string;
  tScore: number;
  dengdi: number;
  gradeAvalibleCnt: number;
  classAvalibleCnt: number;
  gradeRankPercent: number;
  classRankPercent: number;
  gradeRank: number;
  classRank: number;
  gradeAvg: number;
  classAvg: number;
  gradeAvgDiff: number;
  classAvgDiff: number;
  teacherID: string;
  teacherName: string;
}

export interface IKaoqin {
  id: string;
  term: string;
  recDateTime: string;
  recDateTimeYear: string;
  recDateTimeMonth: string;
  recDateTimeDay: string;
  recDateTimeHour: string;
  controllerID: string;
  controllerName: string;
  detailId: string;
  studentID: string;
  studentName: string;
  className: string;
  classId: string;
  weather: IWeather;
  dayOfWeek: number;
}

export interface IKaoqinOverview {
  monthDict: { [key: string]: { name: string, value: number }[] };
  overviewDict: { [key: string]: { name: string, value: number } };
}

export interface ISexRate {
  maleCnt: number;
  femaleCnt: number;
  malePercent: number;
  femaleCntPercent: number;
}

export interface ICampus {
  grade1SexRate: ISexRate;
  grade2SexRate: ISexRate;
  grade3SexRate: ISexRate;
  teacherCnt: number;
  teacherSubCnt: { [key: string]: number }
  classCnt: number;
  classIBCnt: number;
  property: IStudentGroupProperty;
}

export interface IStudentGroupProperty {
  studentCnt: number;
  studentIBCnt: number;
  totalSexRate: ISexRate;
  policy: { name: string, value: number }[];
  nation: { name: string, value: number }[];
  nativePlace: { name: string, value: number }[];
  nativePlaceZheJiang: { name: string, value: number }[];
}

export interface ISchoolInfo {
  baiYang: ICampus;
  east: ICampus;
  total: ICampus;
  schoolRooms: {
    baiYangMale: { [key: string]: number };
    baiYangFemale: { [key: string]: number };
    eastMale: { [key: string]: number };
    eastFemale: { [key: string]: number };
  }
}

export interface IClassInfo {
  property: IStudentGroupProperty;
  teachers: ITeacher[];
  exams: IClassExam[];
  kaoqing: { name: string, value: number }[];
}

export interface ICourse {
  selectionCourseCnt: { name: string, value: number }[];
  selectionTwoCourseCnt: { name: string, value: number }[];
  selectionThreeCourseCnt: { name: string, value: number }[];
  studentCnt: number;
}

export interface ISchoolConsumptionInfo {
  monthlyConsumption: { name: string, value: number }[];
  monthlyConsumptionLiveAtSchool: { name: string, value: number }[];
  monthlyConsumptionNotLiveAtSchool: { name: string, value: number }[];
  weekDayConsumption: { name: string, value: number }[];
  weekDayConsumptionLiveAtSchool: { name: string, value: number }[];
  weekDayConsumptionNotLiveAtSchool: { name: string, value: number }[];
  dailyConsumption: { name: string, value: number }[];
  highestRec: IConsumption[];
  highestRecLiveAtSchool: IConsumption[];
  highestRecNotLiveAtSchool: IConsumption[];
  liveAtSchoolCnt: number;
  notLiveAtSchoolCnt: number;
  weekTimeConsumption: { name: string, value: number }[];
  weekTimeConsumptionLiveAtSchool: { name: string, value: number }[];
  weekTimeConsumptionNotLiveAtSchool: { name: string, value: number }[];
  perPriceRange: { name: string, value: number }[];
}

/**天气 */
export interface IWeather {
  year: number;
  month: number;
  day: number;
  high: number;
  low: number;
  type: string;
}