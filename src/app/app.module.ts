import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { DatePipe } from '@angular/common';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//FIREBASE config
import { FIREBASE_CONFIG } from "./app.firebase.config";
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

//Pluginovi
import { Facebook } from '@ionic-native/facebook'
import { Firebase } from '@ionic-native/firebase';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { Geolocation } from '@ionic-native/geolocation';
import { Network } from '@ionic-native/network';
import { Camera } from '@ionic-native/camera';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Diagnostic } from '@ionic-native/diagnostic';
import { StreamingMedia } from '@ionic-native/streaming-media';
import { GoogleMaps } from '@ionic-native/google-maps';

//Providers
import { AuthProvider } from '../providers/auth/auth';
import { ConnectivityServiceProvider } from '../providers/connectivity-service/connectivity-service';

//Pages
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { DuhovniKutakPage } from '../pages/duhovni-kutak/duhovni-kutak';
import { DogadjanjaPage } from '../pages/dogadjanja/dogadjanja';

//Components
import { TimelineComponent } from '../components/timeline/timeline';
import { TimelineTimeComponent } from '../components/timeline/timeline';
import { TimelineItemComponent } from '../components/timeline/timeline';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    DuhovniKutakPage,
    DogadjanjaPage,
    TimelineComponent,
    TimelineItemComponent,
    TimelineTimeComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    DuhovniKutakPage,
    DogadjanjaPage,
    TimelineComponent,
    TimelineItemComponent,
    TimelineTimeComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    ConnectivityServiceProvider,
    Facebook,
    Firebase,
    LaunchNavigator,
    Geolocation,
    Network,
    Camera,
    LocalNotifications,
    Diagnostic,
    DatePipe,
    StreamingMedia,
    GoogleMaps

  ]
})
export class AppModule {}
