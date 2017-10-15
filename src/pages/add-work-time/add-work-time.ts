import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import * as moment from 'moment';
import {FirebaseService} from '../../providers/firebase-service';

@IonicPage()
@Component({
  selector: 'page-add-work-time',
  templateUrl: 'add-work-time.html',
})
export class AddWorkTimePage {

  date: string;
  workTimeStart: string;
  workTimeEnd: string;

  constructor(public navCtrl: NavController,
              private firebaseService: FirebaseService) {
    moment.locale('de-DE');
    this.date = moment().format();
    // console.log(`date is: ${this.date}`);
    this.workTimeStart = moment().hour(8).minutes(0).format();
    this.workTimeEnd = moment().hour(17).minutes(0).format();
  }

  saveWorkTime() {
    let chosenDate: string = moment(this.date).format("YYYY-MM-DD");
    let chosenWorkTimeStart = `${chosenDate}${moment(this.workTimeStart).format().substring(10)}`;
    let chosenWorkTimeEnd = `${chosenDate}${moment(this.workTimeEnd).format().substring(10)}`;
    this.firebaseService.saveWorkTime(chosenDate, chosenWorkTimeStart, chosenWorkTimeEnd)
      .then(() => this.navCtrl.pop())
      .catch(error => console.log(error));
  }
}
