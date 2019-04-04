import { Component, OnInit } from '@angular/core';
import { IClassExam } from 'src/app/Home/Common/Education.model';
import { HomeService } from '../Common/Home.service';

@Component({
    templateUrl: 'ExamClassDiff.html',
})
export class ExamClassDiffComponent implements OnInit {
    Exams: IClassExam[];
    Title:string;
    subTitle:string; 
    ngOnInit(): void {
        this.Exams = this.service.CourseDiffInfo;
        this.Title = this.Exams[0].record.numberName;
        this.subTitle = this.Exams[0].record.grade + " - " + this.Exams[0].record.subName;
    }
    constructor(
        public service: HomeService
    ) { }
}
