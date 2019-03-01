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
    liveAtSchool: string;
    leaveSchool: string;
    liveRoomNo: string;
}

export interface ITeacher{
    id:string;
    name:string;
    term:string;
    classId:string;
    className:string;
    graName:string;
    subId:string;
    subName:string;
}

export interface IConsumption {
    dealTime: string;
    dealTimeYear: string;
    dealTimeMonth: string;
    dealTimeDay: string;
    dealTimeHour: string;
    monDeal: number;
    studentID: string;
    accName: string;
    perSex: string;
}

export interface IScore {
    id: string;
    number: string;
    numberName: string;
    subId: String;
    subName: String;
    term: string;
    type: string;
    sdate: string;
    studentId: string;
    score: string;
    zScore: string;
    tScore: string;
    dengdi: string;
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
    cClassId: string;
}

export interface IStudentInfo {
    baseInfo: IStudent;
    consumptions: IConsumption[];
    kaoqins: IKaoqin[];
    scores: IScore[];
    consumptionCnt: number;
    chengjiCnt: number;
    teachers:ITeacher[];
}