import { Injectable } from '@angular/core';
import { CommonFunction } from './common';
import { ISchoolInfo, ICourse, IClassInfo, IStudentInfo, ISchoolConsumptionInfo, ITeacherInfo, IExamList, IScore, IKaoqinOverview, ICompareStudentInfo } from './Education.model';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { HomeService } from './Home.service'

@Injectable()
export class ICompareStudentResolver implements Resolve<ICompareStudentInfo> {
    constructor(public commonFunction: CommonFunction) {

    }
    resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): ICompareStudentInfo | Observable<ICompareStudentInfo> | Promise<ICompareStudentInfo> {
        let secondid = route.paramMap.get('secondid');
        let firstid = route.paramMap.get('firstid');
        return this.commonFunction.httpRequest<ICompareStudentInfo>("Student/CompareStudent?firstid=" + firstid + "&secondid=" + secondid);
    }
}


@Injectable()
export class IExamGradeListResolver implements Resolve<IExamList> {
    constructor(public commonFunction: CommonFunction) {

    }
    resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): IExamList | Observable<IExamList> | Promise<IExamList> {
        return this.commonFunction.httpRequest<IExamList>("course/GetExamNameList");
    }
}

@Injectable()
export class ISingleExamInfoResolver implements Resolve<Array<IScore>> {
    constructor(public commonFunction: CommonFunction) {

    }
    resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Array<IScore> | Observable<Array<IScore>> | Promise<Array<IScore>> {
        let id = route.paramMap.get('id');
        return this.commonFunction.httpRequest<Array<IScore>>("course/GetExamForSingleExam?IdForClass=" + id);
    }
}

@Injectable()
export class IKaoqinInfoResolver implements Resolve<IKaoqinOverview> {
    constructor(public commonFunction: CommonFunction) {

    }
    resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): IKaoqinOverview | Observable<IKaoqinOverview> | Promise<IKaoqinOverview> {
        return this.commonFunction.httpRequest<IKaoqinOverview>("kaoqin/GetKaoqinOverview");
    }
}

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
export class ITeacherInfoResolver implements Resolve<ITeacherInfo> {
    constructor(private homeservice: HomeService) {

    }
    resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): ITeacherInfo | Observable<ITeacherInfo> | Promise<ITeacherInfo> {
        let id = route.paramMap.get('id');
        return this.homeservice.QueryByTeacherId(id);
    }
}

@Injectable()
export class ISchoolInfoResolver implements Resolve<ISchoolInfo>{
    resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): ISchoolInfo | Observable<ISchoolInfo> | Promise<ISchoolInfo> {
        return this.commonFunction.httpRequest<ISchoolInfo>("school/GetOverview");
    }
    constructor(public commonFunction: CommonFunction) {

    }
}

@Injectable()
export class IClassInfoResolver implements Resolve<IClassInfo>{
    resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): IClassInfo | Observable<IClassInfo> | Promise<IClassInfo> {
        let id = route.paramMap.get("id");
        return this.commonFunction.httpRequest<IClassInfo>("class/GetClassOverview?ClassId=" + id);
    }
    constructor(public commonFunction: CommonFunction) {

    }
}

@Injectable()
export class ICourseResolver implements Resolve<ICourse>{
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): ICourse | Observable<ICourse> | Promise<ICourse> {
        let type = route.paramMap.get("type");
        return this.commonFunction.httpRequest<ICourse>("course/GetOverview?ExamType=" + type);
    }
    constructor(public commonFunction: CommonFunction) {

    }
}

@Injectable()
export class ISchoolConsumptionResolver implements Resolve<ISchoolConsumptionInfo>{
    resolve(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): ISchoolConsumptionInfo | Observable<ISchoolConsumptionInfo> | Promise<ISchoolConsumptionInfo> {
        return this.commonFunction.httpRequest<ISchoolConsumptionInfo>("Consumption/GetSchoolConsumptionInfo");
    }
    constructor(public commonFunction: CommonFunction) {

    }
}
