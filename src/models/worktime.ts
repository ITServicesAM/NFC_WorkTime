export class WorkTime {
  date: string;
  workTimeStart: string;
  workTimeEnd: string;
  workingMinutesBrutto: number;
  workingMinutesNetto: number;
  workingMinutesOverTime: number;
  workingMinutesPause: number;
  reverseOrderDate: number;

  constructor(workTimeStart: string, workTimeEnd: string) {
    this.workTimeStart = workTimeStart;
    this.workTimeEnd = workTimeEnd;
  }
}
