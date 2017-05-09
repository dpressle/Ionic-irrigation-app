import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

import { Logs } from '../../shared/models';

import { SprinklersApiService } from '../../shared/shared';


/*
  Generated class for the Logs page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-logs',
  templateUrl: 'logs.html'
})
export class LogsPage {
  startTime: string;
  endTime: string;
  logs: Logs[];
  allLogs: Logs[];
  zones: any[];
  queryText: string = "";
  // private url: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private api: SprinklersApiService,
    private loadingCtrl: LoadingController,
    // private configService: ConfigService,
    // private events: Events
    ) {
    // events.subscribe('config:save', () => {
    //   this.url = this.configService.url;
    // });
  }

  ionViewDidLoad() {
    // this.url = this.configService.url;
    let date = new Date();
    this.endTime = date.toISOString();
    date.setDate(date.getDate() - 1);
    this.startTime = date.toISOString();
    
    this.api.getZones().subscribe(
        data => {
          this.zones = data;
          this.getLogsByDate();
        },
        err => {
          console.log(err)
        }
    );
  }

  getLogsByDate() {
    this.api.getLogs(new Date(this.startTime).getTime()/1000, new Date(this.endTime).getTime()/1000).subscribe(
      data => {
        this.logs = data;
        this.allLogs = this.logs;
        //console.log(this.logs);
      },
      error => {
        console.error(error);
        // TODO: show message to user
      });
  }

  onStartChange() {
    //this.startTime = 
    this.getLogsByDate();
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    refresher.complete();
    this.getLogsByDate();
  }

  getLogs($event){
    let queryTextLower = this.queryText.toLowerCase();
    if(queryTextLower != '') {
      let filteredZones = [];
      for (var index = 0; index < this.allLogs.length; index++) {
        var element = this.allLogs[index];
        //console.log(this.zones[element.zone].name.toLowerCase());
        if (this.zones[element.zone - 1].name.toLowerCase().includes(queryTextLower)) {
          filteredZones.push(element);
        }
      }
      this.logs = filteredZones;
    } else {
      this.logs = this.allLogs;
    }
  }
}
