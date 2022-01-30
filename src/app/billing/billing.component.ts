import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import * as moment from 'moment';

import { BillingService } from './billing.service';
//import { BillingSearch, BillingTabTypeEnum } from '../shared/models/patient.model';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { BillingSubmittedComponent } from './billing-submitted/billing-submitted.component';
import { BillingDirtyComponent } from './billing-dirty/billing-dirty.component';

@Component({
  selector: 'app-main-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingMainComponent implements OnInit {

  @ViewChild(BillingSubmittedComponent) billingsubmittedComponent!;
  @ViewChild(BillingDirtyComponent) billingdirtyComponent!;
  billingType: any;
  constructor() {
  }
  ngOnInit(): void {
  }

  onTabChanged($event: any) {
    let clickedIndex = $event.index + 1;
    this.setBillingTabType(clickedIndex);

  }
  setBillingTabType(type: any) {
    this.billingType = type;
    switch (this.billingType) {
      // case 1:
      //   this.getBillingTimlog();
      //   break;
      // case 2:
      //   this.getBilling();
      //   break;
      case 3:
        this.billingsubmittedComponent.getBillingCPTCompleted();

        break;

      case 4:
        this.billingdirtyComponent.getBillingCPTCompleted();


    }
  }

  ngAfterViewInit() {


  }


}




