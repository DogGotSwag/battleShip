import Ship from './Ship';

class GameBoard {

  #missedShots = [];

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

  getGrid(){
    return this.#grid;
  }

  getMissedShots(){
    return this.#missedShots;
  }

  setShipAt(...arr) {
    const currShip = new Ship(arr.length);
    for(let i = 0; i < arr.length ; i += 1){
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
}

export default GameBoard;
