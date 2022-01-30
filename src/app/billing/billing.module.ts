import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
//import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { BillingMainComponent } from './billing.component';
import { BillingTimelogComponent } from './billing-timelog/billing-timelog.component';
import { BillingCptcodesComponent } from './billing-cptcodes/billing-cptcodes.component';
import { BillingSubmittedComponent } from './billing-submitted/billing-submitted.component';
import { BillingDirtyComponent } from './billing-dirty/billing-dirty.component';



const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: BillingMainComponent },
      // {path: 'patients', component: PatientsOverviewComponent },

    ]
  },

];

@NgModule({
  declarations: [

    BillingMainComponent,
    BillingTimelogComponent,
    BillingCptcodesComponent,
    BillingSubmittedComponent,
    BillingDirtyComponent

  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    SharedModule,
    FormsModule
  ]
})
export class BillingModule { }
