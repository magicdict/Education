import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IExamList, IClassExam } from 'src/app/Education.model';
import { CommonFunction } from 'src/app/common';
import { HomeService } from '../../Home.service';

@Component({
    templateUrl: 'ExamOverView.html',
})
export class ExamOverViewComponent implements OnInit {
    Grade1: {
        grade: string,
        numberName: string,
        subNameList: string[]
    }[];
    Grade2: {
        grade: string,
        numberName: string,
        subNameList: string[]
    }[];
    Grade3: {
        grade: string,
        numberName: string,
        subNameList: string[]
    }[];
    ngOnInit(): void {
        this.route.data
            .subscribe((data: { examgradelist: IExamList }) => {
                this.Grade1 = data.examgradelist["高一"];
                this.Grade2 = data.examgradelist["高二"];
                this.Grade3 = data.examgradelist["高三"];
            });
    }
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private commonFunction: CommonFunction,
        public service: HomeService
    ) { }

    JumpToExam(numberName: string, subName: string, Grade: string) {
        var request = "course/GetExamInfoByNumberAndSubName?numberName=" + numberName + "&subName=" + subName + "&Grade=" + Grade;
        
        this.commonFunction.httpRequest<IClassExam[]>(request).then(
            r => {
                this.service.CourseDiffInfo = r;
                this.service.CourseDiffInfoTitle = "[" + Grade + "]" + numberName + "(" + subName + ")";
                this.router.navigate(["course/classdiff"]);
            }
        );
    }
} 