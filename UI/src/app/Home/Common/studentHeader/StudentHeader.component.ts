import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../Home.service';

@Component({
  selector: 'student-header',
  templateUrl: 'StudentHeader.html',
})
export class StudentHeaderComponent implements OnInit {
  constructor(
    public service: HomeService
  ) {

  }
  CurrentStudent = this.service.CurrentStudentInfo.baseInfo;
  ngOnInit(): void {

  }
}
