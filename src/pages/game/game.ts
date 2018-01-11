import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import * as $ from 'jquery';
import * as io from 'socket.io-client';
import {ResultsPage} from "../results/results";

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

  io: any;
  playerId: any;
  currentRound: number;
  socketId: any;
  game: any;
  question: any;
  questions: any;
  start: boolean;
  points: number;
  answers: any;
  message: string;
  time:any;
  timer: any;
  avatar: any;
  tabBarElement:any;
  scrollContentElement;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.io = navParams.data.io;
    this.game = navParams.data.game;
    this.playerId = navParams.data.playerId;
    this.socketId = navParams.data.socketId;
    this.avatar = navParams.data.avatar;

    //this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    //this.scrollContentElement = document.querySelector('.scroll-content');

    this.questions = this.game.questions;
    this.currentRound = -1;
    this.points = 0;
    this.answers = [];
    this.start = true;
    this.time = this.game.settings.time;


    this.timer = setInterval(() => {
      this.time--;

      if (this.time == -1) {
        clearInterval(this.timer);
        this.io.emit('end-time', {
          'id': this.game.id,
          'playerId': this.playerId,
          'answers': this.answers,
          'points': this.points,
          'time': this.time,
          'avatar' : this.avatar
        });
      }

    }, 1000);

    this.nextRound();

    this.io.on('end-game', (parameters) => {
      this.game = parameters.game;
      this.navCtrl.push(ResultsPage, {
        'io': this.io,
        'playerId': this.playerId,
        'results': parameters.results
      });

    });

  }

  nextRound() {
    if (this.currentRound < this.game.settings.round - 1) {
      this.currentRound++;
      this.question = this.questions[this.currentRound];
    } else {
      this.start = false;
      clearInterval(this.timer);

      this.io.emit('end-game', {
        'id': this.game.id,
        'playerId': this.playerId,
        'answers': this.answers,
        'points': this.points,
        'time': this.time,
        'avatar' : this.avatar
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
