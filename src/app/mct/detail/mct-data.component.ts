import { AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { merge } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MctFormService } from '../services/mct-service';
import { MatPaginator } from '@angular/material/paginator';
import { map, startWith, switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog.component';
@Component({
    selector: 'mct-form-data',
    templateUrl: './mct-data.component.html',
    styleUrls: ['./mct-data.component.css'],
})
export class MctDataComponent implements OnInit, AfterViewInit {
    moment: any = moment;
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
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    detailDataloading: boolean = false;
    theFile: any = null;
    messages: string[] = [];
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

    downloadReport(row: any) {
        const dialogConfig = new MatDialogConfig();
        const message = "Do you want to download report ?";
        dialogConfig.data = {
            message
        };
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {

                this.mctFormService.downloadReport(row.clinicCode,row.s3PdfName).subscribe(response => {
                      window.location.href = response.url;
                  }),error => console.log('Error downloading the file'),
                  () => console.info('File downloaded successfully');;
            }
        });
    }
}