import Ship from './Ship';

class GameBoard {
  #missedShots = [];

  #hitShots = [];

  #allShips = [];

  #grid = [
    ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
    ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
    ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
    ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
    ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
    ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
    ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
    ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
    ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
    ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
    ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
  ];

  getGrid() {
    return this.#grid;
  }

  getMissedShots() {
    return this.#missedShots;
  }

  getHitShots(){
    return this.#hitShots;
  }

  setShipAt(...arr) {
    const currShip = new Ship(arr.length);
    this.#allShips.push(currShip);
    for (let i = 0; i < arr.length; i += 1) {
      const currCoordinate = arr[i];
      this.#grid[currCoordinate[0]][currCoordinate[1]] = currShip;
    }
  }

  receiveAttack(arr) {
    const coordinate = this.#grid[arr[0]][arr[1]];
    if (typeof coordinate === 'object') {
      coordinate.hit();
      return 'Hit';
    }
    this.#missedShots.push([arr[0], arr[1]]);
    return 'Miss';
  }

  allSunk() {
    const ships = this.#allShips;
    for (let i = 0; i < ships.length; i += 1) {
      const currShip = ships[i];
      if (currShip.isSunk() === false) {
        return false;
      }
    }
    return true;
  }
}

export default GameBoard;
