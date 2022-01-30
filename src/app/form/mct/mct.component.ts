import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
//import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewChild } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MctFormService } from './service/mct-service';
import { NotificationService } from '../../patient/patient-detail/Video/services/notification.service'
import { debounceTime, skip, switchMap, takeUntil } from 'rxjs/operators';

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
            autocomplete: new FormControl()
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
    onFileSelect(event: any) {
        debugger;
        let name = event.target.files[0].name;
        let newFile:FileUpload = {
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
        if (this.form.valid) {
            this.submitted = true;
            this.mctFormService.saveMctForm(this.form.value).subscribe((res) => {
                this.notifyService.showSuccess("Data Saved successfully !!", "")
                this.form.reset();
                this.submitted = false;
            });
        }
        else {
            this.notifyService.showError("Please fill required fields", "")
        }
    }

}
