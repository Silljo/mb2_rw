import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-galerija',
  templateUrl: 'galerija.html',
})
export class GalerijaPage {

  @ViewChild(Slides) slides: Slides;

  id: any;
  tip: string;
  slike: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase) {

    this.id = navParams.get('id');
    this.tip = navParams.get('tip');

    //Ajmo po slike
    db.object("/" + this.tip + "/" + this.id + "/galerija_slike").valueChanges().subscribe((data_slike) => {
        this.slike = data_slike;
        console.log(data_slike);
    });
  }

  close_galery()
  {
    this.navCtrl.pop();
  }

}
