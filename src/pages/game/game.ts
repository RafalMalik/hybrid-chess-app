import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import * as $ from 'jquery';
import * as io from 'socket.io-client';
import { ResultsPage } from "../results/results";

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
  socketId: any;
  game: any;
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

    console.log(navParams.data.game);

    this.game = navParams.data.game;
    this.id = navParams.data.playerId;
    this.socketId = navParams.data.socketId;

    console.log('GRa od id ' + this.game.id);

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

    this.io.on('end-game', (parameters) => {
      let results = parameters.results;
      this.game = parameters.game;
      if (results.status == 'draw') {
          console.log('kurwa kadlubki jest remis');
      } else {
        let targetId;
        if (this.id == results.win) {
          this.navCtrl.push(ResultsPage, {
            'results' : results.lose
          });
        }  else {
          this.navCtrl.push(ResultsPage, {
            'results' : results.win
          });
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
        'id' : this.game.id,
        'playerId': this.id,
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
