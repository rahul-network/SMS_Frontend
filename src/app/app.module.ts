import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MatSortModule } from '@angular/material/sort';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PatientListComponent } from './patient/patients-list.component';
import { MaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';
import { PatientDetailComponent } from './patient/patient-detail/patient-detail.component';
import { MatTabsModule } from '@angular/material/tabs';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CameraComponent } from './patient/patient-detail/Video/camera/camera.component';
import { ParticipantsComponent } from './patient/patient-detail/Video/participants/participants.component';
import { RoomsComponent } from './patient/patient-detail/Video/rooms/rooms.component';
import { SettingsComponent } from './patient/patient-detail/Video/settings/settings.component';
import { DeviceSelectComponent } from './patient/patient-detail/Video/settings/device-select/device-select.component';
import { VideoChatService } from './patient/patient-detail/Video/services/videochat.service';
import { DeviceService } from './patient/patient-detail/Video/services/device.service';
import { StorageService } from './patient/patient-detail/Video/services/storage.service';
import { VideoCallComponent } from './patient/patient-detail/Video/Call/videoCall.component';
import { participendVideoCallComponent } from './patient/patient-detail/Video/Call/videoCallParticipant.component';
import { SpinnersAngularModule } from 'spinners-angular';
import {DialerAppComponent  } from './patient/patient-detail/Call/dialer-app.component';
import {CcmFormComponent  } from './patient/patient-detail/Forms/component/ccm/ccm.component';
import {MawvFormComponent  } from './patient/patient-detail/Forms/component/mawv/mawv.component';
import {PatientFormsComponent} from './patient/patient-detail/Forms/patient-forms.component';
import {PatientSmsComponent} from './patient/patient-detail/Sms/patient-sms.component';
import {TitleCaseDirective   } from './patient/patient-detail/Forms/TitleCaseDirective';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule, } from '@angular/material/select';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { ToastrModule } from 'ngx-toastr';
import { MatChipsModule } from '@angular/material/chips';
import { EcgModule } from './ecg/ecg.module'
import { MctModule  } from './mct/mct.module'


@NgModule({
  declarations: [
   
    AppComponent,
    PatientListComponent,
    PatientDetailComponent,
    TitleCaseDirective,
    CameraComponent,
    ParticipantsComponent,
    RoomsComponent,
    SettingsComponent,
    DeviceSelectComponent,
    VideoCallComponent,
    participendVideoCallComponent,
    DialerAppComponent,
    CcmFormComponent,
    MawvFormComponent,
    PatientFormsComponent,
    PatientSmsComponent
  ],
  imports: [
    MatChipsModule,
    MaterialModule,
    EcgModule,
    MctModule,
    MatTabsModule,
    DragDropModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AutocompleteLibModule,
    ReactiveFormsModule,
    SpinnersAngularModule,
    NgxSkeletonLoaderModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    ToastrModule.forRoot()
  ],
   providers: [VideoChatService,DeviceService,StorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
