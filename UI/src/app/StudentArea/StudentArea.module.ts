import { NgModule } from '@angular/core';
import { StudentQueryComponent } from './StudentQuery/StudentQuery.component';
import { StudentService } from './Student.service';
import { HttpModule } from '@angular/http';
@NgModule({
  declarations: [
    StudentQueryComponent
  ],
  imports: [
    HttpModule
  ],
  providers: [StudentService],
})
export class StudentAreaModule { }
