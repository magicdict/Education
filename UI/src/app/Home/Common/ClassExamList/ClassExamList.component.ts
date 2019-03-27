import { Component, Input } from '@angular/core';
import { IClassExam } from 'src/app/Education.model';

@Component({
    selector: 'class-exam-list',
    templateUrl: 'ClassExamList.html',
})
export class ClassExamListComponent {
    @Input() Exams: IClassExam[];
}
