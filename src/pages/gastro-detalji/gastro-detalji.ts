import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { Geolocation } from '@ionic-native/geolocation';


@IonicPage()
@Component({
  selector: 'page-gastro-detalji',
  templateUrl: '../views/detalji-view.html'
})
export class GastroDetaljiPage {

  id: any;
  tip: any;
  gastro_detalji: any = {};
  adresa: string;
	kontakt_email: string;
	kontakt_mobitel:string;
	kontakt_telefon: string;
	mjesto: string;
	naziv_objekta: string;
	opis: string;
	ponuda_ikone: Array<any>;
	slika: string;
	zvjezdica: string;
  galerija_img: string;
  radno_vrijeme_dani: string;
  radno_vrijeme_sati: string;
  location_lat: number;
  location_lon: number;
  recenzije_show : any;


  constructor(public navCtrl: NavController, public navParams: NavParams, db: AngularFireDatabase,
              private launchNavigator: LaunchNavigator, private geolocation: Geolocation) {

    this.recenzije_show = 0;
    this.id = navParams.get('id');
    this.tip = navParams.get('tip');

    if(this.tip == 'hrana')
    {
      this.gastro_detalji = db.object('/gastro_detalji_'+ this.tip +'/' + this.id).valueChanges().subscribe((data) => {
          this.adresa = data['adresa'];
          this.kontakt_email = data['kontakt_email'];
          this.kontakt_mobitel = data['kontakt_mobitel'];
          this.kontakt_telefon = data['kontakt_telefon'];
          this.mjesto = data['mjesto'];
          this.naziv_objekta = data['naziv_objekta'];
          this.opis = data['opis'];
          this.ponuda_ikone = data['ponuda_ikone'];
          this.slika = data['slika'];
          this.zvjezdica = data['zvjezdica'];
          this.galerija_img = data['galerija_img'];
          this.radno_vrijeme_dani = data['radno_vrijeme_dani'];
          this.radno_vrijeme_sati = data['radno_vrijeme_sati'];
          this.location_lat = data['location_lat'];
          this.location_lon = data['location_lon'];

      });
    }

    if(this.tip == 'pice')
    {
      this.gastro_detalji = db.object('/gastro_detalji_'+ this.tip +'/' + this.id).valueChanges().subscribe((data) => {
          this.adresa = data['adresa'];
          this.kontakt_email = data['kontakt_email'];
          this.kontakt_mobitel = data['kontakt_mobitel'];
          this.kontakt_telefon = data['kontakt_telefon'];
          this.mjesto = data['mjesto'];
          this.naziv_objekta = data['naziv_objekta'];
          this.opis = data['opis'];
          this.ponuda_ikone = data['ponuda_ikone'];
          this.slika = data['slika'];
          this.zvjezdica = data['zvjezdica'];
          this.galerija_img = data['galerija_img'];
          this.radno_vrijeme_dani = data['radno_vrijeme_dani'];
          this.radno_vrijeme_sati = data['radno_vrijeme_sati'];
          this.location_lat = data['location_lat'];
          this.location_lon = data['location_lon'];
      });
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GastroDetaljiPage');
  }

  close_pop()
  {
    this.navCtrl.pop();
  }

  nav()
  {

    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    this.geolocation.getCurrentPosition(options).then((resp) => {

       let options: LaunchNavigatorOptions = {
         start: resp.coords.latitude + ", " + resp.coords.longitude
       };

       this.launchNavigator.navigate([this.location_lat, this.location_lon], options)
       .then(
         success => console.log('Launched navigator'),
         error => console.log('Error launching navigator', error)
       );

    }).catch((error) => {
      alert('Greška: ' + error);
    });

  }

  open_galerija(id, tip)
  {
    var child_node_baza;

    if(tip == 'hrana')
    {
      child_node_baza = 'gastro_detalji_hrana';
    }
    else
    {
      child_node_baza = 'gastro_detalji_pice';
    }

    this.navCtrl.push('GalerijaPage', {id: id, tip: child_node_baza});
  }

}
