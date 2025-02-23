import Ship from './src/Ship';
import GameBoard from './src/GameBoard';
import Player from './src/Player';

describe('test for classes to be defined', () => {
  test('Ship defined', () => {
    expect(Ship).toBeDefined();
  });
  test('GameBoard defined', () => {
    expect(GameBoard).toBeDefined();
  });
  test('Player defined', () => {
    expect(Player).toBeDefined();
  });
});

describe('test for Ship isSunk() size 4', () => {
  let currShip;

  beforeEach(() => {
    currShip = new Ship(4);
  });

  test('check isSunk() with 1 hit', () => {
    currShip.hit();
    expect(currShip.isSunk()).toBe(false);
  });

  test('check isSunk() 4 with hits', () => {
    currShip.hit();
    currShip.hit();
    currShip.hit();
    currShip.hit();
    expect(currShip.isSunk()).toBe(true);
  });

  test('check isSunk() 2 with hits', () => {
    currShip.hit();
    currShip.hit();
    expect(currShip.isSunk()).toBe(false);
  });
});

describe('test for Ship isSunk() size 10', () => {
  let currShip;

  beforeEach(() => {
    currShip = new Ship(10);
  });

  test('check isSunk() with 1 hit', () => {
    currShip.hit();
    expect(currShip.isSunk()).toBe(false);
  });

  test('check isSunk() 4 with hits', () => {
    currShip.hit();
    currShip.hit();
    currShip.hit();
    currShip.hit();
    expect(currShip.isSunk()).toBe(false);
  });

  test('check isSunk() 2 with hits', () => {
    currShip.hit();
    currShip.hit();
    expect(currShip.isSunk()).toBe(false);
  });

  test('check isSunk() 10 with hits', () => {
    currShip.hit();
    currShip.hit();
    currShip.hit();
    currShip.hit();
    currShip.hit();
    currShip.hit();
    currShip.hit();
    currShip.hit();
    currShip.hit();
    currShip.hit();
    expect(currShip.isSunk()).toBe(true);
  });
});

let currGameBoard;

beforeEach(() => {
  currGameBoard = new GameBoard();
});

describe('test for GameBoard setShipAt()', () => {
  test('check empty spot', () => {
    const grid = currGameBoard.getGrid();
    expect(grid[7][2]).toBe('E');
  });

  test('put ship at [7,2]', () => {
    currGameBoard.setShipAt([7, 2]);
    const grid = currGameBoard.getGrid();
    expect(grid[7][2]).toEqual({ shipLength: 1 });
  });

  test('put ship at [2,0] horizontal through [2,5]', () => {
    currGameBoard.setShipAt([2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5]);
    const grid = currGameBoard.getGrid();
    expect(grid[2][0]).toEqual({ shipLength: 6 });
    expect(grid[2][1]).toEqual({ shipLength: 6 });
    expect(grid[2][2]).toEqual({ shipLength: 6 });
    expect(grid[2][3]).toEqual({ shipLength: 6 });
    expect(grid[2][4]).toEqual({ shipLength: 6 });
    expect(grid[2][5]).toEqual({ shipLength: 6 });
  });
});

describe('test for GameBoard receiveAttack()', () => {
  test('test for receiveAttack() with ship at [0,5]', () => {
    currGameBoard.setShipAt([0, 5]);
    expect(currGameBoard.receiveAttack([0, 5])).toBe('Hit');
  });

  test('test for receiveAttack() no ship at [2,7]', () => {
    expect(currGameBoard.receiveAttack([2, 7])).toBe('Miss');
  });

  test('test for receiveAttack() with ship at [2,7]', () => {
    currGameBoard.setShipAt([2, 7]);
    expect(currGameBoard.receiveAttack([2, 7])).toBe('Hit');
  });

  test('test for receiveAttack() with ship at [0,0] horizontal through [0,3]', () => {
    currGameBoard.setShipAt([0, 0], [0, 1], [0, 2]);
    expect(currGameBoard.receiveAttack([0, 0])).toBe('Hit');
    expect(currGameBoard.receiveAttack([0, 2])).toBe('Hit');
    expect(currGameBoard.receiveAttack([0, 3])).toBe('Miss');
  });

  test('test for receiveAttack() with ship at [4,6] vertical through [7,6]', () => {
    currGameBoard.setShipAt([4, 6], [5, 6], [6, 6], [7, 6]);
    expect(currGameBoard.receiveAttack([5, 6])).toBe('Hit');
    expect(currGameBoard.receiveAttack([5, 5])).toBe('Miss');
    expect(currGameBoard.receiveAttack([7, 6])).toBe('Hit');
  });
});

describe('test for GameBoard getMissedShots()', () => {
  test('test for no missed shots', () => {
    expect(currGameBoard.getMissedShots()).toStrictEqual([]);
  });

  test('test for 4 missed shots length only', () => {
    currGameBoard.receiveAttack([0, 4]);
    currGameBoard.receiveAttack([5, 6]);
    currGameBoard.receiveAttack([4, 2]);
    currGameBoard.receiveAttack([7, 7]);
    expect(currGameBoard.getMissedShots().length).toStrictEqual(4);
  });

  test('test for 7 missed shots length only', () => {
    currGameBoard.receiveAttack([2, 4]);
    currGameBoard.receiveAttack([8, 3]);
    currGameBoard.receiveAttack([4, 2]);
    currGameBoard.receiveAttack([9, 7]);
    currGameBoard.receiveAttack([9, 5]);
    currGameBoard.receiveAttack([5, 2]);
    currGameBoard.receiveAttack([3, 7]);
    expect(currGameBoard.getMissedShots().length).toStrictEqual(7);
  });

  test('test for 3 missed shots get exact coordinates', () => {
    currGameBoard.receiveAttack([0, 1]);
    currGameBoard.receiveAttack([8, 1]);
    currGameBoard.receiveAttack([7, 6]);
    expect(currGameBoard.getMissedShots()).toStrictEqual([
      [0, 1],
      [8, 1],
      [7, 6],
    ]);
  });

  test('test for 6 missed shots get exact coordinates', () => {
    currGameBoard.receiveAttack([8, 6]);
    currGameBoard.receiveAttack([8, 3]);
    currGameBoard.receiveAttack([7, 2]);
    currGameBoard.receiveAttack([0, 1]);
    currGameBoard.receiveAttack([8, 8]);
    currGameBoard.receiveAttack([5, 3]);
    currGameBoard.receiveAttack([9, 9]);
    currGameBoard.receiveAttack([8, 1]);
    currGameBoard.receiveAttack([2, 6]);
    currGameBoard.receiveAttack([1, 2]);
    expect(currGameBoard.getMissedShots()).toStrictEqual([
      [8, 6],
      [8, 3],
      [7, 2],
      [0, 1],
      [8, 8],
      [5, 3],
      [9, 9],
      [8, 1],
      [2, 6],
      [1, 2],
    ]);
  });

  test('test for 3 shots one hit get exact coordinates', () => {
    currGameBoard.setShipAt([0, 0]);
    currGameBoard.receiveAttack([0, 0]);
    currGameBoard.receiveAttack([9, 3]);
    currGameBoard.receiveAttack([8, 1]);
    expect(currGameBoard.getMissedShots()).toStrictEqual([
      [9, 3],
      [8, 1],
    ]);
  });

  test('test for 4 shots only miss get exact coordinates', () => {
    currGameBoard.setShipAt([9, 2]);
    currGameBoard.setShipAt([2, 3]);
    currGameBoard.setShipAt([5, 7]);
    currGameBoard.receiveAttack([9, 2]);
    currGameBoard.receiveAttack([6, 8]);
    currGameBoard.receiveAttack([2, 3]);
    currGameBoard.receiveAttack([5, 7]);
    expect(currGameBoard.getMissedShots()).toStrictEqual([[6, 8]]);
  });
});

describe('test for GameBoards allSunk()', () => {
  test('size 1 ship no shots', () => {
    currGameBoard.setShipAt([0, 0]);
    expect(currGameBoard.allSunk()).toBe(false);
  });

  test('size 1 ship one shot', () => {
    currGameBoard.setShipAt([0, 1]);
    currGameBoard.receiveAttack([0, 1]);
    expect(currGameBoard.allSunk()).toBe(true);
  });

  test('size 4 ship only one shot hit', () => {
    currGameBoard.setShipAt([5, 1], [6, 1], [7, 1], [8, 1]);
    currGameBoard.receiveAttack([5, 1]);
    currGameBoard.receiveAttack([6, 2]);
    currGameBoard.receiveAttack([7, 5]);
    currGameBoard.receiveAttack([1, 1]);
    expect(currGameBoard.allSunk()).toBe(false);
  });

  test('size 4 ship only 4 shots hit', () => {
    currGameBoard.setShipAt([5, 1], [6, 1], [7, 1], [8, 1]);
    currGameBoard.receiveAttack([5, 1]);
    currGameBoard.receiveAttack([6, 1]);
    currGameBoard.receiveAttack([7, 1]);
    currGameBoard.receiveAttack([8, 1]);
    expect(currGameBoard.allSunk()).toBe(true);
  });

  test('two ships one destroyed', () => {
    currGameBoard.setShipAt([3, 6], [3, 7], [3, 8], [3, 9]);
    currGameBoard.setShipAt([6, 1], [6, 2]);
    currGameBoard.receiveAttack([3, 6]);
    currGameBoard.receiveAttack([3, 7]);
    currGameBoard.receiveAttack([3, 8]);
    currGameBoard.receiveAttack([3, 9]);

    currGameBoard.receiveAttack([6, 2]);
    expect(currGameBoard.allSunk()).toBe(false);
  });
});

describe('tests for Player class', () => {
  const currPlayers = new Player();
  test('real player exists', () => {
    const hasProperty = Object.prototype.hasOwnProperty.call(
      currPlayers,
      'realPlayer'
    );
    expect(hasProperty).toBe(true);
  });

  test('computer player exists', () => {
    const hasProperty = Object.prototype.hasOwnProperty.call(
      currPlayers,
      'computerPlayer'
    );
    expect(hasProperty).toBe(true);
  });

  test('real player has its own gameboard', () => {
    const hasProperty = Object.prototype.hasOwnProperty.call(
      currPlayers.realPlayer,
      'gameBoard'
    );
    expect(hasProperty).toBe(true);
  });

  test('real player has its own gameboard', () => {
    const hasProperty = Object.prototype.hasOwnProperty.call(
      currPlayers.computerPlayer,
      'gameBoard'
    );
    expect(hasProperty).toBe(true);
  });
});

describe('test for GameBoard getHitShots()', () => {
  test('test for no missed shots', () => {
    expect(currGameBoard.getHitShots()).toStrictEqual([]);
  });

  test('test for 3 shots one hit get correct length', () => {
    currGameBoard.setShipAt([0, 0]);
    currGameBoard.receiveAttack([0, 0]);
    currGameBoard.receiveAttack([9, 3]);
    currGameBoard.receiveAttack([8, 1]);
    expect(currGameBoard.getHitShots().length).toBe(1);
  });

  test('test for 4 shots only miss get exact coordinates', () => {
    currGameBoard.setShipAt([9, 2]);
    currGameBoard.setShipAt([2, 3]);
    currGameBoard.setShipAt([5, 7]);
    currGameBoard.receiveAttack([9, 2]);
    currGameBoard.receiveAttack([6, 8]);
    currGameBoard.receiveAttack([2, 3]);
    currGameBoard.receiveAttack([5, 7]);
    expect(currGameBoard.getHitShots()).toStrictEqual([
      [9, 2],
      [2, 3],
      [5, 7],
    ]);
  });
});


describe.only('tests for gameBoards availableCoordinates()', () =>{
  test('no attacks length should be 100', () => {
    expect(currGameBoard.availableCoordinates().length).toBe(100);
  });

  test('make sure all coordinates are initially present', () => {
    let num = 0;
    for(let i = 0; i < 10; i += 1){
      for(let j = 0; j < 10; j += 1){
        const check = [i,j];
        const currCoord = currGameBoard.availableCoordinates()[num];
        num += 1;
        expect(JSON.stringify(check) === JSON.stringify(currCoord)).toBe(true);
      }
    }
  });

  test('5 shots fired should decrease length by 5', () => {
    currGameBoard.receiveAttack([0,1]);
    currGameBoard.receiveAttack([5,2]);
    currGameBoard.receiveAttack([6,9]);
    currGameBoard.receiveAttack([8,2]);
    currGameBoard.receiveAttack([2,5]);

    expect(currGameBoard.availableCoordinates().length).toBe(95);
  });

  test('test one shot, should not show up in .availableCoordinates()', () => {
    currGameBoard.receiveAttack([3,7]);

    const array = currGameBoard.availableCoordinates();
    for(let i = 0; i < array.length; i += 1){
      expect(JSON.stringify(array) === JSON.stringify([3,7])).toBe(false);
    }
  });

  test('test 3 shots, should not show up in .availableCoordinates()', () => {
    currGameBoard.receiveAttack([3,7]);
    currGameBoard.receiveAttack([2,1]);
    currGameBoard.receiveAttack([6,4]);

    const array = currGameBoard.availableCoordinates();
    for(let i = 0; i < array.length; i += 1){
      expect(JSON.stringify(array) === JSON.stringify([3,7])).toBe(false);
      expect(JSON.stringify(array) === JSON.stringify([2,1])).toBe(false);
      expect(JSON.stringify(array) === JSON.stringify([6,4])).toBe(false);
    }
  });
});
