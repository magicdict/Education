import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';

import { NgxEchartsModule } from 'ngx-echarts';

import { HomeRoutingModule } from './Home-routing.module';


import { IGroupInfoResolver,ICourseResolver } from "../Resolver.service";

import { CourseOverViewComponent } from './OverViewArea/CourseOverView/CourseOverView.component';
import { SchoolOverViewComponent } from './OverViewArea/SchoolOverView/SchoolOverView.component';
import { StudentQueryComponent } from './ClassArea/StudentQuery/StudentQuery.component';
import { StudentOverviewComponent } from './StudentArea/StudentOverview/StudentOverview.component';
import { StudentCompumptionComponent } from './StudentArea/StudentCompumption/StudentCompumption.component';
import { Grade1ScoreComponent } from './StudentArea/StudentSorce/Grade1Score.component';
import { HomeService } from './Home.service';


@NgModule({
  declarations: [
    SchoolOverViewComponent,
    CourseOverViewComponent,
    StudentQueryComponent,
    StudentOverviewComponent,
    StudentCompumptionComponent,
    Grade1ScoreComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    BrowserAnimationsModule,
    DropdownModule,
    NgxEchartsModule,
    HomeRoutingModule
  ],
  providers: [
    IGroupInfoResolver,
    ICourseResolver,
    HomeService,
    HttpClient
  ],
})
export class HomeModule { }
