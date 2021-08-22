import { Component, Inject, OnInit, ViewChild, Input, Output, EventEmitter, } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { DatatableFeedService } from "../datatable-feed.service";
import { PatientVoiceCallService, PatientVoiceCall } from "./service/patientvoicecall-service";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { debug } from "console";

declare const Twilio: any;

@Component({
  selector: "dialer-app",
  templateUrl: "./dialer-app.component.html",
  styleUrls: ["./dialer-app.component.css"],
})
export class DialerAppComponent implements OnInit {

  displayedColumns: string[] = ['content', 'createdDateTime', 'smsType'];
  detailDataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatSort) sort: MatSort;


  @Input() muted: boolean; onPhone: boolean; disabled: boolean;
  @Output() onClickCall = new EventEmitter();
  @Output() onClickMute = new EventEmitter();

  phoneNumber = "";
  self = this;
  logtext = "";
  isValidNumber: boolean;
  fullNumber: string;
  http: any;

  ngOnInit(): void {
    let curretRowId = this.data.id;
    this.onPhone = false;
    this.muted = false;
    this.isValidNumber = false;
    let serverUrl = environment.apiUrl;
    this.datatableFeedService.getDataById(curretRowId).subscribe((_feedDataDetails) => {
      this.detailDataSource = new MatTableDataSource(_feedDataDetails);
      this.detailDataSource.sort = this.sort;
    });

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
    private datatableFeedService: DatatableFeedService,
    private patientVoiceCallService: PatientVoiceCallService
  ) {
    dialogRef.disableClose = true;
    this.onClickCall = new EventEmitter();;
    this.onClickMute = new EventEmitter();;

    Twilio.Device.on("ready", (device: any) => {
      console.log("This is a listenner that fires when your device is ready")
      console.log(device);
      // 
    });

    Twilio.Device.on("connect", (connection: any) => {
      console.log("This is a listener that fires when your device is connected to a phone call")
      console.log(connection);
      let obj: PatientVoiceCall = {
        PatientId: Number( this.data.id),
        CallLength: "00",
        CallSid: connection.parameters.CallSid,
        CalledTo: connection.message.To,
        OutboundConnectionId: connection.outboundConnectionId
      };
      this.patientVoiceCallService.addOrUpdate(obj).subscribe((res) => {
        console.log(res);
      });
      console.log(connection);
    });
   

    Twilio.Device.on("disconnect", (connection: any) => {
      console.log("disconnect")
      console.log(connection);
      Twilio.Device.disconnectAll();
      this.onPhone = false;
      this.muted = true;
    });
  }

  refreshData(): void {
    this.datatableFeedService.getDataById(this.data.id).subscribe((_feedDataDetails) => {
      this.detailDataSource = new MatTableDataSource(_feedDataDetails);
      this.detailDataSource.sort = this.sort;
    });
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
      this.muted = true;
      var connection = Twilio.Device.activeConnection();
      console.log(connection)
      Twilio.Device.disconnectAll();
      connection = Twilio.Device.activeConnection();
      console.log('After close')
      console.log(connection)
    }
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

  close() {
    Twilio.Device.disconnectAll();
    this.dialogRef.close()

  }
}
