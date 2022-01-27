import { AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PatientService } from '../../patient/service/patient-service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { merge, Observable } from 'rxjs';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MctFormService } from './service/mct-service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { map, startWith, switchMap } from 'rxjs/operators';
import { MctFormComponent } from './mct.component';
@Component({
    selector: 'mct-form-data',
    templateUrl: './mct-data.component.html',
    styleUrls: ['./mct-data.component.css']
})


export class MctDataComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = [
        'clinicName',
        'firstName',
        'lastName',
        'dob', 
        'icD10',
        'rem_CPT93224',
        'rem_CPT93224_ServiceDt',
        'rem_CPT93228',
        'rem_CPT93228_ServiceDt',
        'rem_CPT93229',
        'rem_CPT93229_ServiceDt',
        'createdDateTime'
    ];
    detailDataSourceLength = 0;
    //detailDataSource = new MatTableDataSource<IComms>([]);
    detailDataSource = [];
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    detailDataloading: boolean = false;
    constructor(
        private httpClient: HttpClient,
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

    openMCTForm() {
        const dialogRef = this.dialog.open(MctFormComponent, {
          width: '50%',
          autoFocus: false
        });
        dialogRef.afterClosed().subscribe(result => {
        });
      }
}