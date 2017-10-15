import {Component} from "@angular/core";
import {Platform} from "ionic-angular";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import * as firebase from 'firebase/app';

import {TabsPage} from "../pages/tabs/tabs";
import {FirebaseService} from "../providers/firebase-service";
import {LoginPage} from "../pages/login/login";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(private firebaseService: FirebaseService,
              private platform: Platform,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if (this.platform.is('android')) {
        this.statusBar.backgroundColorByHexString("#34515e");
      } else {
        this.statusBar.styleDefault();
      }
    });

    // if (this.platform.is('cordova'))
    //   this.splashScreen.hide();

    this.firebaseService.isAuthenticated().subscribe((user: firebase.User) => {
      if (this.platform.is('cordova'))
        this.splashScreen.hide();
      if (user == null)
        this.rootPage = LoginPage;
      else {
        this.rootPage = TabsPage;
      }
    });
  }
}
