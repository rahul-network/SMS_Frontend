import { Component, ViewChild, OnInit } from '@angular/core';
import { Room, LocalTrack, LocalVideoTrack, LocalAudioTrack, RemoteParticipant ,createLocalAudioTrack} from 'twilio-video';
import { RoomsComponent } from '../rooms/rooms.component';
import { CameraComponent } from '../camera/camera.component';
import { SettingsComponent } from '../settings/settings.component';
import { ParticipantsComponent } from '../participants/participants.component';
import { VideoChatService } from '../services/videochat.service';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { environment } from "../../../../../environments/environment"
import { PatientService } from '../../../service/patient-service';
import { PatientVideoCallService, PatientVideoCall } from '../services/patientvideocall-service';
import { ActivatedRoute } from '@angular/router';
import {PatientMessageRequest } from '../../../models/patient';
import { StorageService } from '../services/storageService';


@Component({
    selector: 'video-call',
    styleUrls: ['./videoCall.component.scss'],
    templateUrl: './videoCall.component.html',
    providers: [StorageService]
})
export class participendVideoCallComponent implements OnInit {
    @ViewChild('rooms', { static: false }) rooms!: RoomsComponent;
    @ViewChild('camera', { static: false }) camera!: CameraComponent;
    @ViewChild('settings', { static: false }) settings!: SettingsComponent;
    @ViewChild('participants', { static: false }) participants!: ParticipantsComponent;
    disable!: boolean;
    muted:boolean = false;
    activeRoom!: Room;
    callParticipant : boolean = true;
    isRoomExist: boolean = false;
    roomGuid!: string;
    id: number;
    clinicId: number;
    patientId: string;
    meetingId: string;
    private notificationHub!: HubConnection;
    data: any;
    constructor(
        private readonly videoChatService: VideoChatService,
        private patientService: PatientService,
        private patientVideoCallService: PatientVideoCallService,

        private activatedRoute: ActivatedRoute) {
        this.clinicId = this.activatedRoute.snapshot.params.clinicId as number;
        this.patientId = this.activatedRoute.snapshot.params.patientId;
        this.meetingId = this.activatedRoute.snapshot.params.meetingId;
        this.id  = this.activatedRoute.snapshot.params.id;
        if (
            this.meetingId !== null && this.meetingId != "" && typeof this.meetingId !== "undefined"
        ) {
            this.isRoomExist = true;
            this.roomGuid = this.meetingId;
        }
        else
            this.isRoomExist = false;
        }

    async ngOnInit() {
        this.disable = false;
        let serverUrl = environment.apiUrl;
        const builder =
            new HubConnectionBuilder()
                .configureLogging(LogLevel.Information)
                .withUrl(`${serverUrl}/notificationHub`);

        this.notificationHub = builder.build();
        this.notificationHub.on('RoomsUpdated', async updated => {
            if (updated) {
                await this.rooms.updateRooms();
            }
        });
        await this.notificationHub.start();
        this.videoChatService.getAllRooms().then((result) => {
            console.log(result)
        });

        this.patientService.getPatient('QAC', this.patientId).subscribe((result) => {
            this.data = result;
        });

    }

    async onSettingsChanged(deviceInfo: MediaDeviceInfo) {
        await this.camera.initializePreview(deviceInfo.deviceId);
    }

    async onLeaveRoom(_: boolean) {
        if (this.activeRoom) {
            this.activeRoom.disconnect();
        }

        this.camera.finalizePreview();
        const videoDevice = this.settings.hidePreviewCamera();
        await this.camera.initializePreview(videoDevice && videoDevice.deviceId);
        this.participants.clear();
        let obj: PatientVideoCall = {
            RoomId: this.roomGuid,
            HasCreated: true,
            HasJoined: false,
            Id: this.id,
        }
        this.patientVideoCallService.CreateOrUpdateMeeting('QAC', this.patientId, obj).subscribe();
        window.close();
    }

    toggleMute() {
        this.muted = !this.muted;
        if (this.muted) {
            var localParticipant = this.activeRoom.localParticipant;
            localParticipant.audioTracks.forEach(function (audioTrack) {
                audioTrack.track.disable();
            });
        }
        else {  
            var localParticipant = this.activeRoom.localParticipant;
            localParticipant.audioTracks.forEach(function (audioTrack) {
                audioTrack.track.enable();
            });
        }
      }
    async onRoomChanged(roomName: string) {
        if (roomName) {
            if (this.activeRoom) {
                this.activeRoom.disconnect();
            }

            this.camera.finalizePreview();
           // const tracks = await this.settings.showPreviewCamera();
            const tracks = await Promise.all([
                createLocalAudioTrack(),
                this.settings.showPreviewCamera()
            ]);
            this.activeRoom =
                await this.videoChatService
                    .joinOrCreateRoom(roomName, tracks);

            this.participants.initialize(this.activeRoom.participants);
            this.registerRoomEvents();

            this.notificationHub.send('RoomsUpdated', true);
        }
    }

    onParticipantsChanged(_: boolean) {
        this.videoChatService.nudge();
    }

    private registerRoomEvents() {
        this.activeRoom
            .on('disconnected',
                (room: Room) => room.localParticipant.tracks.forEach(publication => this.detachLocalTrack(publication.track)))
            .on('participantConnected',
                (participant: RemoteParticipant) => this.participants.add(participant))
            .on('participantDisconnected',
                (participant: RemoteParticipant) => this.participants.remove(participant))
            .on('dominantSpeakerChanged',
                (dominantSpeaker: RemoteParticipant) => this.participants.loudest(dominantSpeaker));
    }

    private detachLocalTrack(track: LocalTrack) {
        if (this.isDetachable(track)) {
            track.detach().forEach(el => el.remove());
        }
    }

    private isDetachable(track: LocalTrack): track is LocalAudioTrack | LocalVideoTrack {
        return !!track
            && ((track as LocalAudioTrack).detach !== undefined
                || (track as LocalVideoTrack).detach !== undefined);
    }

    sendInvite() {
        this.disable = true;
        this.videoChatService.getNewRoom().subscribe(async (_roomResponse) => {
            if (this.activeRoom) {
                this.activeRoom.disconnect();
            }

            this.camera.finalizePreview();
            //const tracks = await this.settings.showPreviewCamera();
            const tracks = await Promise.all([
                createLocalAudioTrack(),
                this.settings.showPreviewCamera()
            ]);
            this.activeRoom =
                await this.videoChatService
                    .joinOrCreateRoom(_roomResponse.name, tracks);

            this.participants.initialize(this.activeRoom.participants);
            this.registerRoomEvents();

            this.notificationHub.send('RoomsUpdated', true);
            

            let obj: PatientVideoCall = {
                RoomId: this.roomGuid,
                HasCreated: true,
                HasJoined: false,
                Id: this.id,
            }
            this.roomGuid = _roomResponse.name;
            this.patientVideoCallService.CreateOrUpdateMeeting('QAC', this.patientId, obj).subscribe((res) => {
                this.roomGuid = _roomResponse.name;
                this.id = res.id; 
                let sms = `Hello ${this.data.firstName} ${this.data.lastName}, System Admin from ${this.data.clinicName } is requesting a video call. Click this link to join the video session now: `
                let partipantURL = `${sms} ${location.origin}/#/videocall/QAC/${this.patientId}/${res.id}/${this.roomGuid}`
                console.log(partipantURL)
                let obj: PatientMessageRequest = {
                    CellPhone: this.data.cellPhone,
                    Content: partipantURL,
                    IsRead: false,
                }
                this.patientService.sendSms('QAC', this.patientId, obj).subscribe();
                this.disable = false;
            });
        });
    }

    

    async joinMeeting() {

        if (this.activeRoom) {
            this.activeRoom.disconnect();
        }

        this.camera.finalizePreview();
        //const tracks = await this.settings.showPreviewCamera();
        const tracks = await Promise.all([
            createLocalAudioTrack(),
            this.settings.showPreviewCamera()
        ]);
        this.activeRoom =
            await this.videoChatService
                .joinOrCreateRoom(this.roomGuid, tracks);

        this.participants.initialize(this.activeRoom.participants);
        this.registerRoomEvents();

        this.notificationHub.send('RoomsUpdated', true);
        let obj: PatientVideoCall = {
            RoomId: this.roomGuid,
            HasCreated: false,
            HasJoined: true,
            Id: Number( this.id),
        }


        this.patientVideoCallService.CreateOrUpdateMeeting('QAC', this.patientId, obj).subscribe();
        
    }
}