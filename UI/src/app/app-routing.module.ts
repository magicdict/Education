import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentQueryComponent } from './StudentArea/StudentQuery/StudentQuery.component'
const routes: Routes = [
  { path: 'student', component: StudentQueryComponent },
  { path: '', redirectTo: 'student', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
