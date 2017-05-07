import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {AngularFireAuth} from "angularfire2/auth";
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2/database";
import * as firebase from "firebase/app";
import {Observable} from "rxjs/Observable";
import {Platform} from "ionic-angular";
import {GooglePlus} from "@ionic-native/google-plus";
import {HelperService} from "./helper-service";
import {WorkTime} from "../models/worktime";

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

  saveStartWorkTime(startWorkTime: string): firebase.Promise<any> {
    return this.afDB.object("arbeitszeiten/" + this.getDBDateString() + "/Kommtzeit").set(startWorkTime);
  }

  getStartWorkTime(): FirebaseObjectObservable<any> {
    return this.afDB.object("arbeitszeiten/" + this.getDBDateString() + "/Kommtzeit");
  }

  saveEndWorkTime(endWorkTime: string): firebase.Promise<any> {
    return this.afDB.object("arbeitszeiten/" + this.getDBDateString() + "/Gehtzeit").set(endWorkTime);
  }

  getEndWorkTime(): FirebaseObjectObservable<any> {
    return this.afDB.object("arbeitszeiten/" + this.getDBDateString() + "/Gehtzeit");
  }

  getWorkingHours(): FirebaseObjectObservable<any> {
    return this.afDB.object("arbeitszeitkonto");
  }

  saveWorkingHours(workingHours: string) {
    this.afDB.object("arbeitszeitkonto").set(workingHours);
  }

  getAllWorkTimes(): FirebaseListObservable<WorkTime[]> {
    return this.afDB.list("arbeitszeiten", {
      query: {
        orderByKey: true,
      }
    });
  }

  getDBDateString(): string {
    let todayDate = new Date().toISOString();
    let endIndex = todayDate.indexOf("T");
    return todayDate.slice(0, endIndex);
  }

}
