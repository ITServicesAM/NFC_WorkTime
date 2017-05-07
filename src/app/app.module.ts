import {ErrorHandler, NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";
import {MyApp} from "./app.component";

import {WorkTimesPage} from "../pages/worktimes/worktimes";
import {WorkingHoursPage} from "../pages/workinghours/workinghours";
import {TabsPage} from "../pages/tabs/tabs";

import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {Ndef, NFC} from "@ionic-native/nfc";
import {Vibration} from "@ionic-native/vibration";
import {AngularFireModule} from "angularfire2";
import {AngularFireAuthModule} from "angularfire2/auth";
import {AngularFireDatabaseModule} from "angularfire2/database";
import {LoginPage} from "../pages/login/login";
import {FirebaseService} from "../providers/firebase-service";
import {HelperService} from "../providers/helper-service";
import {GooglePlus} from "@ionic-native/google-plus";

export const firebaseConfig = {
  apiKey: "AIzaSyArPv8jzIq2Y8QzY3_RN_k7LS95_MZaNjw",
  authDomain: "nfc-worktime-manager.firebaseapp.com",
  databaseURL: "https://nfc-worktime-manager.firebaseio.com",
  projectId: "nfc-worktime-manager",
  storageBucket: "nfc-worktime-manager.appspot.com",
  messagingSenderId: "8111052943"
};

@NgModule({
  declarations: [
    MyApp,
    WorkTimesPage,
    WorkingHoursPage,
    TabsPage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WorkTimesPage,
    WorkingHoursPage,
    TabsPage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    NFC,
    Vibration,
    Ndef,
    FirebaseService,
    HelperService,
    GooglePlus
  ]
})
export class AppModule {
}
