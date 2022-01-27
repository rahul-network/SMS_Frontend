export interface PatientListPagerModel{
     Sort: string
     PageNumber : number,
     PageSize : number,
     SearchTerm?: string
}

export interface PatientMessageRequest {
     Content : string;
     SMSPhoneNo : string;
     CellPhone : string ;
     IsRead : boolean;
 }