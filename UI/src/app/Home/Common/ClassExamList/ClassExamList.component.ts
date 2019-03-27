import { Component, Input } from '@angular/core';
import { IClassExam } from 'src/app/Education.model';
import { Router } from '@angular/router';

@Component({
    selector: 'class-exam-list',
    templateUrl: 'ClassExamList.html',
})
export class ClassExamListComponent {

    @Input() Exams: IClassExam[];

    @Input() scrollHeight:string = "400px";

    @Input() FunRowSelect: (event: { data: IClassExam; }) => void;

    constructor(
        private router: Router,
    ) { }

    onRowSelect(event: { data: IClassExam; }) {
        if (this.FunRowSelect !== undefined) {
            this.FunRowSelect(event);
        } else {
            //默认方法
            this.router.navigate(["exam/detail", event.data.id]);
        }
    }
}
