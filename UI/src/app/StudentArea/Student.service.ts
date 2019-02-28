import { Injectable } from '@angular/core';
import { CommonFunction } from '../common';
import { IStudent } from './student.model';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
@Injectable()
export class StudentService implements Resolve<IStudent[]>{
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): IStudent[] | Observable<IStudent[]> | Promise<IStudent[]> {
        //let id = route.paramMap.get('id');
        let id = "14151";
        return this.QueryByStudentId(id);
    }

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
