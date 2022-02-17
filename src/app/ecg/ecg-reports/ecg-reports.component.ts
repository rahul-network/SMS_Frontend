import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Subject } from 'rxjs';
import { startWith, switchMap, map, tap } from 'rxjs/operators';
import { MctFormService } from '../../mct/services/mct-service';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog.component';
import { EcgFormService } from '../ecg-service';
@Component({
  selector: 'app-ecg-reports',
  templateUrl: './ecg-reports.component.html',
  styleUrls: ['./ecg-reports.component.scss']
})
export class EcgReportsComponent implements OnInit {
  moment: any = moment;
  loading!: boolean;
  fromDate = new FormControl(this.moment().startOf('month').toDate());
  toDate = new FormControl(new Date());
  displayedColumns: string[] = [
    'status',
    'firstName',
    'lastName',
    'dob',
    'createdDateTime',
    'report',
    'action',

  ];

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  totalCount: number = 0;
  todayDate = new Date();
  searchTerm$ = new Subject<string>();
  searchText!: string;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @Output() newItemEvent = new EventEmitter<any>();

  submitted: boolean = false;
  constructor(
    private mctFormService: MctFormService,
    private ecgFormService: EcgFormService,
    private router: Router, private route: ActivatedRoute, private dialog: MatDialog
    , private toastr: ToastrService,
  ) {
  }
  result!: any[];
  ngOnInit(): void {
  }

  ngAfterViewInit() {
    setTimeout(() => {

      this.getEcgReport();

      if (this.paginator)
        this.dataSource.paginator = this.paginator;
      if (this.sort) {
        this.dataSource.sort = this.sort;

        const sortChange$ = this.sort.sortChange.pipe(tap(_ => {
          this.paginator.pageIndex = 0;
        }))
        merge(sortChange$, this.paginator.page, this.sort.sortChange)
          .pipe(
            tap(() => {
              this.getEcgReport()
            })
          )
          .subscribe();

      }
    }, 1000);

  }
  getEcgReport() {
    this.loading = true;
    var index = this.paginator ? this.paginator.pageIndex : 0;
    var pageSize = this.paginator ? this.paginator.pageSize : 10;
    this.ecgFormService.getMctReports(this.fromDate.value, this.toDate.value, index, pageSize, this.sort).subscribe(results => {
      this.dataSource = new MatTableDataSource(results.items);
      this.loading = false;
      this.totalCount = results.totalCount;

    })
  }

  downloadReport(row: any) {
    const dialogConfig = new MatDialogConfig();
    const message = "Do you want to download report ?";
    dialogConfig.data = {
      message
    };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.mctFormService.downloadReport(row.clinicCode, row.s3PdfName).subscribe(response => {
          window.location.href = response.url;
        }), error => console.log('Error downloading the file'),
          () => console.info('File downloaded successfully');;
      }
    });
  }

  approveReport(row: any) {

    const dialogConfig = new MatDialogConfig();
    const message = "Are you sure you want to approve this entry?";
    dialogConfig.data = {
      message
    };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.ecgFormService.approveReport(
          {
            "id": row.id,
            "UniqueId": row.uniqueId,
            "SubmitAction": 0
          }
        ).subscribe(p => {

          this.loading = false;
          this.toastr.success('Approved report successfully.', 'Successful!');
          this.getEcgReport();
          this.newItemEvent.emit(row);
        },
          error => {

            this.loading = false;
          }
        );
      }
    });



  }
}