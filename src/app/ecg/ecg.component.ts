import { Component, OnInit, ViewChild } from '@angular/core';
import {EcgSubmittedComponent } from './ecg-submitted/ecg-submitted.component';
import { EcgCptcodesComponent } from './ecg-cptcodes/ecg-cptcodes.component';

@Component({
  selector: 'app-main-ecg',
  templateUrl: './ecg.component.html',
  styleUrls: ['./ecg.component.scss']
})
export class EcgMainComponent implements OnInit {
  ecgType:any;

  @ViewChild(EcgSubmittedComponent) ecgSubmittedComponent;
  @ViewChild(EcgCptcodesComponent) ecgCptcodesComponent;
  constructor() { }

  ngOnInit(): void {
  }
  onTabChanged($event: any) {
    let clickedIndex = $event.index + 1;
    this.setEcgTabType(clickedIndex);

  }
  setEcgTabType(type: any) {
    this.ecgType = type;
    switch (this.ecgType) {
      case 2:
        //this.ecgCptcodesComponent.getBillingCPTCompleted();
        break;
      case 3:
       // this.ecgSubmittedComponent.getBillingCPTCompleted();
    }
  }

}
