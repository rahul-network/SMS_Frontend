import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { environment } from "../../../../environments/environment" 

@Injectable({
  providedIn: 'root'
})

export class CCMFormService {
  constructor(private httpClient: HttpClient) { }
  addOrUpdate(_data : FormData,patientId: number,formId: string) {
    let obj : SaveCCMFormModel = {
      FormData : _data,
      PatientId : patientId,
      FormId :  formId 
    }
    let serverUrl = environment.apiUrl;
    return this.httpClient.post(`${serverUrl}/api/CCM/saveDetails`,obj).pipe(
      map((res: any) => {
        return res;
      })
    );
    
  }

  getFormsbyPatientId(_id: any) {
    let serverUrl = environment.apiUrl;
    return this.httpClient.get(`${serverUrl}/api/CCM/getFormsByPatientId/${_id}`).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getDetailsbyFormId(_id: any) {
    let serverUrl = environment.apiUrl;
    return this.httpClient.get(`${serverUrl}/api/CCM/getDetailsbyFormId/${_id}`).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
}

interface SaveCCMFormModel{
  FormData :FormData,
  FormId:string,
  PatientId: number,
}