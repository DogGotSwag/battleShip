import GameBoard from './GameBoard';

class Player {
  realPlayer = {
    gameBoard: new GameBoard(),
  };

  computerPlayer = {
    gameBoard: new GameBoard(),
  };
}

export default Player;
