import {Component} from "@angular/core";
import {Platform} from "ionic-angular";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";

import {TabsPage} from "../pages/tabs/tabs";
import {FirebaseService} from "../providers/firebase-service";
import {LoginPage} from "../pages/login/login";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(private firebaseService: FirebaseService,
              platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
    });

    this.firebaseService.isAuthenticated().subscribe(user => {
      splashScreen.hide();
      if (user === null) {
        this.rootPage = LoginPage;
      } else {
        this.rootPage = TabsPage;
      }
    });
  }
}
