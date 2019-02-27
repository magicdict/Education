import { Component } from '@angular/core';
import { StudentService } from '../Student.service';

@Component({
  templateUrl: 'StudentQuery.html',
})
export class StudentQueryComponent {
  constructor(
    public studentSerice: StudentService
  ) { }
  Query() {
    this.studentSerice.GetStudentInfoByID("14454").then(
      r => {
        console.log(r.baseInfo.bf_Name);
      }
    )
  }
}
