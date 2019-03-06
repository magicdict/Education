import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentOverviewComponent } from './StudentOverview/StudentOverview.component';
import { StudentCompumptionComponent } from './StudentCompumption/StudentCompumption.component';
import { StudentService } from './Student.service';
import { Grade1ScoreComponent } from './StudentSorce/Grade1Score.component';
const routes: Routes = [
  {
    path: 'student/overview/:id',
    component: StudentOverviewComponent,
    resolve: {
      studentinfo: StudentService
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
export class StudentRoutingModule { }
