import { Component, Input, OnInit, OnChanges, ViewChild } from '@angular/core';
import { IClassExam, IScore } from 'src/app/Home/Common/Education.model';
import { Table } from 'primeng/table';
import { Dropdown } from 'primeng/dropdown';
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

    subName: { label: string, value: string }[] = [];

    @ViewChild("dt") dt: Table;

    @ViewChild("subnamelist") subnamelist: Dropdown;

    constructor(
    ) { }
}
