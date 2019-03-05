import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CourseOverViewComponent } from './CourseOverView/CourseOverView.component'
import { TableModule } from 'primeng/table';
import { NgxEchartsModule } from 'ngx-echarts';
import { CourseService } from "./Course.service";

@NgModule({
  declarations: [
    CourseOverViewComponent,
  ],
  imports: [
    FormsModule,
    TableModule,
    NgxEchartsModule
  ],
  providers: [
    CourseService
  ],
})
export class CourseAreaModule { }
