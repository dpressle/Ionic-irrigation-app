import { Injectable, Component } from '@angular/core';
import {
  NavController,
  NavParams,
  ViewController,
  Events
} from 'ionic-angular';

import { Storage } from '@ionic/storage';

@Injectable()
export class ConfigService {
    private _url: string;
    private isOpen: boolean;
    private storage: Storage;
    //public modalCtrl = new ModalController();

    constructor(private events: Events) {
      if(!this.isOpen) {
        this.storage = new Storage();
        this.isOpen = true;
      }
    }

    get url(){
      return this._url;
    }

    set url(webUrl: string){
      this._url = webUrl;
    }

    getUrl(){
      return new Promise((resolve, reject) => {
        this.storage.ready().then(
          () => {
            this.storage.get('baseUrl').then(
              (data) => {
                if (data != null) {
                  this._url = data;
                }
                resolve(this._url);
              }, 
              (error) => {
                reject(error);
              }
            );
          }
        );
      });
    }

    setUrl(newUrl: string){
      return new Promise(
        (resolve, reject) => {
          this.storage.ready().then(
            () => {
              this.storage.set('baseUrl', newUrl).then(
                (data) => {
                  console.log('url saved in config', newUrl);
                  this._url = newUrl;
                  this.events.publish('config:save');
                  resolve(data);
                }, 
                (error) => {
                  reject(error);
                }
              );
            }
          );
        }
      );
    }
}

@Component({
  template: `
   <ion-header>
  <ion-toolbar>
    <ion-title>
      Configuration
    </ion-title>
    <ion-buttons start>
      <button ion-button (click)="dismiss()">
        <span ion-text color="primary" showWhen="ios">Save</span>
        <ion-icon name="md-close" showWhen="android, windows"></ion-icon>
      </button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
<ion-content>
  <ion-list>
    <ion-item>
        <ion-label fixed>Web URL</ion-label>
        <ion-input type="text" [(ngModel)]="webUrl" value=""></ion-input>
    </ion-item>
  </ion-list>
</ion-content>
  `
})
export class ConfigPage {
    private webUrl: string;

    constructor(private navCtrl: NavController,
        private params: NavParams,
        public viewCtrl: ViewController,
        private events: Events,
        private config: ConfigService) {
          this.webUrl = params.get('webUrl');
          console.log('webUrl in config page is', this.webUrl);
          events.subscribe('config:save', () => {
              this.webUrl = this.config.url;
          });
    }

    dismiss() {
        let data = { 'webUrl': this.webUrl };
        this.viewCtrl.dismiss(data);
    }
}