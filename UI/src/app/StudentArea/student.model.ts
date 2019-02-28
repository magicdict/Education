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

export interface IConsumption{
    dealTime : string;
    dealTimeYear : string;
    dealTimeMonth : string;
    dealTimeDay : string;
    dealTimeHour : string;
    monDeal : number;
    studentID:string;
    accName:string;
    perSex:string;
}


export interface IStudentInfo{
    baseInfo:IStudent;
    consumptions:IConsumption[];
    consumptionCnt:number;
}