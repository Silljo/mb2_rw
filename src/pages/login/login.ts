import { Component } from '@angular/core';
import { NavController, NavParams, Events , LoadingController} from 'ionic-angular';
import { User } from "../../models/user";
import { AuthProvider } from '../../providers/auth/auth';
import { HomePage } from '../../pages/home/home';
import firebase from 'firebase';
import { Facebook } from '@ionic-native/facebook';



@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  user = {} as User;

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthProvider, public facebook: Facebook,
              public events: Events, public loadingCtrl: LoadingController)
  {

  }

  //Email
  login(user: User) {

    let loading = this.loadingCtrl.create({
      content: 'Prijava u tijeku, molim pričekajte...'
    });

    loading.present();

    this.auth.login(user.email, user.password).then(
      res => {
        //Dobili smo nešto natrag, i bilo je uspješno
        this.auth.obrada_uspjesnog_logina(res.uid, res.email, res.photoURL, res.displayName).then(
          (finish) => {this.navCtrl.setRoot(HomePage); loading.dismiss();},
          (error) => {this.auth.obrada_neuspjesnog_logina(error); loading.dismiss();}
        );
        //
        //
      }, err => {
        //Došlo je do greške kod logina.
        loading.dismiss();
        this.auth.obrada_neuspjesnog_logina(err);
      }
   );
  }

  register()
  {
    this.navCtrl.push('RegisterPage');
  }

  //Facebook
  fb_login()
  {

    let loading = this.loadingCtrl.create({
      content: 'Prijava u tijeku, molim pričekajte...'
    });

    loading.present();

    this.facebook.login(['public_profile', 'email'])
      .then( response => {

        const facebookCredential = firebase.auth.FacebookAuthProvider
          .credential(response.authResponse.accessToken);

           firebase.auth().signInWithCredential(facebookCredential)
            .then((success) => {
              this.auth.obrada_uspjesnog_logina(success.uid, success.email, success.photoURL, success.displayName).then(
                (finish =>
                  {
                    loading.dismiss();
                    this.navCtrl.setRoot(HomePage);
                    //Subscribamo ili ne ?
                    this.auth.subscribe_topics();
                  }),
                (error =>   {loading.dismiss(); this.auth.obrada_neuspjesnog_logina(error);})
              );
          })
          .catch((error) => {
              loading.dismiss();
              this.auth.obrada_neuspjesnog_logina(error);
          });

      }).catch((error) => { loading.dismiss(); alert(error); this.auth.obrada_neuspjesnog_logina(error); });

  }

  reset_password()
  {
    this.navCtrl.push('ResetPasswordPage');
  }

}
