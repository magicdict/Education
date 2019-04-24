import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { IClassExam } from 'src/app/Home/Common/Education.model';
import { Router } from '@angular/router';
import { HomeService } from '../Home.service';
import { Table } from 'primeng/table';
import { Dropdown } from 'primeng/dropdown';
@Component({
    selector: 'class-exam-list',
    templateUrl: 'ClassExamList.html',
})
export class ClassExamListComponent implements OnChanges {

    @Input() Exams: IClassExam[];

    @Input() scrollHeight: string = "400px";

    @Input() FunRowSelect: (event: { data: IClassExam; }) => void;

    @ViewChild("dt") dt: Table;

    @ViewChild("subnamelist") subnamelist: Dropdown;

    @Input() IsShowExamName: boolean = true;

    /**统计条目 */
    @Input() Footer: IClassExam = null;

    @Input() CSVFilename:string = "download";

    cols = [
        { field: 'record.className', header: "班级名" },
        { field: 'record.numberName', header: "考试名称" },
        { field: 'record.typeName', header: "考试类型" },
        { field: 'record.term', header: "学期" },
        { field: 'record.subName', header: "学科" },
        { field: 'avilibleCnt', header: "有效人数" },
        { field: 'allCnt', header: "总人数" },
        { field: 'maxScore', header: "最高分" },
        { field: 'minScore', header: "最低分" },
        { field: 'avgScore', header: "平均分" },
        { field: 'std', header: "标准差" },
        { field: 'var', header: "方差" }
    ];


    ngOnChanges(): void {
        this.subName = [];
        this.subName.push({ label: "全部", value: null });
        this.Exams.map(x => x.record.subName).forEach(
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
        console.log("成绩列表变更");
    }


    subName: { label: string, value: string }[] = [];

    constructor(
        private router: Router,
        private service: HomeService
    ) { }

    onRowSelect(event: { data: IClassExam; }) {
        if (this.FunRowSelect !== undefined) {
            this.FunRowSelect(event);
        } else {
            //默认方法
            if (event.data.record.className === "年级组") return;
            this.service.CurrentClassExam = event.data;
            this.router.navigate(["exam/detail", event.data.record.idForClass]);
        }
    }
}
