import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, LoadingController, Events, AlertController, Platform } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Diagnostic } from '@ionic-native/diagnostic';
import { HomePage } from '../home/home';

import {
 GoogleMaps,
 GoogleMap,
 GoogleMapsEvent
} from '@ionic-native/google-maps';

@IonicPage()
@Component({
  selector: 'page-interaktivna-mapa',
  templateUrl: 'interaktivna-mapa.html',
})
export class InteraktivnaMapaPage {

  @ViewChild('map') element;

  map: GoogleMap;
  mapElement: HTMLElement;

  interaktivna_mapa_opcenito: any = {};
  interaktivna_mapa_smjestaj: any = {};
  interaktivna_mapa_dogadjanja_sport: any = {};
  interaktivna_mapa_dogadjanja_zabava: any = {};
  interaktivna_mapa_dogadjanja_kultura: any = {};
  interaktivna_mapa_gastro_pice: any = {};
  interaktivna_mapa_gastro_hrana: any = {};
  interaktivna_mapa_atrakcije: any = {};

  markers_opcenito = [];
  markers_opcenito_checkbox: boolean = true;

  markers_dogadjanja = [];
  markers_dogadjanja_checkbox: boolean = true;

  markers_smjestaj = [];
  markers_smjestaj_checkbox: boolean = true;

  markers_gastro = [];
  markers_gastro_checkbox: boolean = true;

  markers_atrakcije = [];
  markers_atrakcije_checkbox: boolean = true;

  mapReady: boolean = false;

  constructor(public navCtrl: NavController, private googleMaps: GoogleMaps, public db: AngularFireDatabase, public loadingCtrl: LoadingController,public events: Events,
              private diagnostic: Diagnostic, private alertCtrl: AlertController, public plt: Platform) {

  }

  ionViewDidLoad() {

    let alert = this.alertCtrl.create({
      title: 'Lokacija',
      message: 'Odabrani modul koristi lokaciju vašeg mobilnog uređaja. Za nastavak potrebno je dozvoliti pristup Vašoj lokaciji',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.setRoot('InteraktivnaMapaPage');
          }
        },
        {
          text: 'Odustani',
          handler: () => {
            this.navCtrl.setRoot(HomePage);
          }
        }
      ]
    });

    //Ako imamo ios onda se loada mapa svikak
    if(this.plt.is('ios'))
    {
      this.loadMap();
    }

    if(this.plt.is('android'))
    {
      this.diagnostic.requestLocationAuthorization().then((status) => {

        switch(status){
         case this.diagnostic.permissionStatus.NOT_REQUESTED:
              alert.present();
             break;
         case this.diagnostic.permissionStatus.DENIED:
             alert.present();
             break;
         case this.diagnostic.permissionStatus.GRANTED:
              this.loadMap();
             break;
         case this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:
              alert.present();
             break;
          }

      }).catch(e => console.log(e));

    }

  }

 loadMap() {

    this.mapElement = document.getElementById('map');
    //this.map = this.googleMaps.create(this.mapElement);

    this.map = GoogleMaps.create('map', {
      'mapType': 'MAP_TYPE_SATELLITE',
      controls: {
        myLocation: true,
        compass: true,
        myLocationButton: true,
        indoorPicker: true,
        mapToolbar: true   // currently Android only
      },
      camera: {
        target: {
          lat: 46.00507,
          lng: 16.119108
        },
        zoom: 15
      },
      'preferences': {
        'zoom': {
          'maxZoom': 19
        },
        'padding': {
          'left': 5,
          'top': 60,
          'bottom': 80,
          'right': 5
        }
      }
    });

    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
     this.mapReady = true;
     this.map.setTrafficEnabled(true);
     this.map.setIndoorEnabled(true);

     let loading = this.loadingCtrl.create({
       content: 'Dohvaćam sadržaj, molim pričekajte (brzina učitavanja sadržaja ovisi o brzini pristupa mreži)...',
       duration: 50000
     });

     loading.present();

     this.events.subscribe('end_loading', () => {
       if(loading){ loading.dismiss(); loading = null; }
     });

     //Opći podaci
     this.db.object("/interaktivna_mapa/").valueChanges().subscribe((data_opcenito) => { this.interaktivna_mapa_opcenito = data_opcenito;

     //Filanje sa regularnim informacijama
     for (let item of this.interaktivna_mapa_opcenito) {

       if(item && item.lat != '' && item.lng != '')
       {

       this.map.addMarker({

           icon: {url: item.slika, size: {width: 24, height: 24}}, animation: 'BOUNCE', zIndex: 1,
           position: { lat: item.lat, lng: item.lng } }).then(marker => {

           this.markers_opcenito = this.markers_opcenito.concat(marker);

           marker.setTitle(item.naziv);
           marker.setSnippet(" " + item.opis + "\n\rAdresa: " + item.adresa);

           //Kad se klikne
           marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
               //Pomakni kameru rotiraj
               marker.showInfoWindow();
               this.map.animateCamera({target: {lat: item.lat, lng: item.lng}, zoom: 17, tilt: 60, bearing: 140, duration: 1500});
           });

         });

       }
      }

      });

      //Smještaj
      this.db.object("/smjestaj_detalji/").valueChanges().subscribe((data_smjestaj_detalji) => {this.interaktivna_mapa_smjestaj = data_smjestaj_detalji;

        for (let item_smjestaj of this.interaktivna_mapa_smjestaj) {

          if(item_smjestaj && item_smjestaj.location_lat != '' && item_smjestaj.location_lat != '')
          {

            this.map.addMarker({

              icon: {url: item_smjestaj.interaktivna_mapa_slika, size: {width: 24, height: 24}}, animation: 'BOUNCE', zIndex: 0,
                position: { lat: item_smjestaj.location_lat, lng: item_smjestaj.location_lon } }).then(marker => {

                this.markers_smjestaj = this.markers_smjestaj.concat(marker);

                marker.setTitle(item_smjestaj.naziv_objekta);
                marker.setSnippet(" " + item_smjestaj.opis_short + "\n\rAdresa: " + item_smjestaj.adresa + "\n\rZa više detalja pritisnite ovdje.");


                //Kad se klikne
                marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
                    //Pomakni kameru rotiraj
                    marker.showInfoWindow();
                    this.map.animateCamera({target: {lat: item_smjestaj.location_lat, lng: item_smjestaj.location_lon}, zoom: 17, tilt: 60, bearing: 140, duration: 1500});
                });

                //Dugi klik na INFO
                marker.on(GoogleMapsEvent.INFO_CLICK).subscribe(() => {
                       this.navCtrl.push('SmjestajDetaljiPage', {id: item_smjestaj.id});
                    });
                });
           }

         }
      });

      this.db.object("/dogadjanja_sport/").valueChanges().subscribe((data_dogadjanja_sport) => {this.interaktivna_mapa_dogadjanja_sport = data_dogadjanja_sport;
        for (let item_dogadjanja_sport of this.interaktivna_mapa_dogadjanja_sport) {

          if(item_dogadjanja_sport && item_dogadjanja_sport.location_lat != '' && item_dogadjanja_sport.location_lat != '')
          {
            this.map.addMarker({

                icon: {url: item_dogadjanja_sport.interaktivna_mapa_slika, size: {width: 24, height: 24}}, animation: 'BOUNCE', zIndex: 2,
                position: { lat: item_dogadjanja_sport.location_lat, lng: item_dogadjanja_sport.location_lon } }).then(marker => {

                  this.markers_dogadjanja = this.markers_dogadjanja.concat(marker);

                  marker.setTitle(item_dogadjanja_sport.naziv);
                  marker.setSnippet(" " + item_dogadjanja_sport.opis_short + "\n\rLokacija: " + item_dogadjanja_sport.lokacija);

                  //Kad se klikne
                  marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
                      //Pomakni kameru rotiraj
                      marker.showInfoWindow();
                      this.map.animateCamera({target: {lat: item_dogadjanja_sport.location_lat, lng: item_dogadjanja_sport.location_lon}, zoom: 17, tilt: 60, bearing: 140, duration: 1500});
                  });

                });
           }
         }
      });

      this.db.object("/dogadjanja_zabava/").valueChanges().subscribe((data_dogadjanja_zabava) => {this.interaktivna_mapa_dogadjanja_zabava = data_dogadjanja_zabava;
        for (let item_dogadjanja_zabava of this.interaktivna_mapa_dogadjanja_zabava) {

          if(item_dogadjanja_zabava && item_dogadjanja_zabava.location_lat != '' && item_dogadjanja_zabava.location_lon != '')
          {
            this.map.addMarker({

                icon: {url: item_dogadjanja_zabava.interaktivna_mapa_slika, size: {width: 24, height: 24}}, animation: 'BOUNCE', zIndex: 2,
                position: { lat: item_dogadjanja_zabava.location_lat, lng: item_dogadjanja_zabava.location_lon } }).then(marker => {

                  this.markers_dogadjanja = this.markers_dogadjanja.concat(marker);

                  marker.setTitle(item_dogadjanja_zabava.naziv);
                  marker.setSnippet(" " + item_dogadjanja_zabava.opis_short + "\n\rLokacija: " + item_dogadjanja_zabava.lokacija);

                  //Kad se klikne
                  marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
                      //Pomakni kameru rotiraj
                      marker.showInfoWindow();
                      this.map.animateCamera({target: {lat: item_dogadjanja_zabava.location_lat, lng: item_dogadjanja_zabava.location_lon}, zoom: 17, tilt: 60, bearing: 140, duration: 1500});
                  });

                });
           }

         }
      });

      this.db.object("/dogadjanja_kultura/").valueChanges().subscribe((data_dogadjanja_kultura) => {this.interaktivna_mapa_dogadjanja_kultura = data_dogadjanja_kultura;
        for (let item_dogadjanja_kultura of this.interaktivna_mapa_dogadjanja_kultura) {

          if(item_dogadjanja_kultura && item_dogadjanja_kultura.location_lat != '' && item_dogadjanja_kultura.location_lon != '')
          {
            this.map.addMarker({

                icon: {url: item_dogadjanja_kultura.interaktivna_mapa_slika, size: {width: 24, height: 24}}, animation: 'BOUNCE', zIndex: 2,
                position: { lat: item_dogadjanja_kultura.location_lat, lng: item_dogadjanja_kultura.location_lon } }).then(marker => {

                  this.markers_dogadjanja = this.markers_dogadjanja.concat(marker);

                  marker.setTitle(item_dogadjanja_kultura.naziv);
                  marker.setSnippet(" " + item_dogadjanja_kultura.opis_short + "\n\rLokacija: " + item_dogadjanja_kultura.lokacija);

                  //Kad se klikne
                  marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
                      //Pomakni kameru rotiraj
                      marker.showInfoWindow();
                      this.map.animateCamera({target: {lat: item_dogadjanja_kultura.location_lat, lng: item_dogadjanja_kultura.location_lon}, zoom: 17, tilt: 60, bearing: 140, duration: 1500});
                  });

                });
           }

         }
      });

      this.db.object("/gastro_detalji_hrana/").valueChanges().subscribe((data_gastro_detalji_hrana) => {this.interaktivna_mapa_gastro_hrana = data_gastro_detalji_hrana;
        for (let item_hrana of this.interaktivna_mapa_gastro_hrana) {

          if(item_hrana && item_hrana.location_lat != '' && item_hrana.location_lat != '')
          {
            this.map.addMarker({

                icon: {url: item_hrana.interaktivna_mapa_slika, size: {width: 24, height: 24}}, animation: 'BOUNCE', zIndex: 0,
                position: { lat: item_hrana.location_lat, lng: item_hrana.location_lon } }).then(marker => {

                this.markers_gastro = this.markers_gastro.concat(marker);

                marker.setTitle(item_hrana.naziv_objekta);
                marker.setSnippet(" " + item_hrana.opis_short + "\n\rAdresa: " + item_hrana.adresa + "\n\rZa više detalja pritisnite ovdje.");

                //Kad se klikne
                marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
                    //Pomakni kameru rotiraj
                    marker.showInfoWindow();
                    this.map.animateCamera({target: {lat: item_hrana.location_lat, lng: item_hrana.location_lon}, zoom: 17, tilt: 60, bearing: 140, duration: 1500});
                });

                //Dugi klik na INFO
                marker.on(GoogleMapsEvent.INFO_CLICK).subscribe(() => {
                       this.navCtrl.push('GastroDetaljiPage', {id: item_hrana.id, tip: 'hrana'});
                    });
                });
           }

         }
      });

      this.db.object("/gastro_detalji_pice/").valueChanges().subscribe((data_gastro_detalji_pice) => {this.interaktivna_mapa_gastro_pice = data_gastro_detalji_pice;
        for (let item_pice of this.interaktivna_mapa_gastro_pice) {

          if(item_pice && item_pice.location_lat != '' && item_pice.location_lon != '')
          {
            this.map.addMarker({

                icon: {url: item_pice.interaktivna_mapa_slika, size: {width: 24, height: 24}}, animation: 'BOUNCE', zIndex: 0,
                position: { lat: item_pice.location_lat, lng: item_pice.location_lon } }).then(marker => {

                this.markers_gastro = this.markers_gastro.concat(marker);

                marker.setTitle(item_pice.naziv_objekta);
                marker.setSnippet(" " + item_pice.opis_short + "\n\rAdresa: " + item_pice.adresa + "\n\rZa više detalja pritisnite ovdje.");

                //Kad se klikne
                marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
                    //Pomakni kameru rotiraj
                    marker.showInfoWindow();
                    this.map.animateCamera({target: {lat: item_pice.location_lat, lng: item_pice.location_lon}, zoom: 17, tilt: 60, bearing: 140, duration: 1500});
                });

                //Dugi klik na INFO
                marker.on(GoogleMapsEvent.INFO_CLICK).subscribe(() => {
                       this.navCtrl.push('GastroDetaljiPage', {id: item_pice.id, tip: 'pice'});
                    });
                });
           }

         }
      });

      this.db.object("/atrakcije/").valueChanges().subscribe((data_atrakcije) => {this.interaktivna_mapa_atrakcije = data_atrakcije;
        for (let item_atrakcije of this.interaktivna_mapa_atrakcije) {

          if(item_atrakcije && item_atrakcije.location_lat != '' && item_atrakcije.location_lon != '')
          {
            this.map.addMarker({

                icon: {url: item_atrakcije.interaktivna_mapa_slika, size: {width: 24, height: 24}}, animation: 'BOUNCE', zIndex: 2,
                position: { lat: item_atrakcije.location_lat, lng: item_atrakcije.location_lon } }).then(marker => {

                  this.events.publish('end_loading');

                  this.markers_atrakcije = this.markers_atrakcije.concat(marker);

                  marker.setTitle(item_atrakcije.naziv);
                  marker.setSnippet("Za više detalja pritisnite ovdje.");

                  //Kad se klikne
                  marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
                      //Pomakni kameru rotiraj
                      marker.showInfoWindow();
                      this.map.animateCamera({target: {lat: item_atrakcije.location_lat, lng: item_atrakcije.location_lon}, zoom: 17, tilt: 60, bearing: 140, duration: 1500});
                  });

                  //Dugi klik na INFO
                  marker.on(GoogleMapsEvent.INFO_CLICK).subscribe(() => {
                         this.navCtrl.push('AtrakcijeDetaljiPage', {id: item_atrakcije.id});
                      });

                });
           }
         }
      });

    });

  }

  show_hide_markers()
  {

    if(!this.markers_opcenito_checkbox)
    {
      this.markers_opcenito.forEach(item => {
        item.setVisible(false);
      });
    }
    else
    {
      this.markers_opcenito.forEach(item => {
        item.setVisible(true);
      });
    }

    if(!this.markers_smjestaj_checkbox)
    {
      this.markers_smjestaj.forEach(item => {
        item.setVisible(false);
      });
    }
    else
    {
      this.markers_smjestaj.forEach(item => {
        item.setVisible(true);
      });
    }

    if(!this.markers_dogadjanja_checkbox)
    {
      this.markers_dogadjanja.forEach(item => {
        item.setVisible(false);
      });
    }
    else
    {
      this.markers_dogadjanja.forEach(item => {
        item.setVisible(true);
      });
    }

    if(!this.markers_gastro_checkbox)
    {
      this.markers_gastro.forEach(item => {
        item.setVisible(false);
      });
    }
    else
    {
      this.markers_gastro.forEach(item => {
        item.setVisible(true);
      });
    }

    if(!this.markers_atrakcije_checkbox)
    {
      this.markers_atrakcije.forEach(item => {
        item.setVisible(false);
      });
    }
    else
    {
      this.markers_atrakcije.forEach(item => {
        item.setVisible(true);
      });
    }

  }


}
