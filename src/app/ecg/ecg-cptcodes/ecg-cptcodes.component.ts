import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge } from 'rxjs';
import { startWith, switchMap, map } from 'rxjs/operators';
import { MctFormService } from 'src/app/form/mct/service/mct-service';
@Component({
  selector: 'app-ecg-cptcodes',
  templateUrl: './ecg-cptcodes.component.html',
  styleUrls: ['./ecg-cptcodes.component.css']
})
export class EcgCptcodesComponent implements OnInit {
  displayedColumns: string[] = [
    'cptCode',
    'description',
    'firstName',
    'lastName',
    'dob', 
    'createdDateTime',
    'action',

  ];
  detailDataSourceLength = 0;
  detailDataSource = [];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  detailDataloading: boolean = false;
  constructor(
    private mctFormService: MctFormService,
    public dialog: MatDialog) {
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
          this.detailDataSourceLength = data.totalCount;
          return data.items;
        })
      ).subscribe(data => this.detailDataSource = data);

  }
}