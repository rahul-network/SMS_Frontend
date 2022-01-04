import { Component, ElementRef, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
import { createLocalTracks, LocalTrack, LocalVideoTrack } from 'twilio-video';

@Component({
    selector: 'app-camera',
    styleUrls: ['./camera.component.css'],
    templateUrl: './camera.component.html',
})
export class CameraComponent implements AfterViewInit {
    @ViewChild('preview', { static: false }) previewElement: ElementRef;

    get tracks(): LocalTrack[] {
        return this.localTracks;
    }

    isInitializing: boolean = true;

    private videoTrack: LocalVideoTrack;
    private localTracks: LocalTrack[] = [];

    constructor(
        private readonly renderer: Renderer2) { }

    async ngAfterViewInit() {
        if (this.previewElement && this.previewElement.nativeElement) {
            await this.initializeDevice();
        }
    }

    initializePreview(deviceInfo?: MediaDeviceInfo) {
        if (deviceInfo) {
            this.initializeDevice(deviceInfo.kind, deviceInfo.deviceId,deviceInfo.label);
        } else {
            this.initializeDevice();
        }
    }

    finalizePreview() {
        try {
            if (this.videoTrack) {
                this.videoTrack.detach().forEach(element => element.remove());
            }
        } catch (e) {
            console.error(e);
        }
    }

    private async initializeDevice(kind?: MediaDeviceKind, deviceId?: string,name?:string) {
        try {
            this.isInitializing = true;
            this.finalizePreview();

            this.localTracks = kind && deviceId
                ? await this.initializeTracks(kind, deviceId,name)
                : await this.initializeTracks();

             

            this.videoTrack = this.localTracks.find(t => t.kind === 'video') as LocalVideoTrack;
            const videoElement = this.videoTrack.attach();
            this.renderer.setStyle(videoElement, 'height', '100vh');
            this.renderer.setStyle(videoElement, 'width', '100vh');
            this.renderer.appendChild(this.previewElement.nativeElement, videoElement);
        } 
        catch (e) {
            alert(e);
            console.log(e)
        }
        finally {
            this.isInitializing = false;
        }
    }

    private initializeTracks(kind?: MediaDeviceKind, deviceId?: string,name? :string) {
       
        if (kind) {
            switch (kind) {
                case 'audioinput':
                    return createLocalTracks({ audio: { deviceId }, video: true });
                case 'videoinput':
                    return createLocalTracks({ audio: true, video: { deviceId,"name":name, width: 1920, height: 1080, frameRate: 24 } });
            }
        }

        return createLocalTracks({ audio: true, video: { width: 1280, height: 720, frameRate: 24 }});
 
    }
}