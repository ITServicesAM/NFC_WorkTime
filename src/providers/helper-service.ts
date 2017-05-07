import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {ToastController} from "ionic-angular";

@Injectable()
export class HelperService {

  pauseDurationMinutes: number = 30;

  constructor(private toastCtrl: ToastController) {
  }

  printError(tag: string, err: any, duration?: number) {
    console.log(tag + ': ' + JSON.stringify(err));
    this.showToast(JSON.stringify(err), duration ? duration : 4000);
  }

  showToast(message, duration: number) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: 'bottom'
    });
    toast.present();
  }

  msToTime(milliseconds: number): string {
    //get minutes form milliseconds
    let minutes = milliseconds / (1000 * 60);
    let absoluteMinutes = Math.floor(minutes);
    // console.log("all minutes in the duration: " + absoluteMinutes);

    let pauseMinutes = 0;
    if (Math.floor(absoluteMinutes / 60) < 6) {
      console.log("Keine Pause");
    } else if (Math.floor(absoluteMinutes / 60) === 6 && (((absoluteMinutes / 60) - (Math.floor(absoluteMinutes / 60))) * 60) > 0) {
      pauseMinutes = 30;
      console.log("30 minuten Pause");
    } else if (Math.floor(absoluteMinutes / 60) > 6 && Math.floor(absoluteMinutes / 60) < 9) {
      pauseMinutes = 30;
      console.log("30 minuten Pause");
    } else if (Math.floor(absoluteMinutes / 60) === 9 && (((absoluteMinutes / 60) - (Math.floor(absoluteMinutes / 60))) * 60) > 0) {
      pauseMinutes = 45;
      console.log("45 minuten Pause");
    } else if (Math.floor(absoluteMinutes / 60) > 9) {
      pauseMinutes = 45;
      console.log("45 minuten Pause");
    }

    //Get hours from milliseconds
    let hours = (milliseconds - (pauseMinutes * 60 * 1000)) / (1000 * 60 * 60);
    let absoluteHours = Math.floor(hours);
    let h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;

    //Get remainder from hours and convert to minutes
    let minutesInHours = (hours - absoluteHours) * 60;
    let absoluteMinutesInHours = Math.floor(minutesInHours);
    let m = absoluteMinutesInHours > 9 ? absoluteMinutesInHours : '0' + absoluteMinutesInHours;

    console.log(milliseconds + " " + absoluteMinutesInHours + " Minuten");
    console.log(milliseconds + " " + absoluteHours + " Stunden");

    let returnText: string = null;
    if (absoluteHours > 0 || absoluteMinutesInHours > 0) {
      returnText = (absoluteHours > 0 ? absoluteHours + " Stunden " : "") + absoluteMinutesInHours + " Minuten";
    }

    return returnText;
  }
}
