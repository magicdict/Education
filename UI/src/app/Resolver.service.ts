import { Injectable } from '@angular/core';
import { CommonFunction } from './common';
import { IGroupInfo, ICourse } from './Education.model';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class IGroupInfoResolver implements Resolve<IGroupInfo>{
    resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): IGroupInfo | Observable<IGroupInfo> | Promise<IGroupInfo> {
        return this.commonFunction.httpRequest<IGroupInfo>("group/GetOverview");
    }
    constructor(public commonFunction: CommonFunction) {

    }
}

@Injectable()
export class ICourseResolver implements Resolve<ICourse>{
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): ICourse | Observable<ICourse> | Promise<ICourse> {
        return this.commonFunction.httpRequest<ICourse>("course/GetOverview");
    }
    constructor(public commonFunction: CommonFunction) {

    }
}
