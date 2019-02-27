import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StudentAreaModule} from './StudentArea/StudentArea.module'

import { CommonFunction } from './common';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StudentAreaModule
  ],
  providers: [CommonFunction],
  bootstrap: [AppComponent]
})
export class AppModule { }
