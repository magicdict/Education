import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GroupOverViewComponent } from './GroupOverView/GroupOverView.component'
import { TableModule } from 'primeng/table';
import { NgxEchartsModule } from '@twp0217/ngx-echarts';
import { GroupService } from "./Group.service";
@NgModule({
  declarations: [
    GroupOverViewComponent,
  ],
  imports: [
    FormsModule,
    TableModule,
    NgxEchartsModule
  ],
  providers: [GroupService],
})
export class GroupAreaModule { }
