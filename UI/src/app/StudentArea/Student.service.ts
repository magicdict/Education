import { Injectable } from '@angular/core';
import { CommonFunction } from '../common';
@Injectable()
export class StudentService {
    constructor(public commonFunction: CommonFunction) {

    }
    
    public GetStudentInfoByID(StudentId: string): Promise<any> {
        return this.commonFunction.httpRequest<any>('Student/GetStudentInfo?ID=' + StudentId);
    }
}
