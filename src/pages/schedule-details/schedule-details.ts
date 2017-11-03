import { Component } from '@angular/core';
import { NavController, 
         NavParams, 
         LoadingController, 
         ToastController, 
         ActionSheetController, 
         AlertController } from 'ionic-angular'; 

import { SprinklersApiService } from '../../shared/shared';

@Component({
  selector: 'page-schedule-details',
  templateUrl: 'schedule-details.html'
})
export class ScheduleDetailsPage {
  scheduleId: number;
  scheduleDetails: any = {};
  name: string;
  enabled: boolean;
  interval: number;
  type: boolean;
  wadj: boolean;
  zones: any;
  days: Array<string> = [];
  // dayData: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public api: SprinklersApiService,
              public loaderCtrl: LoadingController,
              public toastCtrl: ToastController,
              public actionCtrl: ActionSheetController,
              public alertCtrl: AlertController,
              // public events: Events,
              // public configService: ConfigService
              ) { }

  ionViewDidLoad() {
   // console.log(this.navParams.data);
  //  this.url = this.configService.url;
    this.scheduleId = this.navParams.data;
    //console.log(this.scheduleId);
    if (this.scheduleId < 0) {
      this.api.getZones().subscribe(
          data => {
            this.zones = data;
            //console.log(this.zones);
            this.scheduleDetails.zones = [];
            for (var index = 0; index < this.zones.length; index++) {
              var element = this.zones[index];
              this.scheduleDetails.zones.push({name: element.name, e: element.enabled, duration: 0});
            }
         // console.log(this.scheduleDetails.zones);
          },
          error => {
            console.log(error);
          });

      this.scheduleDetails.name = "";
      this.scheduleDetails.enabled = false;
      this.scheduleDetails.type = false;
      this.scheduleDetails.wadj = false;
      this.scheduleDetails.interval = 0;
      
      this.days = [];
      
      this.scheduleDetails.times = [
        { t: '00:00', e: false },
        { t: '00:00', e: false },
        { t: '00:00', e: false },
        { t: '00:00', e: false }];
       
    } else {
      this.api.getScheduleDetails(this.scheduleId)
        .subscribe(data => {
          //console.log(data);
          this.scheduleDetails = data;
          this.name = this.scheduleDetails.name;
          this.enabled = this.scheduleDetails.enabled === 'on' ? true : false;
          this.type = this.scheduleDetails.type === 'on' ? true : false;
          this.wadj = this.scheduleDetails.wadj === 'on' ? true : false;
          this.interval = this.scheduleDetails.interval;

          if (this.scheduleDetails.d1 === 'on') this.days.push('d1');
          if (this.scheduleDetails.d2 === 'on') this.days.push('d2');
          if (this.scheduleDetails.d3 === 'on') this.days.push('d3');
          if (this.scheduleDetails.d4 === 'on') this.days.push('d4');
          if (this.scheduleDetails.d5 === 'on') this.days.push('d5');
          if (this.scheduleDetails.d6 === 'on') this.days.push('d6');
          if (this.scheduleDetails.d7 === 'on') this.days.push('d7');
          
          this.scheduleDetails.times = [
            {t: this.scheduleDetails.times[0].t, e: this.scheduleDetails.times[0].e == 'on'},
            {t: this.scheduleDetails.times[1].t, e: this.scheduleDetails.times[1].e == 'on'},
            {t: this.scheduleDetails.times[2].t, e: this.scheduleDetails.times[2].e == 'on'},
            {t: this.scheduleDetails.times[3].t, e: this.scheduleDetails.times[3].e == 'on'}];
        },
        error => {
          console.log('error occurred here');
          console.log(error);
        },
        () => {
          console.log('schedule details retrieval completed');
      });
    }
  }

  presentActionSheet() {
    let actionSheet = this.actionCtrl.create({
      //title: 'Actions',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            if (this.scheduleId >= 0) {
              this.deleteSchedule();
            }
          }
        },{
          text: 'Save',
          handler: () => {
            this.saveSchedule();
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  saveSchedule(){
    let saveString = "";//id=" + this.scheduleId + '&';
    saveString += 'name=' + this.name + '&';
    saveString += 'enable=' + (this.enabled ? 'on' : 'off') + '&';
    saveString += 'type=' + (this.type ? 'on' : 'off') + '&';
    saveString += 'wadj=' + (this.wadj ? 'on' : 'off') + '&';
    saveString += 'interval=' + this.interval + '&';
    
    for (var i = 0; i < this.days.length; i++) {
       saveString += this.days[i] + '=on&';
    }

    for (var i = 0; i < this.scheduleDetails.times.length; i++) {
      let time = this.scheduleDetails.times[i];
      let number = i + 1;
      if (time.e == true) {
        saveString += `t${number}=${time.t}&e${number}=on&`;
      }
    }
    // console.log(saveString);
    for (var i = 0; i < this.scheduleDetails.zones.length; i++) {
      let zone = this.scheduleDetails.zones[i];
      let zoneIndex = String.fromCharCode(97 + i + 1);
      if (zone.e === 'on') {
        saveString += 'z' + zoneIndex + '=' + zone.duration + '&';
      }
    }
    // console.log(saveString);
    this.api.setScheduleDetails(this.scheduleId, saveString)
      .subscribe(
        data => {
          let toast = this.toastCtrl.create({
            duration: 2000,
            message: "Saved successfully",
            position: 'middle'
          });
          toast.present();
         // this.events.publish('schedule:changed', this.scheduleId);
          this.navCtrl.pop();
        }, 
        err => {
          // Log errors if any
          console.log(<any>err);
          let toast = this.toastCtrl.create({
            duration: 2000,
            message: "Saved failed",
            position: 'middle'
          });
          toast.present();
        });
  }

  deleteSchedule(){
    let confirm = this.alertCtrl.create({
      title: 'Delete this schedule?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.api.deleteSchedule(this.scheduleId)
              .subscribe(
                data => {
                  let toast = this.toastCtrl.create({
                    duration: 2000,
                    message: "Deleted successfully",
                    position: 'middle'
                  });
                  toast.present();
                 // this.events.publish('schedule:changed', this.scheduleId);
                  this.navCtrl.pop();
                  }, 
                err => {
                  // Log errors if any
                  console.log(<any>err)
                  let toast = this.toastCtrl.create({
                    duration: 2000,
                    message: "Deleted failed",
                    position: 'middle'
                  });
                  toast.present();
                });
          }
        }
      ]
    });
    confirm.present();
  }
}
 