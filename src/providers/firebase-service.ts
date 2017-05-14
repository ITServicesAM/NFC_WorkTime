import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import * as firebase from 'firebase/app';
import {Observable} from 'rxjs/Observable';
import {Platform} from 'ionic-angular';
import {GooglePlus} from '@ionic-native/google-plus';
import {HelperService} from './helper-service';
import * as moment from'moment';

@Injectable()
export class FirebaseService {

  private authState: Observable<firebase.User>;

  constructor(private afAuth: AngularFireAuth,
              private afDB: AngularFireDatabase,
              private platform: Platform,
              private google: GooglePlus,
              private helper: HelperService) {
    this.authState = afAuth.authState;
  }

  isAuthenticated(): Observable<firebase.User> {
    return this.authState;
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

  saveStartWorkTime(dateKey: string, startWorkTime: string): firebase.Promise<any> {
    // console.log(moment(dateKey).format());
    this.afDB.object("workTimes/" + this.afAuth.auth.currentUser.uid + "/" + dateKey + "/ReverseOrderDate").set((0 - moment(dateKey).valueOf()));
    return this.afDB.object("workTimes/" + this.afAuth.auth.currentUser.uid + "/" + dateKey + "/workTimeStart").set(startWorkTime);
  }

  getWorkTime(dateKey: string) {
    return this.afDB.object("workTimes/" + this.afAuth.auth.currentUser.uid + "/" + dateKey);
  }

  getStartWorkTime(date: string): FirebaseObjectObservable<any> {
    return this.afDB.object("workTimes/" + this.afAuth.auth.currentUser.uid + "/" + date + "/workTimeStart");
  }

  saveEndWorkTime(date: string, endWorkTime: string): firebase.Promise<any> {
    return this.afDB.object("workTimes/" + this.afAuth.auth.currentUser.uid + "/" + date + "/workTimeEnd").set(endWorkTime);
  }

  getEndWorkTime(date: string): FirebaseObjectObservable<any> {
    return this.afDB.object("workTimes/" + this.afAuth.auth.currentUser.uid + "/" + date + "/workTimeEnd");
  }

  getWorkingHours(): FirebaseObjectObservable<any> {
    return this.afDB.object("overTimeBudgets/" + this.afAuth.auth.currentUser.uid + "/overTimeBudget");
  }

  saveWorkingHours(workingHours: string) {
    this.afDB.object("overTimeBudgets/" + this.afAuth.auth.currentUser.uid + "/overTimeBudget").set(workingHours);
  }

  getAllWorkTimes(): FirebaseListObservable<any> {
    return this.afDB.list("workTimes/" + this.afAuth.auth.currentUser.uid + "/", {
      query: {
        orderByChild: 'ReverseOrderDate',
      }
    });
  }

  deleteWorkTime(dateKey: string) {
    this.afDB.object("workTimes/" + this.afAuth.auth.currentUser.uid + "/" + dateKey).remove();
  }
}
