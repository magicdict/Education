import { NgModule } from '@angular/core';
import { StudentQueryComponent } from './StudentQuery/StudentQuery.component';
import { StudentService } from './Student.service';
import { FormsModule} from '@angular/forms';

import { TableModule } from 'primeng/table';
@NgModule({
  declarations: [
    StudentQueryComponent
  ],
  imports: [
    FormsModule,
    TableModule
  ],
  providers: [StudentService],
})
export class StudentAreaModule { }
