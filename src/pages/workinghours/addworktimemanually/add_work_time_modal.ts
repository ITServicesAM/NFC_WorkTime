import {ViewController} from 'ionic-angular';
import {Component} from '@angular/core';
import * as moment from 'moment';
import {FirebaseService} from '../../../providers/firebase-service';
import {WorkTime} from '../../../models/worktime';

@Component({
  templateUrl: 'add_work_time_modal.html'
})
export class AddWorkTimeModal {
  //true means: Kommtzeit | false means: Gehtzeit
  workTimeStartChecked: boolean;
  workTime: string;
  workTimeStart: string = " - ";
  workTimeEnd: string = " - ";

  constructor(private viewCtrl: ViewController,
              private firebaseService: FirebaseService) {

    this.workTimeStartChecked = true;
    this.workTime = moment().format();

    this.firebaseService.getWorkTime(moment().format("YYYY-MM-DD")).subscribe((data: WorkTime) => {
      if (data.workTimeStart) {
        this.workTimeStart = moment(data.workTimeStart).format();
        this.workTime = this.workTimeStart;
      }
      this.workTimeEnd = data.workTimeEnd ? moment(data.workTimeEnd).format() : " - ";
    });
  }

  save() {
    if (this.workTimeStartChecked)
      this.firebaseService.saveStartWorkTime(moment(this.workTime).format("YYYY-MM-DD"), moment(this.workTime).format())
        .catch(err => console.log(err));
    else
      this.firebaseService.saveEndWorkTime(moment(this.workTime).format("YYYY-MM-DD"), moment(this.workTime).format())
        .catch(err => console.log(err));

    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  selectionChangedEvent(event) {
    // this.workTimeStartChecked = !this.workTimeStartChecked;
    // console.log(event);
    if (this.workTimeStartChecked && this.workTimeStart !== " - ")
      this.workTime = this.workTimeStart;
    else if (!this.workTimeStartChecked && this.workTimeEnd !== " - ")
      this.workTime = this.workTimeEnd;
  }
}

