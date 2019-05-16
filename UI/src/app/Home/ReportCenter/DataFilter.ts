import { Component, OnInit } from '@angular/core';
import { CommonFunction } from '../Common/common';
import { HomeService } from '../Common/Home.service';
import { SelectItem } from 'primeng/api';
import { IStudent } from '../Common/Education.model';
@Component({
    templateUrl: 'DataFilter.html',
})
export class DataFilterComponent implements OnInit {
    constructor(
        private service: HomeService,
        private common: CommonFunction
    ) {

    }
    FullClassOne: SelectItem[] = [];
    FullClassTwo: SelectItem[] = [];
    FullClassThree: SelectItem[] = [];
    SelectClassGradeOne: SelectItem[] = [];
    SelectClassGradeTwo: SelectItem[] = [];
    SelectClassGradeThree: SelectItem[] = [];

    Sexs = [
        { label: '全部', value: '' },
        { label: '男', value: '男' },
        { label: '女', value: '女' }
    ]
    selectedSex: string = '';
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
        let parm = { 'Sex': this.selectedSex, 'ClassIds': this.SelectClassGradeOne.map(x => x.value) };
        this.common.httpRequestPost<IStudent[]>("Student/QueryByFilter", parm).then(
            r => {
                console.log("获得学生：" + r.length)
            }
        );
    }
}