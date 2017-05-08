import {ViewController} from 'ionic-angular';
import {Component, OnInit} from '@angular/core';
import * as moment from 'moment';
import {FirebaseService} from '../../providers/firebase-service';

@Component({
  templateUrl: 'add_work_time_modal.html'
})
export class AddWorkTimeModal implements OnInit {
  ngOnInit(): void {
    this.workTimeStartChecked = true;
    this.workTime = moment().format();
  }


  //true means: Kommtzeit | false means: Gehtzeit
  workTimeStartChecked: boolean;
  workTime: string;
  workTimeStart: string;
  workTimeEnd: string;

  constructor(private viewCtrl: ViewController,
              private firebaseService: FirebaseService) {
    // this.firebaseService.getStartWorkTime(moment().format("YYYY-MM-DD")).subscribe(data => {
    //   if (data.$value)
    //     this.workTimeStart = data.$value;
    //   if (this.workTimeStart)
    //     this.workTime = this.workTimeStart;
    // }).unsubscribe();
    // this.firebaseService.getEndWorkTime(moment().format("YYYY-MM-DD"))
    //   .subscribe(data => {
    //     if (data.$value)
    //       this.workTimeEnd = data.$value
    //   }).unsubscribe();
  }

  // ionViewDidEnter() {
  //   this.workTimeStartChecked = true;
  // }

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
    console.log(event);
    // if (this.workTimeStartChecked && this.workTimeStart)
    //   this.workTime = this.workTimeStart;
    // else if (!this.workTimeStartChecked && this.workTimeEnd)
    //   this.workTime = this.workTimeEnd;
  }
}

