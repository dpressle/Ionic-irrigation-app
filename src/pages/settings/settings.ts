import { Component } from '@angular/core';
import { NavController, 
         NavParams, 
         LoadingController, 
         ToastController, 
         ActionSheetController, 
         AlertController,
         Events,
         ModalController,
         ViewController } from 'ionic-angular';

import { SprinklersApiService } from '../../shared/shared';
import { Settings, Wcheck } from '../../shared/models';

@Component({
  template: `
   <ion-header>
  <ion-toolbar>
    <ion-title>
      WUnderground Data
    </ion-title>
    <ion-buttons start>
      <button ion-button (click)="dismiss()">
        <span ion-text color="primary" showWhen="ios">Cancel</span>
        <ion-icon name="md-close" showWhen="android, windows"></ion-icon>
      </button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
<ion-content>
  <ion-list>
    <ion-item>Min Humidity: {{data.minhumidity}} %</ion-item>
    <ion-item>Max Humidity: {{data.maxhumidity}} %</ion-item>
    <ion-item>Mean Temp: {{data.meantempi}} &deg;F</ion-item>
    <ion-item>Precip Today: {{data.precip_today/100}} "</ion-item>
    <ion-item>Precip Yesterday: {{data.precip/100}} "</ion-item>
    <ion-item>Wind Yesterday: {{data.wind_mph/10}} mph</ion-item>
    <ion-item>UV Now: {{data.UV/10}}</ion-item>
    <ion-item>Overall Scale: {{data.scale}} %</ion-item> 
  </ion-list>
</ion-content>
  `
})
export class Wether {
  data: Wcheck = <Wcheck>{};

  constructor(private navCtrl: NavController,
    private params: NavParams,
    public viewCtrl: ViewController) {
    this.data = params.get('wcheck');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  settings: Settings = <Settings>{};;
  wcheck: Wcheck = <Wcheck>{};
  // private url: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public api: SprinklersApiService,
              public loaderCtrl: LoadingController,
              public toastCtrl: ToastController,
              public actionCtrl: ActionSheetController,
              public alertCtrl: AlertController,
              public events: Events,
              public modalCtrl: ModalController,
              // public configService: ConfigService
              ) {
                // events.subscribe('config:save', () => {
                //   this.url = this.configService.url;
                // });
              }

  ionViewDidLoad() {
    // this.url = this.configService.url;
    this.api.getSettings().subscribe(
      data => {
        this.settings = data
      });
  }

  saveSettings(){
    let saveString: string = `ip=&netmask=&gateway=&wuip=${this.settings.wuip}&apikey=${this.settings.apikey}&wutype=${this.settings.wutype}&zip=${this.settings.zip}&pws=${this.settings.pws}&NTPip=&NTPoffset=&webport=${this.settings.webport}&sadj=${this.settings.sadj}&ot=${this.settings.ot}`;

    //console.log(saveString);
    this.api.setSettings(saveString).subscribe(
      data => {
         let toast = this.toastCtrl.create({
            duration: 2000,
            message: "saved successfully",
            position: 'middle'
          });
          toast.present();
      },
      error => console.log(error));
  }

  testWundergound(){
    this.api.getWether().subscribe(
      data => {
        this.wcheck = data;
        if (this.wcheck.keynotfound == 'true') {
          let toast = this.toastCtrl.create({
            duration: 2000,
            message: "WUnderground API Key is invalid!",
            position: 'middle'
          });
          toast.present();
        } else if (this.wcheck.valid == 'false') {
          let toast = this.toastCtrl.create({
            duration: 2000,
            message: "Invalid Response from WUnderground server!",
            position: 'middle'
          });
          toast.present();
        } else {
          let wetherModal = this.modalCtrl.create(Wether, {wcheck: this.wcheck});
          wetherModal.present();
        }
      },
      error => console.log(error));
  }

  factoryDefaults(){
    let prompt = this.alertCtrl.create({
      title: 'Factory Defaults',
      message: "Are you sure you want to return to factory defaults?",
      // inputs: [
      //   {
      //     name: 'title',
      //     placeholder: 'Title'
      //   },
      // ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: data => {
            this.api.factoryDefaults().subscribe(
              data => {
                   let toast = this.toastCtrl.create({
                    duration: 2000,
                    message: "Reset to factory defaults",
                    position: 'middle'
                  });
                  toast.present();
                },
                error => {
                  let toast = this.toastCtrl.create({
                    duration: 2000,
                    message: "Failed to reset to default",
                    position: 'middle'
                  });
                  toast.present();
                });
          }
        }
      ]
    });
    prompt.present();
  }

  resetSystem(){
    let prompt = this.alertCtrl.create({
      title: 'Reset System',
      message: "Are you sure you want to reset system?",
      // inputs: [
      //   {
      //     name: 'title',
      //     placeholder: 'Title'
      //   },
      // ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: data => {
            this.api.resetSystem().subscribe(
              data => {
                   let toast = this.toastCtrl.create({
                    duration: 2000,
                    message: "System resseting",
                    position: 'middle'
                  });
                  toast.present();
                },
                error => {
                  let toast = this.toastCtrl.create({
                    duration: 2000,
                    message: "Failed to reset",
                    position: 'middle'
                  });
                  toast.present();
                });
          }
        }
      ]
    });
    prompt.present();
  }

  refreshAll(refresher) {
    refresher.complete();
    this.ionViewDidLoad();
  }
}
