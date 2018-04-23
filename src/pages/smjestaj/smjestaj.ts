import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-smjestaj',
  templateUrl: 'smjestaj.html',
})

export class SmjestajPage {

  smjestaj: Observable<any[]>;

  constructor(public navCtrl: NavController, db: AngularFireDatabase) {
    this.smjestaj = db.list('/smjestaj/').valueChanges();
  }

  detalji_smjestaja(id)
  {
    this.navCtrl.push('SmjestajDetaljiPage', {id: id});
  }

}
