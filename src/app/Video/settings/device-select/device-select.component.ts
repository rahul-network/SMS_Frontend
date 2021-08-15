import { Component, EventEmitter, Input, Output } from '@angular/core';

class IdGenerator {
    protected static id: number = 0;
    static getNext() {
        return ++ IdGenerator.id;
    }
}

@Component({
    selector: 'app-device-select',
    templateUrl: './device-select.component.html'
})
export class DeviceSelectComponent {
    private localDevices: MediaDeviceInfo[] = [];

    id: string;
    selectedId: string |null;

    get devices(): MediaDeviceInfo[] {
        return this.localDevices;
    }

    @Input() label: string;
    @Input() kind: MediaDeviceKind;
    @Input() set devices(devices: MediaDeviceInfo[]) {
         this.find(this.localDevices = devices);
    }

    @Output() settingsChanged = new EventEmitter<MediaDeviceInfo>();

    constructor() {
        this.id = `device-select-${IdGenerator.getNext()}`;
    }

    onSettingsChanged(deviceId:Event) {
        let deviceEvent = (<HTMLInputElement>deviceId.target).value;
        this.setAndEmitSelections(this.selectedId = deviceEvent);
    }

    private find(devices: MediaDeviceInfo[]) {
        console.log(devices)
        if (devices && devices.length > 0) {
            return devices[0].deviceId;
        }

        return null;
    }

    private setAndEmitSelections(deviceId: string) {
        this.settingsChanged.emit(this.devices.find(d => d.deviceId === deviceId));
    }
}
