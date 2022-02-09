import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { merge, Subject } from 'rxjs';
import { startWith, switchMap, map } from 'rxjs/operators';
import { EcgFormService } from '../ecg-service';

@Component({
  selector: 'app-ecg-submitted',
  templateUrl: './ecg-submitted.component.html',
  styleUrls: ['./ecg-submitted.component.css']
})
export class EcgSubmittedComponent implements OnInit {
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
    'serviceDate',
    'submitted',
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
    private router: Router, private route: ActivatedRoute, private dialog: MatDialog
    , private toastr: ToastrService,
    private ecgFormService : EcgFormService,
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
          return this.ecgFormService.getEcgFormsCPTCodeSubmitted(this.fromDate.value, this.toDate.value, index, pageSize,this.sort)
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
  getSubmittedCPT(){

    this.loading = true;
    var index = this.paginator ? this.paginator.pageIndex : 0;
    var pageSize = this.paginator ? this.paginator.pageSize : 10;
    this.ecgFormService.getEcgFormsCPTCodeSubmitted(this.fromDate.value, this.toDate.value, index, pageSize,this.sort).subscribe(results => {
      this.dataSource = new MatTableDataSource(results.items);
      this.loading = false;
      this.totalCount = results.totalCount;

    })


  }

  
}