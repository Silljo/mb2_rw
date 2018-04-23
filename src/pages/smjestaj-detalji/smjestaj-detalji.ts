import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { Geolocation } from '@ionic-native/geolocation';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-smjestaj-detalji',
  templateUrl: '../views/detalji-view.html'
})
export class SmjestajDetaljiPage {

  recenzija: any = '';
  id: any;
  smjestaj: any = {};
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
  recenzije_db: String[];
  keys: String[];
  recenzije_show : any;
  rezervacije : Array<any>;
  tip = 'smjestaj_detalji';

  constructor(public navCtrl: NavController, public navParams: NavParams, db: AngularFireDatabase, public viewCtrl: ViewController,
              private launchNavigator: LaunchNavigator, private geolocation: Geolocation, public auth: AngularFireAuth) {

    this.recenzije_show = 1;
    this.id = navParams.get('id');

    this.smjestaj = db.object('/smjestaj_detalji/' + this.id).valueChanges().subscribe((data) => {

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
        this.rezervacije = data['rezervacije'];

        if(data['recenzije'])
        {
            this.recenzije_db = data['recenzije'];
            this.keys = Object.keys(this.recenzije_db);
        }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SmjestajDetaljiPage');
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
      alert('Greška: ' + JSON.stringify(error));
    });

  }

  open_galerija(id, child_node_baza)
  {
    this.navCtrl.push('GalerijaPage', {id: id, tip: child_node_baza});
  }

  recenzija_save()
  {

    var recenzija_baza = this.recenzija;
    this.recenzija = '';

    if(recenzija_baza.length > 5)
    {
      this.auth.authState.subscribe(data => {
        if (data && data.uid) {
          firebase.database().ref('/smjestaj_detalji/' + this.id + '/recenzije/' + data.uid).set({
              korisnik_ime_prezime: data.displayName,
              recenzija: recenzija_baza
            });
          }
        });
    }
  }
}
