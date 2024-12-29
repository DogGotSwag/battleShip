import Ship from './Ship';

class GameBoard {

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
    return 'Miss';
  }
}

export default GameBoard;
