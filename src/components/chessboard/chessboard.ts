import {Component} from '@angular/core';
import * as io from 'socket.io-client';
 import * as $ from 'jquery';

/**
 * Generated class for the Chessboard component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'chessboard',
  templateUrl: 'chessboard.html'
})
export class Chessboard {

  text: string;
  socket: any;
  field: string;
  targetField: string;


  constructor() {
    this.socket = io('http://localhost:3000');

    this.field = null;
    this.targetField = null;

  }

  move(field) {
    if (!this.field) {
      this.field = field;
    } else {

      this.targetField = field;
      this.socket.emit('move', {'code': [this.field, field]});

      // if move is valid ;)
      $('.' + this.targetField).html($('.'+ this.field).html());

      // switch action: colission, dead
      $('.' + this.field).html('');

      this.targetField = null;
      this.field = null;
    }
  }


}
