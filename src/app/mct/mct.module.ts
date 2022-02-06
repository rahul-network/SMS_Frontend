import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
//import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MctMainComponent } from './mct-main.component';
import { MctDataComponent} from './detail/mct-data.component';
import { MctFormComponent} from './form/mct.component';

import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../material.module';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import {SharedModule  } from '../shared/shaered.module';
import {FieldErrorDisplayComponent  } from '../mct/form/field-error-display.component';


const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: MctMainComponent },
      // {path: 'patients', component: PatientsOverviewComponent },
    ]
  },

];

@NgModule({
  
  declarations: [
    
     MctMainComponent, 
     MctDataComponent,
     MctFormComponent,
     FieldErrorDisplayComponent,
  ],
  imports: [
    MatTabsModule,
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    MatTabsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSelectModule,
    SharedModule
  ]
})
export class MctModule { 

}
