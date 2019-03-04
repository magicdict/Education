import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'
import { StudentQueryComponent } from './StudentQuery/StudentQuery.component';
import { StudentOverviewComponent } from './StudentOverview/StudentOverview.component';
import { StudentCompumptionComponent } from './StudentCompumption/StudentCompumption.component';
import { StudentRoutingModule } from './Student-routing.module'
import { StudentService } from './Student.service';
import { FormsModule} from '@angular/forms';
import { TableModule } from 'primeng/table';
import { NgxEchartsModule } from '@twp0217/ngx-echarts';


@NgModule({
  declarations: [
    StudentQueryComponent,
    StudentOverviewComponent,
    StudentCompumptionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    NgxEchartsModule,
    StudentRoutingModule
  ],
  providers: [StudentService],
})
export class StudentAreaModule { }
