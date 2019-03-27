import { Component, Input } from '@angular/core';
import { IClassExam } from 'src/app/Education.model';

@Component({
    selector: 'class-exam-list',
    templateUrl: 'ClassExamList.html',
})
export class ClassExamListComponent {
    @Input() Exams: IClassExam[];

    @Input() FunRowSelect: (event: { data: IClassExam; }) => void;

    onRowSelect(event: { data: IClassExam; }) {
        if (this.FunRowSelect !== undefined) {
            this.FunRowSelect(event);
        } else {
            //默认方法
            console.log(event.data.className);
        }
    }
}
