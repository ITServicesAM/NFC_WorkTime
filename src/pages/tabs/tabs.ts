import {Component} from "@angular/core";
import {WorkingHoursPage} from "../workinghours/workinghours";
import {WorkTimesPage} from "../worktimes/worktimes";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = WorkingHoursPage;
  tab2Root = WorkTimesPage;

  constructor() {

  }
}
