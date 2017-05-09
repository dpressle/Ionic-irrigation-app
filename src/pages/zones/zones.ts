import { Component } from '@angular/core';
import { NavController, 
         NavParams, 
         LoadingController, 
         ToastController,
         Events } from 'ionic-angular';

//import { HomePage } from '../pages';
import { SprinklersApiService } from '../../shared/shared';

@Component({
  selector: 'page-zones',
  templateUrl: 'zones.html'
})
export class ZonesPage {
  zones: any[];
  //private url: string;

  constructor(
    private toastCtrl: ToastController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private api: SprinklersApiService,
    private loadingCtrl: LoadingController,
    public events: Events,
    //public configService: ConfigService
    ) {
      //  events.subscribe('config:save', () => {
      //   this.url = this.configService.url;
      // });
     }

  ionViewDidLoad() {
    // this.configService.getUrl().then((value) => {
    //   console.log('got url', value);
      //this.url = this.configService.url;//<string>value;
      this.loadZones();
      
    // }, (err) => {
      // console.log('Error', err)
    // });
  }

  loadZones() {
    this.api.getZones().subscribe(
      (data) => this.zones = data,
      (error) => console.log(error),
      () => console.log('zones retrieval completed')
    );
  }

  saveZones(){
    let saveString = "";
    for (var i = 0; i < this.zones.length; i++) {
      let zone = this.zones[i];
      let zoneIndex = String.fromCharCode(97 + i + 1);
      saveString += 'z' + zoneIndex + 'name=' + (zone.name ? zone.name : 'zone'+i);
      if (zone.enabled === 'on' || zone.enabled === true) {
        saveString += '&z' + zoneIndex + 'e=on';
      }
      if (zone.pump === 'on' || zone.pump === true) {
        saveString += '&z' + zoneIndex + 'p=on';
      }
      saveString += '&';
    }
    //console.log(saveString);
    this.api.setZones(saveString)
      .subscribe(
        data => {
          // this.events.publish('zones:save');//moved to api
          this.navCtrl.parent.select(0);
          // let toast = this.toastCtrl.create({
          //   duration: 2000,
          //   message: "Zones saved successfully",
          //   position: 'middle'
          // });
          // toast.present();
      },
      err => {
        console.log(err);
      });
  }

  refreshAll(refresher) {
    this.loadZones();
    refresher.complete();
  }
}
