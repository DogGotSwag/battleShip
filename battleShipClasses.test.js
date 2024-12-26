import Ship from './src/Ship';
import GameBoard from './src/GameBoard';
import Player from './src/Player';


describe('test for classes to be defined', () =>{
    test('Ship defined', () =>{
        expect(Ship).toBeDefined();
    });
    test('GameBoard defined', () =>{
        expect(GameBoard).toBeDefined();
    });
    test('Player defined', () =>{
        expect(Player).toBeDefined();
    });
});