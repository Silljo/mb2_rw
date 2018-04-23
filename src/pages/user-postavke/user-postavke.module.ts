import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserPostavkePage } from './user-postavke';

@NgModule({
  declarations: [
    UserPostavkePage,
  ],
  imports: [
    IonicPageModule.forChild(UserPostavkePage),
  ],
})
export class UserPostavkePageModule {}
