import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from '../../Home.service';
import { Location } from '@angular/common';

@Component({
  selector: 'student-header',
  templateUrl: 'StudentHeader.html',
})
export class StudentHeaderComponent implements OnInit {
  constructor(
    private router: Router,
    private _location: Location,
    public service: HomeService
  ) {

  }
  CurrentStudent = this.service.CurrentStudentInfo.baseInfo;
  ngOnInit(): void {

  }
  Return() {
    this._location.back();
  }
  Home(){
    this.router.navigate(['']);
  }
}
