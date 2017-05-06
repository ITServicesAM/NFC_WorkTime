import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {Observable} from 'rxjs/Observable';
import {Platform} from 'ionic-angular';
import {GooglePlus} from '@ionic-native/google-plus';

/*
 Generated class for the FirebaseService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class FirebaseService {

  private authState: Observable<firebase.User>;
  private currentUser: firebase.User;


  constructor(private afAuth: AngularFireAuth,
              private platform: Platform,
              private google: GooglePlus) {
    this.authState = afAuth.authState;
    this.authState.subscribe((user: firebase.User) => {
      this.currentUser = user;
    });
  }

  get authenticated(): boolean {
    return this.currentUser !== null;
  }

  signInWithGoogle(): void {
    if (this.platform.is('cordova')) {
      this.google.login({'webClientId': '1021740552809-9stl2bj35in5rk7l39mh7atueohu2o69.apps.googleusercontent.com'})
        .then(res => {
          const googleCredential = firebase.auth.GoogleAuthProvider.credential(res.idToken);
          firebase.auth().signInWithCredential(googleCredential)
            .catch(err => this.printError(err));
        }).catch(err => this.printError(err));
    } else {
      let googleProvider = new firebase.auth.GoogleAuthProvider();
      googleProvider.setCustomParameters({
        prompt: 'select_account',
      });
      this.afAuth.auth.signInWithPopup(googleProvider)
        .catch(err => this.printError(err));
    }
  }

}
