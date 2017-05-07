import {Component, NgZone} from "@angular/core";
import {NFC} from "@ionic-native/nfc";
import {AlertController, Platform} from "ionic-angular";
import {NdefTag, Tag, TagUtil} from "../../models/tag";
import {Vibration} from "@ionic-native/vibration";
import {FirebaseService} from "../../providers/firebase-service";
import {HelperService} from "../../providers/helper-service";

@Component({
  selector: 'page-home',
  templateUrl: 'workinghours.html'
})
export class WorkingHoursPage {

  tag: Tag = new Tag();
  todayDate: string = "-";
  todayWorkingHours: string;
  overallWorkingHours: string;
  startWorkTime: string = "-";
  endWorkTime: string = "-";

  constructor(private nfc: NFC,
              private platform: Platform,
              private zone: NgZone,
              private vibration: Vibration,
              private firebaseService: FirebaseService,
              private helper: HelperService,
              private alertCtrl: AlertController) {

    this.todayDate = new Date().toLocaleDateString();
    this.firebaseService.getStartWorkTime().subscribe((data: { $value: string }) => {
      this.startWorkTime = data.$value;
      this.calculateTodayWorkingHours();
    });
    this.firebaseService.getEndWorkTime().subscribe((data: { $value: string }) => {
      this.endWorkTime = data.$value;
      this.calculateTodayWorkingHours();
    });
    this.firebaseService.getWorkingHours().subscribe((data: { $value: string }) => {
      this.overallWorkingHours = data.$value;
    });

    platform.ready().then(() => {
      if (platform.is('cordova'))
        this.addNfcListeners();
    })
  }

  calculateTodayWorkingHours() {
    if (this.startWorkTime !== "-" && this.endWorkTime !== "-") {
      console.log(this.endWorkTime + " | " + new Date(this.endWorkTime));
      console.log(this.startWorkTime + " | " + new Date(this.startWorkTime));
      let time = new Date(this.endWorkTime).getTime() - new Date(this.startWorkTime).getTime();
      this.todayWorkingHours = this.helper.msToTime(time);
    }
  }

  addNfcListeners(): void {
    this.nfc.addTagDiscoveredListener().subscribe((tagEvent: Event) => this.tagListenerSuccess(tagEvent));
    this.nfc.addNdefListener().subscribe((tagEvent: Event) => this.tagListenerSuccess(tagEvent));
  }

  tagListenerSuccess(tagEvent: Event) {
    // console.log("RAW_DATA: " + JSON.stringify(tagEvent));
    this.zone.run(() => {
      this.tag = TagUtil.readTagFromJson(tagEvent);
      let payload: string = (<NdefTag>this.tag).records[0].getFormattedPayload();
      console.log("Formatted Payload: " + payload);
      if (payload.indexOf("DRK - Gehen") > 0) {
        if (this.endWorkTime !== "-") {
          let alert = this.alertCtrl.create({
            message: 'Gehtzeit überschreiben?',
            buttons: [
              {
                text: 'Abbrechen',
                role: 'cancel'
              },
              {
                text: 'Jep!',
                handler: () => {
                  this.saveEndWorkTime();
                }
              }
            ]
          });

          alert.present();
        } else {
          this.saveEndWorkTime();
        }
      } else if (payload.indexOf("DRK - Kommen") > 0) {
        if (this.startWorkTime !== "-") {
          let alert = this.alertCtrl.create({
            message: 'Kommtzeit überschreiben?',
            buttons: [
              {
                text: 'Abbrechen',
                role: 'cancel'
              },
              {
                text: 'Jep!',
                handler: () => {
                  this.saveStartWorkTime();
                }
              }
            ]
          });

          alert.present();
        } else {
          this.saveStartWorkTime();
        }
      }

      this.vibration.vibrate(1000);
    });

  }

  private saveStartWorkTime() {
    this.firebaseService.saveStartWorkTime(new Date().toISOString());
    this.helper.showToast("Neue Kommtzeit erfasst", 3000);
  }

  private saveEndWorkTime() {
    this.firebaseService.saveEndWorkTime(new Date().toISOString());
    this.helper.showToast("Neue Gehtzeit erfasst", 3000);
  }

  signOut() {
    this.firebaseService.signOut();
  }

  editWorkingHoursManually() {
    let prompt = this.alertCtrl.create({
      message: "Neuen Wert für das Arbeitszeitkonto setzen",
      inputs: [
        {
          name: 'arbeitszeit',
          placeholder: 'Arbeitszeit',
          value: this.overallWorkingHours
        },
      ],
      buttons: [
        {
          text: 'Abbrechen',
        },
        {
          text: 'Speichern',
          handler: data => {
            console.log('Saved clicked with data: '+JSON.stringify(data));
            this.firebaseService.saveWorkingHours(data.arbeitszeit);
          }
        }
      ]
    });
    prompt.present();
  }

}
