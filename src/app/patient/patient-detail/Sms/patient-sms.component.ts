import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PatientService } from '../../service/patient-service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {PatientMessageRequest, PatientListPagerModel} from '../../models/patient'
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient, HttpParams } from '@angular/common/http';
@Component({
  selector: 'patient-sms.component',
  templateUrl: './patient-sms.component.html',
  styleUrls: ['./patient-sms.component.css']
})
export class PatientSmsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PatientSmsComponent>,private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) 
    public data: any,
    private patientService: PatientService) { }
    result! : any[];
    registerForm: FormGroup = this.formBuilder.group({
      id: [ , { updateOn: "change" }],
      message: [,{validators: [Validators.required],updateOn: "change",}],

      });
    
  ngOnInit(): void {
    let externalPatientId = this.data.externalPatientId;
    let clinitId = this.data.clinicId;
    let pager : PatientListPagerModel = {
      Sort: "1",
      PageNumber : 1,
      PageSize :500
    };
}

  submitForm():void{
    let obj :PatientMessageRequest ={
      Content:this.registerForm.get('message')?.value,
      CellPhone: this.data.cellPhone,
      IsRead:false,

    }
    let externalPatientId = this.data.externalPatientId;
    let clinicId = this.data.clinicId;
    this.patientService.sendSms('QAC',externalPatientId,obj).subscribe((_feedDataDetails) => {
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

