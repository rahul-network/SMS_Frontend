import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { environment } from "../../../environments/environment" 

@Injectable({
  providedIn: 'root'
})

export class PatientVoiceCallService {
  constructor(private httpClient: HttpClient) { }
  addOrUpdate(_data : PatientVoiceCall) {
    let serverUrl = environment.apiUrl;
    return this.httpClient.post(`${serverUrl}/api/PatientVoice/`, _data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
}


export interface PatientVoiceCall {
  CalledTo: string
  CallSid: string, 
  PatientId: number,
  CallLength: string,
  OutboundConnectionId: string
}
