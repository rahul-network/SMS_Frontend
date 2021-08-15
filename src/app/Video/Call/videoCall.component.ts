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

    activeRoom: Room;
    isRoomExist: boolean = false;
    roomGuid: string;
    private notificationHub: HubConnection;

    constructor(
        private readonly videoChatService: VideoChatService,
        private datatableFeedService: DatatableFeedService) {
            debugger;
            let roomSidParams = (new URL(location.href)).hash.substr(1).split('=')[1];
            if (
                roomSidParams !== null && roomSidParams != "" && typeof roomSidParams !== "undefined"
            ) {
                this.isRoomExist = true;
                this.roomGuid = roomSidParams;
            }
            else
                this.isRoomExist = false;


         }

    async ngOnInit() {
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
debugger;
        var x =  this.videoChatService.getAllRooms().then((res)=>{
            console.log(res)
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
        debugger;
        
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
            let partipantURL =  encodeURIComponent(`${location.origin}/videocall/?roomSid=${_roomResponse.name}`) 
            
            this.datatableFeedService.sendSms(156,'+17864633495',`${location.origin}/#/videocall/?roomSid=${_roomResponse.name}`).subscribe((_feedDataDetails) => {
                alert('Invite Sent Successfully');
            });
            
            
              
            console.log("Join Link", `${location.origin}/#/participate/?roomSid=${_roomResponse.name}`);
          
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
    }
}