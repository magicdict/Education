export const nationopt = [
  { label: '满族', value: '满族' },
  { label: '苗族', value: '苗族' },
  { label: '土家族', value: '土家族' },
  { label: '回族', value: '回族' },
  { label: '朝鲜族', value: '朝鲜族' },
  { label: '畲族', value: '畲族' }
]

export const policyopt = [
  { label: '少先队员', value: '少先队员' },
  { label: '一般', value: '一般' },
  { label: '共产党党员', value: '共产党党员' },
  { label: '民主党派', value: '民主党派' }
]


export interface IStudent {
  id: string;
  name: string;
  sex: string;
  nation: string;
  bornDate: string;
  className: string;
  nativePlace: string;
  isNativePlaceZheJiang: boolean;
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
  aiFeatures:IAIFeature[];
  consumptionCnt: number;
  chengjiCnt: number;
  teachers: ITeacher[];
  roommate: IStudent[];
  noConsumptionList: { name: string, value: number }[];
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
  goodRate: number;
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
  top50: IScore[];
  top50ForClassName: { name: string, value: number }[];
  low10: IScore[];
  gradeInfo: IClassExam;
  teacherExamInfoList: IClassExam[];
  scorePercentList: { [key: string]: number[] },
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
  weather: IWeather;
  dayOfWeek: number;
  classId: string;
  grade: string;
  liveAtSchool: boolean;
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
  classID: string;
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
  kaoqingTotal: { name: string, value: number }[];
  kaoqingMale: { name: string, value: number }[];
  kaoqingFeMale: { name: string, value: number }[];
  kaoqingLiveAtSchool: { name: string, value: number }[];
  kaoqingNotLiveAtSchool: { name: string, value: number }[];
  timePolar0099001: { name: string, value: number }[];
  timePolar0099002: { name: string, value: number }[];
  timePolar0099003: { name: string, value: number }[];
  timePolar0099004: { name: string, value: number }[];
  timePolar0099005: { name: string, value: number }[];
  minuteList: string[];
}

export interface IPNRateItem {
  posCnt: number;
  negCnt: number;
  posPercent: number;
  negPercent: number;
}

export interface ICampus {
  grade1SexRate: IPNRateItem;
  grade2SexRate: IPNRateItem;
  grade3SexRate: IPNRateItem;
  teacherCnt: number;
  teacherSubCnt: { [key: string]: number }
  classCnt: number;
  classIBCnt: number;
  property: IStudentGroupProperty;
}

export interface IStudentGroupProperty {
  studentCnt: number;
  studentIBCnt: number;
  sexRate: IPNRateItem;
  liveAtSchoolRate: IPNRateItem;
  zheJiangRate: IPNRateItem;
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
  gradeClassInfoList: { label: string, items: { label: string, value: string, count: number }[] }[];
  totalWorkdaycnt: number;
}

export interface IClassInfo {
  property: IStudentGroupProperty;
  teachers: ITeacher[];
  exams: IClassExam[];
  kaoqing: { name: string, value: number }[];
  monthlyConsumption: { name: string, value: number }[];
  weeklyConsumption: { name: string, value: number }[];
  consumptionStatisticsList: IStatistics[];
  kaoqingStatisticsList: { name: string, value: { name: string, value: number }[] }[];
}

export interface IStatistics {
  name: string;
  max: number;
  min: number;
  avg: number;
  sum: number;
  cnt: number;
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
  dailyConsumptionStudentCnt: { name: string, value: number }[];
  highestRec: IConsumption[];
  highestRecLiveAtSchool: IConsumption[];
  highestRecNotLiveAtSchool: IConsumption[];
  liveAtSchoolCnt: number;
  notLiveAtSchoolCnt: number;
  weekTimeConsumption: { name: string, value: number }[];
  weekTimeConsumptionLiveAtSchool: { name: string, value: number }[];
  weekTimeConsumptionNotLiveAtSchool: { name: string, value: number }[];
  perPriceRange: { name: string, value: number }[];
  perDayByGrade: { name: string, value: number }[];
  timePolar00000: { name: string, value: number }[];
  minuteList: string[];
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

export interface IAIFeature {
  studentID: string;
  subName: string;
  lastDengdi: number;
  lastDengdiMean: number;
  lastDiff: number;
  actDengdi: number
  predDengdi: number
  loss: number
}