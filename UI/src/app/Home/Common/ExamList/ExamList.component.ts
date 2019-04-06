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
        this.subnamelist.value = null;
        console.log("成绩列表变更");
    }

    @Input() Scores: IScore[];

    @Input() scrollHeight: string = "400px";

    @Input() Mode: string = "Same";

    subName: { label: string, value: string }[] = [];

    @ViewChild("dt") dt: Table;

    @ViewChild("subnamelist") subnamelist: Dropdown;

    roundvalue = CommonFunction.roundvalue;

    onRowSelect(event: { data: IScore; }) {
        //默认方法
        this.router.navigate(['student/overview', event.data.studentID]);
    }

    constructor(
        private router: Router,
    ) { }
}
