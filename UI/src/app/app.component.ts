import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
  ngOnInit(): void {

  }
  constructor(

    private router: Router,
    private route: ActivatedRoute) { }

  navTo(url: string) {
    this.router.navigate([url], { relativeTo: this.route });
  }
}
