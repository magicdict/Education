import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GroupOverViewComponent } from './GroupOverView/GroupOverView.component'
import { TableModule } from 'primeng/table';
import { NgxEchartsModule } from 'ngx-echarts';
import { GroupService } from "./Group.service";
import { HttpClient,HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    GroupOverViewComponent,
  ],
  imports: [
    FormsModule,
    TableModule,
    HttpClientModule,
    NgxEchartsModule
  ],
  providers: [
    GroupService,
    HttpClient
  ],
})
export class GroupAreaModule { }
