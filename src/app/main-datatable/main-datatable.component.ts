import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DatatableFeedService } from '../datatable-feed.service';
import { DetailDataComponent } from './detail-data/detail-data.component';
import { DialerAppComponent } from '../Voice/dialer-app.component';
import { PatientFormsComponent } from '../../app/form/ccm/patient-forms.component';
import { MctFormComponent } from '../form/mct/mct.component';
import { PagerModel } from '../shared/pagerModel';
import { Router } from '@angular/router'
@Component({
  selector: 'app-main-datatable',
  templateUrl: './main-datatable.component.html',
  styleUrls: ['./main-datatable.component.css']
})
export class MainDatatableComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['action', 'email', 'firstName', 'clinicId', 'cellPhone'];
  dataSource = new MatTableDataSource([]);

  @ViewChild(MatSort) sort: MatSort;

  constructor(private datatableFeedService: DatatableFeedService,
    public dialog: MatDialog,
    private router: Router) { }

  ngOnInit(): void {
    this.feedDatatableData();
  }

  ngAfterViewInit() {
  }

  feedDatatableData() {
    let clinitId = 7;
    let pager: PagerModel = {
      Sort: "1",
      PageNumber: 1,
      PageSize: 500
    };


    this.datatableFeedService.getAllData('QAC', pager).subscribe((_feedData) => {
      this.dataSource = new MatTableDataSource(_feedData.items);
      this.dataSource.sort = this.sort;
    });
  }

  openDetail(_data: any) {
    const dialogRef = this.dialog.open(DetailDataComponent, {
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
    // const dialogRef = this.dialog.open(MctFormComponent, {
    //   width: '50%',
    //   autoFocus: false
    // });
    // dialogRef.afterClosed().subscribe(result => {
    // });
  }

  openVideoCall(_data: any) {
    window.open(`${location.origin}/#/videocall/${_data.clinic.id}/${_data.externalPatientId}/`, "_blank");
  }

  openCall(_data: any) {
    
    const dialogRef = this.dialog.open(DialerAppComponent, {
      disableClose: true,
      hasBackdrop :false,
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
