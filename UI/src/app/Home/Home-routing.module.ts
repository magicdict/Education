import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentOverviewComponent } from './StudentArea/StudentOverview/StudentOverview.component';
import { StudentCompumptionComponent } from './StudentArea/StudentCompumption/StudentCompumption.component';
import { IStudentInfoResolver, ITeacherInfoResolver, ISingleExamInfoResolver, ICompareStudentResolver } from './Common/Resolver.service';
import { Grade1ScoreComponent } from './StudentArea/StudentSorce/Grade1Score.component';
import { Grade2ScoreComponent } from './StudentArea/StudentSorce/Grade2Score.component';
import { Grade3ScoreComponent } from './StudentArea/StudentSorce/Grade3Score.component';
import { TeacherOverviewComponent } from './TeacherOverview/TeacherOverview.component';
import { SingleExamClassComponent } from './Common/ClassExamList/SingleExamClass.component';
import { StudentKaoqinComponent } from './StudentArea/StudentKaoqin/StudentKaoqin.component';
import { CompareStudentComponent } from './StudentArea/Compare/CompareStudent';
import { FullTeacherComponent } from './OverViewArea/SchoolOverView/TeacherFullGraph';
import { ReportCenterComponent } from './ReportCenter/ReportCenter';

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
  },
  {
    path: 'student/overview/:id/grade2',
    component: Grade2ScoreComponent
  },
  {
    path: 'student/overview/:id/grade3',
    component: Grade3ScoreComponent
  },
  {
    path: 'student/overview/:id/kaoqin',
    component: StudentKaoqinComponent
  },
  {
    path: 'exam/detail/:id',
    component: SingleExamClassComponent,
    resolve: {
      singleExam: ISingleExamInfoResolver
    }
  },
  {
    path: 'student/compare',
    component: CompareStudentComponent,
    resolve: {
      compareinfo: ICompareStudentResolver
    }
  },
  {
    path: 'home/teacherfull',
    component: FullTeacherComponent,
  },
  {
    path: 'home/ReportCenter',
    component: ReportCenterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { } 
