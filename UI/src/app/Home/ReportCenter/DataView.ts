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


    ngOnInit(): void {
        //console.log("ngOnInit");
        this.parmFirst = this.service.parmFirst;
        this.parmSecond = this.service.parmSecond;
        this.common.httpRequestPost<IStudent[]>("Student/QueryByFilter", this.parmFirst).then(
            r => {
                this.FilterResult = r;
            }
        )
        this.common.httpRequestPost<IStudent[]>("Student/QueryByFilter", this.parmSecond).then(
            r => {
                this.FilterResult_2 = r;
            }
        )
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