import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";

import { environment } from "../../../../environments/environment"

@Injectable({
  providedIn: 'root'
})

export class MctFormService {
  constructor(private httpClient: HttpClient) { }

  getClinics() {
    let serverUrl = environment.apiUrl;
    return this.httpClient.get(`${serverUrl}/api/clinic`).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  saveMctForm(_data: PostMctForm) {
   
    let serverUrl = environment.apiUrl;
    return this.httpClient.post(`${serverUrl}/api/mct/saveDetails`,_data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

}


interface PostMctForm {
  ClinicId: number;
  PatientId?: number;
  FirstName: string;
  LastName: string;
  DOB?: Date;
  ICD10: SVGStringList;
  Rem_CPT93224?: boolean;
  Rem_CPT93224_ServiceDt?: Date;
  Rem_CPT93228?: boolean;
  Rem_CPT93228_ServiceDt?: Date;
  Rem_CPT93229?: boolean;
  Rem_CPT93229_ServiceDt?: Date;

}