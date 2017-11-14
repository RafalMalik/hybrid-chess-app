import { Component } from '@angular/core';
import {NavController, AlertController, NavParams} from 'ionic-angular';
import { GamePage } from "../game/game";
import * as io from 'socket.io-client';
import * as $ from 'jquery';

@Component({
  selector: 'page-lobby',
  templateUrl: 'lobby.html'
})
export class LobbyPage {

  private endPoint = 'http://localhost:3000';
  io:any;
  id:any;
  socket: any;
  name: string;
  players: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    this.id = -1;
    this.io = io(this.endPoint, { query : "playerId=" + this.id });

    this.io.on('welcome', (parameters) => {
      this.id = parameters.id;
      this.socket = parameters.socket;
    });

    this.io.on('lobby', (players) =>  {
      this.players = players.filter( (player) => {
          return player.id !== this.id;
      });
    });

    this.io.on('invite', (players) => {
      this.openInviteConfirm(players);
    });

    this.io.on('init-game', (game) => {
      this.navCtrl.push(GamePage, {
        playerId: this.id,
        game: game,
        socketId: this.socket
      }).then(() => {
        const index = this.navCtrl.getActive().index - 1;
        this.navCtrl.remove(1, index);
      });
    });

    this.io.on('discard-invite', (players) => {
      this.presentAlert();
    });
  }

  invitePlayer(id, socket) {
    console.log(id, socket);
    if (this.getStatusById(id) == 0) {
      this.io.emit('invite', {
        'player1' : {
          'id': this.id,
          'socket': this.socket
        },
        'player2' : {
          'id': id,
          'socket': socket
        }
      });
    } else {
      this.presentAlert();
    }
  }

  getIO() {
    return this.io;
  }

  getId() {
    return this.id;
  }

  setStatus(id, status) {
    for (let player of this.players) {

      if (player.id == id) {
        player.status = status;
      }
    }

    console.log(this.players);
  }

  getPlayerById(id) {
    for (let player of this.players) {

      if (player.id == id) {
        return player;
      }
    }
  }

  getPlayerBySocket(socket) {
    for (let player of this.players) {

      if (player.socket == socket) {
        return player;
      }
    }
  }

  getStatusBySocket(socket) {
    let player = this.getPlayerBySocket(socket);

    return player.status;
  }

  getStatusById(id) {
    let player = this.getPlayerById(id);

    return player.status;
  }


  openAddPage() {
    this.navCtrl.push(GamePage)
  }

  openInviteConfirm(players) {
    console.log(players);
    const alert = this.alertCtrl.create({
      title: 'Zaproszenie do gry',
      message: 'Do you want to buy this book?',
      buttons: [
        {
          text: 'Odrzuc',
          role: 'cancel',
          handler: () => {
            this.io.emit('discard', players);
          }
        },
        {
          text: 'Akceptuj',
          handler: () => {
            this.io.emit('join', players);
          }
        }
      ]
    });
    alert.present();
  }

  presentAlert() {
    const alert = this.alertCtrl.create({
      title: 'Low battery',
      subTitle: '10% of battery remaining',
      buttons: ['Dismiss']
    });
    alert.present();
  }


}
