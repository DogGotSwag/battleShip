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

  test('check isSunk() 2 with hits', () => {
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

describe.only('test for GameBoard class', () => {
  let currGameBoard;

  beforeEach(() => {
    currGameBoard = new GameBoard();
  });

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

  
});
