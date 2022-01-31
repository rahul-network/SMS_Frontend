import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
//import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EcgMainComponent } from './ecg.component';
import { EcgReportsComponent } from './ecg-reports/ecg-reports.component';
import { EcgCptcodesComponent  } from './ecg-cptcodes/ecg-cptcodes.component';
import { EcgSubmittedComponent } from './ecg-submitted/ecg-submitted.component';
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
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component';


const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: EcgMainComponent },
      // {path: 'patients', component: PatientsOverviewComponent },
    ]
  },

];

@NgModule({
  
  declarations: [
    EcgMainComponent,
    EcgReportsComponent,
    EcgCptcodesComponent,
    EcgSubmittedComponent,
    
    
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
    MatDialogModule,
    MatSelectModule,
  ]
})
export class EcgModule { 

}
