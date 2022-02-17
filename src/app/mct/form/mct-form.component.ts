import { AfterViewInit, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MctFormService, PatientModel } from '../services/mct-service';
import { debounceTime, skip, switchMap, takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { ClinicModel, FileUpload } from '../interface/mctFormInterface';
import { FormGroupDirective, FormControl, FormGroup, Validators, FormBuilder, ValidatorFn, ValidationErrors, RequiredValidator } from '@angular/forms';
import { FileValidator } from 'ngx-material-file-input';

const autocomplete = (time: any, selector: any) => (source$: any) =>
    source$.pipe(
        debounceTime(time),
        switchMap((...args: any[]) =>
            selector(...args).pipe(takeUntil(source$.pipe(skip(1))))
        )
    );
@Component({
    selector: 'mct-form',
    templateUrl: './mct-form.component.html',
    styleUrls: ['./mct-form.component.scss'],
})
export class MctFormComponent implements OnInit, AfterViewInit {
    @Output("refreshMctForms") RefreshMctForms: EventEmitter<any> = new EventEmitter();
    @ViewChild(FormGroupDirective) myNgForm;
    @Input() files: FileUpload[];
    /** Max file size upto 2 MB */
    readonly maxSize = 2097152;
    moment: any = moment;
    selectedFile: File = null;
    [x: string]: any;
    maxDate = new Date();
    filteredOptions!: Observable<string[]>;
    form!: FormGroup;
    id!: string;
    loading = true;
    submitted = false;
    selected = false;
    selectedClinicCode = "";
    displayAutocomplete = false;
    clinicModel!: ClinicModel[];
    data: any;
    loadPatients!: boolean;
    term$ = new BehaviorSubject<string>('');
    loading$: Observable<boolean> = this.mctFormService.loading$;
    readonly patients: Observable<PatientModel[]> = this.mctFormService.autocomplete$;
    regions$ = this.term$.pipe(autocomplete(1000, (term: any) => this.fetch(term)));
    detailDataloading: boolean = false;
    constructor(
        private mctFormService: MctFormService,
        private formBuilder: FormBuilder,
        public dialog: MatDialog,

    ) {
    }
    result!: any[];

    //ngOnInit
    ngOnInit(): void {
        this.files = new Array()
        this.form = this.formBuilder.group({
            patientType: [''],
            ClinicCode: [''],
            PatientId: [''],
            FirstName: [''],
            LastName: [''],
            DOB: [''],
            ICD10: [''],
            Rem_CPT93224: [''],
            Rem_CPT93224_ServiceDt: [''],
            Rem_CPT93228: [''],
            Rem_CPT93228_ServiceDt: [''],
            Rem_CPT93229: [''],
            Rem_CPT93229_ServiceDt: [''],
            autocomplete: [''],
            report: [''],
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
            report: new FormControl(null, [Validators.required, FileValidator.maxContentSize(this.maxSize)])
        });
        this.form.setValidators(this.serviceDateValidator())
        this.ServiceDateRequiredBind();
        this.getClinics();
    }

    //This will bind event if CBT Checkbox has checked Service Date is required
    ServiceDateRequiredBind()
    {
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
    }

    ngAfterViewInit() {
    }

    // Add File on selection CBT Report from file upload control.
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

    // Set Default Values after selection of Patient from Autocomplete
    onSelectPatient(patient: any) {
        this.form.controls['PatientId'].setValue(patient.id);
        this.form.controls['FirstName'].setValue(patient.firstName);
        this.form.controls['LastName'].setValue(patient.lastName);
        this.form.controls['DOB'].setValue(patient.dateOfBirth);
        this.form.controls['ICD10'].setValue(patient.icd10);
    }

    //Get List of Clinic and Bind 
    getClinics(): void {
        this.mctFormService.getClinics().subscribe(data => {
            if (data) {
                this.clinicModel = data;
                this.loading = false;
            }
        });
    }

    // This function will triggerd on input into Patient Text Box
    onInput(event: Event): void {
        this.mctFormService.setAction((event?.target as HTMLInputElement)?.value, this.form.get('ClinicCode')!.value);
    }
    get f() { return this.form.controls; }


    //Submit MCT Form info and create individual entries of MCT Form.
    onSubmit() {
        this.submitted = true;
        if (this.form.valid) {
            let formData = new FormData();
            // const data = FormDataToObject.toObj(formObject): 
            !isNaN(Date.parse(this.f["DOB"].value)) ?
                this.f["DOB"].setValue(this.moment(this.f["DOB"].value).format("YYYY-MM-DDT00:00:00")) :
                this.f["DOB"].setValue('');
            !isNaN(Date.parse(this.f["Rem_CPT93228_ServiceDt"].value)) ?
                this.f["Rem_CPT93228_ServiceDt"].setValue(this.moment(this.f["Rem_CPT93228_ServiceDt"].value).format("YYYY-MM-DDT00:00:00")) :
                this.f["Rem_CPT93228_ServiceDt"].setValue('');
            !isNaN(Date.parse(this.f["Rem_CPT93229_ServiceDt"].value)) ?
                this.f["Rem_CPT93229_ServiceDt"].setValue(this.moment(this.f["Rem_CPT93229_ServiceDt"].value).format("YYYY-MM-DDT00:00:00")) :
                this.f["Rem_CPT93229_ServiceDt"].setValue('');
            !isNaN(Date.parse(this.f["Rem_CPT93224_ServiceDt"].value)) ?
                this.f["Rem_CPT93224_ServiceDt"].setValue(this.moment(this.f["Rem_CPT93224_ServiceDt"].value).format("YYYY-MM-DDT00:00:00")) :
                this.f["Rem_CPT93224_ServiceDt"].setValue('');

            this.f["PatientId"].value === null ? this.f["PatientId"].setValue(0) : '';
            formData = this.convertoFormData(this.form.value);
            formData.append('Report', this.selectedFile);
            this.submitted = true;
            this.mctFormService.saveMctForm(formData).subscribe((res) => {
                this.ResetForm();
                this.RefreshMctForms.emit();
            });
        }
    }

    ResetForm() {
        setTimeout(() => {
            this.myNgForm.resetForm(),
                this.f["Rem_CPT93224"].setValue(false),
                this.f["Rem_CPT93228"].setValue(false),
                this.f["Rem_CPT93229"].setValue(false),
                this.files = new Array(),
                this.submitted = false,
                this.selectedClinicCode = ""
        }, 0)
    }
    convertoFormData<T>(formValue: T) {
        let formData = new FormData();
        for (const key of Object.keys(formValue)) {
            const value = formValue[key];
            if (value !== null)
                formData.append(key, value);
            console.log(key + value);
        }
        return formData;
    }


    public serviceDateValidator(): ValidatorFn {
        return (group: FormGroup): ValidationErrors => {
            const CPT93224Dt = this.parseDate(group.controls['Rem_CPT93224_ServiceDt']?.value);
            const CPT93228Dt = this.parseDate(group.controls['Rem_CPT93228_ServiceDt']?.value);
            const CPT93229Dt = this.parseDate(group.controls['Rem_CPT93229_ServiceDt']?.value);
            if (this.moment(CPT93224Dt).isAfter(CPT93228Dt) || this.moment(CPT93224Dt).isAfter(CPT93229Dt)) {
                group.controls['Rem_CPT93224_ServiceDt'].setErrors({ notEquivalent: true });
            }
            else {
                group.controls['Rem_CPT93224_ServiceDt'].setErrors(null);
                if (group.controls['Rem_CPT93224'].value === true && CPT93224Dt === null) {
                    group.controls['Rem_CPT93224_ServiceDt'].setErrors({ required: true });
                }
            }
            return;
        };
    }

    private parseDate(value) {
        if (isNaN((this.moment(value)))) {
            return null;
        }
        else {
            return this.moment(value);
        }
    }
}