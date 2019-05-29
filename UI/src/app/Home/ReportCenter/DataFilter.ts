import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonFunction } from '../Common/common';
import { HomeService } from '../Common/Home.service';
import { SelectItem } from 'primeng/api';
import { IStudent } from '../Common/Education.model';
import { ErrorMessageDialogComponent } from '../Common/error-message-dialog/error-message-dialog.component';
@Component({
    selector: "data-filter",
    templateUrl: 'DataFilter.html'
})
export class DataFilterComponent implements OnInit {
    constructor(
        private service: HomeService,
        private common: CommonFunction
    ) {

    }

    @ViewChild(ErrorMessageDialogComponent)
    private errMsgDialog: ErrorMessageDialogComponent;
    @Output() GotoNextPage = new EventEmitter();
    FullClassOne: SelectItem[] = [];
    FullClassTwo: SelectItem[] = [];
    FullClassThree: SelectItem[] = [];

    SelectClassGradeOne: SelectItem[] = [];
    SelectClassGradeTwo: SelectItem[] = [];
    SelectClassGradeThree: SelectItem[] = [];

    SelectClassGradeOne_2: SelectItem[] = [];
    SelectClassGradeTwo_2: SelectItem[] = [];
    SelectClassGradeThree_2: SelectItem[] = [];


    Sexs = [
        { label: '不限', value: '' },
        { label: '男', value: '男' },
        { label: '女', value: '女' }
    ]
    selectedSex: string = '';
    selectedSex_2: string = '';


    LiveAtSchool = [
        { label: '不限', value: '' },
        { label: '住校生', value: '是' },
        { label: '非住校生', value: '否' }
    ]
    IsLiveAtSchool: string = '';
    IsLiveAtSchool_2: string = '';

    NativeZhejiang = [
        { label: '不限', value: '' },
        { label: '浙江省', value: '是' },
        { label: '浙江省之外', value: '否' }
    ]
    IsNativeZhejiang: string = '';
    IsNativeZhejiang_2: string = '';

    BornDateYears = [
        { label: '不限', value: '' },
        { label: '2000年', value: '2000' },
        { label: '2001年', value: '2001' },
        { label: '2002年', value: '2002' },
        { label: '2003年', value: '2003' },
    ];
    BornDate: string = '';
    BornDate_2: string = '';

    parmFirst: any = {};
    parmSecond: any = {};

    ngOnInit(): void {
        //班级数据的获得
        CommonFunction.clone(this.service.SchoolOverview.gradeClassInfoList).forEach(grade => {
            grade.items.forEach(classname => {
                if (grade.label === "高一") this.FullClassOne.push(classname);
                if (grade.label === "高二") this.FullClassTwo.push(classname);
                if (grade.label === "高三") this.FullClassThree.push(classname);
            });
        });
        //不能和{}比较！
        if (this.service.parmFirst.Sex !== undefined) {
            this.selectedSex = this.service.parmFirst.Sex;
            this.IsLiveAtSchool = this.service.parmFirst.IsLiveAtSchool;
            this.IsNativeZhejiang = this.service.parmFirst.IsNativeZhejiang;
            this.BornDate = this.service.parmFirst.BornDate;
            this.SelectClassGradeOne = this.service.parmFirst.SelectClassGradeOne;
            this.SelectClassGradeTwo = this.service.parmFirst.SelectClassGradeTwo;
            this.SelectClassGradeThree = this.service.parmFirst.SelectClassGradeThree;
        }

        if (this.service.parmSecond.Sex !== undefined) {
            this.selectedSex_2 = this.service.parmSecond.Sex;
            this.IsLiveAtSchool_2 = this.service.parmSecond.IsLiveAtSchool;
            this.IsNativeZhejiang_2 = this.service.parmSecond.IsNativeZhejiang;
            this.BornDate_2 = this.service.parmSecond.BornDate;
            this.SelectClassGradeOne_2 = this.service.parmSecond.SelectClassGradeOne_2;
            this.SelectClassGradeTwo_2 = this.service.parmSecond.SelectClassGradeTwo_2;
            this.SelectClassGradeThree_2 = this.service.parmSecond.SelectClassGradeThree_2;
        }
    }
    RunSearch() {
        let ClassIds = this.SelectClassGradeOne.concat(this.SelectClassGradeTwo).concat(this.SelectClassGradeThree);
        if (ClassIds.length == 0) {
            this.errMsgDialog.show("比较对象1,请至少选择一个班级");
            return;
        }
        this.parmFirst = {
            'Sex': this.selectedSex,
            'SelectClassGradeOne': this.SelectClassGradeOne,
            'SelectClassGradeTwo': this.SelectClassGradeTwo,
            'SelectClassGradeThree': this.SelectClassGradeThree,
            'IsNativeZhejiang': this.IsNativeZhejiang,
            'ClassIds': ClassIds.map(x => x.value),
            'IsLiveAtSchool': this.IsLiveAtSchool,
            'BornDate': this.BornDate
        };

        this.common.httpRequestPost<IStudent[]>("Student/QueryByFilter", this.parmFirst).then(
            r => {
                if (r.length == 0) {
                    this.errMsgDialog.show("比较对象1,查询结果为空");
                    return;
                } else {
                    let ClassIds_2 = this.SelectClassGradeOne_2.concat(this.SelectClassGradeTwo_2).concat(this.SelectClassGradeThree_2);
                    if (ClassIds_2.length == 0) {
                        this.errMsgDialog.show("比较对象2，如果不选择班级或者检索结果为空，则进入仅展示模式");
                    }
                    this.parmSecond = {
                        'Sex': this.selectedSex_2,
                        'SelectClassGradeOne_2': this.SelectClassGradeOne_2,
                        'SelectClassGradeTwo_2': this.SelectClassGradeTwo_2,
                        'SelectClassGradeThree_2': this.SelectClassGradeThree_2,
                        'IsNativeZhejiang': this.IsNativeZhejiang_2,
                        'ClassIds': ClassIds_2.map(x => x.value),
                        'IsLiveAtSchool': this.IsLiveAtSchool_2,
                        'BornDate': this.BornDate_2
                    };
                    this.service.parmFirst = this.parmFirst;
                    this.service.parmSecond = this.parmSecond;
                    this.GotoNextPage.emit();
                }
            }
        );
    }
}