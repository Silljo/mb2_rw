import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AtrakcijePage } from './atrakcije';

@NgModule({
  declarations: [
    AtrakcijePage,
  ],
  imports: [
    IonicPageModule.forChild(AtrakcijePage),
  ],
})
export class AtrakcijePageModule {}
