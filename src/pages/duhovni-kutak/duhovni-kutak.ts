import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
  selector: 'page-duhovni-kutak',
  templateUrl: 'duhovni-kutak.html',
})
export class DuhovniKutakPage {

  duhovni_kutak_data: Observable<any[]>;
  toast_msg: any;

  constructor(public navCtrl: NavController, db: AngularFireDatabase, private local_notifications: LocalNotifications, private toast: ToastController) {
    this.duhovni_kutak_data = db.list("/duhovni_kutak/", ref => ref.orderByChild('order_date')).valueChanges();
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
      //at: new Date(godina, mjesec-1, dan, sati, minute, -3600),
      icon: icon
    });
  }

}
