import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
/**第三方UI */
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxTimelineModule } from 'ngx-timeline';
/**路由 */
import { HomeRoutingModule } from './Home-routing.module';
/** 服务 */
import { ConfirmationService } from 'primeng/api';
import {
  IGroupInfoResolver, ICourseResolver, IClassInfoResolver, IStudentInfoResolver,
  ISchoolConsumptionResolver,
  ITeacherInfoResolver,
  IExamGradeListResolver
} from "../Resolver.service";
import { HomeService } from './Home.service';
/**组件 */
import { CourseOverViewComponent } from './OverViewArea/CourseOverView/CourseOverView.component';
import { SchoolOverViewComponent } from './OverViewArea/SchoolOverView/SchoolOverView.component';
import { ExamOverViewComponent } from './OverViewArea/ExamOverview/ExamOverview.component';
import { ConsumptionOverviewComponent } from './OverViewArea/ConsumptionOverview/ConsumptionOverview.component';
import { ClassOverviewComponent } from './ClassArea/ClassOverview/ClassOverview.component';
import { StudentOverviewComponent } from './StudentArea/StudentOverview/StudentOverview.component';
import { TeacherOverviewComponent } from './TeacherOverview/TeacherOverview.component';
import { StudentCompumptionComponent } from './StudentArea/StudentCompumption/StudentCompumption.component';
import { Grade1ScoreComponent } from './StudentArea/StudentSorce/Grade1Score.component';
import { ExamClassDiffComponent } from './ExamArea/ExamClassDiff.component';

/**共通 */
import { ErrorMessageDialogComponent } from './Common/error-message-dialog/error-message-dialog.component';
import { NavigationComponent } from './Common/navigation/Navigation.component';
import { StudentHeaderComponent } from './Common/studentHeader/StudentHeader.component';
import { TeacherPickerComponent } from './Common/teacherPicker/teacherPicker.component';
import { ClassExamListComponent } from './Common/ClassExamList/ClassExamList.component';
import { SingleExamClassComponent } from './ExamArea/SingleExamClass.component';


@NgModule({
  declarations: [
    SchoolOverViewComponent,
    CourseOverViewComponent,
    ConsumptionOverviewComponent,
    ClassOverviewComponent,
    TeacherOverviewComponent,
    //学生相关
    StudentOverviewComponent,
    StudentCompumptionComponent,
    Grade1ScoreComponent,
    //共通
    NavigationComponent,
    TeacherPickerComponent,
    ErrorMessageDialogComponent,
    StudentHeaderComponent,
    ClassExamListComponent,
    //考试相关
    SingleExamClassComponent,
    ExamClassDiffComponent,
    ExamOverViewComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    TabViewModule,
    DialogModule,
    CardModule,
    ButtonModule,
    BrowserAnimationsModule,
    DropdownModule,
    ConfirmDialogModule,
    NgxEchartsModule,
    NgxTimelineModule,
    HomeRoutingModule
  ],
  providers: [
    IGroupInfoResolver,
    ICourseResolver,
    IClassInfoResolver,
    IStudentInfoResolver,
    ITeacherInfoResolver,
    ISchoolConsumptionResolver,
    IExamGradeListResolver,
    HomeService,
    ConfirmationService,
    HttpClient
  ],
})
export class HomeModule { }
