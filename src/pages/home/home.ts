import { Component } from '@angular/core';
import {
  NavController,
  NavParams,
  LoadingController,
  ToastController,
  Events,
  ModalController
} from 'ionic-angular';
import { LocalNotifications } from 'ionic-native';
// import { Storage } from '@ionic/storage';

import { SprinklersApiService, ConfigService, ConfigPage } from '../../shared/shared';
import { State } from '../../shared/models';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  zones: any[];
  zoneState: State = <State>{};
  scheduling: boolean = false;
  //newScheduling: boolean = false;
  //runningZone: string = "";
  runningTime: number;
  intervalId: number;
  timout: number;
  // configService: ConfigService;
  // url: string;
  //storage = new Storage();

  constructor(private toastCtrl: ToastController,
    private navCtrl: NavController,
    private navParams: NavParams,
    private api: SprinklersApiService,
    private loadingCtrl: LoadingController,
    private events: Events,
    private modalCtrl: ModalController,
    private configService: ConfigService) {
      events.subscribe('zones:save', () => {
        this.getZones();
      });
      events.subscribe('config:save', () => {
        //this.getZones();
        // this.url = this.configService.url;
        this.getZones();
      });
  }

  ionViewDidLoad() {
    // this.loadConfig();
    this.getZones(); 
  }

  // loadConfig(){
  //   // this.configService.getUrl().then(
  //   //   (value) => {
  //   //     console.log('got url', value);
  //   //     this.url = <string>value;
  //   //     if (this.url) {
  //   //       this.getZones();  
  //   //     } else {
  //   //       this.editUrl();
  //   //     }
  //   //   }, 
  //   //   (err) => {
  //   //     console.log('Error', err)
  //   //     // TODO: show messsage to user
  //   //   }
  //   // );
  // }

  editUrl() {
    let configModal = this.modalCtrl.create(ConfigPage, {'webUrl': this.configService.url});
    configModal.onDidDismiss( 
      (data) => {
        console.log(data);
        this.configService.setUrl(data.webUrl).then(
          (value) => {
           // this.url = data.webUrl;
            console.log('URL was updated in home');
            //this.getZones();
          }, 
          (err) => {
            console.log('Error', err)
          }
        );
      }
    );
    configModal.present();
  }

  getZones() {
    this.api.getZones().subscribe(
      (data) => {
        this.zones = data;
        this.checkState();
        // this.intervalId = setInterval(() => this.checkState(), 1000);
      },
      (error) => {
        console.error(error);
        this.editUrl();
      },
      () => console.log('zones retrieval completed')
    );
  }

  checkState() {
    this.api.getState().subscribe(
      (state) => {
        this.zoneState = state;
        if (this.zoneState.offtime != null) {
          if (this.zoneState.offtime == 99999) {
            this.runningTime = 0;
          } else {
            if (this.zoneState.offtime >= 0) {
              this.runningTime = this.zoneState.offtime;
            }
          }
        } else {
          this.scheduling = this.zoneState.run === 'on';
        }
      }, 
      (error) => {
        console.log(error);
        //clearInterval(this.intervalId);
        this.editUrl();
      },
      () => {
        console.log('state retrieval completed');
        setTimeout(() => this.checkState(), 1000);
      }
    );
  }

  scheduleNotification() {
    LocalNotifications.schedule({
      id: 1,
      title: 'Sprinklers App',
      text: `${this.zoneState.onzone} started`
      //sound: isAndroid? 'file://sound.mp3': 'file://beep.caf',
      //data: { secret: key }
    });
  }

  toggleScheduling() {
    let newState = this.scheduling ? 'on' : 'off';

    this.api.setState(newState).subscribe(
      data => {
        let toast = this.toastCtrl.create({
          duration: 2000,
          message: "Scheduling is " + newState,
          position: 'middle'
        });
        toast.present();
      },
      error => {
        console.error(error);
        // TODO: add user message that op failed
      }
    );
  }

  runZone(index: number) {
    let selectedZone = this.zones[index];
    let zoneName = String.fromCharCode(97 + index + 1);

    this.api.runZone(zoneName, 'on').subscribe(
      data => {
        let toast = this.toastCtrl.create({
          duration: 2000,
          message: `${selectedZone.name} started`,
          position: 'middle'
        });
        toast.present();
      },
      error => {
        console.error(error);
        // TODO: show error to user
      }
    );
  }

  stopZone() {
    let zoneName;
    for (var index = 0; index < this.zones.length; index++) {
      var element = this.zones[index];
      if (element.name === this.zoneState.onzone) {
        zoneName = String.fromCharCode(97 + index + 1);
      }
    }

    this.api.runZone(zoneName, 'off').subscribe(
      data => {
        let toast = this.toastCtrl.create({
          duration: 2000,
          message: `${this.zoneState.onzone} stoped`,
          position: 'middle'
        });

        toast.present();
      },
      error => {
        console.error(error);
        // TODO: show eeror to user
      }
    );
  }

  refreshAll(refresher) {
    refresher.complete();
    this.getZones();
    // this.loadConfig();//.then(
    //   (success) => {
    //     refresher.complete();
    //   },
    //   (error) => {
         
    //   }
    // );
  }
}
