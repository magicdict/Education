import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentOverviewComponent } from './StudentOverview/StudentOverview.component';
import { StudentCompumptionComponent } from './StudentCompumption/StudentCompumption.component';
import { StudentService } from './Student.service';
const routes: Routes = [
  {
    path: 'student/overview/:id',
    component: StudentOverviewComponent,
    resolve: {
      studentinfo: StudentService
    }
  },{
    path:'student/overview/:id/compumption',
    component:StudentCompumptionComponent

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
