import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { TvPage } from '../tv/tv';
import { LobbyPage } from '../lobby/lobby';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = LobbyPage;
  tab2Root = TvPage;
  tab3Root = AboutPage;

  constructor() {

  }
}
