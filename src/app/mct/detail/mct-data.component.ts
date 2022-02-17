import { AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Component, OnInit, ViewChild } from '@angular/core';
import { merge, Observable } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MctFormService } from '../services/mct-service';
import { MatPaginator } from '@angular/material/paginator';
import { tap } from 'rxjs/operators';
import * as moment from 'moment';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'mct-form-data',
    templateUrl: './mct-data.component.html',
    styleUrls: ['./mct-data.component.scss'],
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
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
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

        setTimeout(() => {

            this.getMctForms();

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
                            this.getMctForms()
                        })
                    )
                    .subscribe();

            }
        }, 1000);


    }

    getMctForms() {
        this.loading = true;
        var index = this.paginator ? this.paginator.pageIndex : 0;
        var pageSize = this.paginator ? this.paginator.pageSize : 10;
        this.mctFormService.getMctForms(index, pageSize, this.sort).subscribe(results => {
            this.dataSource = new MatTableDataSource(results.items);
            this.loading = false;
            this.totalCount = results.totalCount;
        })
        this.loading = true;
        this.mctFormService.getMctForms(index, pageSize, this.sort).subscribe(results => {
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