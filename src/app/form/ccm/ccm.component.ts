import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';


@Component({
    selector: 'ccm-form',
    styleUrls: ['./ccm.component.css'],
    templateUrl: './ccm.component.html',
})


export class CcmFormComponent implements OnInit {
    form: FormGroup;
    id!: string;
    isAddMode!: boolean;
    loading = false;
    submitted = false;
    MeasurableTreatmentgoalsover12monthPeriod ={
        options :["Measurable Treatment goals over 12 month Period"],
        data:[
            "Improve Knowlege defict related to disease process",
            "Improve Knowlege of medication use/compliance",
            "Alteration in lifestyle secondary to disease",
            "Coping related to diagnosis and prognosis.",
            "Improved level of independence/function",
            "Manage co-existing conditions."
        ]
    }
   
        

    PlannedInterventionsOrConditionsMgmtover12monthperiodfromInitiationofplan =
        [
            "Understand Life Planning documents ( DPOA, Living Will, Healthcare Proxy)",
            "Develop Personal Safety Plan (home safety/fall prevention)",
            "Improve Cognitive Function","Improve Mood", "Support/caregiver resources and involvement",
            "Control Pain", "Medication Adherence", "Understand Polypharmacy", "Maintain Healthy Body Weight",
            "Monitor Weight", "Activity Tracking", "Improve Sleep", "Learn about Nurritian Plan",
            "Desh Diet",
            "Decrease Salt Intake",
            "Stop Smoking", "Stop Tovacco Use", "Reduce Alcohol Use", "Monitor glucose at home",
            "Monitor Blood Pressure at home",
            "Keep record of Readings","Manage Anxiety", "Manage Stress", "Regularly Keep Doctors Appts", "Community Resource Avaialbility",
            "Improve Mobility", "Exercise at least 30 min a day"
        ];
    DiscussofDiseaseProcess =
        [
            "Assess weight (on patient's own scale if avaialable)",
            "Evaulate Knowlege of disease process",
            "Instruct on definition"
        ];
    Medication =
        [
            "Instruct on medication schedule",
            "Evaulate effectiveness of medications/symtopm control",
            "Educate on purpose, action, side effects, and interations of medications(s)",
            "Instruct on medication changes"
        ]
    NutritionOrHydrationOrElimication =
        [
            "Assess appropriate fluid and dietarty intake",
            "Evaluate Knowlege of diet restrictions/fluid requirement",
            "Instruct on diet/fluid reuqirement as appropriate",
            "Provide assistance with meal planning",
            "Assess bowel and urinary function",
            "Instruct to avoid straining with bowel movements."
        ]
    Activity =
        [
            "Assess current acitivity and tolerance levels.",
            "Instruct to avoid overexertion",
            "Instruct on importance of frequent rest periods and pacing activities.",
            "Improve sleep quality and duration of sleep"
        ]
    PhychoOrSocial =
        [
            "Assess social support systems",
            "Evaculated caregiver coping status",
            "Completed PHQ9",
            "Completed PHQ2",
            "Completed GADQ2",
            "Asssess safety and fall risk"
        ]

    ProgressOrReductionofBarriersNotedbyPatient =
        [
            "How would you evaluate your progress toward goals ?",
            "How would rate the education information provided this time ?",
            "How would you rate your mental gealth, including your mood and ability to think?",
            "How is your follow-up with all meical appointments ?"
        ];

    MeicationAdherence =
        [
            "Do you forget to take your meication ?",
            "Are you confused about how to take your medication?",
            "Have a hard time opening the bottles or self administering the medication ?",
            "You don't know what they are for ?",
            "Are you worried or are you experiencing side effects ?",
            "Are they too expensive ?", "Pharmacist says they are not available at the time"
        ];


    PHQ2ReportedByPatient =
        ["Feeling down, depressed or hopeless",
            "Little interest or pleasure in doing things."
        ];

    GeneralizedAnxietyDisroder2itemGAD2 =
        [
            "Feeling nervous anxious or on edge",
            "Not being able to stop or control worrying."
        ]

    PatientOrCaregiverOutcomesAchivedThisMonth =
        [
            "Demonstrates ability to maintain medical condition with appts kept.",
            "Verbalizes understanding of purpose, action and side effects of each medication instructed.",
            "Verbalizes general dietary restrictions discussed.",
            "Verbalizes fluid restrictions such as alcohol or caffiene.",
            "Achieved optimal GI Function", "Verbalizes plan to meet basic ADL/IADL needs",
            "Verbalizes importance of frequent appropriate activity level, rest periods and pacing activities.",
            "Verbalizes how and when to call for help",
            "Verbalizes members of support system.",
            "Verbalizes knowledge of plan.barriers to care."
        ]

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
            title: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            role: ['', Validators.required],
            password: ['', [Validators.minLength(6), this.isAddMode ? Validators.required : Validators.nullValidator]],
            confirmPassword: ['', this.isAddMode ? Validators.required : Validators.nullValidator],
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
            ImproveKnowlegeofmedicationuseOrcompliance: ['']




        });
        this.form = new FormGroup({
            medicalPractice: new FormControl(),
            documentCreated: new FormControl(),
            firstName: new FormControl(),
            lastName: new FormControl(),
            dateOfBirth: new FormControl(),
            diagnose1: new FormControl(),
            diagnose2: new FormControl(),
            Alterationinlifestylesecondarytodisease: new FormControl(),
            primaryCarePhysician: new FormControl(),
            careLead: new FormControl(),
            otherProvideOrSpecialist: new FormControl(),
            podiatrist: new FormControl(),
            ImproveKnowlegedefictrelatedtodiseaseprocess: new FormControl(),
            ImproveKnowlegeofmedicationuseOrcompliance: new FormControl(),
            MeasurableTreatmentgoalsover12monthPeriod: this.formBuilder.array(this.MeasurableTreatmentgoalsover12monthPeriod.data.map(x => !1)),
            PlannedInterventionsOrConditionsMgmtover12monthperiodfromInitiationofplan: this.formBuilder.array(this.PlannedInterventionsOrConditionsMgmtover12monthperiodfromInitiationofplan.map(x => !1)),
            DiscussofDiseaseProcess: this.formBuilder.array(this.DiscussofDiseaseProcess.map(x => !1)),
            Medication: this.formBuilder.array(this.Medication.map(x => !1)),
            NutritionOrHydrationOrElimication: this.formBuilder.array(this.NutritionOrHydrationOrElimication.map(x => !1)),
            Activity: this.formBuilder.array(this.Activity.map(x => !1)),
            PhychoOrSocial: this.formBuilder.array(this.PhychoOrSocial.map(x => !1)),
            ProgressOrReductionofBarriersNotedbyPatient: this.formBuilder.array(this.ProgressOrReductionofBarriersNotedbyPatient.map(x => !1)),
            MeicationAdherence: this.formBuilder.array(this.MeicationAdherence.map(x => !1)),
            PHQ2ReportedByPatient: this.formBuilder.array(this.PHQ2ReportedByPatient.map(x => !1)),
            GeneralizedAnxietyDisroder2itemGAD2: this.formBuilder.array(this.GeneralizedAnxietyDisroder2itemGAD2.map(x => !1)),
            PatientOrCaregiverOutcomesAchivedThisMonth: this.formBuilder.array(this.PatientOrCaregiverOutcomesAchivedThisMonth.map(x => !1)),
        })


        if (!this.isAddMode) {

        }
    }
    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
debugger;
        // reset alerts on submit
        // this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
        this.loading = true;
    }


}