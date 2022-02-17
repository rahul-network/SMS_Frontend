import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormService } from './component/ccm/service/ccm-service';
import { MatTableDataSource } from '@angular/material/table';
import { ViewChild } from '@angular/core';
import { CcmFormComponent } from './component/ccm/ccm.component';
import { MawvFormComponent } from './component/mawv/mawv.component';
import { PatientListPagerModel } from '../../models/patient';
import * as moment from 'moment';
@Component({
  selector: 'patient-forms',
  styleUrls: ['./patient-forms.component.css'],
  templateUrl: './patient-forms.component.html',
})

export class PatientFormsComponent implements OnInit {
  displayedColumns: string[] = ['edit', 'formId', 'formName', 'createdDateTime', 'updatedDateTime'];
  detailDataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatSort) sort!: MatSort;
  moment: any = moment;
  form!: FormGroup;
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
    private ccmFormService: FormService

  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;
    let pager: PatientListPagerModel = {
      Sort: "1",
      PageNumber: 1,
      PageSize: 500
    };
    
    //Checking
    this.ccmFormService.getFormsbyPatientId('QAC', this.data.externalPatientId, pager).subscribe((_feedDataDetails) => {
      this.detailDataSource = new MatTableDataSource(_feedDataDetails);
      this.detailDataSource.sort = this.sort;
    });
  }

  openForm(_data: any, isNew: boolean) {
    if (_data.formName == 'MAWV') {
      this.dialog.open(MawvFormComponent, {
        width: '100%',
        height: '100%',
        autoFocus: false,
        data: {
          id: this.data.id,
          externalPatientId: this.data.externalPatientId,
          firstName: this.data.firstName,
          dateOfBirth: this.data.dateOfBirth,
          lastName: this.data.lastName,
          formId: _data == null ? null : _data.formId,
          medicalPractice: this.data.clinicName
        }
      });
    }
    else {
      this.dialog.open(CcmFormComponent, {
        width: '100%',
        height: '100%',
        autoFocus: false,
        data: {
          id: this.data.id,
          externalPatientId: this.data.externalPatientId,
          firstName: this.data.firstName,
          dateOfBirth: this.data.dateOfBirth,
          lastName: this.data.lastName,
          formId: _data == null ? null : _data.formId,
          medicalPractice: this.data.clinicName
        }
      });
    }
  }


}
