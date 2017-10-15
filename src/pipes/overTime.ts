import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'overTime'})
export class OverTimePipe implements PipeTransform {
  transform(value: number): string | number {
    // console.log(`OverTimePipeValue was: ${JSON.stringify(value)}`);
    let overTimeString = "";

    //Get hours from milliseconds
    let hours = ((Math.abs(value)) / 60);
    let absoluteHours = Math.floor(hours);

    //Get remainder from hours and convert to minutes
    let minutesInHours = Math.abs(value) - (absoluteHours * 60);
    let absoluteMinutesInHours = Math.floor(minutesInHours);

    if (absoluteHours > 0 && absoluteHours < 10) {
      overTimeString = `0${absoluteHours}`;
    } else if (absoluteHours > 0) {
      overTimeString = `${absoluteHours}`;
    } else {
      overTimeString = '00';
    }

    if (absoluteMinutesInHours > 0 && absoluteMinutesInHours < 10) {
      overTimeString = `${overTimeString}:0${absoluteMinutesInHours}`;
    } else if (absoluteMinutesInHours > 9) {
      overTimeString = `${overTimeString}:${absoluteMinutesInHours}`;
    } else {
      overTimeString = `${overTimeString}:00`;
    }

    // if (absoluteMinutesInHours > 0) {
    //   overTimeString = overTimeString + " und " + absoluteMinutesInHours+" Minuten";
    // }

    if (value < 0)
      overTimeString = `- ${overTimeString}`;

    return overTimeString;
  }
}
