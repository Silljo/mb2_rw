import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
  selector: 'page-dogadjanja',
  templateUrl: 'dogadjanja.html',
})
export class DogadjanjaPage {

  dogadjanja_kultura: Observable<any[]>;
  dogadjanja_sport: Observable<any[]>;
  dogadjanja_zabava: Observable<any[]>;
  dogadjanja: any;
  toast_msg: any;

  constructor(public navCtrl: NavController, db: AngularFireDatabase, private local_notifications: LocalNotifications, private toast: ToastController) {

    this.dogadjanja = 'kultura';

    this.dogadjanja_kultura = db.list("/dogadjanja_kultura/", ref => ref.orderByChild('order_date')).valueChanges();
    this.dogadjanja_sport = db.list("/dogadjanja_sport/", ref => ref.orderByChild('order_date')).valueChanges();
    this.dogadjanja_zabava = db.list("/dogadjanja_zabava/", ref => ref.orderByChild('order_date')).valueChanges();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DogadjanjaPage');
  }

  add_notification_reminder(datum, vrijeme, naziv, lokacija, icon)
  {

    var godina = datum.substring(6, 10);
    var mjesec = datum.substring(3, 5);
    var dan = datum.substring(0, 2);

    var sati = vrijeme.substring(0, 2);
    var minute = vrijeme.substring(3, 6);

    this.toast_msg = this.toast.create({
      message: "Dodali ste podsjetnik za dan "+datum+", u "+vrijeme+"\n-obavijest ćete primiti sat vremena prije početka događaja",
      position: 'bottom',
      duration: 5000,
    });

    this.toast_msg.present();

    this.local_notifications.schedule({
      id: godina + mjesec + dan + sati + minute,
      title: naziv,
      text: lokacija + ' (' + vrijeme + ' sati)',
      trigger: {at: new Date(godina, mjesec-1, dan, sati, minute, -3600)},
      data: { modul: 'dogadjanja' },
      icon: icon
    });
  }

}
