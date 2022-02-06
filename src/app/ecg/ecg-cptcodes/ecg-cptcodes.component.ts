import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Subject } from 'rxjs';
import { startWith, switchMap, map } from 'rxjs/operators';
import { EcgFormService } from '../ecg-service';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog.component';
@Component({
  selector: 'app-ecg-cptcodes',
  templateUrl: './ecg-cptcodes.component.html',
  styleUrls: ['./ecg-cptcodes.component.css']
})
export class EcgCptcodesComponent implements OnInit {
  moment: any = moment;
  loading!: boolean;
  fromDate = new FormControl(this.moment().startOf('month').toDate());
  toDate = new FormControl(new Date());
  displayedColumns: string[] = [
    'cptCode',
    'description',
    'firstName',
    'lastName',
    'dob', 
    'createdDateTime',
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
    private ecgFormService: EcgFormService,
    private router: Router, private route: ActivatedRoute, private dialog: MatDialog
    , private toastr: ToastrService,
    ) {
  }
  result!: any[];
  ngOnInit(): void {
  }

  ngAfterViewInit() {
    var index = this.paginator ? this.paginator.pageIndex : 0;
    var pageSize = this.paginator ? this.paginator.pageSize : 10;
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          //this.isLoadingResults = true;
          return this.ecgFormService!.getEcgFormsCPTCode(this.fromDate.value, this.toDate.value, index, pageSize,this.sort)
            .pipe();
        }),
        map(data => {
          if (data === null) {
            return [];
          }
          this.totalCount = data.totalCount;
          return data.items;
        })
      ).subscribe(data => this.dataSource = data);

  }
  getcptCpdes(){
    this.loading = true;
    var index = this.paginator ? this.paginator.pageIndex : 0;
    var pageSize = this.paginator ? this.paginator.pageSize : 10;
    this.ecgFormService.getEcgFormsCPTCode(this.fromDate.value, this.toDate.value, index, pageSize,this.sort).subscribe(results => {
      this.dataSource = new MatTableDataSource(results.items);
      this.loading = false;
      this.totalCount = results.totalCount;

    })


  }

  submitReport(row: any) {

    const dialogConfig = new MatDialogConfig();
    const message = "Are you sure you want to submit this entry?";
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
            "SubmitAction": 1
          }
        ).subscribe(p => {

          this.loading = false;
          this.toastr.success('CPI code submitted successfully.', 'Successful!');
          this.getcptCpdes();
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