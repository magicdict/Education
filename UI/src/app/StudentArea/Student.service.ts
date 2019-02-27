import { Injectable } from '@angular/core';
import { CommonFunction } from '../common';
import { IStudent} from './student.model';
@Injectable()
export class StudentService {
    constructor(public commonFunction: CommonFunction) {

    }
    public QueryByStudentId(StudentId: string): Promise<IStudent[]> {
        return this.commonFunction.httpRequest<any>('Student/QueryByStudentId?ID=' + StudentId);
    }
    public QueryByClassId(StudentId: string): Promise<IStudent[]> {
        return this.commonFunction.httpRequest<any>('Student/QueryByClassId?ID=' + StudentId);
    }
    public GetStudentInfoByID(StudentId: string): Promise<any> {
        return this.commonFunction.httpRequest<any>('Student/GetStudentInfo?ID=' + StudentId);
    }
}
