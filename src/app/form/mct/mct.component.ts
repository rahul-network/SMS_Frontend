import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FormGroupDirective} from '@angular/forms';
//import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewChild } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MctFormService } from './service/mct-service';
import { NotificationService } from '../../patient/patient-detail/Video/services/notification.service'
import { debounceTime, skip, switchMap, takeUntil } from 'rxjs/operators';
import * as moment from "moment";
interface FileUpload {
    fileId: number;
    fileName: string;
}
interface ClinicModel {
    name: string;
    code: string;
}
interface PatientModel {
    firstName: string;
    lastName: string;
    id: number,
    dateOfBirth: Date
}

const autocomplete = (time: any, selector: any) => (source$: any) =>
    source$.pipe(
        debounceTime(time),
        switchMap((...args: any[]) =>
            selector(...args).pipe(takeUntil(source$.pipe(skip(1))))
        )
    );
@Component({
    selector: 'mct-form',
    styleUrls: ['./mct.component.css'],
    templateUrl: './mct.component.html',
})


export class MctFormComponent implements OnInit {
    @ViewChild(FormGroupDirective) myNgForm;
    moment: any = moment;
    selectedFile: File = null;
    [x: string]: any;
    @Input() files: FileUpload[];
    maxDate = new Date();
    myControl = new FormControl();
    options: string[] = ['One', 'Two', 'Three'];
    @ViewChild(MatSort, { static: false }) sort!: MatSort;
    filteredOptions!: Observable<string[]>;
    form!: FormGroup;
    id!: string;
    loading = true;
    submitted = false;
    selected = false;
    userState = "";
    patientType = "";
    selectedClinicCode = "";
    displayAutocomplete = false;
    clinicModel!: ClinicModel[];
    data: any;
    loadPatients!: boolean;
    dataSource: any;
    term$ = new BehaviorSubject<string>('');
    loading$: Observable<boolean> = this.mctFormService.loading$;
    readonly patients: Observable<PatientModel[]> = this.mctFormService.autocomplete$;
    regions$ = this.term$.pipe(autocomplete(1000, (term: any) => this.fetch(term)));
    constructor(
        public mctFormService: MctFormService,
        private notifyService: NotificationService,
        private formBuilder: FormBuilder

    ) {

    }
    ngOnInit() {
        this.files = new Array()
        this.form = this.formBuilder.group({
            ClinicCode: [''],
            PatientId: [''],
            FirstName: [''],
            LastName: [''],
            DOB: [''],
            icd10: [''],
            cpt93224: [''],
            cpt93224Date: [''],
            cpt93228: [''],
            cpt93228Date: [''],
            cpt93229: [''],
            cpt93229Date: ['']

        });
        this.form = new FormGroup({
            patientType: new FormControl(),
            ClinicCode: new FormControl(),
            PatientId: new FormControl(),
            FirstName: new FormControl({ value: '', disabled: false }),
            LastName: new FormControl(),
            DOB: new FormControl(),
            ICD10: new FormControl(),
            Rem_CPT93224: new FormControl(false),
            Rem_CPT93224_ServiceDt: new FormControl(),
            Rem_CPT93228: new FormControl(false),
            Rem_CPT93228_ServiceDt: new FormControl(),
            Rem_CPT93229: new FormControl(false),
            Rem_CPT93229_ServiceDt: new FormControl(),
            autocomplete: new FormControl(),
            report: new FormControl(null, [Validators.required, this.requiredFileType('pdf')])
        })




        this.form.get('Rem_CPT93224')!.valueChanges
            .subscribe(value => {
                if (value) {
                    this.form.get('Rem_CPT93224_ServiceDt')!.setValidators(Validators.required)
                    this.form.get('Rem_CPT93224_ServiceDt')!.updateValueAndValidity();
                } else {
                    this.form.get('Rem_CPT93224_ServiceDt')!.clearValidators();
                    this.form.get('Rem_CPT93224_ServiceDt')!.updateValueAndValidity();
                }
            });
        this.form.get('Rem_CPT93228')!.valueChanges
            .subscribe(value => {
                if (value) {
                    this.form.get('Rem_CPT93228_ServiceDt')!.setValidators(Validators.required)
                    this.form.get('Rem_CPT93228_ServiceDt')!.updateValueAndValidity();
                } else {
                    this.form.get('Rem_CPT93228_ServiceDt')!.clearValidators();
                    this.form.get('Rem_CPT93228_ServiceDt')!.updateValueAndValidity();
                }
            });
        this.form.get('Rem_CPT93229')!.valueChanges
            .subscribe(value => {
                if (value) {
                    this.form.get('Rem_CPT93229_ServiceDt')!.setValidators(Validators.required)
                    this.form.get('Rem_CPT93229_ServiceDt')!.updateValueAndValidity();
                } else {
                    this.form.get('Rem_CPT93229_ServiceDt')!.clearValidators();
                    this.form.get('Rem_CPT93229_ServiceDt')!.updateValueAndValidity();
                }
            });

        this.getClinics();
    }

    requiredFileType(type: string) {
        return function (control: FormControl) {
            const file = control.value;
            if (file) {
                const extension = file.split('.')[1].toLowerCase();
                if (type.toLowerCase() !== extension.toLowerCase()) {
                    return {
                        requiredFileType: true
                    };
                }

                return null;
            }

            return null;
        };
    }
    isFieldValid(field: string) {
        return !this.form.get(field).valid && this.form.get(field).touched;
      }
      
      displayFieldCss(field: string) {
        return {
          'has-error': this.isFieldValid(field),
          'has-feedback': this.isFieldValid(field)
        };
      }

    onFileSelect(event: any) {
        this.selectedFile = <File>event.target.files[0];
        let name = event.target.files[0].name;
        let newFile: FileUpload = {
            fileId: 1,
            fileName: name,
        }
        if (!this.files) {
            this.files = new Array();
        }
        this.files = new Array()
        this.files.push(newFile);
    }

    selectEvent(item: any) {
        this.form.controls['PatientId'].setValue(item.value);
        this.form.controls['FirstName'].setValue(item.firstName);
        this.form.controls['LastName'].setValue(item.lastName);
        this.form.controls['DOB'].setValue(item.dateOfBirth);
        return item;
    }
    clearEventStatic() {
        this.form.controls['PatientId'].setValue(null);
        this.form.controls['FirstName'].setValue(null);
        this.form.controls['LastName'].setValue(null);
        this.form.controls['DOB'].setValue(null);
    }
    onSelectPatient(patient: any) {
        this.form.controls['PatientId'].setValue(patient.id);
        this.form.controls['FirstName'].setValue(patient.firstName);
        this.form.controls['LastName'].setValue(patient.lastName);
        this.form.controls['DOB'].setValue(patient.dateOfBirth);
    }

    getClinics(): void {
        this.mctFormService.getClinics().subscribe(data => {
            if (data) {
                this.clinicModel = data;
                this.loading = false;
            }
        });
    }

    onInput(event: Event): void {
        this.mctFormService.setAction((event?.target as HTMLInputElement)?.value, this.form.get('ClinicCode')!.value);
    }
    get f() { return this.form.controls; }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.options.filter(option => option.toLowerCase().includes(filterValue));
    }

    onSubmit() {
        let formData = new FormData();
        // const data = FormDataToObject.toObj(formObject): 
        this.form.controls["DOB"].value !== null ?
        this.form.controls["DOB"].setValue(this.moment(this.form.controls["DOB"]).format("YYYY-MM-DDT00:00:00")) :
        this.form.controls["DOB"].setValue('');
        
        this.form.controls["Rem_CPT93228_ServiceDt"].value !== null ?
        this.form.controls["Rem_CPT93228_ServiceDt"].setValue(this.moment(this.form.controls["Rem_CPT93228_ServiceDt"]).format("YYYY-MM-DDT00:00:00")) :
        this.form.controls["Rem_CPT93228_ServiceDt"].setValue('');

        this.form.controls["Rem_CPT93229_ServiceDt"].value !== null ?
        this.form.controls["Rem_CPT93229_ServiceDt"].setValue(this.moment(this.form.controls["Rem_CPT93229_ServiceDt"]).format("YYYY-MM-DDT00:00:00")) :
        this.form.controls["Rem_CPT93229_ServiceDt"].setValue('');

        this.form.controls["Rem_CPT93224_ServiceDt"].value !== null ?
        this.form.controls["Rem_CPT93224_ServiceDt"].setValue(this.moment(this.form.controls["Rem_CPT93224_ServiceDt"]).format("YYYY-MM-DDT00:00:00")) :
        this.form.controls["Rem_CPT93224_ServiceDt"].setValue('');

        formData = this.convertoFormData(this.form.value);
        formData.append('Report', this.selectedFile);
        if (this.form.valid) {
            this.submitted = true;
            this.mctFormService.saveMctForm(formData).subscribe((res) => {
                this.notifyService.showSuccess("Data Saved successfully !!", "")
                this.myNgForm.reset();
                this.files = new Array();
                this.submitted = false;
                this.selectedClinicCode = "";
            });
        }
        else {
             this.validateAllFormFields(this.form);
            this.notifyService.showError("Please fill required fields", "")
        }
    }

    convertoFormData<T>(formValue: T) {
        let formData = new FormData();

        for (const key of Object.keys(formValue)) {
            const value = formValue[key];
            formData.append(key, value);
            console.log(key + value);
        }

        return formData;
    }

    validateAllFormFields(formGroup: FormGroup) {   
        Object.keys(formGroup.controls).forEach(field => {  //{2}
          const control = formGroup.get(field);             //{3}
          if (control instanceof FormControl) {             //{4}
            control.markAsTouched({ onlySelf: true });
          } else if (control instanceof FormGroup) {        //{5}
            this.validateAllFormFields(control);            //{6}
          }
        });
      }

}
