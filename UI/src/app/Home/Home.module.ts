import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
/**第三方UI */
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ListboxModule } from 'primeng/listbox';
import { StepsModule } from 'primeng/steps';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { NgxEchartsModule } from 'ngx-echarts';
/**路由 */
import { HomeRoutingModule } from './Home-routing.module';
/** 服务 */
import { ConfirmationService } from 'primeng/api';
import {
  ISchoolInfoResolver, ICourseResolver, IClassInfoResolver, IStudentInfoResolver,
  ISchoolConsumptionResolver,
  ITeacherInfoResolver,
  IExamGradeListResolver,
  ISingleExamInfoResolver,
  IKaoqinInfoResolver,
  ICompareStudentResolver
} from "./Common/Resolver.service";
import { HomeService } from './Common/Home.service';
/**组件 */
import { CourseOverViewComponent } from './OverViewArea/CourseOverView/CourseOverView.component';
import { SchoolOverViewComponent } from './OverViewArea/SchoolOverView/SchoolOverView.component';
import { CampusComponent } from './OverViewArea/SchoolOverView/Campus.component';
import { ExamOverViewComponent } from './OverViewArea/ExamOverview/ExamOverview.component';
import { ConsumptionOverviewComponent } from './OverViewArea/ConsumptionOverview/ConsumptionOverview.component';
import { ClassOverviewComponent } from './OverViewArea/ClassOverview/ClassOverview.component';
import { SingleExamClassComponent } from './Common/ClassExamList/SingleExamClass.component';

import { TeacherOverviewComponent } from './TeacherOverview/TeacherOverview.component';
import { StudentOverviewComponent } from './StudentArea/StudentOverview/StudentOverview.component';
import { StudentCompumptionComponent } from './StudentArea/StudentCompumption/StudentCompumption.component';
import { Grade1ScoreComponent } from './StudentArea/StudentSorce/Grade1Score.component';
import { Grade2ScoreComponent } from './StudentArea/StudentSorce/Grade2Score.component';
import { Grade3ScoreComponent } from './StudentArea/StudentSorce/Grade3Score.component';
import { KaoqinOverviewComponent } from './OverViewArea/KaoqinOverview/KaoqinOverview.component';

/**共通 */
import { ErrorMessageDialogComponent } from './Common/error-message-dialog/error-message-dialog.component';
import { NavigationComponent } from './Common/navigation/Navigation.component';
import { TeacherPickerComponent } from './Common/teacherPicker/teacherPicker.component';
import { ClassExamListComponent } from './Common/ClassExamList/ClassExamList.component';
import { StudentPickerComponent } from './Common/studentPicker/studentPicker.component';
import { ExamListComponent } from './Common/ExamList/ExamList.component';
import { ClassPickerComponent } from './Common/classPicker/classPicker.component';
import { StudentItemComponent } from './Common/StudentItem/studentItem.component';
import { StudentKaoqinComponent } from './StudentArea/StudentKaoqin/StudentKaoqin.component';
import { NameValueTableComponent } from './Common/NameValueTable/NameValueTable';
import { ChinaMapComponent } from './Common/ChinaMap/ChinaMap';
import { TableFunctionComponent } from './Common/TableFunction/TableFunction';

import { CompareStudentComponent } from './StudentArea/Compare/CompareStudent';
import { FullTeacherComponent } from './OverViewArea/SchoolOverView/TeacherFullGraph';
import { ReportCenterComponent } from './ReportCenter/ReportCenter';
import { DataFilterComponent } from './ReportCenter/DataFilter';
import { VisualFactoryComponent } from './ReportCenter/VisualFactory';
import { DataViewComponent } from './ReportCenter/DataView';


@NgModule({
  declarations: [
    SchoolOverViewComponent,
    CampusComponent,
    //考勤
    KaoqinOverviewComponent,
    //7选3
    CourseOverViewComponent,
    //消费
    ConsumptionOverviewComponent,
    //班级相关
    ClassOverviewComponent,
    //教师相关
    TeacherOverviewComponent,
    FullTeacherComponent,
    //学生相关
    StudentOverviewComponent,
    StudentCompumptionComponent,
    StudentKaoqinComponent,
    Grade1ScoreComponent,
    Grade2ScoreComponent,
    Grade3ScoreComponent,
    CompareStudentComponent,
    //报表
    ReportCenterComponent,
    DataFilterComponent,
    VisualFactoryComponent,
    DataViewComponent,
    //共通
    NavigationComponent,
    ErrorMessageDialogComponent,
    ClassExamListComponent,
    ExamListComponent,
    TeacherPickerComponent,
    StudentPickerComponent,
    ClassPickerComponent,
    StudentItemComponent,
    NameValueTableComponent,
    ChinaMapComponent,
    TableFunctionComponent,
    //考试相关
    SingleExamClassComponent,
    ExamOverViewComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    TableModule,
    StepsModule,
    TabViewModule,
    ListboxModule,
    DialogModule,
    CardModule,
    CheckboxModule,
    ButtonModule,
    OverlayPanelModule,
    SelectButtonModule,
    BrowserAnimationsModule,
    DropdownModule,
    ConfirmDialogModule,
    NgxEchartsModule,
    HomeRoutingModule
  ],
  providers: [
    ISchoolInfoResolver,
    ICourseResolver,
    IClassInfoResolver,
    IStudentInfoResolver,
    ITeacherInfoResolver,
    ISchoolConsumptionResolver,
    IExamGradeListResolver,
    ISingleExamInfoResolver,
    IKaoqinInfoResolver,
    ICompareStudentResolver,
    HomeService,
    ConfirmationService,
    HttpClient
  ],
})
export class HomeModule { }
