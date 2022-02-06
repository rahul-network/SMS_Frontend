import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
//import { ConfirmDialogComponent } from '@app/shared/confirm-dialog/confirm-dialog.component';
//import { ExcelExportService } from '@app/shared/excel/excel-export-service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { merge, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BillingService } from '../billing.service';

@Component({
  selector: 'app-billing-cptcodes',
  templateUrl: './billing-cptcodes.component.html',
  styleUrls: ['./billing-cptcodes.component.scss']
})
export class BillingCptcodesComponent  implements AfterViewInit {
  moment: any = moment;

  fromDate = new FormControl(this.moment().startOf('month').toDate());
  toDate = new FormControl(new Date());
  displayedColumns = ['cptcode', 'cptdescription', 'firstName', 'lastName', 'dateOfBirth', 'enrolled', 'payer', 'createdDateTime', 'action'];

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  totalCount: number = 0;
  todayDate = new Date();

  searchTerm$ = new Subject<string>();
  searchText!: string;
  //billingSearch = new BillingSearch();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  loading!: boolean;
  patientService: any;

  @Output() newItemEvent = new EventEmitter<any>();

  constructor(private billingService: BillingService,
    private router: Router, private route: ActivatedRoute, private dialog: MatDialog
    , private toastr: ToastrService,
    //private excelExportService: ExcelExportService
    ) {
   // super();
  }


  getBillingCPTInprogress() {
    this.loading = true;
    var index = this.paginator ? this.paginator.pageIndex : 0;
    var pageSize = this.paginator ? this.paginator.pageSize : 10;

    this.billingService.getBillingCPTInprogress
    (this.fromDate.value, this.toDate.value, index, pageSize, this.sort).subscribe(results => {
      this.dataSource = new MatTableDataSource(results.items);
      this.loading = false;
      this.totalCount = results.totalCount;

    })
  }

  exportBillingCPTInprogress() {
    this.loading = true;
    var index = this.paginator ? this.paginator.pageIndex : 0;
    var pageSize = this.paginator ? this.paginator.pageSize : 10;
    var filename = "CPTCodes_Inprogress" + moment().format('MMM DD YYYY HH:mm') + ".xlsx";
    this.billingService.exportBillingCptCodes(this.fromDate.value, this.toDate.value, index, pageSize, this.sort, false, false).subscribe(jsonarray => {
      var columns = [
        { header: 'First Name', key: 'firstName', width: 15 },
        { header: 'Last Name', key: 'lastName', width: 20 },
        { header: 'DateOfBirth', key: 'dateOfBirthDisplay', width: 20 },
        { header: 'CPT Code', key: 'cptCode', width: 20 },
        { header: 'CPT Description', key: 'cptDescription', width: 50 },
        { header: 'Is CPT Deleted', key: 'isCPTDeleted', width: 20 },
        { header: 'Payer', key: 'payer', width: 20 },
        { header: 'Enrolled', key: 'enrolled', width: 20 },
        { header: 'Created', key: 'createdDateTimeDisplay', width: 20 },
        { header: 'ICD-10 Codes', key: 'icd10', width: 20 },
      ];

     // this.excelExportService.exportAsExcelV2(jsonarray, columns, filename, 'A1:I1');
      this.loading = false;

    });
  }

  approveTimeLog(row :any) {

    const dialogConfig = new MatDialogConfig();
    const displayText = "Are you sure you want to approve this entry?";
    dialogConfig.data = displayText;
   // const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);

    // dialogRef.afterClosed().subscribe(result => {

    //   if (result) {
    //     this.loading = true;
    //     this.billingService.approveCptCode(row.id).subscribe(p => {

    //       this.loading = false;
    //       this.toastr.success('Save CPT Codes', 'Successful!');
    //       this.getBillingCPTInprogress();
    //       this.newItemEvent.emit(row);

    //     },
    //       error => {

    //         this.loading = false;
    //       }
    //     );
    //   }
    //   console.log(`Dialog result: ${result}`);
    // });

  }

  ngAfterViewInit() {
    setTimeout(() => {

      this.getBillingCPTInprogress();

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

              this.getBillingCPTInprogress()
            })
          )
          .subscribe();

      }
    }, 1000);

  }

}
