import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-atrakcije-detalji',
  templateUrl: 'atrakcije-detalji.html'
})
export class AtrakcijeDetaljiPage {

  id: any;
  atrakcije_detalji: any = {};
  atrakcija_naziv: string;
  atrakcija_opis: string;
  atrakcija_opis_short: string;
  atrakcija_slike_galerija: Array<any>;
  atrakcija_slika_main: string;
  atrakcija_slika_galerija: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, db: AngularFireDatabase) {

    this.id = navParams.get('id');

    this.atrakcije_detalji = db.object('/atrakcije/'+ this.id).valueChanges().subscribe((data) => {
      this.atrakcija_naziv = data['naziv'];
      this.atrakcija_opis = data['opis_long'];
      this.atrakcija_opis_short = data['opis_short'];
      this.atrakcija_slike_galerija = data['slike_galerija'];
      this.atrakcija_slika_galerija = data['slika_galerija'];
      this.atrakcija_slika_main = data['slika_main'];
    });

  }

  close_pop()
  {
    this.navCtrl.pop();
  }

  open_galerija(id, child_node_baza)
  {
    this.navCtrl.push('GalerijaPage', {id: id, tip: child_node_baza});
  }

}
