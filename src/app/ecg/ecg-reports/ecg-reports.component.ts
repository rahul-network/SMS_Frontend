import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Subject } from 'rxjs';
import { startWith, switchMap, map } from 'rxjs/operators';
import { MctFormService } from 'src/app/form/mct/service/mct-service';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-ecg-reports',
  templateUrl: './ecg-reports.component.html',
  styleUrls: ['./ecg-reports.component.css']
})
export class EcgReportsComponent implements OnInit {
  moment: any = moment;
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
    private router: Router, private route: ActivatedRoute, private dialog: MatDialog
    , private toastr: ToastrService,
    ) {
  }
  result!: any[];
  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          //this.isLoadingResults = true;
          return this.mctFormService!.getMctForms(
            this.sort.active, this.sort.direction, this.paginator.pageIndex, 10)
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
}