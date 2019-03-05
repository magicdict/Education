import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentQueryComponent } from './StudentArea/StudentQuery/StudentQuery.component'
import { GroupOverViewComponent } from './GroupArea/GroupOverView/GroupOverView.component'
import { CourseOverViewComponent } from './CourseArea/CourseOverView/CourseOverView.component'
import { GroupService } from "./GroupArea/Group.service";
import { CourseService } from "./CourseArea/Course.service";

const routes: Routes = [
  {
    path: 'student',
    component: StudentQueryComponent
  },
  {
    path: 'course',
    component: CourseOverViewComponent,
    resolve: { courseInfo: CourseService }
  },
  {
    path: 'group',
    component: GroupOverViewComponent,
    resolve: { groupinfo: GroupService }
  },
  { path: '', redirectTo: 'student', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
