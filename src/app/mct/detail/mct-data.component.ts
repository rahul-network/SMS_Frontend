import { AfterViewInit, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MctFormService, PatientModel } from '../services/mct-service';
import { MatPaginator } from '@angular/material/paginator';
import { debounceTime, map, skip, startWith, switchMap, takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog.component';
import { ClinicModel, FileUpload } from '../interface/mctFormInterface';
import { FormGroupDirective, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';


const autocomplete = (time: any, selector: any) => (source$: any) =>
    source$.pipe(
        debounceTime(time),
        switchMap((...args: any[]) =>
            selector(...args).pipe(takeUntil(source$.pipe(skip(1))))
        )
    );
@Component({
    selector: 'mct-form-data',
    templateUrl: './mct-data.component.html',
    styleUrls: ['./mct-data.component.css'],
})
export class MctDataComponent implements OnInit, AfterViewInit {
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
    displayedColumns: string[] = [
        'clinicName',
        'firstName',
        'lastName',
        'dob', 'createdDateTime',
        'report',
        'cptCodes',
    ];
    detailDataSourceLength = 0;
    detailDataSource = [];
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    detailDataloading: boolean = false;
    theFile: any = null;
    messages: string[] = [];
    constructor(
        private mctFormService: MctFormService,
        private formBuilder: FormBuilder,
        public dialog: MatDialog,

    ) {
    }
    result!: any[];
    ngOnInit(): void {
        this.files = new Array()
        this.form = this.formBuilder.group({
            ClinicCode: [''],
            PatientId: [''],
            FirstName: [''],
            LastName: [''],
            DOB: [''],
            icd10: [''],
            cpt93224: [false],
            cpt93224Date: [''],
            cpt93228: [false],
            cpt93228Date: [''],
            cpt93229: [false],
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

    Update() {


    }

    ngAfterViewInit() {
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                startWith({}),
                switchMap(() => {
                    //this.isLoadingResults = true;
                    return this.mctFormService!.getMctForms(
                        this.sort.active, this.sort.direction, this.paginator.pageIndex, 10)
                        .pipe();
                }),
                map(data => {
                    if (data === null) {
                        return [];
                    }
                    this.totalCount = data.totalCount;
                    return data.items;
                })
            ).subscribe(data => this.dataSource = data);

    }

    getMctForms() {
        this.loading = true;
        this.mctFormService.getMctForms(this.sort.active, this.sort.direction, this.paginator.pageIndex, 10).subscribe(results => {
            this.dataSource = new MatTableDataSource(results.items);
            this.loading = false;
            this.totalCount = results.totalCount;

        })
    }

    downloadReport(row: any) {
        const dialogConfig = new MatDialogConfig();
        const message = "Do you want to download report ?";
        dialogConfig.data = {
            message
        };
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {

                this.mctFormService.downloadReport(row.clinicCode, row.s3PdfName).subscribe(response => {
                    window.location.href = response.url;
                }), error => console.log('Error downloading the file'),
                    () => console.info('File downloaded successfully');;
            }
        });
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
            let formData = new FormData();
            // const data = FormDataToObject.toObj(formObject): 
            !isNaN(Date.parse(this.form.controls["DOB"].value)) ?
                this.form.controls["DOB"].setValue(this.moment(this.form.controls["DOB"].value).format("YYYY-MM-DDT00:00:00")) :
                this.form.controls["DOB"].setValue('');

            !isNaN(Date.parse(this.form.controls["Rem_CPT93228_ServiceDt"].value)) ?
                this.form.controls["Rem_CPT93228_ServiceDt"].setValue(this.moment(this.form.controls["Rem_CPT93228_ServiceDt"].value).format("YYYY-MM-DDT00:00:00")) :
                this.form.controls["Rem_CPT93228_ServiceDt"].setValue('');

            !isNaN(Date.parse(this.form.controls["Rem_CPT93229_ServiceDt"].value)) ?
                this.form.controls["Rem_CPT93229_ServiceDt"].setValue(this.moment(this.form.controls["Rem_CPT93229_ServiceDt"].value).format("YYYY-MM-DDT00:00:00")) :
                this.form.controls["Rem_CPT93229_ServiceDt"].setValue('');

            !isNaN(Date.parse(this.form.controls["Rem_CPT93224_ServiceDt"].value)) ?
                this.form.controls["Rem_CPT93224_ServiceDt"].setValue(this.moment(this.form.controls["Rem_CPT93224_ServiceDt"].value).format("YYYY-MM-DDT00:00:00")) :
                this.form.controls["Rem_CPT93224_ServiceDt"].setValue('');

                this.form.controls["PatientId"].value === null ?
                this.form.controls["PatientId"].setValue(0) :
                '';
            formData = this.convertoFormData(this.form.value);
            formData.append('Report', this.selectedFile);
            this.submitted = true;
            this.mctFormService.saveMctForm(formData).subscribe((res) => {
                setTimeout(() => {
                    
                        this.myNgForm.resetForm(),
                        this.form.controls["Rem_CPT93224"].setValue(false),
                        this.form.controls["Rem_CPT93228"].setValue(false),
                        this.form.controls["Rem_CPT93229"].setValue(false)
                }
                    , 0)
                this.getMctForms()
                this.files = new Array();
                this.submitted = false;
                this.selectedClinicCode = "";
            });
        }
        else {
            this.validateAllFormFields(this.form);
            //this.notifyService.showError("Please fill required fields", "")
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