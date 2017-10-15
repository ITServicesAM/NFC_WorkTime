import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddWorkTimePage } from './add-work-time';

@NgModule({
  declarations: [
    AddWorkTimePage,
  ],
  imports: [
    IonicPageModule.forChild(AddWorkTimePage),
  ],
  exports: [
    AddWorkTimePage
  ]
})
export class AddWorkTimePageModule {}
