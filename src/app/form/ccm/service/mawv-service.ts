import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { environment } from "../../../../environments/environment" 

@Injectable({
  providedIn: 'root'
})

export class MAWVFormService {
  constructor(private httpClient: HttpClient) { }
  addOrUpdate(_data : FormData,externalPatientId: string,formId: string,clinicCode : number) {
    let obj : SaveMAWVFormModel = {
      FormData : _data,
      FormId :  formId 
    }
    let serverUrl = environment.apiUrl;
    return this.httpClient.post(`${serverUrl}/api/Clinic/${clinicCode}/Patient/${externalPatientId}/MAWVForm`,obj).pipe(
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

interface SaveMAWVFormModel{
  FormData :FormData,
  FormId:string,
}