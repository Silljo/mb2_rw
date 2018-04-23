import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController, AlertController, LoadingController } from 'ionic-angular';
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
    private alertCtrl: AlertController, public loadingCtrl: LoadingController) {
  }

  register(user: User) {

    if(user.password == this.password2)
    {

      let loading = this.loadingCtrl.create({
        content: 'Prijava u tijeku, molim pričekajte...'
      });

      this.auth.register(user.email, user.password).then(
        res => {
          //Dobili smo nešto natrag, i bilo je uspješno
          this.auth.obrada_uspjesnog_logina(res.uid, res.email, res.photoURL, res.displayName).then(res => {
            //Subscribamo ili ne ?
            this.auth.subscribe_topics();
            loading.dismiss();
            this.navCtrl.setRoot(HomePage);
          });
          //
          //
        }, err => {
          //Došlo je do greške kod logina.
          loading.dismiss();
          let alert = this.alertCtrl.create({
            title: 'Došlo je do greške prilikom registracije. Pokušajte ponovno',
            subTitle: 'Greška',
            buttons: ['OK']
          });
          alert.present();
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
