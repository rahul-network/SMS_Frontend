import { Component, OnInit, Inject } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { MctFormService } from './service/mct-service';
import { coerceStringArray } from '@angular/cdk/coercion';
import { DatatableFeedService } from 'src/app/datatable-feed.service';
import { PagerModel } from 'src/app/shared/pagerModel';


interface ClinicModel {
    name: string;
    id: number;
}
interface PatientModel {
    firstName: string;
    lastName: string;
    id: number
}

@Component({
    selector: 'mct-form',
    styleUrls: ['./mct.component.css'],
    templateUrl: './mct.component.html',
})


export class MctFormComponent implements OnInit {

    myControl = new FormControl();
    options: string[] = ['One', 'Two', 'Three'];
    filteredOptions: Observable<string[]>;
    @ViewChild(MatSort) sort: MatSort;
    form: FormGroup;
    id!: string;
    loading = true;
    submitted = false;
    selected = false;
    userState = "";
    patientType = "";
    selectedClinicId = "";
    displayAutocomplete = false;
    clinicModel: ClinicModel[];
    data: any;
    isLoaded: boolean;
    dataSource: any;
    patients: PatientModel[];
    constructor(
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<MctFormComponent>,
        public mctFormService: MctFormService,
        private datatableFeedService: DatatableFeedService,
        private formBuilder: FormBuilder

    ) {
    }

    keyword = 'fullName';

    selectEvent(item: any) {
        this.form.controls['PatientId'].setValue(item.value);
        this.form.controls['FirstName'].setValue(item.firstName);
        this.form.controls['LastName'].setValue(item.lastName);
        return item;
    }

    onChangeSearch(search: string) {
        // fetch remote data from here
        // And reassign the 'data' which is binded to 'data' property.
    }

    onFocused(e: any) {
        // do something
    }


    getClinics(): void {

        this.mctFormService.getClinics().subscribe(data => {
            if (data) {
                this.clinicModel = data;
                this.loading = false;
            }
        });
    }



    ngOnInit() {

        this.form = this.formBuilder.group({
            ClinicId: [''],
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
            cpt93229Date: [''],

        });
        this.form = new FormGroup({
            patientType: new FormControl(),
            ClinicId: new FormControl(),
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
        })
        this.form.get("patientType").valueChanges.subscribe(selectedValue => {
            this.isLoaded = true;

            this.form.controls['FirstName'].reset();
            this.form.controls['LastName'].reset();
            if (selectedValue === "Existing") {
                this.displayAutocomplete = true;
                let pager: PagerModel = {
                    Sort: "1",
                    PageNumber: 1,
                    PageSize: 500
                };

                this.datatableFeedService.getAllData(Number(this.form.get('ClinicId').value), pager)
                    .subscribe(data => {
                        if (data) {
                            this.patients = data.rows.map(
                                (obj: PatientModel) => {
                                    return {
                                        fullName: obj.firstName + ' ' + obj.lastName,
                                        value: obj.id,
                                        firstName: obj.firstName,
                                        lastName : obj.lastName
                                    };
                                }
                            );;
                            this.isLoaded = false;

                        }
                    });
            }
            else {
                this.displayAutocomplete = false;
            }

            //console.log(this.form.get("patientType").value)
        })
        this.getClinics();
    }

    get f() { return this.form.controls; }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.options.filter(option => option.toLowerCase().includes(filterValue));
    }

    onSubmit() {

        this.mctFormService.saveMctForm(this.form.value).subscribe((res) => {
            alert("Save Successfully");
            this.dialogRef.close();
        });
        this.submitted = true;
    }
}
