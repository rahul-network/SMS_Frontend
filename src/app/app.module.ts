import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MainDatatableComponent } from './main-datatable/main-datatable.component';
import { MaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';
import { DetailDataComponent } from './main-datatable/detail-data/detail-data.component';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


import { CameraComponent } from './Video/camera/camera.component';
//import {VideocallComponent } from './Video/videocall/videocall.component';


//import {ParticipantvideoComponent } from './Video/participantvideo/participantvideo.component';
import { ParticipantsComponent } from './Video/participants/participants.component';
import { RoomsComponent } from './Video//rooms/rooms.component';
import { SettingsComponent } from './Video//settings/settings.component';
import { DeviceSelectComponent } from './Video/settings/device-select/device-select.component';
import { VideoChatService } from './services/videochat.service';
import { DeviceService } from './services/device.service';
import { StorageService } from './services/storage.service';
import { VideoCallComponent } from './Video/Call/videoCall.component';
import { SpinnersAngularModule } from 'spinners-angular';
import {DialerAppComponent  } from './Voice/dialer-app.component';


@NgModule({
  declarations: [
    AppComponent,
    MainDatatableComponent,
    DetailDataComponent,

    CameraComponent,
    ParticipantsComponent,
    RoomsComponent,
    SettingsComponent,
    DeviceSelectComponent,
    VideoCallComponent,
    DialerAppComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NoopAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnersAngularModule,
    
    

  ],
   providers: [VideoChatService,DeviceService,StorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
