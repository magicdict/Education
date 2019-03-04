import { Injectable } from '@angular/core';
import { CommonFunction } from '../common';
import { IGroupInfo } from './Group.model';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
@Injectable()
export class GroupService implements Resolve<IGroupInfo>{
    resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): IGroupInfo | Observable<IGroupInfo> | Promise<IGroupInfo> {
        return this.commonFunction.httpRequest<IGroupInfo>("group/GetOverview");
    }

    constructor(public commonFunction: CommonFunction) {

    }

}
