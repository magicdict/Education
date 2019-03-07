import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
/**第三方UI */
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { NgxEchartsModule } from 'ngx-echarts';
/**路由 */
import { HomeRoutingModule } from './Home-routing.module';
/** 服务 */
import { IGroupInfoResolver, ICourseResolver, IClassInfoResolver } from "../Resolver.service";
import { HomeService } from './Home.service';
/**组件 */
import { CourseOverViewComponent } from './OverViewArea/CourseOverView/CourseOverView.component';
import { SchoolOverViewComponent } from './OverViewArea/SchoolOverView/SchoolOverView.component';
import { ClassOverviewComponent } from './ClassArea/ClassOverview/ClassOverview.component';
import { StudentOverviewComponent } from './StudentArea/StudentOverview/StudentOverview.component';
import { StudentCompumptionComponent } from './StudentArea/StudentCompumption/StudentCompumption.component';
import { Grade1ScoreComponent } from './StudentArea/StudentSorce/Grade1Score.component';
import { NavigationComponent } from './OverViewArea/SchoolOverView/Navigation.component';


@NgModule({
  declarations: [
    SchoolOverViewComponent,
    CourseOverViewComponent,
    ClassOverviewComponent,
    StudentOverviewComponent,
    StudentCompumptionComponent,
    Grade1ScoreComponent,
    NavigationComponent
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
    IClassInfoResolver,
    HomeService,
    HttpClient
  ],
})
export class HomeModule { }
