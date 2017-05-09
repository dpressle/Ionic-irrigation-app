import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { TabsPage } from '../pages/pages';
import { SprinklersApiService, ConfigService } from '../shared/shared';

@Component({
  templateUrl: 'app.html',
  providers: [
    ConfigService,
    SprinklersApiService
    ]
})
export class MyApp {
  rootPage = TabsPage;
  configReady: boolean = false;

  constructor(platform: Platform, config: ConfigService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      config.getUrl().then(
        data => {
          console.log('got url in app', data);
          this.configReady = true;
        }
      );
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
