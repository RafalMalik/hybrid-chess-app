import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { Chessboard } from './chessboard';

@NgModule({
  declarations: [
    Chessboard,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    Chessboard
  ]
})
export class ChessboardModule {}
