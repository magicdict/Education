import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
  ngOnInit(): void {

  }
  constructor(
    private router: Router,
    private _location: Location
  ) { }

  Return() {
    this._location.back();
  }
  Home() {
    this.router.navigate(['']);
  }
}
