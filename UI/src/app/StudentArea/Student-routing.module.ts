import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentOverviewComponent } from './StudentOverview/StudentOverview.component';
import { StudentService } from './Student.service';
const routes: Routes = [
  {
    path: 'student/overview/:id',
    component: StudentOverviewComponent,
    resolve: {
      studentinfo: StudentService
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
