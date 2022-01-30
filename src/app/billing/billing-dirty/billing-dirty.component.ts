import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
//import { BaseComponent } from '@app/shared/baseComponent';
//import { ExcelExportService } from '@app/shared/excel/excel-export-service';
//import { BillingSearch } from '@app/shared/models/patient.model';
import * as moment from 'moment';
import { merge, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BillingService } from '../billing.service';

@Component({
  selector: 'app-billing-dirty',
  templateUrl: './billing-dirty.component.html',
  styleUrls: ['./billing-dirty.component.scss']
})
export class BillingDirtyComponent  implements AfterViewInit {
  moment: any = moment;


  fromDate = new FormControl(this.moment().startOf('month').toDate());
  toDate = new FormControl(new Date());
  displayedColumns = ['IsDirty', 'cptcode', 'cptdescription', 'firstName', 'lastName', 'dateOfBirth', 'enrolled', 'payer', 'createdDateTime', 'lastUpdatedDateTime'];

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  todayDate = new Date();
  totalCount : number = 0;

  searchTerm$ = new Subject<string>();
  searchText!: string;
  //billingSearch = new BillingSearch();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  loading!: boolean;

  constructor(private billingService: BillingService) {
    //super();
  }


  getBillingCPTCompleted() {
    this.loading = true;
    var index = this.paginator ? this.paginator.pageIndex : 0;
    var pageSize = this.paginator ? this.paginator.pageSize : 10;
    this.billingService.getBillingCPTDirty(this.fromDate.value, this.toDate.value, index, pageSize, this.sort).subscribe(results => {
      this.dataSource = new MatTableDataSource(results.items);
      this.loading = false;
      this.totalCount = results.totalCount;

    })
  }


  exportBillingCPTSubmitted() {
    this.loading = true;
    var index = this.paginator ? this.paginator.pageIndex : 0;
    var pageSize = this.paginator ? this.paginator.pageSize : 10;
    var filename = "CPTCodes_Claim_Errors" + moment().format('MMM DD YYYY HH:mm') + ".xlsx";
    this.billingService.exportBillingCptCodes(this.fromDate.value, this.toDate.value, index, pageSize, this.sort, true, true).subscribe(jsonarray => {
      var columns = [
        { header: 'First Name', key: 'firstName', width: 15 },
        { header: 'Last Name', key: 'lastName', width: 20 },
        { header: 'DateOfBirth', key: 'dateOfBirthDisplay', width: 20 },
        { header: 'CPT Code', key: 'cptCode', width: 20 },
        { header: 'CPT Description', key: 'cptDescription', width: 50 },
        { header: 'Is CPT Deleted', key: 'isCPTDeleted', width: 20 },
        { header: 'Payer', key: 'payer', width: 20 },
        { header: 'Enrolled', key: 'enrolled', width: 20 },
        { header: 'Created', key: 'createdDateTimeDisplay', width: 20 }
    
      ];

     // this.excelExportService.exportAsExcelV2(jsonarray, columns, filename, 'A1:I1');
      this.loading = false;

    });
  }



  ngAfterViewInit() {
    setTimeout(() => {

      this.getBillingCPTCompleted();

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
              this.getBillingCPTCompleted()
            })
          )
          .subscribe();

      }
    }, 1000);

  }

}
