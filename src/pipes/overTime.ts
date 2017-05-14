import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'overTime'})
export class OverTimePipe implements PipeTransform {
  transform(value: number): string {

    let overTimeString = "";

    //Get hours from milliseconds
    let hours = (value / 60);
    let absoluteHours = Math.floor(hours);

    //Get remainder from hours and convert to minutes
    let minutesInHours = (hours - absoluteHours) * 60;
    let absoluteMinutesInHours = Math.floor(minutesInHours);

    if (absoluteHours > 0) {
      overTimeString = absoluteHours + "";
    }

    if (absoluteMinutesInHours === 0) {
      overTimeString = overTimeString + ":00";
    } else if (absoluteMinutesInHours < 10) {
      overTimeString = overTimeString + ":0" + absoluteMinutesInHours;
    } else {
      overTimeString = overTimeString + ":" + absoluteMinutesInHours;
    }

    return overTimeString;
  }
}
