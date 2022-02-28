import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { formatDate } from '@angular/common';
import { MAWVFormService } from './service/mawv-service';
import { MatTableDataSource } from '@angular/material/table';
import { ViewChild } from '@angular/core';
import * as moment from 'moment';
@Component({
    selector: 'mawv-form',
    styleUrls: ['./mawv.component.scss'],
    templateUrl: './mawv.component.html',
})
export class MawvFormComponent implements OnInit {
    displayedColumns: string[] = ['edit', 'formId', 'createdDateTime', 'updatedDateTime'];
    detailDataSource = new MatTableDataSource<any>([]);
    @ViewChild(MatSort) sort!: MatSort;
    form!: FormGroup;
    id!: string;
    isAddMode!: boolean;
    loading = false;
    submitted = false;
    todayDate = moment(new Date()).format('MMMM DD YYYY');
    constructor(public dialog: MatDialog,
        public dialogRef: MatDialogRef<MawvFormComponent>,
        @Inject(MAT_DIALOG_DATA,
        )
        public data: any,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private MAWVFormService: MAWVFormService
    ) { }

    ngOnInit() {
        this.loading = false;
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;
        this.form = this.formBuilder.group({
            mawv_medicalPractice: [''],
            mawv_documentCreated: [''],
            mawv_firstName: [''],
            mawv_lastName: [''],
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
            DateIfVerbalConsent: [''],
            AdditionalNotes:['']
        });
        this.form = new FormGroup({
            mawv_patientId: new FormControl(),
            mawv_medicalPractice: new FormControl(),
            mawv_documentCreated: new FormControl(moment(new Date()).format('MMMM DD YYYY')),
            
            mawv_firstName: new FormControl(this.data.firstName),
            mawv_lastName: new FormControl(this.data.lastName),
            typeOfVisit: new FormControl(),	//	TYPE OF VISIT
            typeOfVisitOther: new FormControl(),	//	TYPE OF VISIT OTHER
            gender: new FormControl(),	//	Gender
            comment: new FormControl(),	//	Comment
            ageOfPatientCalculation: new FormControl(),	//	Age of Patient Calculation
            colorectalScreening: new FormControl(),	//	Colorectal Screening
            breastCancerScreening: new FormControl(),	//	Breast Cancer Screening
            dateOfLastColScreening: new FormControl(),	//	Date of last Colorectal Screening
            dateofLastBreastCancerScreening: new FormControl(),	//	Date of Last Breast Cancer Screening
            bloodPressureScreening: new FormControl(),	//	Blood Pressure Screening
            diabeticEyeExam: new FormControl(),	//	Diabetic Eye Exam
            nephropathyScreening: new FormControl(),	//	Nephropathy Screening
            boneDensityTest: new FormControl(),	//	Bone Density Test
            hedisQualityOpt1: new FormControl(),	//	Considering your age, how would you rate your overall health?
            hedisQualityOpt2: new FormControl(),	//	In general, what is your satisfaction with life?
            hedisQualityOpt3: new FormControl(),	//	How would you describe the condition of your mouth and teeth, including false teeth or dentures?
            hedisQualityOpt4: new FormControl(),	//	How would you rate your mental health, including your mood and ability to think?
            hedisQualityComment: new FormControl(),	//	Comment
            hedisQualityOpt5: new FormControl(),	//	How often do you snore?
            hedisQualityOpt6: new FormControl(),	//	In the past 7 days, how often have you felt sleepy during the daytime?
            hedisQualityOpt7: new FormControl(),	//	In the past 7 days, how often have you felt sleepy during the daytime?
            hedisQualityOpt8: new FormControl(),	//	In the past 7 days, how often have you felt sleepy during the daytime?
            rateLevelOfPainScale: new FormControl(),	//	Rate level of pain on scale 1-10 (1 being the lowest)
            hedisQualityOpt9: new FormControl(),	//	Have you suffered a personal loss or misfortune in the last year? (For example: a job loss, disability, divorce, separation, jail term, or the death of someone close to you.)
            hedisQualityComment2: new FormControl(),	//	Comment
            eachNightSleep: new FormControl(),	//	How much sleep do you usually get each night?
            medicalAdherence: new FormControl(),	//	Do you take your medications as you have been told to take them?
            medicalAdherenceComment: new FormControl(),	//	Comments:
            medicalAdherenceOp1: new FormControl(),	//	Do you forget to take your medication?
            medicalAdherenceOp2: new FormControl(),	//	Are confused about how to take your medication?
            medicalAdherenceOp3: new FormControl(),	//	Have a hard time opening the bottles or self administering the medication?
            medicalAdherenceOp4: new FormControl(),	//	You don't know what they are for?
            medicalAdherenceOp5: new FormControl(),	//	Are you worried or are you experiencing side effects?
            medicalAdherenceOp6: new FormControl(),	//	Are they too expensive?
            medicalAdherenceOp7: new FormControl(),	//	Pharmacist says they are not available at the time
            medicalAdherenceComment1: new FormControl(),	//	Comments
            adlFunctionalAssessmentOp1: new FormControl(),	//	Can you stand from a sitting position?
            adlFunctionalAssessmentOp2: new FormControl(),	//	Are you able to walk outside of the house?
            adlFunctionalAssessmentOp3: new FormControl(),	//	Can you eat meals unassisted?
            adlFunctionalAssessmentOp4: new FormControl(),	//	Can you bathe unassisted?
            adlFunctionalAssessmentOp5: new FormControl(),	//	Are you able to organize your day?
            adlFunctionalAssessmentOp6: new FormControl(),	//	Are you able to walk in the house?
            adlFunctionalAssessmentOp7: new FormControl(),	//	Can you get dressed unassisted?
            adlFunctionalAssessmentOp8: new FormControl(),	//	Can you use the toilet unassisted?
            adlFunctionalAssessmentOp9: new FormControl(),	//	"Since you answered ""no"" to one of the questions, do you have someone who can assist you?        "
            adlFunctionalAssessmentOp10: new FormControl(),	//	In the past 6 months, have you experience leaking of urine?
            adlFunctionalAssessmentComment: new FormControl(),	//	"Comments"
            adlInstrumentalAssesmentOp1: new FormControl(),	//	Can you or someone shop for groceries?
            adlInstrumentalAssesmentOp2: new FormControl(),	//	Are you able to drive or use of public transportation?
            adlInstrumentalAssesmentOp3: new FormControl(),	//	Can you make phone calls unassisted?
            adlInstrumentalAssesmentOp4: new FormControl(),	//	Are you able to cook?
            adlInstrumentalAssesmentOp5: new FormControl(),	//	Can you do housework?
            adlInstrumentalAssesmentOp6: new FormControl(),	//	Can you take your medications?
            adlInstrumentalAssesmentOp7: new FormControl(),	//	Can you handle your finances?
            adlInstrumentalAssesmentComment: new FormControl(),	//	Comments
            fallPreventionOp1: new FormControl(),	//	In the past 6 months, have you fallen?
            fallPreventionOp2: new FormControl(),	//	Did you sustain any injuries?
            fallPreventionOp3: new FormControl(),	//	Do you feel unsteady when you walk?
            wheelchair: new FormControl(),	//	wheelchair
            cane: new FormControl(),	//	cane
            prosthetic: new FormControl(),	//	prosthetic
            orthotic: new FormControl(),	//	orthotic
            walkers: new FormControl(),	//	orthotic //New
            fallPreventionComment: new FormControl(),	//	Comments
            gaitAndBalance: new FormControl(),	//	Gait & Balance
            levelOfConsciousness: new FormControl(),	//	Level of Consciousness
            mobility: new FormControl(),	//	Mobility
            complications: new FormControl(),	//	Complications
            ambulationAndEliminationStatus: new FormControl(),	//	Ambulation/Elimination Status
            visualImpairment: new FormControl(),	//	Visual Impairment
            environmentalHazards: new FormControl(),	//	Environmental Hazards
            predisposingDiseases: new FormControl(),	//	Predisposing Diseases
            historyOfFallsInLastDays: new FormControl(),	//	History of Falls in Last 90 Days
            fallRistAssessmentOp1: new FormControl(),	//	Rugs in the hallways?
            fallRistAssessmentOp2: new FormControl(),	//	Grab bars in the bathroom?
            fallRistAssessmentOp3: new FormControl(),	//	Hand rails on the stairs?
            fallRistAssessmentOp4: new FormControl(),	//	Proper lighting?
            fallRistAssessmentComments: new FormControl(),	//	Comments
            hearingImpairmentOp1: new FormControl(),	//	Do you currently wear a hearing aid?
            hearingImpairmentOp2: new FormControl(),	//	Do you currently have a hearing problem or do you feel you hearing aid is not addressing the issue?
            hearingImpairmentOp3: new FormControl(),	//	Does a hearing problem cause you to feel embarassed when you meet new people?
            hearingImpairmentOp4: new FormControl(),	//	Do you feel frustrated when talking to members of your family?
            hearingImpairmentOp5: new FormControl(),	//	Do you have a hard time hearing when someone speaks in a whisper?
            hearingImpairmentOp6: new FormControl(),	//	Does a hearing problem cause you difficulty when visting friends, relatives, or neighbors?
            hearingImpairmentOp7: new FormControl(),	//	Does a hearing problem cause you to have arguments with family members?
            hearingImpairmentOp8: new FormControl(),	//	Does a hearing problem cause you difficulty when listening to TV or radio?
            hearingImpairmentComment: new FormControl(),	//	Comments
            depressionOp1: new FormControl(),	//	Little interest or pleasure in doing things
            depressionOp2: new FormControl(),	//	Feeling down, depressed or hopeless
            depressionOp3: new FormControl(),	//	Trouble falling or staying asleep or sleeping too much?
            depressionOp4: new FormControl(),	//	Feeling tired or having little energy?
            depressionOp5: new FormControl(),	//	Poor appetitie or eating too much?
            depressionOp6: new FormControl(),	//	Trouble concentrating on things such as reading the newspaper or watching TV?
            depressionOp7: new FormControl(),	//	Moving or speaking so slowly that other people have noticed? Or the opposite - being so fidgety and restless that you have been moving around a lot more than usual.
            depressionOp8: new FormControl(),	//	Thoughts that you would be better off dead, or hurting yourself or others?
            depressionOp9: new FormControl(),	//	Do you drink alcohol?
            depressionOp10: new FormControl(),	//	Do you take recreational drugs?
            depressionOp11: new FormControl(),  // When did you have these thoughts and do you have plans to take your life?
            depressionComment: new FormControl(),	//	Comments:
            anxietyOp1: new FormControl(),	//	In the past 2 weeks, how often have you felt nervous, anxious, or on edge?
            anxietyOp2: new FormControl(),	//	In the past 2 weeks how often were you not able to stop worrying or control your worrying?
            anxietyOp3: new FormControl(),	//	How often does stress prevent you from handling tasks such as your health, finances, family, relationships, work?
            anxietyOp4: new FormControl(),	//	How often do you get the social and emotional support you need?
            anxietyComment: new FormControl(),	//	Comments
            nutritionOp1: new FormControl(),	//	How often do you eat fast food or snacks or pizza?
            nutritionOp2: new FormControl(),	//	How often do you drink sodas or eat sweets?
            nutritionOp3: new FormControl(),	//	How often do you eat fruits and vegetables?
            nutritionOp4: new FormControl(),	//	How often do you eat less than 2 meals a day?
            nutritionOp5: new FormControl(),	//	Do you always have enough money to buy the food you need?
            nutritionComment: new FormControl(),	//	Comments:
            physicalActivityOp1: new FormControl(),	//	Do you exercise?
            physicalActivityOp2: new FormControl(),	//	How many days a week do you exercise?
            physicalActivityOp3: new FormControl(),	//	On days when you exercise, for how long doyou exercise (in minutes)?
            physicalActivityOp4: new FormControl(),	//	How intense is your typical exercise?
            physicalActivityComment: new FormControl(),	//	Comments:
            homeSafetyLivingConditionOp1: new FormControl(),	//	Does your home have smoke and carbon monoxide detectors?
            homeSafetyLivingConditionOp2: new FormControl(),	//	Do you always fasten your seat belt when you are in a car?
            homeSafetyLivingConditionOp3: new FormControl(),	//	Do you live alone?
            homeSafetyLivingConditionComment: new FormControl(),	//	Comments:
            liveWith: new FormControl(),	//	Who do you live with?
            liveIn: new FormControl(),	//	Do you live in:
            advanceCarePlanningOp1: new FormControl(),	//	Does your home have smoke and carbon monoxide detectors?
            advanceCarePlanningOp2: new FormControl(),	//	Do you have a living will/advance directive?
            advanceCarePlanningOp3: new FormControl(),	//	Is a copy of your advance care directive on file at your doctor'soffice?
            advanceCarePlanningComment: new FormControl(),	//	Comments
            annualReviewChronicOp1: new FormControl(),	//	G82.2 - Paraplegia
            annualReviewChronicOp2: new FormControl(),	//	G82.5 - Quadriplegia.
            annualReviewChronicOp3: new FormControl(),	//	M05.9 - Rheumatoid arthritis
            annualReviewChronicOp4: new FormControl(),	//	R25.1 - Tremor, unspecified
            annualReviewChronicOp5: new FormControl(),	//	G20 - Parkinson's disease
            annualReviewChronicOp6: new FormControl(),	//	R56.9 - Unspecified convulsions
            annualReviewChronicOp7: new FormControl(),	//	G40.9 - Epilepsy, unspecified
            annualReviewChronicOp8: new FormControl(),	//	I20 - Angina pectoris
            annualReviewChronicOp9: new FormControl(),	//	Z21 - Asymptomatic human immunodeficiency virus[HIV] infection
            annualReviewChronicOp10: new FormControl(),	//	B18 - Chronic viral hepatitis
            annualReviewChronicOp11: new FormControl(),	//	D69.2 - Other nonthrombocytopenic purpura
            annualReviewChronicOp12: new FormControl(),	//	I25.119 - Atherosclerotic heart disease of native coronary artery with unspecified angina pectoris
            annualReviewChronicOp13: new FormControl(),	//	I48.91 - Unspecified atrial fibrillation
            annualReviewChronicOp14: new FormControl(),	//	I49.9 - Cardiac arrhythmia, unspecified
            annualReviewChronicOp15: new FormControl(),	//	Z94.1 - Heart transplant
            annualReviewChronicOp16: new FormControl(),	//	Z94.2 - Lung transplant
            annualReviewChronicOp17: new FormControl(),	//	Z94.4 - Liver transplant
            annualReviewChronicOp18: new FormControl(),	//	Z93.0 - Tracheostomy
            annualReviewChronicOp19: new FormControl(),	//	Z93.1 - Gastrostomy
            annualReviewChronicOp20: new FormControl(),	//	Z93.3 - Colostomy
            annualReviewChronicOp21: new FormControl(),	//	Z89.4 - Acquired absence of toe(s), foot, and ankle
            annualReviewChronicOp22: new FormControl(),	//	Z89.5 - Acquired absence of leg below knee
            planCareAssessment: new FormControl(),	//	
            planCarePlan: new FormControl(),	//	
            referralsOp1: new FormControl(),	//	Referral for Bone Density Exam
            referralsOp2: new FormControl(),	//	Referral for Colorectal Cancer Screening
            referralsOp3: new FormControl(),	//	Referral for Podiatry
            referralsOp4: new FormControl(),	//	Referral for Dilated Eye Exam
            referralsOp5: new FormControl(),	//	Referral for Rheumatologist
            referralsOp6: new FormControl(),	//	Referral for Nephrology
            bnp: new FormControl(),	//	BNP
            cbc: new FormControl(),	//	CBC
            cbcdiff: new FormControl(),	//	CBC w/Diff
            cmp: new FormControl(),	//	CMP
            esr: new FormControl(),	//	ESR
            fastingLipidPanel: new FormControl(),	//	Fasting Lipid Panel
            freet: new FormControl(),	//	Free T-4
            hemoglobinA1c: new FormControl(),	//	Hemoglobin A1C
            homocysteine: new FormControl(),	//	Homocysteine
            iron: new FormControl(),	//	Iron
            ucidAcid: new FormControl(),	//	Ucid Acid
            magnesium: new FormControl(),	//	Magnesium
            vitD: new FormControl(),	//	Vit D
            phos: new FormControl(),	//	PHOS
            tsh: new FormControl(),	//	TSH
            thyroxine: new FormControl(),	//	Thyroxine
            ptnr: new FormControl(),	//	PTINR
            otherBloodTest: new FormControl(),	//	Other Blood Test
            urineDrug: new FormControl(),	//	Urine Drug Test/conf.
            urinalysisWithReflexCluture: new FormControl(),	//	Urinalysis with reflex/culture
            stoolOccultBlood: new FormControl(),	//	Stool, Occult Blood
            urineMicroalbumin: new FormControl(),	//	Urine microalbumin
            otherUrineTest: new FormControl(),	//	Other Urine Test
            cxrPALateralViews: new FormControl(),	//	CXR PA/Lateral views
            ultraSound: new FormControl(),	//	Ultrasound
            venousDoppler: new FormControl(),	//	Venous Doppler
            arterialDoppler: new FormControl(),	//	Arterial Doppler
            xray: new FormControl(),	//	X-ray
            mriWContrast: new FormControl(),	//	MRI w/Contrast
            mriWoContrast: new FormControl(),	//	MRI w/o Contrast
            ctWContrast: new FormControl(),	//	CT w/Contrast
            ctWoContrast: new FormControl(),	//	CT w/o Contrast
            otherRadiologyImaging: new FormControl(),	//	Other Radiology/Imaging
            overnightOximetry: new FormControl(),	//	Overnight Oximetry (Virtuox)
            homeSleepOxygenTest: new FormControl(),	//	Home Sleep Oxygen Test (Virtuox)
            mobileCardiacTelementry: new FormControl(),	//	Mobile Cardiac Telemetry (Virtuox)
            overnightEEG: new FormControl(),	//	Overnight EEG (Virtuox)
            leadEkG: new FormControl(),	//	12 Lead EKG (VIrtoux)
            otherTest: new FormControl(),	//	Other Test
            providersName: new FormControl(),	//	Provider’s name
            additionalNotes: new FormControl(),	//	ADDITIONAL NOTES
        })
        if (this.data.formId !== null) {
            debugger;
            this.todayDate =moment(this.data.createdDateTime).format('MMMM DD YYYY');
            this.MAWVFormService.getDetailsbyFormId(this.data.formId).subscribe((res) => {
                
                res.forEach((element: any) => {
                    (this.form.controls[element.fieldKey] as FormControl).patchValue(element.fieldValue)
                })
            });
        }
    }
    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    public calculateAge(birthdate: any): number {
        return moment().diff(birthdate, 'years');
    }
    onSubmit() {
        this.submitted = true;
        this.MAWVFormService.addOrUpdate(this.form.value, this.data.externalPatientId, this.data.formId, 'QAC').subscribe((res) => {
            alert("Save Successfully");
            this.dialogRef.close();
        });
        if (this.form.invalid) {
            return;
        }
    }
}
