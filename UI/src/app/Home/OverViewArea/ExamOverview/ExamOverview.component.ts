import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IExamList, IClassExam } from 'src/app/Home/Common/Education.model';
import { CommonFunction } from 'src/app/Home/Common/common';
import { HomeService } from '../../Common/Home.service';

@Component({
    templateUrl: 'ExamOverView.html',
})
export class ExamOverViewComponent implements OnInit, AfterViewInit {

    Exams: IClassExam[] = [];
    Title:string;
    subTitle:string; 

    GradeList: {
        name: string,
        value: {
            grade: string,
            numberName: string,
            subNameList: string[]
        }[]
    }[] = [];
    ngOnInit(): void {
        this.route.data
            .subscribe((data: { examgradelist: IExamList }) => {
                this.GradeList = [];
                this.GradeList.push({ name: "高一", value: data.examgradelist["高一"] });
                this.GradeList.push({ name: "高二", value: data.examgradelist["高二"] });
                this.GradeList.push({ name: "高三", value: data.examgradelist["高三"] });
            });
    }
    constructor(
        private route: ActivatedRoute,
        private commonFunction: CommonFunction,
        public service: HomeService,
        private cd: ChangeDetectorRef
    ) { }

    ngAfterViewInit() {
        //ExpressionChangedAfterItHasBeenCheckedError的对应
        //因为动态加载了Panel
        this.cd.detectChanges();
    }

    JumpToExam(numberName: string, subName: string, Grade: string) {
        var request = "course/GetExamInfoByNumberAndSubName?numberName=" + numberName + "&subName=" + subName + "&Grade=" + Grade;

        this.commonFunction.httpRequest<IClassExam[]>(request).then(
            r => {
                this.service.CourseDiffInfo = r;
                this.Exams = r;
                this.Title = this.Exams[0].record.numberName;
                this.subTitle = this.Exams[0].record.grade + " - " + this.Exams[0].record.subName;
            }
        );
    }
} 