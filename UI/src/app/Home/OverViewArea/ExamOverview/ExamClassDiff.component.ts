import { Component, OnInit } from '@angular/core';
import { IClassExam } from 'src/app/Education.model';
import { HomeService } from '../../Home.service';

@Component({
    templateUrl: 'ExamClassDiff.html',
})
export class ExamClassDiffComponent implements OnInit {
    Exams: IClassExam[];
    ngOnInit(): void {
        this.Exams = this.service.CourseDiffInfo;
    }
    constructor(
        public service: HomeService
    ) { }
}
