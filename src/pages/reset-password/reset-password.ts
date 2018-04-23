import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { User } from "../../models/user";
import * as firebase from 'firebase';
import { AuthProvider } from '../../providers/auth/auth';
import { LoginPage } from '../../pages/login/login';

@IonicPage()
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html'
})
export class ResetPasswordPage {

  user = {} as User;

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthProvider, private alertCtrl: AlertController) {

  }

  reset(user: User)
  {

    let alert = this.alertCtrl.create({
      title: 'Resetiranje lozinke',
      message: 'E-mail sa linkom za resetiranje lozinke poslan je na '+user.email+'. Nakon resetiranja lozinke ponovno se prijavite u aplikaciju.',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.setRoot(LoginPage);
          }
        }
      ]
    });

    var auth = firebase.auth();
    return auth.sendPasswordResetEmail(user.email).then(
        () =>
        alert.present()
        )
      .catch(
        (error) => this.auth.obrada_neuspjesnog_logina(error))
  }

  resetPassword(email: string) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetPasswordPage');
  }

}
