export interface PatientListPagerModel{
     Sort: string
     PageNumber : number,
     PageSize : number,
     SearchTerm?: string
}

export interface PatientMessageRequest {
     Content : string;
     CellPhone : string ;
     IsRead : boolean;
 }