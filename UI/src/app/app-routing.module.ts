import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IGroupInfoResolver, ICourseResolver, IClassInfoResolver, ISchoolConsumptionResolver, IExamGradeListResolver, IKaoqinInfoResolver } from "./Home/Common/Resolver.service";
import { SchoolOverViewComponent } from "./Home/OverViewArea/SchoolOverView/SchoolOverView.component"
import { CourseOverViewComponent } from './Home/OverViewArea/CourseOverView/CourseOverView.component';
import { ConsumptionOverviewComponent } from './Home/OverViewArea/ConsumptionOverview/ConsumptionOverview.component';
import { ClassOverviewComponent } from './Home/ClassArea/ClassOverview/ClassOverview.component';
import { ExamOverViewComponent } from './Home/OverViewArea/ExamOverview/ExamOverview.component';
import { KaoqinOverviewComponent } from './Home/OverViewArea/KaoqinOverview/KaoqinOverview.component';
const routes: Routes = [
  {
    path: 'home/school',
    component: SchoolOverViewComponent,
    resolve: { groupinfo: IGroupInfoResolver }
  },
  {
    path: 'home/course',
    component: CourseOverViewComponent,
    resolve: { courseInfo: ICourseResolver }
  },
  {
    path: 'home/exam',
    component: ExamOverViewComponent,
    resolve: { examgradelist: IExamGradeListResolver }
  },
  {
    path: 'home/consumption',
    component: ConsumptionOverviewComponent,
    resolve: { consumptionInfo: ISchoolConsumptionResolver }
  },
  {
    path: 'home/kaoqin',
    component: KaoqinOverviewComponent,
    resolve: { kaoqinInfo: IKaoqinInfoResolver }
  },
  {
    path: 'class/overview/:id',
    component: ClassOverviewComponent,
    resolve: { classinfo: IClassInfoResolver }
  },
  { path: '', redirectTo: 'home/school', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
