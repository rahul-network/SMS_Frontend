import { Component, Inject, OnInit, ViewChild, Input, Output, EventEmitter, } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { PatientService } from "../patient/service/patient-service";
import { PatientVoiceCallService, PatientVoiceCall } from "./service/patientvoicecall-service";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { Subscription } from "rxjs/internal/Subscription";

declare const Twilio: any;

@Component({
  selector: "dialer-app",
  templateUrl: "./dialer-app.component.html",
  styleUrls: ["./dialer-app.component.css"],
})
export class DialerAppComponent implements OnInit {
  subscription: Subscription;
  displayedColumns: string[] = ['content', 'createdDateTime', 'smsType'];
  detailDataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatSort) sort: MatSort;


  @Input() muted: boolean; onPhone: boolean; disabled: boolean;dialpadshow:boolean;Notes:string;
  
  @Output() onClickCall = new EventEmitter();
  @Output() onClickMute = new EventEmitter();

  phoneNumber = "";
  self = this;
  logtext = "";
  isValidNumber: boolean;
  fullNumber: string;
  http: any;
  patientVoiceCallResponse : any;

  ngOnInit(): void {
    let curretRowId = this.data.id;
    this.onPhone = false;
    this.dialpadshow = false;
    this.muted = false;
    this.dialpadshow = false;
    this.isValidNumber = false;
    let serverUrl = environment.apiUrl;
    this.Notes = '';
    // this.datatableFeedService.getDataById(curretRowId).subscribe((_feedDataDetails) => {
    //   this.detailDataSource = new MatTableDataSource(_feedDataDetails);
    //   this.detailDataSource.sort = this.sort;
    // });

    this.httpClient
      .get(`${serverUrl}/Token`, { responseType: "text" })
      .toPromise()
      .then((res) => {
        var options = {
          closeProtection: true, // will warn user if you try to close browser window during an active call
          debug: true
        };
        Twilio.Device.setup(res, options);
      });
  }
  constructor(public dialogRef: MatDialogRef<DialerAppComponent>,
    private httpClient: HttpClient,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private patientService: PatientService,
    private patientVoiceCallService: PatientVoiceCallService
  ) {
    dialogRef.disableClose = true;
    this.onClickCall = new EventEmitter();;
    this.onClickMute = new EventEmitter();;

    Twilio.Device.on("ready", (device: any) => {
      console.log("This is a listenner that fires when your device is ready")
      console.log(device);
      device.volume = 1.0
      
      
      // 
    });

    Twilio.Device.on("volume", (connection: any) =>{

      alert('c')
    });

    Twilio.Device.on("connect", (connection: any) => {
      console.log("This is a listener that fires when your device is connected to a phone call")
      console.log(connection);
      this.PatientAddOrUpdate(connection.parameters.CallSid,connection.message.To,connection.outboundConnectionId)
    });
    Twilio.Device.on("disconnect", (connection: any) => {
      console.log("disconnect")
      console.log(connection);
      Twilio.Device.disconnectAll();
      this.onPhone = false;
      this.dialpadshow = false;
      this.muted = true;
    });
  }

  PatientAddOrUpdate(CallSid : any,To:any,outboundConnectionId : any){
    let obj: PatientVoiceCall = {
      Id: 0,
      PatientId: this.data.externalPatientId,
      cliniccode: this.data.clinicId,     
      CallLength:""   ,
      CallSid: CallSid,
      CalledTo: To,
      OutboundConnectionId: outboundConnectionId,
      Remarks : ""
    };
    this.patientVoiceCallService.addOrUpdate(obj).subscribe((res) => {
      this.patientVoiceCallResponse = res;
      console.log(res);
    });
    this.subscription.unsubscribe();
    

  }

  Phonecall(phoneNumber: string) {
    if (!this.onPhone) {
      this.onPhone = true;
      
      this.muted = false;
       Twilio.Device.connect({ To: phoneNumber, From :this.data.smsPhoneNo });
      this.logtext = `Calling ${this.fullNumber}`;
    } else {
      // hang up call in progress
      this.onPhone = false;
      this.dialpadshow = false;
      this.muted = true;
      var connection = Twilio.Device.activeConnection();
      console.log(connection)
      Twilio.Device.disconnectAll();
      connection = Twilio.Device.activeConnection();
      console.log('After close')
      console.log(connection)
    }
  }

  sendDigit(input: any){
    Twilio.Device.activeConnection()?.sendDigits(input);
    

  }
  endCall() {
    var connection = Twilio.Device.activeConnection();
    console.log(connection)
    if (connection) {
      connection.disconnect();  
    }
  }
  acceptCall() {
    var connection = Twilio.Device.activeConnection();
    if (connection) {
      connection.accept();
    }
  }
  rejectCall() {
    var connection = Twilio.Device.activeConnection();
    if (connection) {
      connection.reject();
    }
  }
  destroy() {
    Twilio.Device.destroy();
  }
  // Handle muting
  toggleMute() {
    this.muted = !this.muted;
    Twilio.Device.activeConnection()?.mute(this.muted);
  }
  toggleDialPad() {
    this.dialpadshow = !this.dialpadshow;
  }


  close() {
    Twilio.Device.disconnectAll();
    if(this.patientVoiceCallResponse !== undefined){
    let obj: PatientVoiceCall = {
      Id: this.patientVoiceCallResponse.id,
      PatientId: this.data.externalPatientId,
      cliniccode: this.data.clinicId,     
      CallLength:""   ,
      CallSid: "",
      CalledTo: "",
      OutboundConnectionId: "",
      Remarks :  this.Notes
    };
    this.patientVoiceCallService.addOrUpdate(obj).subscribe((res) => {
      this.patientVoiceCallResponse = res;
      this.dialogRef.close()
      console.log(res);
    });
  }else{
    this.dialogRef.close()
  }
   
   


  }
}
