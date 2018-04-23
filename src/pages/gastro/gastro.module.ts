import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GastroPage } from './gastro';

@NgModule({
  declarations: [
    GastroPage,
  ],
  imports: [
    IonicPageModule.forChild(GastroPage),
  ],
})
export class GastroPageModule {}
