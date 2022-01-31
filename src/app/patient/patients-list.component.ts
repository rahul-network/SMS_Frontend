import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PatientService } from './service/patient-service';
import { PatientDetailComponent  } from './patient-detail/patient-detail.component';
import { DialerAppComponent } from './patient-detail/Call/dialer-app.component';
import { PatientFormsComponent } from './patient-detail/Forms/patient-forms.component';
import {PatientListPagerModel } from './models/patient'
import { MctFormComponent } from '../form/mct/mct.component';
import { Router } from '@angular/router'
@Component({
  selector: 'patient-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.css']
})
export class PatientListComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['action', 'email', 'firstName', 'clinicId', 'cellPhone'];
  dataSource = new MatTableDataSource([]);

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private patientService: PatientService,
    public dialog: MatDialog,
    private router: Router) { }

  ngOnInit(): void {
    this.feedDatatableData();
  }

  ngAfterViewInit() {
  }

  feedDatatableData() {
    let pager: PatientListPagerModel = {
      Sort: "1",
      PageNumber: 1,
      PageSize: 500
    };
    this.patientService.getAllData('QAC', pager).subscribe((_feedData) => {
      this.dataSource = new MatTableDataSource(_feedData.items);
      this.dataSource.sort = this.sort;
    });
  }

  openDetail(_data: any) {
    debugger;
    const dialogRef = this.dialog.open(PatientDetailComponent, {
      width: '100vw',
      height: '100vh',
      data: _data,
      autoFocus: false

    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openMCTForm() {
    this.router.navigate(['mctform']);
   
  }
  openECGForm() {
    this.router.navigate(['ecg']);
   
  }

  openVideoCall(_data: any) {
    window.open(`${location.origin}/#/videocall/${_data.clinic.id}/${_data.externalPatientId}/`, "_blank");
  }

  openCall(_data: any) {
    
    const dialogRef = this.dialog.open(DialerAppComponent, {
      disableClose: true,
      hasBackdrop :true,
      width: '100vw',
      height: '100vh',
      panelClass: 'my-dialog',
      autoFocus:false,
      data: {
        id: _data.id,
        cellPhone: _data.cellPhone,
        firstName: _data.firstName,
        clinicId: _data.clinicId,
        email: _data.email,
        smsPhoneNo: _data.cellPhone,
        lastName: _data.lastName,
        gender: _data.gender,
        externalPatientId: _data.externalPatientId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openCCMForm(_data: any) {
    const dialogRef = this.dialog.open(PatientFormsComponent, {
      width: '100vw',
      height: '100vh',
      autoFocus:false,
      data: {
        id: _data.id,
        cellPhone: _data.cellPhone,
        firstName: _data.firstName,
        clinicId: _data.clinicId,
        email: _data.email,
        smsPhoneNo: _data.cellPhone,
        dateOfBirth: _data.dateOfBirth,
        lastName: _data.lastName,
        externalPatientId: _data.externalPatientId

      }
    });
  }

}
