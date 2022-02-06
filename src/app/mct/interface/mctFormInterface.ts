
 export interface FileUpload {
    fileId: number;
    fileName: string;
}
export  interface ClinicModel {
    name: string;
    code: string;
}
export  interface PatientModel {
    firstName: string;
    lastName: string;
    id: number,
    dateOfBirth: Date
}