import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-gastro',
  templateUrl: 'gastro.html',
})
export class GastroPage {

  gastro_hrana: Observable<any[]>;
  gastro_pice: Observable<any[]>;
  gastro: any;

  constructor(public navCtrl: NavController, db: AngularFireDatabase) {

    this.gastro_hrana = db.list('/gastro_hrana/').valueChanges();
    this.gastro_pice = db.list('/gastro_pice/').valueChanges();
    this.gastro = 'hrana';
  }

  gastro_detalji(tip, id)
  {
    this.navCtrl.push('GastroDetaljiPage', {id: id, tip: tip});
  }

}
