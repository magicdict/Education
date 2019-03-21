import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentOverviewComponent } from './StudentArea/StudentOverview/StudentOverview.component';
import { StudentCompumptionComponent } from './StudentArea/StudentCompumption/StudentCompumption.component';
import { IStudentInfoResolver, ITeacherInfoResolver } from '../Resolver.service';
import { Grade1ScoreComponent } from './StudentArea/StudentSorce/Grade1Score.component';
import { TeacherOverviewComponent } from './StudentArea/TeacherOverview/TeacherOverview.component';
const routes: Routes = [
  {
    path: 'student/overview/:id',
    component: StudentOverviewComponent,
    resolve: {
      studentinfo: IStudentInfoResolver
    }
  },
  {
    path: 'teacher/overview/:id',
    component: TeacherOverviewComponent,
    resolve: {
      teacherinfo: ITeacherInfoResolver
    }
  },
  {
    path: 'student/overview/:id/compumption',
    component: StudentCompumptionComponent
  },
  {
    path: 'student/overview/:id/grade1',
    component: Grade1ScoreComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { } 
