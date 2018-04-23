import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Firebase } from '@ionic-native/firebase';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-user-postavke',
  templateUrl: 'user-postavke.html',
})
export class UserPostavkePage {

  slika: string;
  slika_validation: string;

  korisnik_naziv: string;
  korisnik_slika: string;

  smjestaj_toggle: boolean;
  gastro_toggle: boolean;
  dogadjanja_toggle: boolean;
  duhovni_kutak_toggle: boolean;
  uid: string;

  constructor(public navCtrl: NavController, public camera: Camera, public db: AngularFireDatabase,
              public auth: AngularFireAuth, public firebase_plugin: Firebase) {

  }

  ionViewDidLoad() {

    this.auth.authState.subscribe(data => {
      if (data && data.uid) {

        this.uid = data.uid;

        //E sad da prvo vidimo da li je to komunalni redar
        this.db.object("/user_profiles/" + data.uid).valueChanges().subscribe((data_user) => {
          this.korisnik_naziv = data_user['display_name'];
          this.korisnik_slika = data_user['slika'];
          this.smjestaj_toggle = data_user['subscribe_smjestaj'];
          this.gastro_toggle = data_user['subscribe_gastro'];
          this.dogadjanja_toggle = data_user['subscribe_dogadjanja'];
          this.duhovni_kutak_toggle = data_user['subscribe_duhovni_kutak'];
        });


      }
    });

  }

  async slika_user()
  {
    try{

      const options: CameraOptions = {
        quality: 50,
        targetWidth: 500,
        targetHeight: 500,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        saveToPhotoAlbum: false,
        allowEdit : true,
        correctOrientation: true,
        sourceType: 0
      }

      await this.camera.getPicture(options).then((imageData) => {
       // imageData is either a base64 encoded string or a file URI
       // If it's base64:
       let base64Image = 'data:image/jpeg;base64,' + imageData;
       this.slika = base64Image;
       this.slika_validation = 'true';
       this.korisnik_slika = this.slika;

       this.auth.authState.subscribe(data => {
         if (data && data.uid) {

           var storageRef = firebase.storage().ref('user_img/' + data.uid);

           storageRef.putString(this.slika, firebase.storage.StringFormat.DATA_URL).then(function(snapshot) {

             firebase.database().ref('user_profiles/' + data.uid).update({
                 slika: snapshot.downloadURL,
               });

           });

         }
       });

      }, (err) => {
       // Handle error
      });
      }
      catch(e)
      {

      }

      this.update_user_profile();
  }

  subscribe(tip)
  {

    this.auth.authState.subscribe(data => {
      if (data && data.uid) {

        if(tip == 'smjestaj')
        {
          if(this.smjestaj_toggle)
          {
            this.firebase_plugin.subscribe('topic_smjestaj');
          }
          else
          {
            this.firebase_plugin.unsubscribe('topic_smjestaj');
          }

          firebase.database().ref('user_profiles/' + data.uid).update({
              subscribe_smjestaj: this.smjestaj_toggle,
            });

        }
        if(tip == 'gastro')
        {
          if(this.gastro_toggle)
          {
            this.firebase_plugin.subscribe('topic_gastro');
          }
          else
          {
            this.firebase_plugin.unsubscribe('topic_gastro');
          }

          firebase.database().ref('user_profiles/' + data.uid).update({
              subscribe_gastro: this.gastro_toggle,
            });

        }
        if(tip == 'duhovni_kutak')
        {
          if(this.duhovni_kutak_toggle)
          {
            this.firebase_plugin.subscribe('topic_duhovni_kutak');
          }
          else
          {
            this.firebase_plugin.unsubscribe('topic_duhovni_kutak');
          }

          firebase.database().ref('user_profiles/' + data.uid).update({
              subscribe_duhovni_kutak: this.duhovni_kutak_toggle,
            });

        }
        if(tip == 'dogadjanja')
        {
          if(this.dogadjanja_toggle)
          {
            this.firebase_plugin.subscribe('topic_dogadjanja');
          }
          else
          {
            this.firebase_plugin.unsubscribe('topic_dogadjanja');
          }

          firebase.database().ref('user_profiles/' + data.uid).update({
              subscribe_dogadjanja: this.dogadjanja_toggle,
            });

        }

      }
    });
  }

  username_change(username : string ) {

    if(username.length > 3)
    {
      this.auth.authState.subscribe(data => {
        if (data && data.uid) {
          firebase.database().ref('user_profiles/' + data.uid).update({
              display_name: username,
            });
          }
        });
    }

    this.update_user_profile();

  }

  update_user_profile()
  {
    var user = firebase.auth().currentUser;

    this.db.object("/user_profiles/" + user.uid).valueChanges().subscribe((data_user) => {

      if(data_user)
      {
        user.updateProfile({
          displayName: data_user['display_name'],
          photoURL: data_user['slika']
        }).then(function() {
          // Update successful.
        }).catch(function(error) {
          // An error happened.
        });
      }

    });
  }

}
