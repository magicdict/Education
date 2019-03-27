import { Injectable } from '@angular/core';
import { CommonFunction } from './common';
import { IStudent, IStudentInfo, ITeacher, ITeacherInfo, IClassExam } from './Education.model';

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
    /** 学生信息缓存 */
    CurrentStudentInfo: IStudentInfo;

    CurrentClassInfo: IStudent[];

    CourseDiffInfo:IClassExam[];

    CourseDiffInfoTitle:string;
}
