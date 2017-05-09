import { Component } from '@angular/core';

import { HomePage, LogsPage, SchedulesPage, SettingsPage, ZonesPage } from '../pages';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = ZonesPage;
  tab3Root: any = SchedulesPage;
  tab5Root: any = LogsPage;
  tab6Root: any = SettingsPage;

  constructor() {

  }
}
