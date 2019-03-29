import { Component, Input } from '@angular/core';
import { IClassExam } from 'src/app/Home/Common/Education.model';
import { Router } from '@angular/router';
import { HomeService } from '../Home.service';
@Component({
    selector: 'class-exam-list',
    templateUrl: 'ClassExamList.html',
})
export class ClassExamListComponent {

    @Input() Exams: IClassExam[];

    @Input() scrollHeight: string = "400px";

    @Input() FunRowSelect: (event: { data: IClassExam; }) => void;

    constructor(
        private router: Router,
        private service: HomeService
    ) { }

    onRowSelect(event: { data: IClassExam; }) {
        if (this.FunRowSelect !== undefined) {
            this.FunRowSelect(event);
        } else {
            //默认方法
            this.service.CurrentClassExam = event.data;
            this.router.navigate(["exam/detail", event.data.record.idForClass]);
        }
    }
}
