import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Billing } from '../shared/models/patient.model';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserService } from '@app/users/user.service';
import * as moment from "moment";


@Injectable({
  providedIn: 'root'
})
export class BillingService {
  billingUrl: string;
  reimbursements: Billing[] = [];
  patientBaseUrl = environment.patientUrl;
  moment: any = moment;

  constructor(private http: HttpClient, private userService: UserService) {

    this.billingUrl = `${this.patientBaseUrl}/api/clinic/${this.userService.getCurrentClinic()}/billing`;
  }
  

  getBillingTimlog(dateFrom: Date, toDate: Date, pageIndex = 0, pageSize = 10, sort: any): Observable<any> {

    var _pageIndex = pageIndex + 1;
    var _sort = "startTime";
    var _direction = "-"
    if (sort && sort.active && sort._direction) {
      _sort = sort.active;
      _direction = sort._direction == "asc" ? "" : "-";
    }
    var tempFromDate = this.moment(dateFrom).format("YYYY-MM-DDT00:00:00");
    var temptoDate = this.moment(toDate).format("YYYY-MM-DDT00:00:00");

    var url = `${this.billingUrl}/timelogData?PageSize=${pageSize}&PageNumber=${_pageIndex}&Sort=${_direction}${_sort}&StartDate=${tempFromDate}&EndDate=${temptoDate}`;

    return this.http.get(url);


  }


  getBillingCPTInprogress(dateFrom: Date, toDate: Date, pageIndex = 0, pageSize = 10, sort: any): Observable<any> {

    var _pageIndex = pageIndex + 1;
    var _sort = "createdDateTime";
    var _direction = "-"
    if (sort && sort.active && sort._direction) {
      _sort = sort.active;
      _direction = sort._direction == "asc" ? "" : "-";
    }

    var tempFromDate = this.moment(dateFrom).format("YYYY-MM-DDT00:00:00");
    var temptoDate = this.moment(toDate).format("YYYY-MM-DDT00:00:00");

    var url = `${this.billingUrl}/cptcodesinprogress?PageSize=${pageSize}&PageNumber=${_pageIndex}&Sort=${_direction}${_sort}&StartDate=${tempFromDate}&EndDate=${temptoDate}`;

    return this.http.get(url);


  }

  getBillingCPTCompleted(dateFrom: Date, toDate: Date, pageIndex = 0, pageSize = 10, sort: any): Observable<any> {

    var _pageIndex = pageIndex + 1;
    var _sort = "createdDateTime";
    var _direction = "-"
    if (sort && sort.active && sort._direction) {
      _sort = sort.active;
      _direction = sort._direction == "asc" ? "" : "-";
    }
    var tempFromDate = this.moment(dateFrom).format("YYYY-MM-DDT00:00:00");
    var temptoDate = this.moment(toDate).format("YYYY-MM-DDT00:00:00");

    var url = `${this.billingUrl}/cptcodescompleted?PageSize=${pageSize}&PageNumber=${_pageIndex}&Sort=${_direction}${_sort}&StartDate=${tempFromDate}&EndDate=${temptoDate}`;

    return this.http.get(url);
  }


  getBillingCPTDirty(dateFrom: Date, toDate: Date, pageIndex = 0, pageSize = 10, sort: any): Observable<any> {

    var _pageIndex = pageIndex + 1;
    var _sort = "createdDateTime";
    var _direction = "-"
    if (sort && sort.active && sort._direction) {
      _sort = sort.active;
      _direction = sort._direction == "asc" ? "" : "-";
    }
    var tempFromDate = this.moment(dateFrom).format("YYYY-MM-DDT00:00:00");
    var temptoDate = this.moment(toDate).format("YYYY-MM-DDT00:00:00");

    var url = `${this.billingUrl}/cptcodesdirty?PageSize=${pageSize}&PageNumber=${_pageIndex}&Sort=${_direction}${_sort}&StartDate=${tempFromDate}&EndDate=${temptoDate}`;

    return this.http.get(url);


  }


  approveCptCode(id: number) {

    return this.http.put(`${this.billingUrl}/approveCptCode?id=${id}`, {});
  }


  exportBillingTimelog(dateFrom: Date, toDate: Date, pageIndex = 0, pageSize = 10, sort: any) {

    var _pageIndex = pageIndex + 1;
    var _sort = "startTime";
    var _direction = "-"
    if (sort && sort.active && sort._direction) {
      _sort = sort.active;
      _direction = sort._direction == "asc" ? "" : "-";
    }
    var tempFromDate = this.moment(dateFrom).format("YYYY-MM-DDT00:00:00");
    var temptoDate = this.moment(toDate).format("YYYY-MM-DDT00:00:00");

    var url = `${this.billingUrl}/exporttimelogData?PageSize=${pageSize}&PageNumber=${_pageIndex}&Sort=${_direction}${_sort}&StartDate=${tempFromDate}&EndDate=${temptoDate}`;

    return this.http.get(url);

  }



  exportBillingCptCodes(dateFrom: Date, toDate: Date, pageIndex = 0, pageSize = 10, sort: any, isApprovedOnly: boolean, isCorruptedOnly: boolean) {

    var _pageIndex = pageIndex + 1;
    var _sort = "createdDateTime";
    var _direction = "-"
    if (sort && sort.active && sort._direction) {
      _sort = sort.active;
      _direction = sort._direction == "asc" ? "" : "-";
    }
    var tempFromDate = this.moment(dateFrom).format("YYYY-MM-DDT00:00:00");
    var temptoDate = this.moment(toDate).format("YYYY-MM-DDT00:00:00");

    var methodName = "exportcptcodesinprogress";

    if (isApprovedOnly == true) {
      methodName = "exportcptcodescompleted"
    }

    if (isCorruptedOnly == true) {
      methodName = "exportcptcodesdirty";
    }
    var url = `${this.billingUrl}/${methodName}?PageSize=${pageSize}&PageNumber=${_pageIndex}&Sort=${_direction}${_sort}&StartDate=${tempFromDate}&EndDate=${temptoDate}`;

    return this.http.get(url);

  }



}
