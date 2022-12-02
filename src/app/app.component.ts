import {Component} from '@angular/core';
import {GameService} from './services/game.service';
import {Branch} from './model/branch.model';
import {Place} from './model/place.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  isGameOver = false;

  constructor(public readonly game: GameService) {
    game.newGame();
    this.isGameOver = false;
  }

  selectBranch(side: number, branch: Branch) {
    if (this.canSelect(side, branch)) {
      this.game.select(side, branch);
    } else if(this.isSelected(branch)) {
      this.game.deselect();
    }
    this.isGameOver = this.game.isGameOver();
  }

  isSelected(branch: Branch): boolean {
    return this.game.selectedBranch === branch;
  }

  canSelect(side: number, branch: Branch): boolean {
    return (!this.game.selected && this.game.canSource(branch))
      || (!!this.game.selected && this.game.selected !== side && this.game.canTarget(branch));
  }

  getReverse(list: Place[]): Place[] {
    return [...list].reverse();
  }

  easy() {
    this.game.newGame(2, 3, 70, 3);
    this.isGameOver = false;
  }

  medium() {
    this.game.newGame();
    this.isGameOver = false;
  }

  hard() {
    this.game.newGame(4, 6, 85, 5);
    this.isGameOver = false;
  }
}
