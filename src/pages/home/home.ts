import { Component } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  podaci: any;
  podaci_vrijeme: any;
  podaci_vrijeme_prognoza: any;
  podaci_vrijeme_data: any;
  vrijeme_slike: any;
  vrijeme_data_ikona: string;
  vrijeme_opis: string;
  vrijeme_temp: string;
  vrijeme_temp_max: string;
  vrijeme_temp_min: string;
  slika_pozadina: string;
  prognoza: Array<any>;

  constructor(public db: AngularFireDatabase) {

    this.podaci_vrijeme = this.db.object('/weather/').valueChanges().subscribe((data_vrijeme) => {

      this.podaci_vrijeme_data = JSON.parse(data_vrijeme['current'].data);

      this.vrijeme_data_ikona = 'assets/icon/' + this.podaci_vrijeme_data.weather[0].icon + '.svg';
      this.vrijeme_opis = this.podaci_vrijeme_data.weather[0].description.charAt(0).toUpperCase() + this.podaci_vrijeme_data.weather[0].description.slice(1);
      this.vrijeme_temp = this.podaci_vrijeme_data.main.temp;
      this.vrijeme_temp_max = this.podaci_vrijeme_data.main.temp_max;
      this.vrijeme_temp_min = this.podaci_vrijeme_data.main.temp_min;

      this.podaci_vrijeme_prognoza = JSON.parse(data_vrijeme['forecast'].data).list;

      this.format_datuma();

      this.prognoza = [{
        0: this.podaci_vrijeme_prognoza[0],
        1: this.podaci_vrijeme_prognoza[1],
        2: this.podaci_vrijeme_prognoza[2],
        3: this.podaci_vrijeme_prognoza[3],
        4: this.podaci_vrijeme_prognoza[4]
      }, {
        0: this.podaci_vrijeme_prognoza[5],
        1: this.podaci_vrijeme_prognoza[6],
        2: this.podaci_vrijeme_prognoza[7],
        3: this.podaci_vrijeme_prognoza[8],
        4: this.podaci_vrijeme_prognoza[9]
      },{
        0: this.podaci_vrijeme_prognoza[10],
        1: this.podaci_vrijeme_prognoza[11],
        2: this.podaci_vrijeme_prognoza[12],
        3: this.podaci_vrijeme_prognoza[13],
        4: this.podaci_vrijeme_prognoza[14]
      },{
        0: this.podaci_vrijeme_prognoza[15],
        1: this.podaci_vrijeme_prognoza[16],
        2: this.podaci_vrijeme_prognoza[17],
        3: this.podaci_vrijeme_prognoza[18],
        4: this.podaci_vrijeme_prognoza[19]
      },{
        0: this.podaci_vrijeme_prognoza[20],
        1: this.podaci_vrijeme_prognoza[21],
        2: this.podaci_vrijeme_prognoza[22],
        3: this.podaci_vrijeme_prognoza[23],
        4: this.podaci_vrijeme_prognoza[24]
      },{
        0: this.podaci_vrijeme_prognoza[25],
        1: this.podaci_vrijeme_prognoza[26],
        2: this.podaci_vrijeme_prognoza[27],
        3: this.podaci_vrijeme_prognoza[28],
        4: this.podaci_vrijeme_prognoza[29]
      }];

    });

  }


  format_datuma()
  {
    for (let key in this.podaci_vrijeme_prognoza) {

      var datum_timestamp = new Date(this.podaci_vrijeme_prognoza[key].dt * 1000);
      var dan = datum_timestamp.getDay();

      if(dan == 0)
      {
        this.podaci_vrijeme_prognoza[key].dan_txt = 'Ned';
      }
      if(dan == 1)
      {
        this.podaci_vrijeme_prognoza[key].dan_txt = 'Pon';
      }
      if(dan == 2)
      {
        this.podaci_vrijeme_prognoza[key].dan_txt = 'Uto';
      }
      if(dan == 3)
      {
        this.podaci_vrijeme_prognoza[key].dan_txt = 'Sri';
      }
      if(dan == 4)
      {
        this.podaci_vrijeme_prognoza[key].dan_txt = 'Čet';
      }
      if(dan == 5)
      {
        this.podaci_vrijeme_prognoza[key].dan_txt = 'Pet';
      }
      if(dan == 6)
      {
        this.podaci_vrijeme_prognoza[key].dan_txt = 'Sub';
      }

    }

  }

}
