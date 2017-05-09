import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MyApp } from './app.component';
import { TabsPage, HomePage, ZonesPage, SchedulesPage, ScheduleDetailsPage, LogsPage, SettingsPage, Wether} from '../pages/pages';

import { ConfigService, ConfigPage, SprinklersApiService, FloorPipe, ItimePipe, IDatePipe, SecondsToTimePipe } from '../shared/shared';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    ZonesPage,
    SchedulesPage,
    ScheduleDetailsPage,
    LogsPage,
    SettingsPage,
    Wether,
    ConfigPage,
    FloorPipe,
    ItimePipe,
    IDatePipe,
    SecondsToTimePipe
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    ZonesPage,
    SchedulesPage,
    ScheduleDetailsPage,
    LogsPage,
    SettingsPage,
    Wether,
    ConfigPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler}, 
    Storage, 
    ConfigService, 
    SprinklersApiService]
})
export class AppModule {}
