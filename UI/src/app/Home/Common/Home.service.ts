import { Injectable } from '@angular/core';
import { CommonFunction } from './common';
import { IStudent, IStudentInfo, ITeacherInfo, IClassExam, IStudentMonthlyConsumption, ISchoolInfo, IExamInfoForNumberAndSubName } from './Education.model';

@Injectable()
export class HomeService {
    IsFirstRun = false;
    IsFullScreen = false;
    constructor(public commonFunction: CommonFunction) {

    }
    /** 按学号检索 */
    public QueryByTeacherId(TeacherId: string): Promise<ITeacherInfo> {
        return this.commonFunction.httpRequest<any>('Teacher/QueryByTeacherId?ID=' + TeacherId);
    }
    /** 按学号检索 */
    public QueryByStudentId(StudentId: string): Promise<Array<IStudent>> {
        return this.commonFunction.httpRequest<any>('Student/QueryByStudentId?ID=' + StudentId);
    }
    public QueryByLiveRoomNo(RoomNo: string, Campus: string, Sex: string): Promise<Array<IStudent>> {
        return this.commonFunction.httpRequest<any>('Student/QueryByLiveRoomNo?ID=' + RoomNo + "&Campus=" + escape(Campus) + "&Sex=" + escape(Sex));
    }
    public QueryByNation(Nation: string): Promise<Array<IStudent>> {
        return this.commonFunction.httpRequest<any>('Student/QueryByNation?Nation=' + escape(Nation));
    }
    public QueryByPolicy(Policy: string): Promise<Array<IStudent>> {
        return this.commonFunction.httpRequest<any>('Student/QueryByPolicy?Policy=' + escape(Policy));
    }
    /** 月度消费 */
    public GetStudentWithMonthLimit(limit: number): Promise<IStudentMonthlyConsumption[]> {
        return this.commonFunction.httpRequest<any>('Consumption/GetStudentWithMonthLimit?limit=' + limit);
    }
    /** 月度消费 */
    public GetStudentMonthlyConsumption(studentId: string): Promise<IStudentMonthlyConsumption[]> {
        return this.commonFunction.httpRequest<any>('Consumption/GetStudentMonthlyConsumption?studentId=' + studentId);
    }
    /** 按班级检索 */
    public QueryByClassId(ClassId: string): Promise<IStudent[]> {
        return this.commonFunction.httpRequest<any>('Student/QueryByClassId?ID=' + ClassId);
    }
    /**获得数据 */
    public GetStudentInfoByID(StudentId: string): Promise<IStudentInfo> | IStudentInfo {
        if (this.CurrentStudentInfo !== undefined &&
            this.CurrentStudentInfo.baseInfo.id === StudentId) {
            console.log("使用缓存数据：" + StudentId);
            return this.CurrentStudentInfo;
        }
        return this.commonFunction.httpRequest<any>('Student/GetStudentInfo?ID=' + StudentId);
    }

    /**是否注册完毕地图 */
    IsMapReady: boolean = false;

    /**考试一览缓存 */
    CurrentExam: IExamInfoForNumberAndSubName;

    /** 学校总体信息 */
    SchoolOverview: ISchoolInfo;

    /** 学生信息缓存 */
    CurrentStudentInfo: IStudentInfo;

    /**当前学生 */
    CurrentClassInfo: IStudent[];

    /** 班级考试状态到单门开始列表的缓存 */
    CurrentClassExam: IClassExam;
}
