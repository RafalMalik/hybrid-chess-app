import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GamePage } from "../game/game";

@Component({
  selector: 'page-lobby',
  templateUrl: 'lobby.html'
})
export class LobbyPage {

  constructor(public navCtrl: NavController) {

  }

  openAddPage() {
    this.navCtrl.push(GamePage)
  }

}
