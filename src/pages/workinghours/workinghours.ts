import {Component, NgZone} from '@angular/core';
import {NFC} from '@ionic-native/nfc';
import {AlertController, NavController, Platform} from 'ionic-angular';
import {NdefTag, Tag, TagUtil} from '../../models/tag';
import {Vibration} from '@ionic-native/vibration';
import {FirebaseService} from '../../providers/firebase-service';
import {HelperService} from '../../providers/helper-service';
import {WorkTime} from '../../models/worktime';
import {fadeIn} from '../../animations/animations';
import * as moment from 'moment';
import {AfoObjectObservable} from 'angularfire2-offline';

@Component({
  selector: 'page-home',
  templateUrl: 'workinghours.html',
  animations: [fadeIn()]
})
export class WorkingHoursPage {
  tag: Tag = new Tag();
  todayDate: string;
  workTime$: AfoObjectObservable<WorkTime>;
  workingHours$: AfoObjectObservable<any>;
  workTimeStart: string = " - ";
  workTimeEnd: string = " - ";
  overallWorkingHours: string;
  state: string = "";

  constructor(private navCtrl: NavController,
              private nfc: NFC,
              private platform: Platform,
              private zone: NgZone,
              private vibration: Vibration,
              private firebaseService: FirebaseService,
              private helper: HelperService,
              private alertCtrl: AlertController) {
    platform.ready().then(() => {
      if (platform.is('cordova'))
        this.addNfcListeners();
    });
    this.init();
  }

  init() {
    moment.locale('de-DE');
    this.todayDate = moment().format("ddd, DD.MM.YYYY");

    this.workTime$ = this.firebaseService.getWorkTime(moment().format("YYYY-MM-DD"));
    this.workingHours$ = this.firebaseService.getWorkingHours();
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
      // console.log("Formatted Payload: " + payload);

      if (payload.indexOf("DRK - Gehen") > 0) {
        if (this.workTimeStart !== " - ") {
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
        if (this.workTimeEnd !== " - ") {
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
    this.firebaseService.saveStartWorkTime(moment());
    this.helper.showToast("Neue Kommtzeit erfasst", 3000);
  }

  private saveEndWorkTime() {
    this.firebaseService.saveEndWorkTime(moment());
    this.helper.showToast("Neue Gehtzeit erfasst", 3000);
  }

  signOut() {
    this.firebaseService.signOut();
  }

  openMap() {
    // this.navCtrl.push(AddWorkingLocationPage);
  }

  editWorkingHoursManually() {
    let workingHoursValue;
    this.workingHours$.take(1).subscribe(value => {
      // console.log(value);
      workingHoursValue = value.$value;
      let prompt = this.alertCtrl.create({
        title: "Neuen Wert für das Arbeitszeitkonto setzen",
        inputs: [
          {
            name: 'arbeitszeit',
            placeholder: 'Arbeitszeit',
            value: workingHoursValue
          },
        ],
        buttons: [
          {
            text: 'Abbrechen',
          },
          {
            text: 'Speichern',
            handler: data => {
              // console.log('Saved clicked with data: ' + JSON.stringify(data));
              this.firebaseService.saveWorkingHours(Number(data.arbeitszeit));
            }
          }
        ]
      });
      prompt.present();
    });
  }
}
