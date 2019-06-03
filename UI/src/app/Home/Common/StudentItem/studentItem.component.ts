import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'student-item',
    templateUrl: './studentItem.component.html'
})
export class StudentItemComponent {
    @Input() Sex: string;
    @Input() StudentId: string;
    @Input() Title: string;
    @Input() SubTitle: string;
    constructor(
        private router: Router,
    ) { }

    JumpTo(studentId: string) {
        this.router.navigate(['student/overview', studentId]);
    }
} 