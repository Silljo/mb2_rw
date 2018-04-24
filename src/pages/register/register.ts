import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController, LoadingController } from 'ionic-angular';
import { User } from "../../models/user";
import { AuthProvider } from '../../providers/auth/auth';
import { HomePage } from '../../pages/home/home';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {

  user = {} as User;
  password2 : any;

  constructor(
    public navCtrl: NavController, public navParams: NavParams, public auth: AuthProvider, public events: Events, private toastCtrl: ToastController,
    public loadingCtrl: LoadingController) {
  }

  register(user: User) {

    if(user.password == this.password2)
    {

      let loading = this.loadingCtrl.create({
        content: 'Prijava u tijeku, molim pričekajte...'
      });

      loading.present();

      this.auth.register(user.email, user.password).then(
        res => {
          //Dobili smo nešto natrag, i bilo je uspješno
          this.auth.obrada_uspjesnog_logina(res.uid, res.email, res.photoURL, res.displayName).then(res => {
            //Subscribamo ili ne ?
            this.auth.subscribe_topics();
            this.auth.token_update();
            loading.dismiss();
            this.navCtrl.setRoot(HomePage);
          });
          //
          //
        }, err => {
          //Došlo je do greške kod logina.
          loading.dismiss();
          this.auth.obrada_neuspjesnog_logina(err);
        }
     );
    }
    else
    {
      let toast = this.toastCtrl.create({
        message: 'Upisane lozinke se ne podudaraju',
        duration: 3000,
        position: 'bottom'
      });

      toast.present();
    }

 }
}
