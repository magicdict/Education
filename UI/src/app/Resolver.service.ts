import { Injectable } from '@angular/core';
import { CommonFunction } from './common';
import { IGroupInfo, ICourse, IClassInfo, IStudentInfo, ISchoolConsumptionInfo, ITeacher } from './Education.model';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { HomeService } from './Home/Home.service'

@Injectable()
export class IStudentInfoResolver implements Resolve<IStudentInfo> {
    constructor(private homeservice: HomeService) {

    }
    resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): IStudentInfo | Observable<IStudentInfo> | Promise<IStudentInfo> {
        let id = route.paramMap.get('id');
        return this.homeservice.GetStudentInfoByID(id);
    }
}

@Injectable()
export class ITeacherInfoResolver implements Resolve<ITeacher[]> {
    constructor(private homeservice: HomeService) {

    }
    resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): ITeacher[] | Observable<ITeacher[]> | Promise<ITeacher[]> {
        let id = route.paramMap.get('id');
        return this.homeservice.QueryByTeacherId(id);
    }
}

@Injectable()
export class IGroupInfoResolver implements Resolve<IGroupInfo>{
    resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): IGroupInfo | Observable<IGroupInfo> | Promise<IGroupInfo> {
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
    resolve(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): ICourse | Observable<ICourse> | Promise<ICourse> {
        return this.commonFunction.httpRequest<ICourse>("course/GetOverview");
    }
    constructor(public commonFunction: CommonFunction) {

    }
}

@Injectable()
export class ISchoolConsumptionResolver implements Resolve<ISchoolConsumptionInfo>{
    resolve(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): ISchoolConsumptionInfo | Observable<ISchoolConsumptionInfo> | Promise<ISchoolConsumptionInfo> {
        return this.commonFunction.httpRequest<ISchoolConsumptionInfo>("group/GetSchoolConsumptionInfo");
    }
    constructor(public commonFunction: CommonFunction) {

    }
}
