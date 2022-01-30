import { AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { merge } from 'rxjs';
import { MatSort} from '@angular/material/sort';
import { MctFormService } from './service/mct-service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { map, startWith, switchMap } from 'rxjs/operators';
import { MctFormComponent } from './mct.component';
import * as moment from 'moment';
const MAX_SIZE: number = 1048576;
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
    //detailDataSource = new MatTableDataSource<IComms>([]);
    detailDataSource = [];
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    detailDataloading: boolean = false;
    theFile: any = null;
messages: string[] = [];
 
// Maximum file size allowed to be uploaded = 1MB

    constructor(
        private httpClient: HttpClient,
        private mctFormService: MctFormService,
        public dialog: MatDialog) {

    }
    result!: any[];
    ngOnInit(): void {


    }
    onFileChange(event: any) {
        this.theFile = null;
        if (event.target.files && event.target.files.length > 0) {
            // Don't allow file sizes over 1MB
            if (event.target.files[0].size < MAX_SIZE) {
                // Set theFile property
                this.theFile = event.target.files[0];
            }
            else {
                // Display error message
                this.messages.push("File: " + event.target.files[0].name + " is too large to upload.");
            }
        }
    }

    // private readAndUploadFile(theFile: any) {
    //     let file = new FileToUpload();
        
    //     // Set File Information
    //     file.fileName = theFile.name;
    //     file.fileSize = theFile.size;
    //     file.fileType = theFile.type;
    //     file.lastModifiedTime = theFile.lastModified;
    //     //file.lastModifiedDate = theFile.lastModifiedDate;
        
    //     // Use FileReader() object to get file to upload
    //     // NOTE: FileReader only works with newer browsers
    //     let reader = new FileReader();
        
    //     // Setup onload event for reader
    //     reader.onload = () => {
    //         // Store base64 encoded representation of file
    //         file.fileAsBase64 = reader.result?.toString() ?? "";
            
    //         // POST to server
    //         this.mctFormService.uploadFile(file).subscribe(resp => { 
    //             this.messages.push("Upload complete"); });
    //     }
        
    //     // Read the file
    //     reader.readAsDataURL(theFile);
    // }
    // uploadFile(): void {
    //     this.readAndUploadFile(this.theFile);
    // }


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