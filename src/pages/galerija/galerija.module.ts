import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GalerijaPage } from './galerija';

@NgModule({
  declarations: [
    GalerijaPage,
  ],
  imports: [
    IonicPageModule.forChild(GalerijaPage),
  ],
})
export class GalerijaPageModule {}
