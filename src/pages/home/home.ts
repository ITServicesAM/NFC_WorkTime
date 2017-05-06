import {Component, NgZone} from "@angular/core";
import {Ndef, NFC} from "@ionic-native/nfc";
import {Platform} from "ionic-angular";
import {NdefTag, Tag, TagUtil} from "../../models/tag";
import {Vibration} from "@ionic-native/vibration";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  tag: Tag = new Tag();
  dataReceived: boolean = false;
  startWorkTime: string;
  endWorkTime: string;

  constructor(private nfc: NFC,
              private ndef: Ndef,
              private platform: Platform,
              private zone: NgZone,
              private vibration: Vibration) {

    platform.ready().then(() => {
      this.addNfcListeners();
      // this.nfc.showSettings();
    })
  }

  addNfcListeners(): void {
    this.nfc.addTagDiscoveredListener().subscribe((tagEvent: Event) => this.tagListenerSuccess(tagEvent));
    this.nfc.addNdefListener().subscribe((tagEvent: Event) => this.tagListenerSuccess(tagEvent));
  }

  tagListenerSuccess(tagEvent: Event) {
    console.log("RAW_DATA: " + JSON.stringify(tagEvent));
    this.zone.run(() => {
      this.tag = TagUtil.readTagFromJson(tagEvent);
      let payload: string = (<NdefTag>this.tag).records[0].getFormattedPayload();
      console.log("Formatted Payload: " + payload);
      if (payload.indexOf("Gehen") > 0) {
        this.endWorkTime = new Date().toLocaleTimeString();
      } else if (payload.indexOf("Kommen") > 0) {
        this.startWorkTime = new Date().toLocaleTimeString();
      }

      this.dataReceived = true;
      this.vibrate(1000);


    });

  }

  vibrate(time: number): void {
    this.vibration.vibrate(time);
  }

}
