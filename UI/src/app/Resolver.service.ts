import { Injectable } from '@angular/core';
import { CommonFunction } from './common';
import { IGroupInfo, ICourse, IClassInfo } from './Education.model';
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
export class IClassInfoResolver implements Resolve<IClassInfo>{
    resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): IClassInfo | Observable<IClassInfo> | Promise<IClassInfo> {
        let id = route.paramMap.get("id");
        return this.commonFunction.httpRequest<IClassInfo>("group/GetClassOverview?ClassId=" + id);
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
