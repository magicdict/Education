import { Component } from '@angular/core';
import { StudentService } from '../Student.service';
import { IStudent } from '../student.model';

@Component({
  templateUrl: 'StudentQuery.html',
})
export class StudentQueryComponent {
  constructor(
    public studentSerice: StudentService,
  ) { }


  public StudentId: string;
  public ClassId: string;

  public QueryResult: IStudent[];


  QueryByStudentId() {
    this.studentSerice.QueryByStudentId(this.StudentId).then(
      r => {
        this.QueryResult = r;
      }
    )
  }
  QueryByClassId() {
    this.studentSerice.QueryByClassId(this.ClassId).then(
      r => {
        this.QueryResult = r;
      }
    )
  }
}
