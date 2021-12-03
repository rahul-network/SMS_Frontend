import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainDatatableComponent  } from './main-datatable/main-datatable.component';
import { VideoCallComponent } from './Video/Call/videoCall.component';
import { participendVideoCallComponent } from './Video/Call/videoCall.component - Copy';


const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: MainDatatableComponent },
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