import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentOverviewComponent } from './StudentArea/StudentOverview/StudentOverview.component';
import { StudentCompumptionComponent } from './StudentArea/StudentCompumption/StudentCompumption.component';
import { HomeService } from './Home.service';
import { Grade1ScoreComponent } from './StudentArea/StudentSorce/Grade1Score.component';
const routes: Routes = [
  {
    path: 'student/overview/:id',
    component: StudentOverviewComponent,
    resolve: {
      studentinfo: HomeService
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
