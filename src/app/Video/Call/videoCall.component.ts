import { Component, ViewChild, OnInit } from '@angular/core';
import { Room, LocalTrack, LocalVideoTrack, LocalAudioTrack, RemoteParticipant } from 'twilio-video';
import { RoomsComponent } from '../rooms/rooms.component';
import { CameraComponent } from '../camera/camera.component';
import { SettingsComponent } from '../settings/settings.component';
import { ParticipantsComponent } from '../participants/participants.component';
import { VideoChatService } from '../../services/videochat.service';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { environment } from "../../../environments/environment"
import { DatatableFeedService } from 'src/app/datatable-feed.service';
import { PatientVideoCallService,PatientVideoCall  } from 'src/app/Video/service/patientvideocall-service';
import { ActivatedRoute } from '@angular/router';
import { PatientVoiceCall } from 'src/app/Voice/service/patientvoicecall-service';

@Component({
    selector: 'video-call',
    styleUrls: ['./videoCall.component.css'],
    templateUrl: './videoCall.component.html',
})
export class VideoCallComponent implements OnInit {
    @ViewChild('rooms', { static: false }) rooms: RoomsComponent;
    @ViewChild('camera', { static: false }) camera: CameraComponent;
    @ViewChild('settings', { static: false }) settings: SettingsComponent;
    @ViewChild('participants', { static: false }) participants: ParticipantsComponent;
    disable :boolean;
    activeRoom: Room;
    isRoomExist: boolean = false;
    roomGuid: string;
    patientId: number;
    meetingId: string;
    private notificationHub: HubConnection;
    data:any;
    constructor(
        private readonly videoChatService: VideoChatService,
        private datatableFeedService: DatatableFeedService, 
        private patientVideoCallService: PatientVideoCallService, 
        
        private activatedRoute: ActivatedRoute) {
        this.patientId = this.activatedRoute.snapshot.params.id as number;
        this.meetingId = this.activatedRoute.snapshot.params.meetingId;
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
        
        this.datatableFeedService.getPatient(this.patientId).subscribe((result) => {
            this.data = result;
          });

    }

    async onSettingsChanged(deviceInfo: MediaDeviceInfo) {
        await this.camera.initializePreview(deviceInfo);
    }

    async onLeaveRoom(_: boolean) {
        if (this.activeRoom) {
            this.activeRoom.disconnect();
            this.activeRoom = null;
        }

        this.camera.finalizePreview();
        const videoDevice = this.settings.hidePreviewCamera();
        this.camera.initializePreview(videoDevice);

        this.participants.clear();
        let obj : PatientVideoCall = {
            MeetingId :  this.roomGuid,
            PatientId : Number(this.patientId),
            HasPartiparntJoined : true,
            CallStartDateTime : new Date(),
            ParticipantJoinDateTime : new Date(),
            PartipantLeaveDateTime : null,
            CreatedBy : 1,
        }
        this.patientVideoCallService.Leavemeeting(obj).subscribe();
    }

    async onRoomChanged(roomName: string) {
        if (roomName) {
            if (this.activeRoom) {
                this.activeRoom.disconnect();
            }

            this.camera.finalizePreview();
            const tracks = await this.settings.showPreviewCamera();

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
            const tracks = await this.settings.showPreviewCamera();

            this.activeRoom =
                await this.videoChatService
                    .joinOrCreateRoom(_roomResponse.name, tracks);

            this.participants.initialize(this.activeRoom.participants);
            this.registerRoomEvents();
           
            this.notificationHub.send('RoomsUpdated', true);
            let partipantURL =  `${location.origin}/#/videocall/${this.patientId}/${_roomResponse.name}`
                
            
             this.datatableFeedService.sendSms(Number(this.patientId), this.data.cellPhone,partipantURL).subscribe((_feedDataDetails) => {
                this.disable = false;
                let obj : PatientVideoCall = {
                    MeetingId :  _roomResponse.name,
                    PatientId : Number(this.patientId),
                    HasPartiparntJoined : false,
                    CallStartDateTime : new Date(),
                    ParticipantJoinDateTime : null,
                    PartipantLeaveDateTime : null,
                    CreatedBy : 1,
                }
                this.patientVideoCallService.CreateMeeting(obj).subscribe();
             },error=>{
                this.disable = false;
             });
        });
    }


    async joinMeeting() {
        
        if (this.activeRoom) {
            this.activeRoom.disconnect();
        }

        this.camera.finalizePreview();
        const tracks = await this.settings.showPreviewCamera();

        this.activeRoom =
            await this.videoChatService
                .joinOrCreateRoom(this.roomGuid, tracks);

        this.participants.initialize(this.activeRoom.participants);
        this.registerRoomEvents();

        this.notificationHub.send('RoomsUpdated', true);
        let obj : PatientVideoCall = {
            MeetingId :  this.roomGuid,
            PatientId : Number(this.patientId),
            HasPartiparntJoined : true,
            CallStartDateTime : new Date(),
            ParticipantJoinDateTime : new Date(),
            PartipantLeaveDateTime : null,
            CreatedBy : 1,
        }
        this.patientVideoCallService.Joinmeeting(obj).subscribe();
    }
}