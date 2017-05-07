import {Component} from "@angular/core";
import {MenuController} from "ionic-angular";
import {FirebaseService} from "../../providers/firebase-service";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(private menuCtrl: MenuController,
              private firebaseService: FirebaseService) {
  }

  signInWithGoogle(): void {
    this.firebaseService.signInWithGoogle();
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ionViewWillLeave() {
    this.menuCtrl.enable(true);
  }

}
