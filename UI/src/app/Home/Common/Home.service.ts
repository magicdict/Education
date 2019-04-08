import { Injectable } from '@angular/core';
import { CommonFunction } from './common';
import { IStudent, IStudentInfo, ITeacherInfo, IClassExam, IStudentMonthlyConsumption, ISchoolInfo } from './Education.model';

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
    public QueryByStudentId(StudentId: string): Promise<IStudent> {
        return this.commonFunction.httpRequest<any>('Student/QueryByStudentId?ID=' + StudentId);
    }
    public QueryByLiveRoomNo(RoomNo: string,Campus:string): Promise<Array<IStudent>> {
        return this.commonFunction.httpRequest<any>('Student/QueryByLiveRoomNo?ID=' + RoomNo + "&Campus=" + Campus);
    }
    public QueryByNation(Nation: string): Promise<Array<IStudent>> {
        return this.commonFunction.httpRequest<any>('Student/QueryByNation?Nation=' + Nation);
    }
    public QueryByPolicy(Policy: string): Promise<Array<IStudent>> {
        return this.commonFunction.httpRequest<any>('Student/QueryByPolicy?Policy=' + Policy);
    }
    /** 月度消费 */
    public GetStudentWithMonthLimit(limit: number): Promise<IStudentMonthlyConsumption[]> {
        return this.commonFunction.httpRequest<any>('Consumption/GetStudentWithMonthLimit?limit=' + limit);
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

    /** 学校总体信息 */    
    SchoolOverview:ISchoolInfo;

    /** 学生信息缓存 */
    CurrentStudentInfo: IStudentInfo;

    CurrentClassInfo: IStudent[];

    CurrentClassExam: IClassExam;
}
