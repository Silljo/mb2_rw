import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { DuhovniKutakPage } from '../pages/duhovni-kutak/duhovni-kutak';
import { DogadjanjaPage } from '../pages/dogadjanja/dogadjanja';

import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { ConnectivityServiceProvider } from '../providers/connectivity-service/connectivity-service';
import { Firebase } from '@ionic-native/firebase';
import { ToastController } from 'ionic-angular';

import * as firebase from 'firebase';
import { AuthProvider } from '../providers/auth/auth';

export class NotificationModel {
    public body: string;
    public title: string;
    public tap: boolean
    public aps: any;
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = '';
  pages: Array<{title: string, component: any, icon: string, icon_color: string}>;
  user_img: string;
  username: string;
  email: string;
  data_user = <any>{};
  redirekcija: boolean;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private streamingMedia: StreamingMedia,
              private afAuth: AngularFireAuth, public events: Events,
              public conn: ConnectivityServiceProvider, private db: AngularFireDatabase, public firebase_plugin: Firebase, public menu: MenuController,
              public toast: ToastController, public auth_provider: AuthProvider) {

    this.initializeApp();

    this.pages = [
      { title: 'Početna', component: HomePage, icon: 'md-home', icon_color: 'siva'},
      { title: 'Smještaj', component: 'SmjestajPage', icon: 'md-briefcase', icon_color: 'narandjasta'},
      { title: 'Gastro', component: 'GastroPage', icon: 'md-restaurant', icon_color: 'roza'},
      { title: 'Događanja', component: DogadjanjaPage, icon: 'md-list-box', icon_color: 'zelena'},
      { title: 'Interaktivna mapa', component: 'InteraktivnaMapaPage', icon: 'ios-map', icon_color: 'bijela'},
      { title: 'Posebnosti', component: 'AtrakcijePage', icon: 'ios-camera', icon_color: 'siva'},
      { title: 'Duhovni kutak', component: DuhovniKutakPage, icon: 'md-body', icon_color: 'crna'},
      { title: 'Komunalno', component: 'KomunalnoPage', icon: 'md-warning', icon_color: 'plava'},
      { title: 'Oglasna ploča', component: 'OglasnaPlocaPage', icon: 'md-albums', icon_color: 'crvena_tamna'}
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();

      setTimeout(() => {
          this.splashScreen.hide();
      }, 1000);

      this.platform.registerBackButtonAction(() => {
            if(this.nav.canGoBack()){
              this.nav.pop();
            }else{
              //don't do anything
            }
          });
    });

    //Clearamo badge
    this.firebase_plugin.setBadgeNumber(0);

    //Ajmo pohraniti sve vezano za korisnika sta bi nam trebalo u nekom trenutku
    this.afAuth.authState.subscribe(data => {

      if (data && data.uid) {
        //Ajmo po sliku usera i naziv
        this.db.object("/user_profiles/" + data.uid).valueChanges().subscribe((data_user) => {
          if(data_user)
          {
            this.username = data_user['display_name'];
            this.user_img = data_user['slika'];
            this.email = data_user['email'];

          }

        });

        if(!this.redirekcija)
        {
            this.menu.enable(true);
            this.rootPage = HomePage;

            // Handle incoming notifications
            this.firebase_plugin.onNotificationOpen().subscribe(
              (notification: NotificationModel) => {

                  if(!notification.tap)
                  {
                    if(this.platform.is('android'))
                    {
                      var notification_body = notification.body;
                    }

                    if(this.platform.is('ios'))
                    {
                      if(notification.aps.alert.body)
                      {
                        var notification_body:string = notification.aps.alert.body;
                      }
                      else
                      {
                        var notification_body:string = notification.aps.alert;
                      }

                    }

                    //Kad je aplikacija otvorena dati ćemo korisniku samo alert neki ili toast ovisi kaj će ljepse izgledati
                    let toast = this.toast.create({
                      message: notification_body,
                      position: 'top',
                      showCloseButton: true,
                      closeButtonText: 'OK'
                    });

                    toast.present();
                  }
                  else
                  {
                    //Kad je aplikacija zatvorena
                    if(notification['modul'] == 'komunalno')
                    {
                        this.nav.setRoot('KomunalnoPage', {komunalno_segment_redirect: 'arhiva'});
                    }
                    else if(notification['modul'] == 'dogadjanja')
                    {
                      this.nav.setRoot(DogadjanjaPage);
                    }
                    else if(notification['modul'] == 'duhovni_kutak')
                    {
                      this.nav.setRoot(DuhovniKutakPage);
                    }
                    else if(notification['modul'] == 'smjestaj')
                    {
                      this.nav.setRoot('SmjestajPage');
                    }
                    else if(notification['modul'] == 'gastro')
                    {
                      this.nav.setRoot('GastroPage');
                    }
                    else if(notification['modul'] == 'atrakcije')
                    {
                      this.nav.setRoot('AtrakcijePage');
                    }

                  }
              },
              error => {
                  console.error('Error getting the notification', error);
              });
        }

      }
      else {
        //Nema nikakvih podataka da je korisnik ulogiran...
        this.menu.enable(false);
        this.rootPage = LoginPage;
      }
    });

  }

  openPage(page) {

      if(page.component.name == 'HomePage')
      {
          this.nav.setRoot(HomePage);
      }
      else if(page.component.name == 'DogadjanjaPage')
      {
        this.nav.setRoot(DogadjanjaPage);
      }
      else if(page.component.name == 'DuhovniKutakPage')
      {
        this.nav.setRoot(DuhovniKutakPage);
      }
      else
      {
        this.nav.setRoot(page.component);
      }

  }

  openRadio():void
  {
    var audioUrl = 'http://85.10.55.147:8026/stream/';

    // Play an audio file with options (all options optional)
    var options = {
      bgColor: "#FFFFFF",
      bgImage: "https://firebasestorage.googleapis.com/v0/b/mbistrica-c5bd3.appspot.com/o/rmb_logo.png?alt=media&token=7854878d-55b2-4856-b790-748ab7484513",
      bgImageScale: "fit", // other valid values: "stretch"
      initFullscreen: true, // true(default)/false iOS only
      successCallback: function() {

      },
      errorCallback: function(errMsg) {
          this.nav.setRoot(HomePage);
      }
    };
    this.streamingMedia.playAudio(audioUrl, options);
  }

  open_livestream()
  {
      var video = "rtmp://cdn-003.whatsupcams.com/live/hr_marbistrica01";

      let options: StreamingVideoOptions = {
        successCallback: () => { console.log('Video played') },
        errorCallback: (e) => { alert(e) },
        orientation: 'landscape'
      };

      this.streamingMedia.playVideo(video, options);
  }

  logout()
  {

    this.auth_provider.logout_true();
    this.firebase_plugin.unregister();
    this.afAuth.auth.signOut();

    firebase.auth().signOut().then(function() {
      //Ako se odlogira moramo maknuti korisnikov token

    }, function(error) {

    });
  }

  user_postavke()
  {
    this.nav.setRoot('UserPostavkePage');
  }

}
