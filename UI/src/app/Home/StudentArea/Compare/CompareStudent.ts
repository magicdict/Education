import { Component, OnInit } from '@angular/core';
import { ICompareStudentInfo, IStudent, IChengjiSimple } from '../../Common/Education.model';
import { ActivatedRoute } from '@angular/router';
@Component({
    templateUrl: 'CompareStudent.html',
})
export class CompareStudentComponent implements OnInit {

    cols = [
        { field: 'numberName', header: "考试" },
        { field: 'subName', header: "科目" },
        { field: 'score', header: "分数" },
        { field: 'compareToScore', header: "分数" },
        { field: 'resultText', header: "结果" }
    ];

    FirstStudent: IStudent;
    SecondStudent: IStudent;
    Scores: IChengjiSimple[];
    ngOnInit(): void {
        this.route.data
            .subscribe((data: { compareinfo: ICompareStudentInfo }) => {
                this.FirstStudent = data.compareinfo.first;
                this.SecondStudent = data.compareinfo.second;
                this.Scores = data.compareinfo.examResult;
            });
    }
    constructor(
        private route: ActivatedRoute
    ) {

    }

    getRowStyle(chengji: IChengjiSimple): any {
        if (chengji.subId == "99") {
            if (chengji.result === "1") {
                return { 'background': 'lightgreen', 'font-weight': 'bolder' };
            }
            if (chengji.result === "-1") {
                return { 'background': 'pink', 'font-weight': 'bolder' };
            }
            if (chengji.result === "-" || chengji.result === "-8" || chengji.result === "-9") {
                return { 'background': 'lightgray', 'font-weight': 'bolder' };
            }
        }
        return {};
    }
}