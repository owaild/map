import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { InputPreventDirective } from './@core/directives/input-prevent.directive';
import { Input2PreventDirective } from './@core/directives/input-prevent2.directive';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    InputPreventDirective,Input2PreventDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
