import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { environment } from "../../../environments/environment" 

@Injectable({
  providedIn: 'root'
})

export class PatientVideoCallService {
  constructor(private httpClient: HttpClient) { }
  CreateMeeting(_data : PatientVideoCall) {
    let serverUrl = environment.apiUrl;
    return this.httpClient.post(`${serverUrl}/api/PatientVideoCall/createmeeting/`, _data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  Joinmeeting(_data : PatientVideoCall) {
    let serverUrl = environment.apiUrl;
    return this.httpClient.post(`${serverUrl}/api/PatientVideoCall/joinmeeting/`, _data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  Leavemeeting(_data : PatientVideoCall) {
    let serverUrl = environment.apiUrl;
    return this.httpClient.post(`${serverUrl}/api/PatientVideoCall/leavemeeting/`, _data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
}


export interface PatientVideoCall {
    MeetingId: string,
    PatientId: number,
    HasPartiparntJoined: boolean,
    CallStartDateTime : Date,
    ParticipantJoinDateTime: Date,
    PartipantLeaveDateTime: Date,
    CreatedBy: number
}
