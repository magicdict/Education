import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { IScore } from 'src/app/Home/Common/Education.model';
import { Table } from 'primeng/table';
import { Dropdown } from 'primeng/dropdown';
import { Router } from '@angular/router';
import { CommonFunction } from '../common'
@Component({
    selector: 'exam-list',
    templateUrl: 'ExamList.html',
})
export class ExamListComponent implements OnChanges {


    cols = [
        { field: 'studentID', header: "学号" },
        { field: 'studentName', header: "姓名" },
        { field: 'numberName', header: "考试名称" },
        { field: 'subName', header: "科目" },
        { field: 'score', header: "分数" },
        { field: 'scorePercent', header: "得分率" },
        { field: 'gradeAvgDiff', header: "年级离均值" },
        { field: 'classAvgDiff', header: "班级离均值" },
        { field: 'tScore', header: "T分数" },
        { field: 'zScore', header: "Z分数" },
        { field: 'dengdi', header: "等第" },
        { field: 'classRank', header: "班级排名" },
        { field: 'gradeRank', header: "年级排名" },
        { field: 'gradeRankPercent', header: "年级排名百分比" }
    ];

    @Input() CSVFilename: string = "download";

    ngOnChanges(): void {
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
        this.dt.filter("", 'record.subName', 'equals')
        if (this.subnamelist !== undefined) {
            this.subnamelist.value = null;
        }
        //console.log("成绩列表变更");
    }

    @Input() IsColorful = true;

    @Input() Scores: IScore[];

    @Input() scrollHeight: string = "400px";

    @Input() Mode: string = "SAME";

    subName: { label: string, value: string }[] = [];

    @ViewChild("dt") dt: Table;

    @ViewChild("subnamelist") subnamelist: Dropdown;

    roundvalue = CommonFunction.roundvalue;

    onRowSelect(event: { data: IScore; }) {
        //默认方法
        if (this.Mode == "SAME") return;
        this.router.navigate(['student/overview', event.data.studentID]);
    }
    /**根据年级排名设定行颜色 */
    public GetStyle(itemData: IScore): any {
        if (!this.IsColorful) return {};
        if (itemData.score <= 0) {
            return { 'background': 'lightgray' }
        }
        if (itemData.type !== '4' && itemData.type !== '22') {
            if (itemData.gradeRankPercent <= 10) {
                return { 'background': 'lightgreen' }
            }
            if (itemData.gradeRankPercent >= 90) {
                return { 'background': 'pink' }
            }
        }
        return {};
    }

    constructor(
        private router: Router,
    ) { }
}
