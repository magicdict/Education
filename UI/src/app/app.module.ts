import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StudentAreaModule} from './StudentArea/StudentArea.module'
import { GroupAreaModule} from './GroupArea/GroupArea.module'
import { CommonFunction } from './common';

@NgModule({
  declarations: [
    
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,

    StudentAreaModule,
    GroupAreaModule
  ],
  providers: [CommonFunction],
  bootstrap: [AppComponent]
})
export class AppModule { }
