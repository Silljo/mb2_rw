import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-oglasna-ploca',
  templateUrl: 'oglasna-ploca.html',
})
export class OglasnaPlocaPage {

  oglasi: Observable<any[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams, db: AngularFireDatabase) {

    this.oglasi = db.list("/oglasna_ploca/", ref => ref.orderByChild('id')).valueChanges();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OglasnaPlocaPage');
  }

}
