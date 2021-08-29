import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { endWith } from 'rxjs/operators';


@Component({
    selector: 'ccm-form',
    styleUrls: ['./ccm.component.css'],
    templateUrl: './ccm.component.html',
})


export class CcmFormComponent implements OnInit {
    answers = {};
    form: FormGroup;
    id!: string;
    isAddMode!: boolean;
    loading = false;
    submitted = false;

    FormFields = {
        MeasurableTreatmentgoalsover12monthPeriod: [
            { name: "", id: 0, value: "" },
            { name: "", id: 0, value: "" },
            { name: "", id: 0, value: "" },
            { name: "", id: 0, value: "" },
            { name: "", id: 0, value: "" },
            { name: "", id: 0, value: "" },
        ],
        PlannedInterventionsOrConditionsMgmtover12monthperiodfromInitiationofplan:
            [
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
            ],
        DiscussofDiseaseProcess:
            [
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
            ],
        Medication:
            [
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
            ],
        NutritionOrHydrationOrElimication:
            [
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
            ],
        Activity:
            [
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
            ],
        PhychoOrSocial:
            [
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
            ],
        ProgressOrReductionofBarriersNotedbyPatient:
            [
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
            ],
        MeicationAdherence:
            [
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
            ],
        PHQ2ReportedByPatient:
            [
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
            ],
        GeneralizedAnxietyDisroder2itemGAD2:
            [
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
            ],
        PatientOrCaregiverOutcomesAchivedThisMonth:
            [
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
                { name: "", id: 0, value: "" },
            ]


    }

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        // private userService: UserService,
        // private alertService: AlertService
    ) { }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;

        // password not required in edit mode
        const passwordValidators = [Validators.minLength(6)];
        if (this.isAddMode) {
            passwordValidators.push(Validators.required);
        }


        this.form = this.formBuilder.group({
            medicalPractice: [''],
            documentCreated: [''],
            firstName: [''],
            lastName: [''],
            dateOfBirth: [''],
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
        this.form = new FormGroup({

            medicalPractice: new FormControl(),
            documentCreated: new FormControl(),
            firstName: new FormControl(),
            lastName: new FormControl(),
            dateOfBirth: new FormControl(),
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


      
    }
    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        debugger;
        this.submitted = true;

        let map = new Map<string, string>();
        map.set("MEDICAL PRACTICE", this.form.controls.medicalPractice.value)
        map.set("DOCUMENT CREATED", this.form.controls.documentCreated.value)
        map.set("First name", this.form.controls.firstName.value)
        map.set("Last name", this.form.controls.lastName.value)
        map.set("Date of birth", this.form.controls.dateOfBirth.value)
        map.set("Diagnosis 1", this.form.controls.diagnose1.value)
        map.set("Diagnosis 2", this.form.controls.diagnose2.value)
        map.set("Primary care physician", this.form.controls.primaryCarePhysician.value)
        map.set("Care lead", this.form.controls.careLead.value)
        map.set("Other provider/specialist", this.form.controls.otherProvideOrSpecialist.value)
        map.set("Podiatrist", this.form.controls.podiatrist.value)
        // this.MeasurableTreatmentgoalsover12monthPeriod.data.forEach((currentValue, index) => {
        //     map.set(currentValue, (this.form.controls.MeasurableTreatmentgoalsover12monthPeriod as FormArray).controls[index].value);
        // });

        // this.PlannedInterventionsOrConditionsMgmtover12monthperiodfromInitiationofplan.forEach((currentValue, index) => {
        //     map.set(currentValue, (this.form.controls.PlannedInterventionsOrConditionsMgmtover12monthperiodfromInitiationofplan as FormArray).controls[index].value);
        // });



        map.set("Symptoms management - current month", this.form.controls.Symptomsmanagementcurrentmonth.value)
        map.set("Key labs noted this month", this.form.controls.Keylabsnotedthismonth.value)
        map.set("Medication management - key medication changes noted this month", this.form.controls.Medicationmanagementkeymedicationchangesnotedthismonth.value)
        // this.DiscussofDiseaseProcess.forEach((currentValue, index) => {
        //     map.set(currentValue, (this.form.controls.DiscussofDiseaseProcess as FormArray).controls[index].value);
        // });
        // this.Medication.forEach((currentValue, index) => {
        //     map.set(currentValue, (this.form.controls.Medication as FormArray).controls[index].value);
        // });
        // this.NutritionOrHydrationOrElimication.forEach((currentValue, index) => {
        //     map.set(currentValue, (this.form.controls.NutritionOrHydrationOrElimication as FormArray).controls[index].value);
        // });
        // this.Activity.forEach((currentValue, index) => {
        //     map.set(currentValue, (this.form.controls.Activity as FormArray).controls[index].value);
        // });
        // this.PhychoOrSocial.forEach((currentValue, index) => {
        //     map.set(currentValue, (this.form.controls.PhychoOrSocial as FormArray).controls[index].value);
        // });


        map.set("Patient response for interventions outlined above", this.form.controls.Patientresponseforinterventionsoutlinedabove.value)

        // this.ProgressOrReductionofBarriersNotedbyPatient.forEach((currentValue, index) => {
        //     map.set(currentValue, (this.form.controls.ProgressOrReductionofBarriersNotedbyPatient as FormArray).controls[index].value);
        // });

        map.set("Rate level of pain", this.form.controls.Ratelevelofpain.value)
        map.set("Medication Adherence Comments", this.form.controls.MedicationadherenceComments.value)
        // this.MeicationAdherence.forEach((currentValue, index) => {
        //     map.set(currentValue, (this.form.controls.MeicationAdherence as FormArray).controls[index].value);
        // });
        // this.PHQ2ReportedByPatient.forEach((currentValue, index) => {
        //     map.set(currentValue, (this.form.controls.PHQ2ReportedByPatient as FormArray).controls[index].value);
        // });

        map.set("PHQ2 patient score", this.form.controls.PHQ2patientscore.value)
        map.set("GAD Patient Scrore", this.form.controls.GADPatientScrore.value)
        map.set("GAD2 Comments", this.form.controls.GAD2Comments.value)
        // this.GeneralizedAnxietyDisroder2itemGAD2.forEach((currentValue, index) => {
        //     map.set(currentValue, (this.form.controls.GeneralizedAnxietyDisroder2itemGAD2 as FormArray).controls[index].value);
        // });
        // this.PatientOrCaregiverOutcomesAchivedThisMonth.forEach((currentValue, index) => {
        //     map.set(currentValue, (this.form.controls.PatientOrCaregiverOutcomesAchivedThisMonth as FormArray).controls[index].value);
        // });

        map.set("ADDITIONAL NOTES", this.form.controls.AdditionaNotes.value)
        map.set("Date of verbal consent:", this.form.controls.DateIfVerbalConsent.value)

        console.log(map);
        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
    }


    // ProgressOrReductionofBarriersNotedbyPatientChange(event: MatRadioChange) {

    //     let index = this.ProgressOrReductionofBarriersNotedbyPatient.findIndex(item => item == event.source.name);
    //     (this.form.controls.ProgressOrReductionofBarriersNotedbyPatient as FormArray).controls[index].patchValue(event.value);
    // }

    // MeicationAdherenceChange(event: MatRadioChange) {

    //     let index = this.MeicationAdherence.findIndex(item => item == event.source.name);
    //     (this.form.controls.MeicationAdherence as FormArray).controls[index].patchValue(event.value);
    // }

    // PHQ2ReportedByPatientChange(event: MatRadioChange) {
    //     let index = this.PHQ2ReportedByPatient.findIndex(item => item == event.source.name);
    //     (this.form.controls.PHQ2ReportedByPatient as FormArray).controls[index].patchValue(event.value);
    // }
    // GeneralizedAnxietyDisroder2itemGAD2Change(event: MatRadioChange) {
    //     let index = this.GeneralizedAnxietyDisroder2itemGAD2.findIndex(item => item == event.source.name);
    //     (this.form.controls.GeneralizedAnxietyDisroder2itemGAD2 as FormArray).controls[index].patchValue(event.value);

    // }
    // PatientOrCaregiverOutcomesAchivedThisMonthChange(event: MatRadioChange) {
    //     let index = this.PatientOrCaregiverOutcomesAchivedThisMonth.findIndex(item => item == event.source.name);
    //     (this.form.controls.PatientOrCaregiverOutcomesAchivedThisMonth as FormArray).controls[index].patchValue(event.value);

    // }
}
