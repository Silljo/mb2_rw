import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { KomunalnoPage } from './komunalno';

@NgModule({
  declarations: [
    KomunalnoPage,
  ],
  imports: [
    IonicPageModule.forChild(KomunalnoPage),
  ],
})
export class KomunalnoPageModule {}
