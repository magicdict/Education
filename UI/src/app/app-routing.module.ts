import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IGroupInfoResolver, ICourseResolver, IClassInfoResolver } from "./Resolver.service";
import { SchoolOverViewComponent } from "./Home/OverViewArea/SchoolOverView/SchoolOverView.component"
import { CourseOverViewComponent } from './Home/OverViewArea/CourseOverView/CourseOverView.component';
import { NavigationComponent } from './Home/OverViewArea/SchoolOverView/Navigation.component';
import { ClassOverviewComponent } from './Home/ClassArea/ClassOverview/ClassOverview.component';
const routes: Routes = [
  {
    path: 'home',
    component: NavigationComponent,
    children:
      [
        {
          path: 'school',
          component: SchoolOverViewComponent,
          resolve: { groupinfo: IGroupInfoResolver }
        },
        {
          path: 'course',
          component: CourseOverViewComponent,
          resolve: { courseInfo: ICourseResolver }
        }
      ]
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
