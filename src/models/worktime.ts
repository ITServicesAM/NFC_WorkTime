export class WorkTime {
  workTimeStart: string;
  workTimeEnd: string;
  workingMinutesBrutto: number;
  workingMinutesNetto: number;
  workingMinutesOverTime: number;
  workingMinutesPause: number;

  constructor(workTimeStart: string, workTimeEnd: string) {
    this.workTimeStart = workTimeStart;
    this.workTimeEnd = workTimeEnd;
  }
}
