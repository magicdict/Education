import { Component, OnInit, ViewChild } from '@angular/core';
import { ICompareStudentInfo, IStudent, IChengjiSimple } from '../../Common/Education.model';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
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

    resultopt = [
        { label: "全部", value: null },
        { label: "好于", value: "好于" },
        { label: "差于", value: "差于" },
        { label: "一致", value: "一致" },
    ];

    FirstStudent: IStudent;
    SecondStudent: IStudent;
    Scores: IChengjiSimple[];
    subResult: { name: string, value: number }[] = [];

    subName: { label: string, value: string }[] = [];
    @ViewChild("dt", {static: false}) dt: Table;

    ngOnInit(): void {
        this.route.data
            .subscribe((data: { compareinfo: ICompareStudentInfo }) => {
                this.FirstStudent = data.compareinfo.first;
                this.SecondStudent = data.compareinfo.second;
                this.Scores = data.compareinfo.examResult;
                this.subResult = data.compareinfo.subResult;
                //过滤器的准备    
                this.subName = [];
                this.subName.push({ label: "全部", value: null });
                this.Scores.map(x => x.subName).forEach(
                    r => {
                        if (this.subName.map(x => x.label).indexOf(r) === -1) {
                            if (r !== "") {
                                this.subName.push({ label: r, value: r });
                            }
                        }
                    }
                );
                this.dt.filter("", 'subName', 'equals')
            });
    }


    constructor(
        private route: ActivatedRoute
    ) {

    }

    GetResultStyle(result: { name: string, value: number }) {
        if (result.value == 0) {
            return { 'margin': '10px 5px', 'cursor': 'default', 'color': 'black' };
        } else {
            if (result.value > 0) {
                return { 'margin': '10px 5px', 'cursor': 'default', 'color': 'black', 'background-color': 'lightgreen' };

            } else {
                return { 'margin': '10px 5px', 'cursor': 'default', 'color': 'black', 'background-color': 'pink' };
            }
        }
    }

    getRowStyle(chengji: IChengjiSimple): any {
        if (chengji.subId === "99" || chengji.subId === "98") {
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