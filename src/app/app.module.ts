import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { MapsModule } from './maps/maps.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MapsModule,
    HttpClientModule
  ],
  providers: [ {provide: LocationStrategy, useClass: HashLocationStrategy} ],
  bootstrap: [AppComponent]
})
export class AppModule { }
