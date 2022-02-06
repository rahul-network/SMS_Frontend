import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { debug } from 'console';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { debounceTime, map, switchMap, tap } from "rxjs/operators";
import { environment } from "../../environments/environment"
import * as moment from "moment";

const httpOptions = {
  headers: new HttpHeaders({
    'enctype': 'multipart/form-data',
    'Accept': 'application/json'
  })
};

@Injectable({ providedIn: 'root' })

export class EcgFormService {
  ecgUrl: string;
  mctUrl: string;
  moment: any = moment;
  patientBaseUrl = environment.patientUrl;
  constructor(private http: HttpClient) {
    //this.ecgUrl = `${this.patientBaseUrl}/api/clinic/${this.userService.getCurrentClinic()}/mct`;
    this.ecgUrl = `${this.patientBaseUrl}/api/clinic/QAC/ecg`;
    this.mctUrl = `${this.patientBaseUrl}/api/mct`;
  }

  getEcgFormsCPTCodeSubmitted(dateFrom: Date, toDate: Date, pageIndex = 0, pageSize = 10, sort: any): Observable<any> {
    var _pageIndex = pageIndex + 1;
    var _sort = "startTime";
    var _direction = "-"
    if (sort && sort.active && sort._direction) {
      _sort = sort.active;
      _direction = sort._direction == "asc" ? "" : "-";
    }
    var tempFromDate = this.moment(dateFrom).format("YYYY-MM-DDT00:00:00");
    var temptoDate = this.moment(toDate).format("YYYY-MM-DDT00:00:00");

    var url = `${this.ecgUrl}/getCbtCodes/?Submitted=true&PageSize=${pageSize}&PageNumber=${_pageIndex}&Sort=${_direction}${_sort}&StartDate=${tempFromDate}&EndDate=${temptoDate}`;

    return this.http.get(url);

  }

  getEcgFormsCPTCode(dateFrom: Date, toDate: Date, pageIndex = 0, pageSize = 10, sort: any): Observable<any> {
    var _pageIndex = pageIndex + 1;
    var _sort = "startTime";
    var _direction = "-"
    if (sort && sort.active && sort._direction) {
      _sort = sort.active;
      _direction = sort._direction == "asc" ? "" : "-";
    }
    var tempFromDate = this.moment(dateFrom).format("YYYY-MM-DDT00:00:00");
    var temptoDate = this.moment(toDate).format("YYYY-MM-DDT00:00:00");

    var url = `${this.ecgUrl}/getCbtCodes/?PageSize=${pageSize}&PageNumber=${_pageIndex}&Sort=${_direction}${_sort}&StartDate=${tempFromDate}&EndDate=${temptoDate}`;

    return this.http.get(url);

  }

  getMctReports(dateFrom: Date, toDate: Date, pageIndex = 0, pageSize = 10, sort: any): Observable<any> {

    var _pageIndex = pageIndex + 1;
    var _sort = "startTime";
    var _direction = "-"
    if (sort && sort.active && sort._direction) {
      _sort = sort.active;
      _direction = sort._direction == "asc" ? "" : "-";
    }
    var tempFromDate = this.moment(dateFrom).format("YYYY-MM-DDT00:00:00");
    var temptoDate = this.moment(toDate).format("YYYY-MM-DDT00:00:00");

    var url = `${this.ecgUrl}/getReports/?PageSize=${pageSize}&PageNumber=${_pageIndex}&Sort=${_direction}${_sort}&StartDate=${tempFromDate}&EndDate=${temptoDate}`;

    return this.http.get(url);
  }


  approveReport(_data: any) {
    return this.http.post(`${this.ecgUrl}`, _data,httpOptions).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
}

