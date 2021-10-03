import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { environment } from "../../../environments/environment"

@Injectable({
  providedIn: 'root'
})

export class PatientVoiceCallService {
  constructor(private httpClient: HttpClient) { }
  addOrUpdate(_data: PatientVoiceCall) {
    let serverUrl = environment.apiUrl;
    http://localhost:12387/api/Clinic/7/Patient/028f6bfe-fc30-4a0d-9050-925cbb3ea11a/VoiceCall/

    return this.httpClient.post(`${serverUrl}/api/Clinic/${Number(_data.cliniccode)}/Patient/${_data.PatientId}/VoiceCall/`, {
      CallSid: _data.CallSid,
      OutboundConnectionId: _data.OutboundConnectionId,
      CalledTo: _data.CalledTo,
      Remarks : _data.Remarks,
      Id : _data.Id

    }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
}


export interface PatientVoiceCall {
  CalledTo: string
  CallSid: string,
  cliniccode: string,
  PatientId: string,
  CallLength: string,
  OutboundConnectionId: string,
  Id : number,
  Remarks: string
}
