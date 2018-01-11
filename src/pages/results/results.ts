import { Component } from '@angular/core';
import {App, IonicPage, NavController, NavParams} from 'ionic-angular';
import { LobbyPage } from "../lobby/lobby";

/**
 * Generated class for the ResultsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-results',
  templateUrl: 'results.html',
})
export class ResultsPage {

  io:any;
  result:any;
  playerId: any;


  constructor(public appCtrl: App, public navCtrl: NavController, public navParams: NavParams) {
    this.io = this.navParams.data.io;
    this.playerId = navParams.data.playerId;
    this.result = this.parseResults(navParams.data.results);
  }

  parseResults(results) {
    if (results.status == 'draw') {
      return 0;
    } else if (results.win.id == this.playerId) {
      return 1;
    } else {
      return 2;
    }

  }

  backToLobby() {
    this.navCtrl.push(LobbyPage, {
      'playerId': this.playerId
    }).then(() => {
      const index = this.navCtrl.getActive().index - 1;
      this.navCtrl.remove(1, index);
    });
  }
}
