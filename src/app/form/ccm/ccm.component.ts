import { Component, OnInit,Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { formatDate } from '@angular/common';
import { CCMFormService } from './service/ccm-servuce';
import { MatTableDataSource } from '@angular/material/table';
import { ViewChild } from '@angular/core';
import * as moment from 'moment';
import { debug } from 'console';


@Component({
    selector: 'ccm-form',
    styleUrls: ['./ccm.component.css'],
    templateUrl: './ccm.component.html',
})


export class CcmFormComponent implements OnInit {
    displayedColumns: string[] = ['edit','formId', 'createdDateTime', 'updatedDateTime'];
    detailDataSource = new MatTableDataSource<any>([]);
    @ViewChild(MatSort) sort: MatSort;

    form: FormGroup;
    id!: string;
    isAddMode!: boolean;
    loading = false;
    submitted = false;
    todayDate = moment(new Date()).format('MMMM DD yyyy');
    

    constructor(public dialog: MatDialog,
        public dialogRef: MatDialogRef<CcmFormComponent>,
        @Inject(MAT_DIALOG_DATA,
            ) 
        public data: any,
        // private userSer
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private ccmFormService: CCMFormService
       
        // private alertService: AlertService
    ) { }

    ngOnInit() {
        this.loading = false;
        


        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;
        this.form = this.formBuilder.group({
            medicalPractice: [''],
            documentCreated: [''],
            firstName: [''],
            lastName: [''],
            //dateOfBirth: [''],
            dateOfBirth: [formatDate(this.data.dateOfBirth, 'MM/dd/yyyy', 'en'), [Validators.required]],
            diagnose1: [''],
            diagnose2: [''],
            primaryCarePhysician: [''],
            careLead: [''],
            otherProvideOrSpecialist: [''],
            podiatrist: [''],
            ImproveKnowlegedefictrelatedtodiseaseprocess: [''],
            ImproveKnowlegeofmedicationuseOrcompliance: [''],
            Symptomsmanagementcurrentmonth: [''],
            DateIfVerbalConsent: ['']



        });
        debugger;
       
            this.form = new FormGroup({

                patientId : new FormControl(),
                medicalPractice: new FormControl(),
                documentCreated: new FormControl(),
                firstName: new FormControl(this.data.firstName),
                lastName: new FormControl(this.data.lastName),
               
                diagnose1: new FormControl(),
                diagnose2: new FormControl(),
                primaryCarePhysician: new FormControl(),
                careLead: new FormControl(),
                otherProvideOrSpecialist: new FormControl(),
                podiatrist: new FormControl(),
                //#region PATIENT'S CARE PLAN 
                //#region Measurable treatment goals over 12 month period
                //MeasurableTreatmentgoalsover12monthPeriod : this.formBuilder.array(this.FormFields.MeasurableTreatmentgoalsover12monthPeriod.map(x => !1)),
                MsrableTrtmntGoalOpt1: new FormControl(),
                MsrableTrtmntGoalOpt2: new FormControl(),
                MsrableTrtmntGoalOpt3: new FormControl(),
                MsrableTrtmntGoalOpt4: new FormControl(),
                MsrableTrtmntGoalOpt5: new FormControl(),
                MsrableTrtmntGoalOpt6: new FormControl(),
                //#endregion
                //#region Planned interventions/conditions mgmt over 12 month period from initiation of plan 
                //PlannedInterventionsOrConditionsMgmtover12monthperiodfromInitiationofplan: this.formBuilder.array(this.PlannedInterventionsOrConditionsMgmtover12monthperiodfromInitiationofplan.map(x => !1)),
                PlannedMgtOpt1 : new FormControl(),
                PlannedMgtOpt2 : new FormControl(),
                PlannedMgtOpt3 : new FormControl(),
                PlannedMgtOpt4 : new FormControl(),
                PlannedMgtOpt5 : new FormControl(),
                PlannedMgtOpt6 : new FormControl(),
                PlannedMgtOpt7 : new FormControl(),
                PlannedMgtOpt8 : new FormControl(),
                PlannedMgtOpt9 : new FormControl(),
                PlannedMgtOpt10 : new FormControl(),
                PlannedMgtOpt11 : new FormControl(),
                PlannedMgtOpt12 : new FormControl(),
                PlannedMgtOpt13 : new FormControl(),
                PlannedMgtOpt14 : new FormControl(),
                PlannedMgtOpt15 : new FormControl(),
                PlannedMgtOpt16 : new FormControl(),
                PlannedMgtOpt17 : new FormControl(),
                PlannedMgtOpt18 : new FormControl(),
                PlannedMgtOpt19 : new FormControl(),
                PlannedMgtOpt20 : new FormControl(),
                PlannedMgtOpt21 : new FormControl(),
                PlannedMgtOpt22 : new FormControl(),
                PlannedMgtOpt23: new FormControl(),
                PlannedMgtOpt24 : new FormControl(),
                //#endregion
                //#endregion
                Symptomsmanagementcurrentmonth: new FormControl(),
                Keylabsnotedthismonth: new FormControl(),
                Medicationmanagementkeymedicationchangesnotedthismonth: new FormControl(),
                //#region  Telephone interventions with patient this month
                //#region Discuss of disease process
                DiscussofDiseaseProcessOpt1 : new FormControl() ,
                DiscussofDiseaseProcessOpt2 : new FormControl() ,
                DiscussofDiseaseProcessOpt3 : new FormControl() ,
                //#endregion
                //#region  Medication
                MedicationOpt1 : new FormControl(),
                MedicationOpt2 : new FormControl(),
                MedicationOpt3 : new FormControl(),
                MedicationOpt4 : new FormControl(),
                //#endregion 
                //#region  Nutrition/hydration/elimication
                NutrnHydrationElimincationOpt1 : new FormControl(),
                NutrnHydrationElimincationOpt2 : new FormControl(),
                NutrnHydrationElimincationOpt3 : new FormControl(),
                NutrnHydrationElimincationOpt4 : new FormControl(),
                NutrnHydrationElimincationOpt5 : new FormControl(),
                NutrnHydrationElimincationOpt6 : new FormControl(),
                //#endregion
                //#region Activity
                ActivityOp1 : new FormControl(),
                ActivityOp2 : new FormControl(),
                ActivityOp3 : new FormControl(),
                ActivityOp4 : new FormControl(),
                //#endregion
                //#region  Phycho/Social
                PhychoSocialOpt1 : new FormControl(),
                PhychoSocialOpt2 : new FormControl(),
                PhychoSocialOpt3 : new FormControl(),
                PhychoSocialOpt4 : new FormControl(),
                PhychoSocialOpt5 : new FormControl(),
                PhychoSocialOpt6 : new FormControl(),
                //#endregion
                //#endregion
                Patientresponseforinterventionsoutlinedabove: new FormControl(),
                //#region  Progress/reduction of barriers noted by patient
                PrgrsRdctnOfBarriersOpt1 : new FormControl(),
                PrgrsRdctnOfBarriersOpt2 : new FormControl(),
                PrgrsRdctnOfBarriersOpt3 : new FormControl(),
                PrgrsRdctnOfBarriersOpt4 : new FormControl(),   
                //#endregion
                Ratelevelofpain: new FormControl(),
                //#region  Medication adherence
                MedicationAdherenceOpt1 : new FormControl(),
                MedicationAdherenceOpt2 : new FormControl(),
                MedicationAdherenceOpt3 : new FormControl(),
                MedicationAdherenceOpt4: new FormControl(),
                MedicationAdherenceOpt5 : new FormControl(),
                MedicationAdherenceOpt6 : new FormControl(),
                MedicationAdherenceOpt7 : new FormControl(),
                //#endregion
                MedicationadherenceComments: new FormControl(),
                //#region PHQ2 reported By patient
                PHQ2ReportedByPatientOpt1 : new FormControl(),
                PHQ2ReportedByPatientOpt2 : new FormControl(),
                //#endregion
                PHQ2patientscore: new FormControl(),
                //#region Generalized anxiety disorder 2-item (GAD-2)
                GeneralizedAnxietyDisroder2itemGAD2Opt1 : new FormControl(),
                GeneralizedAnxietyDisroder2itemGAD2Opt2 : new FormControl(),
                //#endregion
                GADPatientScrore: new FormControl(),
                GAD2Comments: new FormControl(),
                //#region  Patient/caregiver outcomes achieved this month
                PatientCaregiveroutcomesOpt1 : new FormControl(),
                PatientCaregiveroutcomesOpt2 : new FormControl(),
                PatientCaregiveroutcomesOpt3 : new FormControl(),
                PatientCaregiveroutcomesOpt4 : new FormControl(),
                PatientCaregiveroutcomesOpt5 : new FormControl(),
                PatientCaregiveroutcomesOpt6 : new FormControl(),
                PatientCaregiveroutcomesOpt7 : new FormControl(),
                PatientCaregiveroutcomesOpt8 : new FormControl(),
                PatientCaregiveroutcomesOpt9 : new FormControl(),
                PatientCaregiveroutcomesOpt10 : new FormControl(),
                //#endregion
                ServiceOrders : new FormControl(),
                AdditionaNotes: new FormControl(),
                DateIfVerbalConsent: new FormControl(),
                
            })
            if(this.data.formId !== null){
                this.ccmFormService.getDetailsbyFormId(this.data.formId).subscribe((res) => {
                    this.todayDate = res.documentCreated;
                    res.forEach((element :any)=> {
                        (this.form.controls[element.fieldKey] as FormControl).patchValue(element.fieldValue)
                    })
                    
                  });
                }

      
    }
    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        debugger;
        this.submitted = true;
        this.ccmFormService.addOrUpdate(this.form.value,Number(this.data.id),this.data.formId).subscribe((res) => {
            alert("Save Successfully");
            this.dialogRef.close();
          });
        if (this.form.invalid) {
            return;
        }
    }

    openCCMForm(_data: any) {
        const dialogRef = this.dialog.open(CcmFormComponent, {
          width: '100$',
          height: '100%',
          autoFocus:false,
          data: { 
            
     
            }
         
        });
      }


}
