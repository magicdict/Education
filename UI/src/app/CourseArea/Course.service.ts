import { Injectable } from '@angular/core';
import { CommonFunction } from '../common';
import { ICourse } from './Course.model';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
@Injectable()
export class CourseService implements Resolve<ICourse>{
    resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): ICourse | Observable<ICourse> | Promise<ICourse> {
        return this.commonFunction.httpRequest<ICourse>("course/GetOverview");
    }

    constructor(public commonFunction: CommonFunction) {

    }

}
