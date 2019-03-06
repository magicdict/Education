import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IGroupInfoResolver, ICourseResolver } from "./Resolver.service";
import { SchoolOverViewComponent } from "./Home/OverViewArea/SchoolOverView/SchoolOverView.component"
import { CourseOverViewComponent } from './Home/OverViewArea/CourseOverView/CourseOverView.component';
import { NavigationComponent } from './Home/OverViewArea/SchoolOverView/Navigation.component';
import { StudentQueryComponent } from './Home/ClassArea/StudentQuery/StudentQuery.component';
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
  { path: 'class/overview', component:StudentQueryComponent },
  { path: '', redirectTo: 'home/school', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
