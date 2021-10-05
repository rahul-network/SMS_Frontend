import { Component, OnInit,Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { formatDate } from '@angular/common';
import { CCMFormService } from './service/ccm-servuce';
import { MatTableDataSource } from '@angular/material/table';
import { ViewChild } from '@angular/core';
import { CcmFormComponent } from './ccm.component';


@Component({
    selector: 'patient-forms',
    styleUrls: ['./patient-forms.component.css'],
    templateUrl: './patient-forms.component.html',
})


export class PatientFormsComponent implements OnInit {
    displayedColumns: string[] = ['edit','formId', 'createdDateTime', 'updatedDateTime'];
    detailDataSource = new MatTableDataSource<any>([]);
    @ViewChild(MatSort) sort: MatSort;

    form: FormGroup;
    id!: string;
    isAddMode!: boolean;
    loading = false;
    submitted = false;

    

    constructor(public dialog: MatDialog,
        public dialogRef: MatDialogRef<PatientFormsComponent>,
        @Inject(MAT_DIALOG_DATA,
            ) 
        public data: any,
        private route: ActivatedRoute,
        private ccmFormService: CCMFormService
       
    ) { }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;

       
        this.ccmFormService.getFormsbyPatientId(this.data.id).subscribe((_feedDataDetails) => {
          this.detailDataSource = new MatTableDataSource(_feedDataDetails);
          this.detailDataSource.sort = this.sort;
        });
    }

    openCCMForm(_data: any,isNew :boolean) {
        debugger;
        const dialogRef = this.dialog.open(CcmFormComponent, {
          width: '100%',
          height: '100%',
          autoFocus:false,
          data: { 
           id: this.data.id,
            firstName :this.data.firstName,
            dateOfBirth :this.data.dateOfBirth,
            lastName : this.data.lastName,
            formId : _data == null ? null : _data.formId,
            medicalPractice :  this.data.clinic.name
           }
        });
      }


}
