import { Component, Input } from '@angular/core';
import { HomeService } from '../Home.service';
import { IStudent } from '../Education.model';

@Component({
  selector: 'student-header',
  templateUrl: 'StudentHeader.html',
})
export class StudentHeaderComponent {
  constructor(
    public service: HomeService
  ) {

  }
  @Input() CurrentStudent: IStudent;
}
