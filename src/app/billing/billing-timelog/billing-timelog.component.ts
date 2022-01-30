import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
//import { TimelogComponent } from '@app/patients/patient/billing/timelog/timelog.component';
//import { PatientsService } from '@app/patients/patients.service';
//import { BaseComponent } from '@app/shared/baseComponent';
//import { ConfirmDialogComponent } from '@app/shared/confirm-dialog/confirm-dialog.component';
//import { BillingSearch, TimeLog } from '@app/shared/models/patient.model';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { merge, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BillingService } from '../billing.service';
//import { hideDefaultDate } from '@app/shared/pipes/hideDefaultDate.pipe';
//import { ExcelExportService } from '@app/shared/excel/excel-export-service';

@Component({
  selector: 'app-billing-timelog',
  templateUrl: './billing-timelog.component.html',
  styleUrls: ['./billing-timelog.component.scss']
})
export class BillingTimelogComponent implements AfterViewInit {
  moment: any = moment;

  fromDate = new FormControl(this.moment().startOf('month').toDate());
  toDate = new FormControl(new Date());
  displayedColumns = ['firstName', 'lastName', 'dateOfBirth', 'activityDescription', 'notes', 'startTime', 'durationInMinutes', 'createdByName', 'action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  todayDate = new Date();
  searchTerm$ = new Subject<string>();
  searchText!: string;
  //billingSearch = new BillingSearch();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  loading: boolean = false;
  activities: any;
  activityId!: number;

  note!: string;
  minutes!: number;
  currentPatientId!: string;
  selectedDate!: Date;
totalCount!:number;
  constructor(private billingService: BillingService, 
    private route: ActivatedRoute,
    private toastr: ToastrService,
    public dialog: MatDialog) {

    //super();
    this.getBillingTimlog();
    this.getActivities();
  }


  getBillingTimlog() {
    this.loading = true;
    var index = this.paginator ? this.paginator.pageIndex : 0;
    var pageSize = this.paginator ? this.paginator.pageSize : 10;

    this.billingService.getBillingTimlog(this.fromDate.value, this.toDate.value, index, pageSize, this.sort).subscribe(results => {
      results.items.forEach((r: any) => {
        r.startTime  =  moment.utc(r.startTime).toDate();
      
      }); 

      this.dataSource = new MatTableDataSource(results.items);
      this.loading = false;
      this.totalCount = results.totalCount;

    });
  }

  exportBillingTimelog() {
    this.loading = true;
    var index = this.paginator ? this.paginator.pageIndex : 0;
    var pageSize = this.paginator ? this.paginator.pageSize : 10;
    var filename = "TimelogdataExport_" + moment().format('MMM DD YYYY HH:mm') + ".xlsx";
    this.billingService.exportBillingTimelog(this.fromDate.value, this.toDate.value, index, pageSize, this.sort).subscribe(jsonarray => {
      //this.excelExportService.exportAsExcelFile(jsonarray, filename);

      var columns = [
        { header: 'First Name', key: 'firstName', width: 15 },
        { header: 'Last Name', key: 'lastName', width: 20 },
        { header: 'Date Of Birth', key: 'dateOfBirthDisplay', width: 20 },
        { header: 'Activity', key: 'activityDescription', width: 20 },
        { header: 'Notes', key: 'notes', width: 20 },
        { header: 'Date', key: 'startTimeDisplay', width: 20 },
        { header: 'Duration (mins)', key: 'durationDisplay', width: 20 },
        { header: 'Created By', key: 'createdByName', width: 20 }
      ];

      //this.excelExportService.exportAsExcelV2(jsonarray, columns, filename, 'A1:H1');
      this.loading = false;

    });
  }
  editTimeLog(timeLog :any) {

    const activities = this.activities;
    timeLog.patientId = timeLog.externalPatientId;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      timeLog, activities
    };

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // const dialogRef = this.dialog.open(TimelogComponent,
    //   dialogConfig);

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.getBillingTimlog();
    //     ;
    //   }
    // });
  }


  deleteTimeLog(timelog: any) {
    const dialogConfig = new MatDialogConfig();
    const displayText = "Are you sure you want to delete this entry?";
    dialogConfig.data = {
      displayText
    };
    //const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);

    // dialogRef.afterClosed().subscribe(result => {

    //   if (result) {
    //     this.loading = true;
    //     this.patientService.deleteTimeLog(timelog).subscribe(p => {

    //       this.loading = false;
    //       this.toastr.success('Delete Billing', 'Successful!');
    //       this.getBillingTimlog();

    //     },
    //       error => {

    //         this.loading = false;
    //       }
    //     );
    //   }
    //   console.log(`Dialog result: ${result}`);
    // });

  }

  getActivities() {

    // this.patientService.getActivites().subscribe(re => {
    //   this.activities = re;
    //   //console.log(this.activities);
    // },
    //   error => {
    //   }
    // );
  }
  ngOnInit() {
    //    this.dataSource.paginator = this.paginator;

  }

  ngAfterViewInit() {


    setTimeout(() => {


      if (this.sort) {
        this.dataSource.sort = this.sort;

        const sortChange$ = this.sort.sortChange.pipe(tap(_ => {
          this.paginator.pageIndex = 0;
        }))
        merge(sortChange$, this.paginator.page, this.sort.sortChange)
          .pipe(
            tap(() => {
              if (!this.loading)
                this.getBillingTimlog()
            })
          )
          .subscribe();

      }
    }, 1000);

  }


}
