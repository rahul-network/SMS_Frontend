import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DatatableFeedService } from 'src/app/datatable-feed.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {PatientMessageRequest} from '../shared/patientMessagePagerModel'
import {PagerModel} from '../shared/pagerModel'
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient, HttpParams } from '@angular/common/http';
@Component({
  selector: 'message.component',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<MessageComponent>,private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) 
    public data: any,
    private datatableFeedService: DatatableFeedService) { }
    result : any[];
    registerForm: FormGroup = this.formBuilder.group({
      id: [ , { updateOn: "change" }],
      message: [,{validators: [Validators.required],updateOn: "change",}],

      });
    
  ngOnInit(): void {
    let externalPatientId = this.data.externalPatientId;
    let clinitId = this.data.clinicId;
    let pager : PagerModel = {
      Sort: "1",
      PageNumber : 1,
      PageSize :500
    };
}

  submitForm():void{
    let obj :PatientMessageRequest ={
      CellPhone:this.data.cellPhone,
      Content:this.registerForm.get('message')?.value,
      SMSPhoneNo: this.data.cellPhone,
      IsRead:false,

    }
    let externalPatientId = this.data.externalPatientId;
    let clinicId = this.data.clinicId;
    this.datatableFeedService.sendSms(Number(clinicId),externalPatientId,obj).subscribe((_feedDataDetails) => {
        this.dialogRef.close();
    },
    (error) => {
      alert(error.error);
      return false;
    }
    );
    
  }
  close(): void {
    this.dialogRef.close();
  }


}

