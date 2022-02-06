import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { debug } from 'console';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { debounceTime, map, switchMap, tap } from "rxjs/operators";
import { FileToUpload } from '../file-to-upload';
import { environment } from "../../../../environments/environment"
const API_URL = "http://localhost:65172/api/mct";
const httpOptions = {
    headers: new HttpHeaders({
        
      'enctype': 'multipart/form-data',
      'Accept': 'application/json'
    })
};



@Injectable({ providedIn: 'root' })

export class MctFormService {
  public loading$ = new BehaviorSubject<boolean>(false);
  private actionSubject = new BehaviorSubject<string>('');
  readonly action$ = this.actionSubject.asObservable();
  public clinicCode = new BehaviorSubject<string>('');
  public setAction(input: string, code: string): void {
    this.actionSubject.next(input);
    this.clinicCode.next(code);
  }

  constructor(private httpClient: HttpClient) { }

  readonly autocomplete$: Observable<PatientModel[]> = this.action$.pipe(
    tap((data: string) => this.loading$.next(true)),
    // Wait for 250 ms to allow the user to finish typing
    debounceTime(250),
    switchMap(input => ((!!input && input.trim().length > 1) ? this.httpClient.get<PatientModel[]>(`${environment.apiUrl}/api/Clinic/${this.clinicCode.value}/Patient?PageNumber=1&&PageSize=10&&SearchTerm=${input}`) : of([]))
      .pipe(
        map((data: any) => {
          this.loading$.next(false);
          return data.items

        }),
        tap((data: any) => console.log('output:', data))
      )),
  );
  // Cleanup.
  ngOnDestroy() {
    this.loading$.unsubscribe();
  }


  getClinics() {
    let serverUrl = environment.apiUrl;
    return this.httpClient.get(`${serverUrl}/api/clinic`).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  saveMctForm(_data: FormData) {
    
    let serverUrl = environment.apiUrl;
    return this.httpClient.post(`${serverUrl}/api/mct/`, _data,httpOptions).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getMctForms(sort: string, order: SortDirection, page: number, pageSize: number): Observable<any> {
    if (sort === undefined)
      sort = 'createdDateTime';
    if (order !== 'asc' && sort !== undefined)
      sort = `-${sort}`;
    else
      sort
    const href = environment.apiUrl;
    const requestUrl = `${href}/api/mct/?&Sort=${sort}&order=${order}&PageNumber=${page + 1}&PageSize=${pageSize}`;
    return this.httpClient.get<any>(requestUrl);
  }

  

  downloadReport(clinicCode : string,formId : string): Observable<HttpResponse<Blob>>{
    
    const href = environment.apiUrl;
    const requestUrl = `${href}/api/mct/${clinicCode}/${formId}`;
    return this.httpClient.get(requestUrl, {responseType: 'blob',observe:'response'});

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
export interface PatientModel {
  firstName: string;
  lastName: string;
  id: number,
  dateOfBirth: Date
}
