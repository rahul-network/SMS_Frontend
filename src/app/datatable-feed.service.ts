import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { environment } from "../environments/environment" 
@Injectable({
  providedIn: 'root'
})
export class DatatableFeedService {

  constructor(private httpClient: HttpClient) { }

  getAllData(): Observable<any> {
    let serverUrl = environment.apiUrl;
    return this.httpClient.get(`${serverUrl}/api/patient`).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getDataById(_id: any) {
    let serverUrl = environment.apiUrl;
    return this.httpClient.get(`${serverUrl}/api/PatientMessages/${_id}`).pipe(
      map((res: any) => {
        console.log(res);
        return res;
      })
    );

    
  }

  sendSms(_id: number,smsPhoneNo:string,_message:string) {
    let serverUrl = environment.apiUrl;
    return this.httpClient.post(`${serverUrl}/api/PatientMessages/SendSms`,{Patientid:_id,SMSPhoneNo:smsPhoneNo, Message :_message}).pipe(
      map((res: any) => {
        console.log(res);
        return res;
      })
    );

    
  }

}
