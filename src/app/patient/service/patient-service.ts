import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment"
import {PatientMessageRequest, PatientListPagerModel} from '../models/patient'
@Injectable({
  providedIn: 'root'
})
export class PatientService {
  constructor(private httpClient: HttpClient) { }
  getAllData(clinicId : string,_pagerModel : PatientListPagerModel): Observable<any> {
    let serverUrl = environment.apiUrl;
    return this.httpClient.get(`${serverUrl}/api/Clinic/${clinicId}/Patient/?PageNumber=${_pagerModel.PageNumber}&&PageSize=${_pagerModel.PageSize}&&Sort=${_pagerModel.Sort}`).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  getPatient(clinicId: string, _id:any): Observable<any> {
    let serverUrl = environment.apiUrl;
    return this.httpClient.get(`${serverUrl}/api/Clinic/${clinicId}/Patient/${_id}`).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  getDataById(cliniccode:number,patientid :string,_pagerModel: PatientListPagerModel) {
    let serverUrl = environment.apiUrl;
    return this.httpClient.get(`${serverUrl}/api/Clinic/${cliniccode}/Patient/${patientid}/Message/?PageNumber=${_pagerModel.PageNumber}&&PageSize=${_pagerModel.PageSize}&&Sort=${_pagerModel.Sort}`).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  getMessagesById(cliniccode:number,patientid :string,_pagerModel: PatientListPagerModel) {
    let serverUrl = environment.apiUrl;
    return this.httpClient.get(`${serverUrl}/api/Clinic/${cliniccode}/Patient/${patientid}/Message/?PageNumber=${_pagerModel.PageNumber}&&PageSize=${_pagerModel.PageSize}&&Sort=${_pagerModel.Sort}`).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  getVoiceCallsById(cliniccode:number,patientid :string,_pagerModel: PatientListPagerModel) {
    let serverUrl = environment.apiUrl;
    return this.httpClient.get(`${serverUrl}/api/Clinic/${cliniccode}/Patient/${patientid}/VoiceCall/?PageNumber=${_pagerModel.PageNumber}&&PageSize=${_pagerModel.PageSize}&&Sort=${_pagerModel.Sort}`).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  getVideoCallsById(cliniccode:number,patientid :string,_pagerModel: PatientListPagerModel) {
    let serverUrl = environment.apiUrl;
    return this.httpClient.get(`${serverUrl}/api/Clinic/${cliniccode}/Patient/${patientid}/VideoCall/?PageNumber=${_pagerModel.PageNumber}&&PageSize=${_pagerModel.PageSize}&&Sort=${_pagerModel.Sort}`).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  sendSms(cliniccode:string,patientid :string,model:PatientMessageRequest) {
    let serverUrl = environment.apiUrl;
    return this.httpClient.post(`${serverUrl}/api/Clinic/${cliniccode}/Patient/${patientid}/Message`,model).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  downloadDeviceHistoryReport(clinicCode : string): Observable<HttpResponse<Blob>>{
    
    const href = environment.apiUrl;
    const requestUrl = `${href}/api/DeviceHistory/?&PageSize=1000000&PageNumber=1&Sort=1&ClinicCode=${clinicCode}`
    return this.httpClient.get(requestUrl, {responseType: 'blob',observe:'response'});

  }



  
}
