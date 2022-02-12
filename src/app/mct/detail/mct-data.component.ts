import { AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Component,  OnInit, ViewChild } from '@angular/core';
import {  merge, Observable } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MctFormService } from '../services/mct-service';
import { MatPaginator } from '@angular/material/paginator';
import { map, startWith, switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'mct-form-data',
    templateUrl: './mct-data.component.html',
    styleUrls: ['./mct-data.component.css'],
})
export class MctDataComponent implements OnInit, AfterViewInit {
    @ViewChild(MatSort, { static: false }) sort!: MatSort;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    /** Max file size upto 2 MB */
    readonly maxSize = 2097152;
    moment: any = moment;
    selectedFile: File = null;
    totalCount: number = 0;
    loading = true;
    dataSource: any;
    loading$: Observable<boolean> = this.mctFormService.loading$;
    displayedColumns: string[] = [
        'clinicName',
        'firstName',
        'lastName',
        'dob', 'createdDateTime',
        'report',
        'cptCodes',
    ];
    detailDataSourceLength = 0;
    detailDataSource = [];
    detailDataloading: boolean = false;
    constructor(
        private mctFormService: MctFormService,
        public dialog: MatDialog
    ) {
    }
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

    getMctForms() {
        this.loading = true;
        this.mctFormService.getMctForms(this.sort.active, this.sort.direction, this.paginator.pageIndex, 10).subscribe(results => {
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
}