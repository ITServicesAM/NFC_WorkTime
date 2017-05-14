"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const moment = require("moment");
admin.initializeApp(functions.config().firebase);
exports.calculateOverTimeBudgetStartChange = functions.database.ref('workTimes/{uID}/{dateKey}/workTimeStart')
    .onWrite((event) => __awaiter(this, void 0, void 0, function* () {
    let snap = event.data;
    snap.ref.parent.once('value').then(snap2 => {
        let workTimeStart = snap2.val().workTimeStart;
        let workTimeEnd = snap2.val().workTimeEnd;
        let workingMinutesOverTimeOld = snap2.val().workingMinutesOverTime;
        let milliseconds = -1;
        if (workTimeStart && workTimeEnd) {
            milliseconds = moment(workTimeEnd).valueOf() - moment(workTimeStart).valueOf();
        }
        // console.log("Calculated milliseconds: " + milliseconds);
        if (milliseconds > 0) {
            //get minutes form milliseconds
            let minutes = milliseconds / (1000 * 60);
            let workingMinutesBrutto = Math.floor(minutes);
            // console.log("all minutes in the duration: " + workingMinutesRaw);
            let workingMinutesPause = 0;
            if (Math.floor(workingMinutesBrutto / 60) < 6) {
                // console.log("Keine Pause");
            }
            else if (Math.floor(workingMinutesBrutto / 60) === 6 && (((workingMinutesBrutto / 60) - (Math.floor(workingMinutesBrutto / 60))) * 60) > 0) {
                workingMinutesPause = 30;
                // console.log("30 minuten Pause");
            }
            else if (Math.floor(workingMinutesBrutto / 60) > 6 && Math.floor(workingMinutesBrutto / 60) < 9) {
                workingMinutesPause = 30;
                // console.log("30 minuten Pause");
            }
            else if (Math.floor(workingMinutesBrutto / 60) === 9 && (((workingMinutesBrutto / 60) - (Math.floor(workingMinutesBrutto / 60))) * 60) > 0) {
                workingMinutesPause = 45;
                // console.log("45 minuten Pause");
            }
            else if (Math.floor(workingMinutesBrutto / 60) > 9) {
                workingMinutesPause = 45;
                // console.log("45 minuten Pause");
            }
            let defaultWorkingMinutesPerDay = 480; //entspricht 8:30 Stunden
            let workingMinutesNetto = workingMinutesBrutto - workingMinutesPause;
            let workingMinutesOverTimeNew = workingMinutesNetto - defaultWorkingMinutesPerDay;
            snap2.ref.child("workingMinutesBrutto").set(workingMinutesBrutto);
            snap2.ref.child("workingMinutesPause").set(workingMinutesPause);
            snap2.ref.child("workingMinutesNetto").set(workingMinutesNetto);
            snap2.ref.child("workingMinutesOverTime").set(workingMinutesOverTimeNew);
            //CALCULATE ADDITION OR SUBTRACTION TO WORKING_HOURS_BUDGET
            return admin.database().ref("overTimeBudgets/" + event.params.uID + "/overTimeBudget").once('value').then(snapshot => {
                console.log(snapshot.val());
                let overTimeBudget = snapshot.val(); //in minutes
                let newOverTimeBudget;
                if (!workingMinutesOverTimeOld) {
                    newOverTimeBudget = overTimeBudget + workingMinutesOverTimeNew;
                }
                else {
                    let valueChange = workingMinutesOverTimeNew - workingMinutesOverTimeOld;
                    console.log("ValueChange: " + valueChange);
                    newOverTimeBudget = overTimeBudget + valueChange;
                }
                return admin.database().ref("overTimeBudgets/" + event.params.uID + "/overTimeBudget").set(newOverTimeBudget);
            });
        }
    });
}));
exports.calculateOverTimeBudgetEndChange = functions.database.ref('workTimes/{uID}/{dateKey}/workTimeEnd')
    .onWrite((event) => __awaiter(this, void 0, void 0, function* () {
    let snap = event.data;
    snap.ref.parent.once('value').then(snap2 => {
        let workTimeStart = snap2.val().workTimeStart;
        let workTimeEnd = snap2.val().workTimeEnd;
        let workingMinutesOverTimeOld = snap2.val().workingMinutesOverTime;
        let milliseconds = -1;
        if (workTimeStart && workTimeEnd) {
            milliseconds = moment(workTimeEnd).valueOf() - moment(workTimeStart).valueOf();
        }
        // console.log("Calculated milliseconds: " + milliseconds);
        if (milliseconds > 0) {
            //get minutes form milliseconds
            let minutes = milliseconds / (1000 * 60);
            let workingMinutesBrutto = Math.floor(minutes);
            // console.log("all minutes in the duration: " + workingMinutesRaw);
            let workingMinutesPause = 0;
            if (Math.floor(workingMinutesBrutto / 60) < 6) {
                // console.log("Keine Pause");
            }
            else if (Math.floor(workingMinutesBrutto / 60) === 6 && (((workingMinutesBrutto / 60) - (Math.floor(workingMinutesBrutto / 60))) * 60) > 0) {
                workingMinutesPause = 30;
                // console.log("30 minuten Pause");
            }
            else if (Math.floor(workingMinutesBrutto / 60) > 6 && Math.floor(workingMinutesBrutto / 60) < 9) {
                workingMinutesPause = 30;
                // console.log("30 minuten Pause");
            }
            else if (Math.floor(workingMinutesBrutto / 60) === 9 && (((workingMinutesBrutto / 60) - (Math.floor(workingMinutesBrutto / 60))) * 60) > 0) {
                workingMinutesPause = 45;
                // console.log("45 minuten Pause");
            }
            else if (Math.floor(workingMinutesBrutto / 60) > 9) {
                workingMinutesPause = 45;
                // console.log("45 minuten Pause");
            }
            let defaultWorkingMinutesPerDay = 480; //entspricht 8:30 Stunden
            let workingMinutesNetto = workingMinutesBrutto - workingMinutesPause;
            let workingMinutesOverTimeNew = workingMinutesNetto - defaultWorkingMinutesPerDay;
            snap2.ref.child("workingMinutesBrutto").set(workingMinutesBrutto);
            snap2.ref.child("workingMinutesPause").set(workingMinutesPause);
            snap2.ref.child("workingMinutesNetto").set(workingMinutesNetto);
            snap2.ref.child("workingMinutesOverTime").set(workingMinutesOverTimeNew);
            //CALCULATE ADDITION OR SUBTRACTION TO WORKING_HOURS_BUDGET
            return admin.database().ref("overTimeBudgets/" + event.params.uID + "/overTimeBudget").once('value').then(snapshot => {
                console.log(snapshot.val());
                let overTimeBudget = snapshot.val(); //in minute
                let newOverTimeBudget;
                if (!workingMinutesOverTimeOld) {
                    newOverTimeBudget = overTimeBudget + workingMinutesOverTimeNew;
                }
                else {
                    let valueChange = workingMinutesOverTimeNew - workingMinutesOverTimeOld;
                    console.log("ValueChange: " + valueChange);
                    newOverTimeBudget = overTimeBudget + valueChange;
                }
                return admin.database().ref("overTimeBudgets/" + event.params.uID + "/overTimeBudget").set(newOverTimeBudget);
            });
        }
    });
}));
