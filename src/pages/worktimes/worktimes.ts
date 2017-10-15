import {Component} from '@angular/core';
import {FirebaseService} from '../../providers/firebase-service';
import {WorkTime} from '../../models/worktime';
import {moveInLeft} from '../../animations/animations';
import {AlertController, NavController} from 'ionic-angular';
import * as moment from 'moment';
import {AfoListObservable, AfoObjectObservable} from 'angularfire2-offline';
import {AddWorkTimePage} from '../add-work-time/add-work-time';

@Component({
  selector: 'page-about',
  templateUrl: 'worktimes.html',
  animations: [moveInLeft()]
})
export class WorkTimesPage {

  workTimes$: AfoListObservable<WorkTime[]>;
  workingHours$: AfoObjectObservable<any>;

  constructor(private firebaseService: FirebaseService,
              private alertCtrl: AlertController,
              private nav: NavController) {
    this.workTimes$ = this.firebaseService.getAllWorkTimes();
    this.workingHours$ = this.firebaseService.getWorkingHours();
  }

  signOut() {
    this.firebaseService.signOut();
  }

  workTimeStartChanged($event, workTime: WorkTime) {
    // console.log($event + " and " + JSON.stringify(workTime));
    let curDate = moment(Math.abs(workTime.reverseOrderDate));
    curDate.set('hour', $event.hour);
    curDate.set('minute', $event.minute);
    curDate.set('second', $event.second);
    // console.log(curDate.format());
    this.firebaseService.saveStartWorkTime(curDate);
  }

  workTimeEndChanged($event, workTime?: WorkTime) {
    console.log($event);
    let curDate = moment(Math.abs(workTime.reverseOrderDate));
    curDate.set('hour', $event.hour);
    curDate.set('minute', $event.minute);
    curDate.set('second', $event.second);
    console.log(`CurDate: ${curDate.format()}`);
    this.firebaseService.saveEndWorkTime(curDate);
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

  addWorkTime() {
    this.nav.push(AddWorkTimePage);
  }
}
