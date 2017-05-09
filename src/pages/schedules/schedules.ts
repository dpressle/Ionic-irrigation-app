import { Component } from '@angular/core';
import { NavController, 
         NavParams, 
         LoadingController, 
         AlertController, 
         ToastController,
         Events } from 'ionic-angular';

import { ScheduleDetailsPage } from '../pages';
import { SprinklersApiService } from '../../shared/shared';

@Component({
  selector: 'page-schedules',
  templateUrl: 'schedules.html'
})
export class SchedulesPage {
  // private url: string;
  schedules: any[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private api: SprinklersApiService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtlr: ToastController,
    public events: Events,
    // private configService: ConfigService
    ) {
    events.subscribe('schedule:saved', (id) => {
      console.log('Schedule', id, 'changed');
      this.getSchedules();
    });
    // events.subscribe('config:save', () => {
    //   this.url = this.configService.url;
    // });
  }

  ionViewDidLoad() {
    // this.url = this.configService.url;
    this.getSchedules();
  }

  getSchedules() {
    this.api.getSchedules().subscribe(
      schedules => {
        this.schedules = schedules;
      },
      error => {
        console.log('error occurred here');
        console.log(error);
      },
      () => {
        console.log('schedules retrieval completed');
      });
  }

  itemTapped(scheduleId: number){
    this.navCtrl.push(ScheduleDetailsPage, scheduleId);
  }

  itemRun(scheduleId: number) {
    //let activeZones = 'zb=0&zc=0&zd=0&ze=0&zf=0&zg=0&zh=0';
    this.api.runSchedule(scheduleId).subscribe(
      data => {
        let toast = this.toastCtlr.create({
          duration: 2000,
          message: "Successfully Run schedule",
          position: 'middle'
        });

        toast.present();
        this.navCtrl.parent.select(0);
      },
      error => {
        console.error(error);
      }
    );
  }

  newSchedule(){
    this.navCtrl.push(ScheduleDetailsPage, -1);
  }

  refreshAll(refresher) {
    refresher.complete();
    this.getSchedules();
  }

}
