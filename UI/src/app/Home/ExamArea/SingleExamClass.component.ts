import { Component, OnInit } from '@angular/core';
import { IScore } from 'src/app/Home/Common/Education.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    templateUrl: 'SingleExamClass.html',
})
export class SingleExamClassComponent implements OnInit {
    Scores: IScore[];
    ngOnInit(): void {
        this.route.data.subscribe((data: { singleExam: IScore[] }) => {
            this.Scores = data.singleExam;
        });
    }
    constructor(
        private route: ActivatedRoute,
        private router: Router,
    ) { }

    onRowSelect(event: { data: IScore; }) {
        this.router.navigate(['student/overview', event.data.studentID]);
    }
}