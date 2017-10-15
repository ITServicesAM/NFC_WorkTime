import {ErrorHandler, LOCALE_ID, NgModule} from "@angular/core";
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
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SuperTabsModule} from 'ionic2-super-tabs';
import {OverTimePipe} from '../pipes/overTime';
import {AngularFireOfflineModule} from 'angularfire2-offline';
import {AddWorkTimePageModule} from '../pages/add-work-time/add-work-time.module';
import {ExpandableComponentModule} from '../components/expandable/expandable.module';

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
    LoginPage,
    OverTimePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    // IonicModule.forRoot(MyApp),
    IonicModule.forRoot(MyApp, {
      monthNames: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
        'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
      monthShortNames: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun',
        'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
      dayNames: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
      dayShortNames: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
    }),
    SuperTabsModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireOfflineModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AddWorkTimePageModule,
    ExpandableComponentModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WorkTimesPage,
    WorkingHoursPage,
    TabsPage,
    LoginPage,
  ],
  providers: [
    {provide: LOCALE_ID, useValue: "de-DE"}, //replace "de-DE" with your locale
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
