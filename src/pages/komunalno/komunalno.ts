import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, IonicPage, ToastController, normalizeURL } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import * as firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { DatePipe } from '@angular/common';


@IonicPage()
@Component({
  selector: 'page-komunalno',
  templateUrl: 'komunalno.html',
})

export class KomunalnoPage {

  private komunalno : FormGroup;
  slika: string;
  slika_validation: string;
  uid: string;
  datum: String = new Date().toISOString();
  prijave_komunalno_data: Observable<any[]>;
  komunalno_segment: any;
  komunalni_redar = 0;
  redirect_param_komunalno: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, private camera: Camera,
              public db: AngularFireDatabase, public auth: AngularFireAuth, private datePipe: DatePipe, public loadingCtrl: LoadingController,
              private toast: ToastController) {

    /*
    STATUSI:
    1 - Novi predmet salje se obavijest komunalnom redaru
    2 - Poslana poruka komunalnom redaru
    3 - Komunalni redar je oznacio da je vidio poruku i sanje povratnu informaciju korisniku
    4 - Korisnik je dobio notifikaciju
    */

    this.redirect_param_komunalno = navParams.get('komunalno_segment_redirect');

    if(this.redirect_param_komunalno)
    {
        this.komunalno_segment = 'arhiva';
    }
    else
    {
        this.komunalno_segment = 'prijava';
    }

    this.komunalno = this.formBuilder.group({
      hitnost: ['niska', Validators.required],
      mjesto: ['', Validators.required],
      opis: ['', Validators.required],
      slika: [this.slika, Validators.required],
      kontakt: ['', Validators.required],
    });

    this.auth.authState.subscribe(data => {
      if (data && data.uid) {

        //E sad da prvo vidimo da li je to komunalni redar
        this.db.object("/user_profiles/" + data.uid).valueChanges().subscribe((data_user) => {

          if(data_user['komunalno'])
          {
            this.komunalno_segment = 'arhiva';
            this.komunalni_redar = data_user['komunalno'];
            this.prijave_komunalno_data = db.list('/komunalno', ref => ref.limitToLast(20).orderByChild('status')).valueChanges();

          }
          else
          {
            this.prijave_komunalno_data = db.list('/komunalno', ref => ref.limitToLast(20).orderByChild('status')).valueChanges();

          }
          console.log(this.prijave_komunalno_data);
        });


      }
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad KomunalnoPage');
  }

  logForm(){

    let loading = this.loadingCtrl.create({
      content: 'Slanje prijave, molim pričekajte...'
    });

    let toast = this.toast.create({
      message: 'Vaša prijava poslana je komunalnom redaru. Nakon obrade prijave primiti ćete obavijest.',
      duration: 5000,
      position: 'bottom'
    });

    loading.present();

    var opis = this.komunalno.value.opis;
    var mjesto = this.komunalno.value.mjesto;
    var kontakt = this.komunalno.value.kontakt;
    var hitnost = this.komunalno.value.hitnost;
    var datum = new Date();
    var datum_order = this.datePipe.transform(datum, 'yyyyMMddHHmm');
    var datum_formated = this.datePipe.transform(datum, 'dd.MM.yyyy. HH:mm');

    this.komunalno.reset();

    this.auth.authState.subscribe(data => {

      if(data.uid)
      {
        var storageRef = firebase.storage().ref('komunalno/' + data.uid + '_' + Date.now());

        storageRef.putString(this.slika, firebase.storage.StringFormat.DATA_URL).then(function(snapshot) {

          var newPostKey = firebase.database().ref().child('komunalno').push().key;

          firebase.database().ref('komunalno/' + newPostKey).set({
              status: 1,
              image_url: snapshot.downloadURL,
              opis: opis,
              mjesto: mjesto,
              kontakt: kontakt,
              hitnost: hitnost,
              uid: data.uid,
              key: newPostKey,
              datum_order: datum_order,
              datum_prijave: datum_formated
            });

            loading.dismiss();
            toast.present();

        });
      }

      this.slika = '';

    });

  }

  async slika_komunalno()
  {
    try{

      const options: CameraOptions = {
        quality: 50,
        targetWidth: 1000,
        targetHeight: 1000,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        saveToPhotoAlbum: false,
        allowEdit : true,
        correctOrientation: true
      }

      await this.camera.getPicture(options).then((imageData) => {
       // imageData is either a base64 encoded string or a file URI
       // If it's base64:

       let base64Image = normalizeURL('data:image/jpeg;base64,' + imageData);
       this.slika = base64Image;
       this.slika_validation = 'true';

      }, (err) => {
       // Handle error
      });
      }
      catch(e)
      {

      }
  }

  azuriraj_status_komunalni_radnik(key)
  {
    firebase.database().ref('komunalno/' + key).update({
        status: 3
      });
  }

}
