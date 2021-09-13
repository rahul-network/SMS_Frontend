import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { environment } from "../../../environments/environment" 

@Injectable({
  providedIn: 'root'
})

export class PatientVideoCallService {
  constructor(private httpClient: HttpClient) { }
  CreateOrUpdateMeeting(cliniccode: number,patientid:string, _data : PatientVideoCall) {
    let serverUrl = environment.apiUrl;
    return this.httpClient.post(`${serverUrl}/api/Clinic/${cliniccode}/Patient/${patientid}/VideoCall`, _data).pipe(
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
  Id: number,
  RoomId: string,
  HasCreated: boolean,
  HasJoined : boolean
}
