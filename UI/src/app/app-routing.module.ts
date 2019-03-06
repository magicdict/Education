import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IGroupInfoResolver } from "./Resolver.service";
import { SchoolOverViewComponent } from "./Home/OverViewArea/SchoolOverView/SchoolOverView.component"
const routes: Routes = [
  {
    path: 'home',
    component: SchoolOverViewComponent,
    resolve: { groupinfo: IGroupInfoResolver }
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
