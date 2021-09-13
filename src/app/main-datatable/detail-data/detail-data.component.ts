import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {  ChangeDetectorRef } from '@angular/core';
import {MatDialog,MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DatatableFeedService } from 'src/app/datatable-feed.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {PatientMessageRequest} from '../../shared/patientMessagePagerModel'
import {PagerModel} from '../../shared/pagerModel'
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient, HttpParams } from '@angular/common/http';
import  {MessageComponent} from '../../messsage/message.component';
import { DialerAppComponent } from 'src/app/Voice/dialer-app.component';
import { debug } from 'console';
@Component({
  selector: 'app-detail-data',
  templateUrl: './detail-data.component.html',
  styleUrls: ['./detail-data.component.css']
})


export class DetailDataComponent implements OnInit {

  displayedColumns: string[] = ['createdDateTime','smsType', 'content', 'createdByName', 'markread'];
  messageDisplayedColumns: string[] = ['createdDateTime','smsType', 'content', 'createdByName', 'markread'];
  callsDisplayedColumns: string[] = ['createdDateTime','calledTo', 'callLength', 'callStartDateTime', 'createdByName'];
  videoDisplayedColumns: string[] = ['createdDateTime','videoCallStartDateTime','videoCallEndDateTime','participantJoinDateTime','partipantLeaveDateTime','createdByName'];

  detailDataSource = new MatTableDataSource<IComms>([]);
  messageDataSource = new MatTableDataSource<any>([]);
  callsDataSource = new MatTableDataSource<any>([]);
  videoDataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatSort) messagesort: MatSort;
  @ViewChild(MatSort) voicecallsort: MatSort;
  @ViewChild(MatSort) videocallsort: MatSort;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) messagepaginator: MatPaginator;
  @ViewChild(MatPaginator) voicepaginator: MatPaginator;
  @ViewChild(MatPaginator) videpaginator: MatPaginator;

  detailDataloading  : boolean = false;
  messageDataloading : boolean = false;
  callsDataloading  : boolean = false;
  videoDataloading : boolean = false;


  constructor(
    public dialog: MatDialog,private changeDetectorRefs: ChangeDetectorRef,
    public dialogRef: MatDialogRef<DetailDataComponent>,private formBuilder: FormBuilder,

    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private datatableFeedService: DatatableFeedService) {

     }

    result : any[];
    messageResult : any[];
    voiceResult : any[];
    videoResult : any[];

    registerForm: FormGroup = this.formBuilder.group({
      id: [ , { updateOn: "change" }],
      message: [,{validators: [Validators.required],updateOn: "change",}],

      });



  ngOnInit(): void {

    this.detailDataSource.sort = this.sort;
    this.messageDataSource.sort = this.sort;


    let externalPatientId = this.data.externalPatientId;
    let clinitId = this.data.clinicId;
    let pager : PagerModel = {
      Sort: "1",
      PageNumber : 1,
      PageSize :500
    };
    this.detailDataloading = false;
    //Comms
    this.datatableFeedService.getDataById(Number(clinitId),externalPatientId, pager).subscribe((_feedDataDetails) => {

      this.result = _feedDataDetails.rows;
      this.result.length = _feedDataDetails.totalRowCount;
      this.detailDataSource = new MatTableDataSource(this.result);
      this.detailDataSource.paginator = this.paginator;
      this.detailDataSource.sort = this.sort;
      this.detailDataloading = false;
      
    });

    this.messageDataloading = true;
    //Messages
    this.datatableFeedService.getMessagesById(Number(clinitId),externalPatientId, pager).subscribe((_feedDataDetails) => {

      debugger
      this.messageResult = _feedDataDetails.rows;
      this.messageResult.length = _feedDataDetails.totalRowCount;
      this.messageDataSource = new MatTableDataSource(this.messageResult);
      this.messageDataSource.paginator = this.messagepaginator;
      this.messageDataSource.sort = this.messagesort;
      this.messageDataloading = false
    });

    this.callsDataloading= true;
    //Voice Call
    this.datatableFeedService.getVoiceCallsById(Number(clinitId),externalPatientId, pager).subscribe((_feedDataDetails) => {
      this.voiceResult = _feedDataDetails.rows;
      this.voiceResult.length = _feedDataDetails.totalRowCount;
      this.callsDataSource = new MatTableDataSource(this.voiceResult);
      this.callsDataSource.paginator = this.voicepaginator;
      this.callsDataSource.sort = this.voicecallsort;
      this.callsDataloading = false;

    });

    //Video Call
    this.videoDataloading = false;
    this.datatableFeedService.getVideoCallsById(Number(clinitId),externalPatientId, pager).subscribe((_feedDataDetails) => {

      this.videoResult = _feedDataDetails.rows;
      this.videoResult.length = _feedDataDetails.totalRowCount;
      this.videoDataSource = new MatTableDataSource(this.videoResult);
      this.videoDataSource.paginator = this.videpaginator;
      this.videoDataSource.sort = this.videocallsort;
      
      this.videoDataloading = false;
    });

  }



  getNextData(currentSize:any, offset :any, limit:any){

    let params = new HttpParams();
    params = params.set('offset', offset);
    params = params.set('limit', limit);

    let externalPatientId = this.data.externalPatientId;
    let clinitId = this.data.clinitId;
    let pager : PagerModel = {
      Sort: "1",
      PageNumber : offset,
      PageSize : limit
    };

    this.datatableFeedService.getDataById(Number(clinitId),externalPatientId, pager).subscribe((_feedDataDetails) => {

      this.result.length = _feedDataDetails.totalRowCount;
      this.result.push(_feedDataDetails.rows);

      this.detailDataSource = new MatTableDataSource<any>(this.result);
      this.detailDataSource._updateChangeSubscription();
      this.detailDataSource.paginator = this.paginator;
      this.detailDataSource.sort = this.sort;
    });

}

  pageChanged(event :any){

    let pageIndex = event.pageIndex;
    let pageSize = event.pageSize;

    let previousIndex = event.previousPageIndex;

    let previousSize = pageSize * pageIndex;

    this.getNextData(previousSize, (pageIndex).toString(), pageSize.toString());
  }
  
  messagepageChanged(event :any){

    let pageIndex = event.pageIndex;
    let pageSize = event.pageSize;

    let previousIndex = event.previousPageIndex;

    let previousSize = pageSize * pageIndex;

    this.getNextData(previousSize, (pageIndex).toString(), pageSize.toString());
  }



  


  openVideoCall() {
    window.open(`${location.origin}/#/videocall/${this.data.clinic.id}/${this.data.externalPatientId}/`, "_blank");

  }

  openMessage(phoneNumber: any) {
    const dialogRef = this.dialog.open(MessageComponent, {
      disableClose: true ,
      width: '50vw',
      height: '50vh',
      data: {
        id: this.data.id,
       cellPhone: phoneNumber , //,
       firstName :this.data.firstName,
       clinic: this.data.clinic,
       email : this.data.email,
       smsPhoneNo : this.data.clinic.smsPhoneNo,
       lastName :this.data.lastName,
       gender :this.data.gender,
       externalPatientId : this.data.externalPatientId
      }

   });
  }

  openPhoneCall(phoneNumber : any) {
    const dialogRef = this.dialog.open(DialerAppComponent, {
      disableClose: true ,
      width: '50vw',
      height: '50vh',
     data: {
       id: this.data.id,
       cellPhone: phoneNumber , //,
       firstName :this.data.firstName,
       clinicId: this.data.clinicId,
       email : this.data.email,
       smsPhoneNo : this.data.clinic.smsPhoneNo,
       lastName :this.data.lastName,
       gender :this.data.gender,
       externalPatientId : this.data.externalPatientId
      }
   });
   dialogRef.afterClosed().subscribe(result => {
   });
  }

}

export interface IComms{
  createdDateTime : Date,
  smsType: number,
  content: string,
  createdByName: Date,
  markread:boolean
}