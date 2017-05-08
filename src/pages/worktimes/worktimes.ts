import {Component} from '@angular/core';
import {FirebaseService} from '../../providers/firebase-service';
import {WorkTime} from '../../models/worktime';
import {moveInLeft} from '../../animations/animations';
import {AlertController} from 'ionic-angular';
import * as moment from'moment';

@Component({
  selector: 'page-about',
  templateUrl: 'worktimes.html',
  animations: [moveInLeft()]
})
export class WorkTimesPage {

  workTimes: WorkTime[] = [];

  constructor(private firebaseService: FirebaseService,
              private alertCtrl: AlertController) {
  }

  ionViewDidEnter() {
    this.firebaseService.getAllWorkTimes()
      .subscribe(snapShots => {
        this.workTimes = [];
        snapShots.forEach(snapShot => {
          // console.log(snapShot.key);
          // console.log(snapShot.val());
          this.workTimes.push(new WorkTime(snapShot.val().Kommtzeit, snapShot.val().Gehtzeit));
        });
      });
  }

  signOut() {
    this.firebaseService.signOut();
  }

  kommtZeitChanged($event, workTime) {
    let curDate = moment()
      .date($event.day)
      .hour($event.hour)
      .minute($event.minute)
      .month($event.month - 1)
      .second($event.second)
      .year($event.year);
    this.firebaseService.saveStartWorkTime(curDate.format("YYYY-MM-DD"), curDate.format());
  }

  gehtZeitChanged($event, workTime) {
    let curDate = moment()
      .date($event.day)
      .hour($event.hour)
      .minute($event.minute)
      .month($event.month - 1)
      .second($event.second)
      .year($event.year);
    this.firebaseService.saveEndWorkTime(curDate.format("YYYY-MM-DD"), curDate.format());
  }

  editWorkTime(workTime: WorkTime) {
    let prompt = this.alertCtrl.create({
      title: 'Arbeitszeit bearbeiten',
      inputs: [
        {
          name: 'kommtZeit',
          placeholder: 'Kommtzeit',
          value: workTime.getKommtzeit()
        },
        {
          name: 'gehtZeit',
          placeholder: 'Gehtzeit',
          value: workTime.getGehtzeit()
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
            // this.firebaseService.saveStartWorkTime(new Date(), new Date)
            // this.firebaseService.saveWorkingHours(data.arbeitszeit);
          }
        }
      ]
    });
    prompt.present();
  }

  deleteWorkTime(workTime: WorkTime) {
    let alert = this.alertCtrl.create({
      title: 'Arbeitszeit löschen?',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel'
        },
        {
          text: 'Jep!',
          handler: () => {
            this.firebaseService.deleteWorkTime(moment(workTime.workTimeStart).format("YYYY-MM-DD"));
          }
        }
      ]
    });

    alert.present();
  }

}
