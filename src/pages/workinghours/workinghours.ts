import {Component, NgZone, OnDestroy} from '@angular/core';
import {NFC} from '@ionic-native/nfc';
import {AlertController, ModalController, Platform} from 'ionic-angular';
import {NdefTag, Tag, TagUtil} from '../../models/tag';
import {Vibration} from '@ionic-native/vibration';
import {FirebaseService} from '../../providers/firebase-service';
import {HelperService} from '../../providers/helper-service';
import {WorkTime} from '../../models/worktime';
import {fadeIn} from '../../animations/animations';
import * as moment from 'moment';
import {AddWorkTimeModal} from './addworktimemanually/add_work_time_modal';
import {FirebaseObjectObservable} from 'angularfire2/database';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'page-home',
  templateUrl: 'workinghours.html',
  animations: [fadeIn()]
})
export class WorkingHoursPage implements OnDestroy {
  ngOnDestroy(): void {
    this.workTimeObservableSubscription.unsubscribe();
    this.workingHoursObservableSubscription.unsubscribe();
  }

  tag: Tag = new Tag();
  todayDate: string;
  workTimeObservable: FirebaseObjectObservable<WorkTime>;
  workTimeObservableSubscription: Subscription;
  workingHoursObservable: FirebaseObjectObservable<any>;
  workingHoursObservableSubscription: Subscription;
  workTimeStart: string = " - ";
  workTimeEnd: string = " - ";
  overallWorkingHours: string;
  state: string = "";

  constructor(private nfc: NFC,
              private platform: Platform,
              private zone: NgZone,
              private vibration: Vibration,
              private firebaseService: FirebaseService,
              private helper: HelperService,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController) {
    platform.ready().then(() => {
      if (platform.is('cordova'))
        this.addNfcListeners();
    });

    this.init();
  }

  ionViewDidEnter() {
  }

  init() {
    this.todayDate = moment().format("DD.MM.YYYY");

    this.workTimeObservable = this.firebaseService.getWorkTime(moment().format("YYYY-MM-DD"));
    this.workTimeObservableSubscription = this.workTimeObservable.subscribe((data: WorkTime) => {
      this.workTimeStart = data.workTimeStart ? moment(data.workTimeStart).format("HH:mm:ss") : " - ";
      this.workTimeEnd = data.workTimeEnd ? moment(data.workTimeEnd).format("HH:mm:ss") : " - ";
    });

    this.workingHoursObservable = this.firebaseService.getWorkingHours();
    this.workingHoursObservableSubscription = this.workingHoursObservable.subscribe(data => {
      this.overallWorkingHours = data.$value;
    });
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
    this.firebaseService.saveStartWorkTime(moment().format("YYYY-MM-DD"), moment().format());
    this.helper.showToast("Neue Kommtzeit erfasst", 3000);
  }

  private saveEndWorkTime() {
    this.firebaseService.saveEndWorkTime(moment().format("YYYY-MM-DD"), moment().format());
    this.helper.showToast("Neue Gehtzeit erfasst", 3000);
  }

  signOut() {
    this.firebaseService.signOut();
  }

  editWorkingHoursManually() {
    let prompt = this.alertCtrl.create({
      title: "Neuen Wert für das Arbeitszeitkonto setzen",
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
            // console.log('Saved clicked with data: ' + JSON.stringify(data));
            this.firebaseService.saveWorkingHours(data.arbeitszeit);
          }
        }
      ]
    });
    prompt.present();
  }

  addWorkTimeManually() {
    this.modalCtrl.create(AddWorkTimeModal).present();
  }


}
