import { connect, ConnectOptions, LocalTrack, LocalVideoTrack, Room } from 'twilio-video';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReplaySubject , Observable } from 'rxjs';
import { environment } from "../../environments/environment" 

interface AuthToken {
    token: string;
}

export interface NamedRoom {
    id: string;
    name: string;
    maxParticipants?: number;
    participantCount: number;
}

export type Rooms = NamedRoom[];

@Injectable()
export class VideoChatService {
    $roomsUpdated: Observable<boolean>;

    private roomBroadcast = new ReplaySubject<boolean>();

    constructor(private readonly http: HttpClient) {
        this.$roomsUpdated = this.roomBroadcast.asObservable();
    }

    private async getAuthToken() {
        let serverUrl = environment.apiUrl;
        const auth =
            await this.http
            .get<AuthToken>(`${serverUrl}/api/video/token`)
                      .toPromise();

        return auth.token;
    }

    getAllRooms() {
        let serverUrl = environment.apiUrl;
        return this.http
            .get<Rooms>(`${serverUrl}/api/video/rooms`)
            .toPromise();
    }

    getNewRoom() {
        let serverUrl = environment.apiUrl;
        return this.http
            .get<NamedRoom>(`${serverUrl}/api/video/room`);
    }
    
    async joinOrCreateRoom(name: string, tracks: LocalTrack[]) {
        let room: Room = null;
        try {
            const token = await this.getAuthToken();
            room =
                await connect(
                    token, {
                        name,
                        tracks,
                        dominantSpeaker: true
                    } as ConnectOptions);
        } catch (error) {
            alert(error)
            console.error(`Unable to connect to Room: ${error}`);
        } finally {
            
            if (room) {
                this.roomBroadcast.next(true);
            }
        }

        return room;
    }

    nudge() {
        this.roomBroadcast.next(true);
    }
}