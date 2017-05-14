import {Component} from '@angular/core';
import {FirebaseService} from '../../providers/firebase-service';
import {WorkTime} from '../../models/worktime';
import {moveInLeft} from '../../animations/animations';
import {AlertController} from 'ionic-angular';
import * as moment from'moment';
import {FirebaseListObservable} from 'angularfire2/database';

@Component({
  selector: 'page-about',
  templateUrl: 'worktimes.html',
  animations: [moveInLeft()]
})
export class WorkTimesPage {

  // workTimes: WorkTime[] = [];
  workTimesObservable: FirebaseListObservable<WorkTime[]>;

  constructor(private firebaseService: FirebaseService,
              private alertCtrl: AlertController) {
    this.workTimesObservable = this.firebaseService.getAllWorkTimes();
    // console.log(this.workTimesObservable);
  }

  signOut() {
    this.workTimesObservable = null;
    this.firebaseService.signOut();
  }

  workTimeStartChanged($event) {
    let curDate = moment()
      .date($event.day)
      .hour($event.hour)
      .minute($event.minute)
      .month($event.month - 1)
      .second($event.second)
      .year($event.year);
    this.firebaseService.saveStartWorkTime(curDate.format("YYYY-MM-DD"), curDate.format());
  }

  workTimeEndChanged($event) {
    let curDate = moment()
      .date($event.day)
      .hour($event.hour)
      .minute($event.minute)
      .month($event.month - 1)
      .second($event.second)
      .year($event.year);
    this.firebaseService.saveEndWorkTime(curDate.format("YYYY-MM-DD"), curDate.format());
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
