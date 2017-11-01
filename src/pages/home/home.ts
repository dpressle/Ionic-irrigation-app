import { Component } from '@angular/core';
import {
  NavController,
  NavParams,
  LoadingController,
  ToastController,
  Events,
  ModalController,
  AlertController
} from 'ionic-angular';
import { LocalNotifications } from 'ionic-native';
// import { Storage } from '@ionic/storage';
import { QuickSchedulePage } from '../pages';
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
  runningTime: string;
  // intervalId: number;
  timeout: number;
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
    private configService: ConfigService,
    private alertCtrl: AlertController) {
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

  ionViewWillEnter () {
    if (this.zoneState.offtime == null) {
      this.checkState();
    }
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
        //this.checkState();
        // this.intervalId = setInterval(() => this.checkState(), 1000);
      },
      (error) => {
        console.error(error);
        let alert = this.alertCtrl.create({
          title: 'Failed getting zones!',
          subTitle: error,
          buttons: ['OK']
        });
        // alert.present();
        this.editUrl();
      },
      () => console.log('zones retrieval completed')
    );
  }

  checkState() {
    this.api.getState().subscribe(
      (state) => {
        this.scheduling = state.run === 'on';
        this.zoneState = state;
        if (this.zoneState.offtime != null) {
          console.log(this.zoneState.offtime);
          this.timeout = (new Date().getTime()) + (1000 * state.offtime);
          
          if (state.offtime == 99999) {
            this.runningTime = '- - : - -';
          } else {
            this.updateState();
            //setInterval(() => this.updateState(), 1);
            //setTimeout(() => this.updateState(), 1);
          }
        } else {
          this.timeout = 0;
        }
      }, 
      (error) => {
        console.log(error);
        this.editUrl();
      },
      () => {
        console.log('state retrieval completed');
        //setTimeout(() => this.checkState(), 1000);
      }
    );
  }

  updateState() {
    // console.log('timeout: '+this.timeout);
    // console.log('round: '+Math.round(new Date().getTime() / 1000));
    // console.log('before floor: '+(this.timeout - Math.round((new Date().getTime()) / 1000)));
    let remaining = this.timeout - (new Date().getTime());
    //console.log('remaining: '+remaining);
    remaining = Math.round(remaining / 1000);
    console.log('remaining: '+remaining);
    if (remaining >= 0) {
      this.runningTime = Math.round(remaining / 60).toString() + ":" + ("00" + (remaining % 60  ).toString()).substr(-2);
      setTimeout(() => this.updateState(), 1000);
    } else {
      this.checkState();
    }
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
      },
      () => {
        this.checkState();
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
      },
      () => {
        this.checkState();
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

  quickSchedule() {
    this.navCtrl.push(QuickSchedulePage);
    this.checkState();
  }
}
