import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientListComponent   } from './patient/patients-list.component';
import { VideoCallComponent } from './patient/patient-detail/Video/Call/videoCall.component';
import { participendVideoCallComponent } from './patient/patient-detail/Video/Call/videoCallParticipant.component';
import {MctMainComponent  } from './form/mct/mct-main.component';
import {EcgMainComponent  } from './ecg/ecg.component';


const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: PatientListComponent },
   { path: 'ecg', component: EcgMainComponent },
  { path: 'mctform', component: MctMainComponent },
  { path: 'videocall', component: VideoCallComponent },
  { path: 'videocall/:clinicId/:patientId', component: VideoCallComponent },
  { path: 'videocall/:clinicId/:patientId/:id/:meetingId', component: participendVideoCallComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    useHash: true,
  })],
  exports: [RouterModule]
})

export class AppRoutingModule { }