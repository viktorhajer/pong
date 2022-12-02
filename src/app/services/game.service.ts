import {Injectable} from '@angular/core';
import {Branch} from '../model/branch.model';
import {Movement} from '../model/movement.model';
import {Place} from '../model/place.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  // config
  numberOfColors = 3;
  numberOfBranches = 5;
  numberOfPlaces = 4;
  saturation = 80;

  selected = 0;
  selectedBranch: Branch = null as any;
  numberOfSteps = 0;
  left: Branch[] = [];
  right: Branch[] = [];

  canSource(branch: Branch): boolean {
    return branch.places.some(place => place.color !== 0);
  }

  getPoint(branch: Branch): Movement {
    let color = 0;
    let count = 0;
    for (let i = branch.places.length - 1; i >= 0; i--) {
      if (branch.places[i].color !== 0) {
        if (color === 0) {
          color = branch.places[i].color;
          count = 1;
        } else if (color === branch.places[i].color) {
          count++;
        } else {
          break;
        }
      }
    }
    return {color, count};
  }

  canTarget(branch: Branch): boolean {
    const count = this.getPoint(this.selectedBranch).count;
    return branch.places.filter(place => place.color === 0).length >= count;
  }

  select(side: number, branch: Branch) {
    if (!this.selected) {
      this.selectedBranch = branch;
      this.selected = side;
    } else {
      this.numberOfSteps++;
      this.selected = 0;
      const movement = this.getPoint(this.selectedBranch);
      let j = 0;
      for (let i = 0; i < this.numberOfPlaces; i++) {
        if (branch.places[i].color === 0 && j < movement.count) {
          branch.places[i].color = movement.color;
          j++;
        }
      }
      j = 0;
      for (let i = this.numberOfPlaces - 1; i >= 0; i--) {
        if (this.selectedBranch.places[i].color !== 0 && j < movement.count) {
          this.selectedBranch.places[i].color = 0;
          j++;
        }
      }
      this.selectedBranch = null as any;
      this.hideCollection(branch);
      this.isGameOver();
    }
  }

  deselect() {
    this.selected = 0;
    this.selectedBranch = null as any;
  }

  newGame(colors = 3, branches = 5, saturation = 80, places = 4) {
    this.numberOfColors = colors;
    this.numberOfBranches = branches;
    this.numberOfPlaces = places;
    this.saturation = saturation;

    this.selected = 0;
    this.selectedBranch = null as any;
    this.numberOfSteps = 0;
    this.left = [];
    this.right = [];
    const totalPlaces = this.numberOfBranches * 2 * this.numberOfPlaces;
    let numberOfPlacesPerTypes = totalPlaces * (this.saturation / 100) / this.numberOfColors;
    numberOfPlacesPerTypes = numberOfPlacesPerTypes - (numberOfPlacesPerTypes % this.numberOfPlaces);
    [1, 2].forEach(i => {
      const container = i % 2 == 1 ? this.left : this.right;
      for (let j = 0; j < this.numberOfBranches; j++) {
        const branch = new Branch();
        for (let k = 0; k < this.numberOfPlaces; k++) {
          branch.places.push(new Place());
        }
        container.push(branch);
      }
    });
    for (let i = 0; i < numberOfPlacesPerTypes * this.numberOfColors; i++) {
      const color = (i % this.numberOfColors) + 1;
      let container = null;
      let branch = 0;
      do {
        container = Math.floor(Math.random() * 2) === 1 ? this.left : this.right;
        branch = Math.floor(Math.random() * this.numberOfBranches);
      } while (!this.hasCapacity(container[branch]));
      this.addColor(container[branch] as Branch, color);
    }
    if (this.left.some(b => this.hideCollection(b)) || this.right.some(b => this.hideCollection(b))) {
      console.log('Regenerate');
      this.newGame(colors, branches, saturation, places);
    }
  }

  isGameOver(): boolean {
    return this.left.every(b => b.places.every(p => p.color === 0))
      && this.right.every(b => b.places.every(p => p.color === 0));
  }

  private hasCapacity(branch: Branch): boolean {
    return branch.places.some(p => p.color === 0);
  }

  private addColor(branch: Branch, color: number) {
    for (let i = 0; i < branch.places.length; i++) {
      if (!branch.places[i].color) {
        branch.places[i].color = color;
        break;
      }
    }
  }

  private hideCollection(branch: Branch): boolean {
    const color = branch.places[0].color;
    if (branch.places.every(p => p.color === color)) {
      branch.places.forEach(p => p.color = 0);
      return true;
    }
    return false;
  }
}
