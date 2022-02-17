import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { VideoCallComponent } from '../patient-detail/Video/Call/videoCall.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PatientSmsComponent } from '../patient-detail/Sms/patient-sms.component';
import { DialerAppComponent } from './Call/dialer-app.component';
import { merge, Observable } from 'rxjs';
import { startWith, switchMap, catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import * as moment from 'moment';
@Component({
  selector: 'patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css']
})


export class PatientDetailComponent implements OnInit {
  moment: any = moment;
  displayedColumns: string[] = ['createdDateTime', 'smsType','smsStatus', 'content', 'createdByName', 'markread'];
  messageDisplayedColumns: string[] = ['createdDateTime', 'smsType','smsStatus', 'content', 'createdByName', 'markread'];
  callsDisplayedColumns: string[] = ['createdDateTime', 'calledTo', 'callLength', 'callStartDateTime', 'remarks','createdByName'];
  videoDisplayedColumns: string[] = ['createdDateTime', 'videoCallStartDateTime', 'videoCallEndDateTime', 'participantJoinDateTime', 'partipantLeaveDateTime', 'createdByName'];
  detailDataSourceLength = 0;
  detailDataSource = new MatTableDataSource<IComms>([]);
  messageDataSourceLength = 0;
  messageDataSource = new MatTableDataSource<IMessage>([]);
  callsDataSourceLength = 0;
  callsDataSource = new MatTableDataSource<ICalls>([]);
  videoDataSourceLength = 0;
  videoDataSource = new MatTableDataSource<IVideoCalls>([]);

  @ViewChild("TableCommsSort", { static: true }) commSort!: MatSort;

  @ViewChild("TableMessageSort", { static: true }) messagesort!: MatSort;
  @ViewChild("TableCallsSort", { static: true }) voicecallsort!: MatSort;
  @ViewChild("TableVideoCallsSort", { static: true }) videocallsort!: MatSort;

  @ViewChild("TableCommsPaginator", { static: true }) paginator!: MatPaginator;
  @ViewChild("TableMessagePaginator", { static: true }) messagepaginator!: MatPaginator;
  @ViewChild("TableCallsPaginator", { static: true }) voicepaginator!: MatPaginator;
  @ViewChild("TableVideoCallsPaginator", { static: true }) videpaginator!: MatPaginator;

  detailDataloading: boolean = false;
  messageDataloading: boolean = false;
  callsDataloading: boolean = false;
  videoDataloading: boolean = false;


  constructor(
    private httpClient: HttpClient,
    public dialog: MatDialog, private changeDetectorRefs: ChangeDetectorRef,
    private formBuilder: FormBuilder,

    @Inject(MAT_DIALOG_DATA)
    public data: any) {

  }
  laraHealthHttpDatabase!: LaraHealthHttpDatabase | null;
  result!: any[];
  messageResult!: any[];
  voiceResult!: any[];
  videoResult!: any[];

  registerForm: FormGroup = this.formBuilder.group({
    id: [, { updateOn: "change" }],
    message: [, { validators: [Validators.required], updateOn: "change", }],

  });

  ngAfterViewInit() {
    this.laraHealthHttpDatabase = new LaraHealthHttpDatabase(this.httpClient);
    this.commSort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.commSort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          //this.isLoadingResults = true;
          return this.laraHealthHttpDatabase!.getComms(
            this.commSort.active, this.commSort.direction, this.paginator.pageIndex, 10, 'QAC', this.data.externalPatientId)
            .pipe();
        }),
        map(data => {
          if (data === null) {
            return [];
          }
          this.detailDataSourceLength = data.totalRowCount;
          return data.rows;
        })
      ).subscribe(data => this.detailDataSource = data);

    this.messagesort.sortChange.subscribe(() => this.messagepaginator.pageIndex = 0);
    merge(this.messagesort.sortChange, this.messagepaginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          //this.isLoadingResults = true;
          return this.laraHealthHttpDatabase!.getMessages(
            this.messagesort.active, this.messagesort.direction, this.messagepaginator.pageIndex, 10, 'QAC', this.data.externalPatientId)
            .pipe();
        }),
        map(data => {
          if (data === null) {
            return [];
          }
          this.messageDataSourceLength = data.totalRowCount;
          return data.rows;
        })
      ).subscribe(data => this.messageDataSource = data);

    this.voicecallsort.sortChange.subscribe(() => this.voicepaginator.pageIndex = 0);
    merge(this.voicecallsort.sortChange, this.voicepaginator.page)
      .pipe(
        startWith({}), switchMap(() => {
          return this.laraHealthHttpDatabase!.getVoiceCalls(
            this.voicecallsort.active, this.voicecallsort.direction, this.voicepaginator.pageIndex, 10, 'QAC', this.data.externalPatientId)
            .pipe();
        }),
        map(data => {
          if (data === null)
            return [];
          this.callsDataSourceLength = data.totalRowCount;
          return data.rows;
        })
      ).subscribe(data => this.callsDataSource = data);


    this.videocallsort.sortChange.subscribe(() => this.videpaginator.pageIndex = 0);
    merge(this.voicecallsort.sortChange, this.videpaginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          //this.isLoadingResults = true;
          return this.laraHealthHttpDatabase!.getVideoCalls(
            this.videocallsort.active, this.videocallsort.direction, this.videpaginator.pageIndex, 10, Number(this.data.clinicId), this.data.externalPatientId)
            .pipe();
        }),
        map(data => {
          if (data === null) {
            return [];
          }
          this.videoDataSourceLength = data.totalRowCount;
          return data.rows;
        })
      ).subscribe(data => this.videoDataSource = data);
  }

  ngOnInit(): void {

  }

  openVideoCall() {
    const dialogRef = this.dialog.open(VideoCallComponent, {
      disableClose: true,
      autoFocus:false,
      panelClass: 'my-video',
      width: '100%',
      height: '100%',
      data: {
        id: this.data.id,
        firstName: this.data.firstName,
        clinicId: this.data.clinicId,
        email: this.data.email,
        smsPhoneNo: this.data.cellPhone,
        lastName: this.data.lastName,
        gender: this.data.gender,
        externalPatientId: this.data.externalPatientId
      }

    });
    //window.open(`${location.origin}/#/videocall/${this.data.clinic.id}/${this.data.externalPatientId}/`, "_blank");

  }
  openMessage(phoneNumber: any) {
    const dialogRef = this.dialog.open(PatientSmsComponent, {
      disableClose: true,
      autoFocus:false,
      width: '50vw',
      height: '50vh',
      data: {
        id: this.data.id,
        cellPhone: phoneNumber, //,
        firstName: this.data.firstName,
        clinic: this.data.clinic,
        email: this.data.email,
        smsPhoneNo: this.data.cellPhone,
        lastName: this.data.lastName,
        gender: this.data.gender,
        externalPatientId: this.data.externalPatientId
      }

    });
  }
  openPhoneCall(phoneNumber: any) {
    const dialogRef = this.dialog.open(DialerAppComponent, {
      disableClose: true,
      panelClass: 'my-dialog',
      autoFocus:false,
      hasBackdrop:false,
      data: {
        id: this.data.id,
        cellPhone: phoneNumber, //,
        firstName: this.data.firstName,
        clinicId: this.data.clinicId,
        email: this.data.email,
        smsPhoneNo: this.data.cellPhone,
        lastName: this.data.lastName,
        gender: this.data.gender,
        externalPatientId: this.data.externalPatientId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
}

export class LaraHealthHttpDatabase {
  constructor(private _httpClient: HttpClient) { }

  getComms(sort: string, order: SortDirection, page: number, pageSize: number,
    cliniccode: string, patientid: string): Observable<any> {
    if (sort === undefined)
      sort = 'createdDateTime';
    if (order !== 'asc' && sort !== undefined)
      sort = `-${sort}`;
    else
      sort
    const href = environment.apiUrl;
    const requestUrl = `${href}/api/Clinic/${cliniccode}/Patient/${patientid}/Message?&Sort=${sort}&order=${order}&PageNumber=${page + 1}&PageSize=${pageSize}`;
    return this._httpClient.get<any>(requestUrl);
  }

  getMessages(sort: string, order: SortDirection, page: number, pageSize: number,
    cliniccode: string, patientid: string): Observable<any> {
    if (sort === undefined)
      sort = 'createdDateTime';
    if (order !== 'asc' && sort !== undefined)
      sort = `-${sort}`;
    else
      sort
    const href = environment.apiUrl;
    const requestUrl = `${href}/api/Clinic/${cliniccode}/Patient/${patientid}/Message?&Sort=${sort}&order=${order}&PageNumber=${page + 1}&PageSize=${pageSize}`;
    return this._httpClient.get<any>(requestUrl);
  }
  getVoiceCalls(sort: string, order: SortDirection, page: number, pageSize: number,
    cliniccode: string, patientid: string): Observable<any> {
    if (sort === undefined)
      sort = 'createdDateTime';
    if (order !== 'asc' && sort !== undefined)
      sort = `-${sort}`;
    else
      sort
    const href = environment.apiUrl;
    const requestUrl = `${href}/api/Clinic/${cliniccode}/Patient/${patientid}/VoiceCall?&Sort=${sort}&order=${order}&PageNumber=${page + 1}&PageSize=${pageSize}`;
    return this._httpClient.get<any>(requestUrl);
  }

  getVideoCalls(sort: string, order: SortDirection, page: number, pageSize: number,
    cliniccode: number, patientid: string): Observable<any> {
    if (sort === undefined)
      sort = 'createdDateTime';
    if (order !== 'asc' && sort !== undefined)
      sort = `-${sort}`;
    else
      sort
    const href = environment.apiUrl;
    const requestUrl = `${href}/api/Clinic/${cliniccode}/Patient/${patientid}/VideoCall?&Sort=${sort}&order=${order}&PageNumber=${page + 1}&PageSize=${pageSize}`;
    return this._httpClient.get<any>(requestUrl);
  }
}

export interface IComms {
  createdDateTime: Date,
  smsType: number,
  content: string,
  createdByName: Date,
  markread: boolean
}

export interface IMessage {
  createdDateTime: Date,
  smsType: number,
  content: string,
  createdByName: Date,
  markread: boolean
}

export interface ICalls {
  createdDateTime?: Date
  calledTo: string,
  callLength?: number
  callStartDateTime?: Date,
  createdByName?: string
}

export interface IVideoCalls {
  createdDateTime?: Date
  videoCallStartDateTime?: Date
  videoCallEndDateTime?: Date
  participantJoinDateTime?: Date
  partipantLeaveDateTime?: Date
  createdByName?: string
}