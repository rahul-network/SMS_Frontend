import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MainDatatableComponent } from './main-datatable/main-datatable.component';
import { MaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';
import { DetailDataComponent } from './main-datatable/detail-data/detail-data.component';

@NgModule({
  declarations: [
    AppComponent,
    MainDatatableComponent,
    DetailDataComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NoopAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
