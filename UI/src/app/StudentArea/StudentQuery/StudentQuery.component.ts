import { Component } from '@angular/core';
import { StudentService } from '../Student.service';
import { IStudent } from '../student.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: 'StudentQuery.html',
})
export class StudentQueryComponent {
  constructor(
    public studentSerice: StudentService,
    private router: Router,
    private route: ActivatedRoute
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
  StudentOverview() {
    this.router.navigate(['overview'], { relativeTo: this.route });
  }
}
