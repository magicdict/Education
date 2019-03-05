import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { registerMap } from 'echarts';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    //最初的页面就执行地图注册的操作
    this.http.get('assets/china.json')
      .subscribe(geoJson => {
        registerMap('China', geoJson);
      });
  }
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute) { }

  navTo(url: string) {
    this.router.navigate([url], { relativeTo: this.route });
  }
}
