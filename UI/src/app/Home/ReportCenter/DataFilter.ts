import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonFunction } from '../Common/common';
import { HomeService } from '../Common/Home.service';
import { SelectItem, MessageService } from 'primeng/api';
import { IStudent, IClassInfo } from '../Common/Education.model';
import { ErrorMessageDialogComponent } from '../Common/error-message-dialog/error-message-dialog.component';
@Component({
    selector: "data-filter",
    templateUrl: 'DataFilter.html',
    providers: [MessageService],
})
export class DataFilterComponent implements OnInit {
    constructor(
        private service: HomeService,
        private messageService: MessageService,
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

    NativeZhejiang = [
        { label: '不限', value: '' },
        { label: '浙江省', value: '是' },
        { label: '浙江省之外', value: '否' }
    ]
    IsNativeZhejiang: string = '';

    parm :any = {};

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
        this.parm = { 'Sex': this.selectedSex, 
                     'IsNativeZhejiang':this.IsNativeZhejiang,
                     'ClassIds': ClassIds.map(x => x.value), 
                     'IsLiveAtSchool': this.IsLiveAtSchool };

        this.common.httpRequestPost<IStudent[]>("Student/QueryByFilter", this.parm).then(
            r => {
                if (r.length == 0) {
                    this.errMsgDialog.show("查询结果为空");
                } else {
                    this.FilterResult = r;
                    this.DataPicked.emit();
                    this.messageService.add({severity:'success', summary: '查询完毕', detail:'符合条件人数：' + r.length});
                }
            }
        );
    }
    GoToVisualFactory() {
        if (this.FilterResult.length == 0) {
            this.errMsgDialog.show("请先选择可视化用学生数据");
            return;
        } else {
            this.common.httpRequestPost<IClassInfo>("Student/VisualDateForFilter", this.parm).then(
                r => {
                    this.service.FilterDataClassInfo = r;
                    this.GotoNextPage.emit();
                }
            ) 
        }
    }
}