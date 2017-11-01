import { Component } from '@angular/core';
import {
    NavController,
    NavParams,
    LoadingController,
    ToastController,
    ActionSheetController,
    AlertController
} from 'ionic-angular';

import { SprinklersApiService } from '../../shared/shared';

@Component({
    selector: 'page-quick-schedule',
    templateUrl: 'quick-schedule.html'
})
export class QuickSchedulePage {
    zones: any[] = [];
    //schedules: any[];
    //zones: any = {};

    constructor(private toastCtrl: ToastController,
        private navCtrl: NavController,
        private navParams: NavParams,
        private api: SprinklersApiService,
        private loadingCtrl: LoadingController,
        // private events: Events,
        // private configService: ConfigService,
        private alertCtrl: AlertController) { }

    ionViewDidLoad() {
        this.api.getZones().subscribe(
            data => {
               // console.log(data);
                //this.zones = data;
                for (var index = 0; index < data.length; index++) {
                    var element = data[index];
                    //console.log(element);
                   // if (element.enabled === 'on') {
                        //console.log(element.name);
                        this.zones.push({ name: element.name, e: element.enabled, duration: 0 });
                    //}

                }

            },
            error => {
                console.log(error);
            });
        // this.api.getSchedules().subscribe(
        //     schedules => {
        //         this.schedules = schedules;
        //     },
        //     error => {
        //         console.log(error);
        //     },
        //     () => {
        //         console.log('schedules retrieval completed');
        //     });
    }

    run() {
        let saveString = "";
        for (var i = 0; i < this.zones.length; i++) {
          let zone = this.zones[i];
          if (zone.e === 'on') {
              let zoneIndex = String.fromCharCode(97 + i + 1);
              saveString += 'z' + zoneIndex + '=' + zone.duration;
              saveString += '&';
          }
        }
       // console.log(saveString);
        this.api.runSchedule(saveString).subscribe(
            error => {
                console.log(error);
            },
            () => {
                console.log('schedules started');
            });
        this.navCtrl.pop();
    }

    cancel() {
        this.navCtrl.pop();
    }
}