import { OnInit, Output, EventEmitter, Component } from '@angular/core';
import { HomeService } from '../Common/Home.service';
import { CommonFunction } from '../Common/common';
import { IClassInfo, IStudent } from '../Common/Education.model';
@Component({
    selector: "data-view",
    templateUrl: 'DataView.html',
})
export class DataViewComponent implements OnInit {
    constructor(
        private service: HomeService,
        private common: CommonFunction
    ) {

    }
    cols = [
        { field: 'id', header: "学号" },
        { field: 'name', header: "姓名" },
        { field: 'sex', header: "性别" },
        { field: 'bornDate', header: "出生年" },
        { field: 'policy', header: "政治面貌" },
        { field: 'nation', header: "民族" },
        { field: 'nativePlace', header: "出生地" },
    ];
    FilterResult: IStudent[] = [];
    FilterResult_2: IStudent[] = [];

    parmFirst: any = {};
    parmSecond: any = {};
    @Output() GotoNextPage = new EventEmitter();
    @Output() GotoPreviousPage = new EventEmitter();
    Description1 = "";
    Description2 = "";


    ngOnInit(): void {
        //console.log("ngOnInit");
        this.parmFirst = this.service.parmFirst;
        this.parmSecond = this.service.parmSecond;
        this.common.httpRequestPost<IStudent[]>("Student/QueryByFilter", this.parmFirst).then(
            r => {
                this.FilterResult = r;
                this.Description1 = this.GetDescription(this.service.parmFirst, r.length);
            }
        )
        this.common.httpRequestPost<IStudent[]>("Student/QueryByFilter", this.parmSecond).then(
            r => {
                this.FilterResult_2 = r;
                if (r.length !== 0){
                    this.Description2 = this.GetDescription(this.service.parmSecond, r.length);
                }
            }
        )
    }
    GetDescription(parm: any, cnt: number): string {
        let description = "";
        if (parm.Sex !== "") {
            description += "性别：" + parm.Sex + " ";
        } else {
            description += "性别：不限 ";
        }
        if (parm.IsNativeZhejiang !== "") {
            if (parm.IsNativeZhejiang === "是") {
                description += "出生地：浙江省 ";
            } else {
                description += "出生地：非浙江省 ";
            }
        } else {
            description += "出生地：不限 ";
        }
        if (parm.IsLiveAtSchool !== "") {
            description += "住校：" + parm.IsLiveAtSchool + " ";
        } else {
            description += "住校：不限 ";
        }
        if (parm.BornDate !== "") {
            description += "出生年：" + parm.BornDate + " ";
        } else {
            description += "出生年：不限 ";
        }
        description += "班级数：" + parm.ClassIds.length;
        description += " 人数：" + cnt;
        return description;
    }
    GoToFilter() {
        this.GotoPreviousPage.emit();
    }
    GoToVisualFactory() {
        this.common.httpRequestPost<IClassInfo>("Student/VisualDateForFilter", this.parmFirst).then(
            r => {
                this.service.FilterDataClassInfo = r;
                this.service.FilterDataClassInfo_2 = null;
                if (this.FilterResult_2.length !== 0) {
                    this.common.httpRequestPost<IClassInfo>("Student/VisualDateForFilter", this.parmSecond).then(
                        r => {
                            this.service.FilterDataClassInfo_2 = r;
                            this.GotoNextPage.emit();
                        }
                    )
                } else {
                    this.GotoNextPage.emit();
                }
            }
        )
    }
}