import { Component, OnInit } from '@angular/core';
import { StudentService } from '../Student.service';
import { IStudent } from '../student.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  templateUrl: 'StudentOverview.html',
})
export class StudentOverviewComponent implements OnInit {
  ngOnInit(): void {
    this.route.data
      .subscribe((data: { studentinfo: IStudent[] }) => {
        this.CurrentStudent = data.studentinfo[0];
      });
  }
  constructor(
    public studentSerice: StudentService,
    private route: ActivatedRoute,
    private router: Router,
  ) {

  }



  public CurrentStudent: IStudent;

}
