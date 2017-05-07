import {Component} from "@angular/core";
import {FirebaseService} from "../../providers/firebase-service";
import {WorkTime} from "../../models/worktime";
import {FirebaseListObservable} from "angularfire2/database";

@Component({
  selector: 'page-about',
  templateUrl: 'worktimes.html'
})
export class WorkTimesPage {

  worktimes: WorkTime[];
  workTimesObservable: FirebaseListObservable<WorkTime[]>;

  constructor(private firebaseService: FirebaseService) {
    this.workTimesObservable = this.firebaseService.getAllWorkTimes();
    //   .subscribe((data:WorkTime[]) => {
    //   this.worktimes = data;
    //   console.log("WorkTimesList: " + JSON.stringify(data));
    // });
  }

  signOut() {
    this.firebaseService.signOut();
  }

}
