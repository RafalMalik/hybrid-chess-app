import {Component} from '@angular/core';
import {NavController, AlertController, NavParams} from 'ionic-angular';
import {GamePage} from "../game/game";
import * as io from 'socket.io-client';

@Component({
  selector: 'page-lobby',
  templateUrl: 'lobby.html'
})
export class LobbyPage {

  private endPoint = 'ws://193.70.113.241:3001';
  io;
  playerId;
  socket;
  name;
  players;
  avatar;
  invited = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    this.playerId = -1;

    if (this.navParams.data.playerId) {
      this.playerId = this.navParams.data.playerId;
    }
    this.io = io(this.endPoint, {query: "playerId=" + this.playerId});


    this.io.on('update-socket', (parameters) => {
      this.socket = parameters.socket;
    });

    this.io.on('welcome', (parameters) => {
      this.playerId = parameters.id;
      this.socket = parameters.socket;
      this.avatar  = parameters.avatar;
    });

    this.io.on('lobby', (players) => {
      this.players = players.filter((player) => {
        return player.id !== this.playerId;
      });
    });

    this.io.on('invite', (players) => {
      if (!this.invited) {
        this.invited = true;
        this.openInviteConfirm(players);
      }
    });

    this.io.on('init-game', (game) => {
      this.navCtrl.push(GamePage, {
        io: this.io,
        playerId: this.playerId,
        game: game,
        socketId: this.socket,
        avatar: this.avatar
      }).then(() => {
        const index = this.navCtrl.getActive().index - 1;
        this.navCtrl.remove(1, index);
      });
    });

    this.io.on('discard-invite', (players) => {
      this.presentAlert('Przepraszam', 'Uzytkownik odrzucil twoje zaproszenie');
    });

  }

  invitePlayer(id, socket) {
    if (this.getStatusById(id) == 0) {
      this.io.emit('invite', {
        'player1': {
          'id': this.playerId,
          'socket': this.socket
        },
        'player2': {
          'id': id,
          'socket': socket
        }
      });
    } else {
      this.presentAlert('Przepraszam', 'Uzytkownik prowadzi obecnie gre');
    }
  }

  getIO() {
    return this.io;
  }

  getId() {
    return this.playerId;
  }

  setStatus(id, status) {
    for (let player of this.players) {

      if (player.id == id) {
        player.status = status;
      }
    }

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
    const alert = this.alertCtrl.create({
      title: 'Zaproszenie do gry',
      message: 'Uzytkownik ' + players.player1.name + ' zaprosił Cię do gry',
      buttons: [
        {
          text: 'Odrzuc',
          role: 'cancel',
          handler: () => {
            this.invited = false;
            this.io.emit('discard', players);
          }
        },
        {
          text: 'Akceptuj',
          handler: () => {
            this.invited = false;
            this.io.emit('join', players);
          }
        }
      ]
    });
    alert.present();
  }

  presentAlert(title, subTitle) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['Zamknij']
    });
    alert.present();
  }


}
