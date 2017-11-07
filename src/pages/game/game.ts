import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import * as $ from 'jquery';
import * as io from 'socket.io-client';

/**
 * Generated class for the GamePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-game',
  templateUrl: 'game.html',
})
export class GamePage {

  private endPoint = 'http://localhost:3000/game';
  io: any;
  id: any;
  currentRound: number;
  time: number;
  round: number;
  question: any;
  questions: any;
  start: boolean;
  points: number;
  answers: any;
  message: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.io = io(this.endPoint);

    console.log(navParams.data.id);
    this.id = navParams.data.socketId;

    this.currentRound = -1;
    this.points = 0;
    this.answers = [];
    this.time = 30;
    this.message = 'Oczekiwanie na graczy';

    var x = setInterval(() => {
      this.time--;

    }, 1000);

    this.io.on('waiting', (parameters) => {
      console.log('do kurwy nedzy');
    });

    this.io.on('start-game', (parameters) => {
      this.start = true;
      this.time = parameters.time;
      this.round = parameters.round;
      this.questions = parameters.questions;
      this.nextRound();
    });

    this.io.on('end-game', (results) => {
      console.log(results);
      if (results.status == 'draw') {
          console.log('kurwa kadlubki jest remis');
      } else {
        if (this.id == results.win) {
          console.log('wygrales' + this.id);
        }  else {
          console.log('przegralem' + this.id);
        }
      }
    });
  }

  getIO() {
    return this.io;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GamePage');
  }

  nextRound() {
    if (this.currentRound < this.round - 1) {
      this.currentRound++;
      this.question = this.questions[this.currentRound];
    } else {
      this.start = false;
      this.message = 'Gra zakonczona. Oczekiwanie na pozostalych graczy';
      this.io.emit('end-game', {
        'answers': this.answers,
        'points': this.points
      });
    }
  }

  answer(option) {
    this.answers[this.currentRound] = {'correct': this.question.t, 'value': option};
    if (this.question.t === option) {
      this.points++;
    }
    this.nextRound();
  }


}
