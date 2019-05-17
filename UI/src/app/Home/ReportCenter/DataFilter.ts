import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonFunction } from '../Common/common';
import { HomeService } from '../Common/Home.service';
import { SelectItem } from 'primeng/api';
import { IStudent, IStudentGroupProperty } from '../Common/Education.model';
import { ErrorMessageDialogComponent } from '../Common/error-message-dialog/error-message-dialog.component';
@Component({
    selector: "data-filter",
    templateUrl: 'DataFilter.html',
})
export class DataFilterComponent implements OnInit {
    constructor(
        private service: HomeService,
        private common: CommonFunction
    ) {

    }
    @ViewChild(ErrorMessageDialogComponent)
    private errMsgDialog: ErrorMessageDialogComponent;
    @Output() DataPicked = new EventEmitter();
    @Output() GotoNextPage = new EventEmitter();
    FullClassOne: SelectItem[] = [];
    FullClassTwo: SelectItem[] = [];
    FullClassThree: SelectItem[] = [];
    SelectClassGradeOne: SelectItem[] = [];
    SelectClassGradeTwo: SelectItem[] = [];
    SelectClassGradeThree: SelectItem[] = [];
    Sexs = [
        { label: '不限', value: '' },
        { label: '男', value: '男' },
        { label: '女', value: '女' }
    ]
    selectedSex: string = '';
    LiveAtSchool = [
        { label: '不限', value: '' },
        { label: '住校生', value: '是' },
        { label: '非住校生', value: '否' }
    ]
    IsLiveAtSchool: string = '';

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

    ngOnInit(): void {
        //班级数据的获得
        CommonFunction.clone(this.service.SchoolOverview.gradeClassInfoList).forEach(grade => {
            grade.items.forEach(classname => {
                if (grade.label === "高一") this.FullClassOne.push(classname);
                if (grade.label === "高二") this.FullClassTwo.push(classname);
                if (grade.label === "高三") this.FullClassThree.push(classname);
            });
        });
    }
    RunSearch() {
        let ClassIds = this.SelectClassGradeOne.concat(this.SelectClassGradeTwo).concat(this.SelectClassGradeThree);
        if (ClassIds.length == 0) {
            this.errMsgDialog.show("请至少选择一个班级");
            return;
        }
        let parm = { 'Sex': this.selectedSex, 'ClassIds': ClassIds.map(x => x.value), 'IsLiveAtSchool': this.IsLiveAtSchool };
        this.common.httpRequestPost<IStudent[]>("Student/QueryByFilter", parm).then(
            r => {
                if (r.length == 0) {
                    this.errMsgDialog.show("查询结果为空");
                } else {
                    this.FilterResult = r;
                    this.DataPicked.emit();
                }
            }
        );
    }
    GoToVisualFactory() {
        if (this.FilterResult.length == 0) {
            this.errMsgDialog.show("请先选择可视化用学生数据");
            return;
        } else {
            let ClassIds = this.SelectClassGradeOne.concat(this.SelectClassGradeTwo).concat(this.SelectClassGradeThree);
            let parm = { 'Sex': this.selectedSex, 'ClassIds': ClassIds.map(x => x.value), 'IsLiveAtSchool': this.IsLiveAtSchool };
            this.common.httpRequestPost<IStudentGroupProperty>("Student/VisualDateForFilter", parm).then(
                r => {
                    this.service.FilterDataGroupProperty = r;
                    this.GotoNextPage.emit();
                }
            )
        }
    }
}