import { Component, OnInit } from '@angular/core';
import { IClassExam } from 'src/app/Education.model';
import { HomeService } from '../Home.service';

@Component({
    templateUrl: 'SingleExamClass.html',
})
export class SingleExamClassComponent implements OnInit {
    Exams: IClassExam[];
    ngOnInit(): void {
        this.Exams = this.service.CourseDiffInfo; 
    }
    constructor(
        public service: HomeService
    ) { }
    
    onRowSelect(event: { data: IClassExam; }) {
        console.log(event.data.className);
    }
}