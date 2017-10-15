import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {Platform} from 'ionic-angular';
import {GooglePlus} from '@ionic-native/google-plus';
import {HelperService} from './helper-service';
import * as moment from 'moment';
import {Moment} from 'moment';
import {AfoListObservable, AfoObjectObservable, AngularFireOfflineDatabase} from 'angularfire2-offline';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class FirebaseService {

  constructor(private afAuth: AngularFireAuth,
              private afOfDB: AngularFireOfflineDatabase,
              private platform: Platform,
              private google: GooglePlus,
              private helper: HelperService) {
  }

  isAuthenticated(): Observable<firebase.User> {
    return this.afAuth.authState;
  }

  signInWithGoogle(): void {
    if (this.platform.is('cordova')) {
      this.google.login({'webClientId': '8111052943-9kskkbgnalu66et40r4ru482f21jgio7.apps.googleusercontent.com'})
        .then(res => {
          const googleCredential = firebase.auth.GoogleAuthProvider.credential(res.idToken);
          firebase.auth().signInWithCredential(googleCredential)
            .catch(err => this.helper.printError(FirebaseService.name, err));
        }).catch(err => this.helper.printError(FirebaseService.name, err));
    } else {
      let googleProvider = new firebase.auth.GoogleAuthProvider();
      googleProvider.setCustomParameters({
        prompt: 'select_account',
      });
      this.afAuth.auth.signInWithPopup(googleProvider)
        .catch(err => this.helper.printError(FirebaseService.name, err));
    }
  }

  signOut() {
    this.afAuth.auth.signOut();
  }

  saveStartWorkTime(dateObj: Moment): firebase.Promise<any> {
    let dateKey: string = dateObj.format("YYYY-MM-DD");
    let workTimeStart: string = dateObj.format();

    // console.log(moment(dateKey).format());
    let updates = {};
    updates[`/reverseOrderDate`] = (0 - moment(dateKey).valueOf());
    updates[`/date`] = dateKey;
    updates[`/workTimeStart`] = workTimeStart;

    return this.afOfDB.object(`workTimes/${this.afAuth.auth.currentUser.uid}/${dateKey}`).update(updates)
      .then(() => {
        this.calculateOverTimeBudget(dateKey);
      });
  }

  getWorkTime(dateKey: string) {
    return this.afOfDB.object(`workTimes/${this.afAuth.auth.currentUser.uid}/${dateKey}`);
  }

  saveEndWorkTime(dateObj: Moment): firebase.Promise<any> {
    let dateKey: string = dateObj.format("YYYY-MM-DD");
    let workTimeEnd: string = dateObj.format();

    // console.log(moment(dateKey).format());
    let updates = {};
    updates[`/date`] = dateKey;
    updates[`/workTimeEnd`] = workTimeEnd;

    return this.afOfDB.object(`workTimes/${this.afAuth.auth.currentUser.uid}/${dateKey}`).update(updates)
      .then(() => {
        this.calculateOverTimeBudget(dateKey);
      });
  }

  saveWorkTime(dateKey: string, workTimeStart: string, workTimeEnd: string): firebase.Promise<any> {
    let updates = {};
    updates[`/reverseOrderDate`] = (0 - moment(dateKey).valueOf());
    updates[`/date`] = dateKey;
    updates[`/workTimeStart`] = workTimeStart;
    updates[`/workTimeEnd`] = workTimeEnd;

    return this.afOfDB.object(`workTimes/${this.afAuth.auth.currentUser.uid}/${dateKey}`).update(updates)
      .then(() => {
        this.calculateOverTimeBudget(dateKey);
      });
  }

  getWorkingHours(): AfoObjectObservable<any> {
    return this.afOfDB.object("overTimeBudgets/" + this.afAuth.auth.currentUser.uid + "/overTimeBudget");
  }

  saveWorkingHours(workingHours: number) {
    this.afOfDB.object("overTimeBudgets/" + this.afAuth.auth.currentUser.uid + "/overTimeBudget").set(workingHours);
  }

  getAllWorkTimes(): AfoListObservable<any> {
    return this.afOfDB.list("workTimes/" + this.afAuth.auth.currentUser.uid + "/", {
      query: {
        orderByChild: 'reverseOrderDate',
      }
    });
  }

  async deleteWorkTime(dateKey: string) {
    let workingHoursObj = await firebase.database()
      .ref("workTimes/" + this.afAuth.auth.currentUser.uid + "/" + dateKey + "/workingMinutesOverTime").once('value');
    let workingHours = workingHoursObj.val();
    let overallWorkingHoursObj = await firebase.database()
      .ref("overTimeBudgets/" + this.afAuth.auth.currentUser.uid + "/overTimeBudget").once('value');
    let overallWorkingHours = overallWorkingHoursObj.val();

    let newValue: number = overallWorkingHours - workingHours;

    // console.log(workingHoursObj.val() + "  " + overallWorkingHoursObj.val() + "   " + newValue);
    this.afOfDB.object("overTimeBudgets/" + this.afAuth.auth.currentUser.uid + "/overTimeBudget").set(newValue);
    this.afOfDB.object("workTimes/" + this.afAuth.auth.currentUser.uid + "/" + dateKey).remove();
  }

  async calculateOverTimeBudget(dateKey: string) {
    let workTimeObj = await firebase.database().ref("workTimes/" + this.afAuth.auth.currentUser.uid + "/" + dateKey).once('value');
    let workTimeStart = workTimeObj.val().workTimeStart;
    let workTimeEnd = workTimeObj.val().workTimeEnd;

    if (workTimeStart && workTimeEnd) {
      let workingMinutesOverTimeOld: number = workTimeObj.val().workingMinutesOverTime;
      let milliseconds = moment(workTimeEnd).valueOf() - moment(workTimeStart).valueOf();

      if (milliseconds > 0) {
        //get minutes form milliseconds
        let minutes = milliseconds / (1000 * 60);
        let workingMinutesBrutto: number = Math.floor(minutes);
        // console.log("all minutes in the duration: " + workingMinutesRaw);

        let workingMinutesPause: number = 0;
        if (Math.floor(workingMinutesBrutto / 60) < 6) {
          // console.log("Keine Pause");
        } else if (Math.floor(workingMinutesBrutto / 60) === 6 && (((workingMinutesBrutto / 60) - (Math.floor(workingMinutesBrutto / 60))) * 60) > 0) {
          workingMinutesPause = 30;
          // console.log("30 minuten Pause");
        } else if (Math.floor(workingMinutesBrutto / 60) > 6 && Math.floor(workingMinutesBrutto / 60) < 9) {
          workingMinutesPause = 30;
          // console.log("30 minuten Pause");
        } else if (Math.floor(workingMinutesBrutto / 60) === 9 && (((workingMinutesBrutto / 60) - (Math.floor(workingMinutesBrutto / 60))) * 60) > 0) {
          workingMinutesPause = 45;
          // console.log("45 minuten Pause");
        } else if (Math.floor(workingMinutesBrutto / 60) > 9) {
          workingMinutesPause = 45;
          // console.log("45 minuten Pause");
        }

        let defaultWorkingMinutesPerDay: number = 480; //entspricht 8:30 Stunden
        let workingMinutesNetto: number = workingMinutesBrutto - workingMinutesPause;
        let workingMinutesOverTimeNew: number = workingMinutesNetto - defaultWorkingMinutesPerDay;

        workTimeObj.ref.child("workingMinutesBrutto").set(workingMinutesBrutto);
        workTimeObj.ref.child("workingMinutesPause").set(workingMinutesPause);
        workTimeObj.ref.child("workingMinutesNetto").set(workingMinutesNetto);
        workTimeObj.ref.child("workingMinutesOverTime").set(workingMinutesOverTimeNew);

        //CALCULATE ADDITION OR SUBTRACTION TO WORKING_HOURS_BUDGET
        let overTimeBudgetObj = await firebase.database().ref("overTimeBudgets/" + this.afAuth.auth.currentUser.uid + "/overTimeBudget").once('value');
        let overTimeBudget: number = Number(overTimeBudgetObj.val()); //value in minutes

        let newOverTimeBudget: number = 0;
        if (!workingMinutesOverTimeOld) {
          newOverTimeBudget = overTimeBudget + workingMinutesOverTimeNew;
        } else {
          let valueChange: number = workingMinutesOverTimeNew - workingMinutesOverTimeOld;
          console.log("ValueChange: " + valueChange);
          newOverTimeBudget = overTimeBudget + valueChange;
        }

        firebase.database().ref("overTimeBudgets/" + this.afAuth.auth.currentUser.uid + "/overTimeBudget").set(newOverTimeBudget);
      }
    }
    // console.log("workTime: " + workTimeObj.val().workTimeEnd);
  }
}
