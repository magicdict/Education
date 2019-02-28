import { Injectable } from '@angular/core';
import { CommonFunction } from '../common';
import { IStudent, IStudentInfo } from './student.model';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
@Injectable()
export class StudentService implements Resolve<IStudentInfo>{
    resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): IStudentInfo | Observable<IStudentInfo> | Promise<IStudentInfo> {
        let id = route.paramMap.get('id');
        return this.GetStudentInfoByID(id);
    }

    constructor(public commonFunction: CommonFunction) {

    }
    public QueryByStudentId(StudentId: string): Promise<IStudent[]> {
        return this.commonFunction.httpRequest<any>('Student/QueryByStudentId?ID=' + StudentId);
    }
    public QueryByClassId(StudentId: string): Promise<IStudent[]> {
        return this.commonFunction.httpRequest<any>('Student/QueryByClassId?ID=' + StudentId);
    }
    public GetStudentInfoByID(StudentId: string): Promise<IStudentInfo> {
        return this.commonFunction.httpRequest<any>('Student/GetStudentInfo?ID=' + StudentId);
    }
}
