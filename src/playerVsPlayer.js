import {
  twoPlayerSetup,
  inBetween,
  renderPlayersBoards,
  renderBoard,
  singlePlayerSetup,
  disablePlay,
  enablePlay,
  gameOver,
} from './domChanger';
import { dragAndDropInterface } from './dragAndDrop';
import './playerVsPlayerStyles.css';
import Player from './Player';
import {
  setBoard,
  postHitEffects,
  getCoordinatesFromDragAndDrop,
} from './commonGameFunctions';

function makeGame(playerOneCoordinates, playerTwoCoordinates) {
  singlePlayerSetup();
  renderPlayersBoards();
  const indexPlayer = new Player();
  const playerOneBoard = indexPlayer.realPlayer.gameBoard;
  const playerTwoBoard = indexPlayer.computerPlayer.gameBoard;
  const playerArray = [playerOneBoard, playerTwoBoard];

  setBoard(
    playerOneCoordinates,
    playerTwoCoordinates,
    playerOneBoard,
    playerTwoBoard
  );

  const playerBoardClasses = ['realPlayer', 'computerPlayer'];
  disablePlay(playerBoardClasses[0]);

  const boards = document.querySelectorAll('.player');

  for (let index = 0; index < boards.length; index += 1) {
    const board = boards[index];
    let indexComplement;
    if (index === 0) indexComplement = 1;
    else indexComplement = 0;

    board.addEventListener('click', (e) => {
      const clicked = e.target;
      const clickedType = clicked.classList[0];

      if (clickedType === 'coordinate') {
        const clickedPosition = clicked.classList[1].slice(1, 3).split('');
        const hitOrMiss = playerArray[index].receiveAttack(clickedPosition);

        if (hitOrMiss === 'Hit') {
          postHitEffects(playerArray[index], clickedPosition, 'player');

          if (playerArray[index].allSunk()) {
            gameOver(
              playerBoardClasses[index],
              playerBoardClasses[indexComplement]
            );
          }
        } else {
          disablePlay(playerBoardClasses[index]);
          enablePlay(playerBoardClasses[indexComplement]);
        }
      } // if

      renderBoard(
        playerBoardClasses[index],
        playerArray[index].getGrid(),
        playerArray[index].getMissedShots(),
        playerArray[index].getHitShots()
      );
    }); // eventList
  }
}

export default () => {
  twoPlayerSetup('player');
  let playerOneCoordinates = [];
  let playerTwoCoordinates = [];

  dragAndDropInterface('player');
  const startButton = document.querySelector('.startButton');
  startButton.addEventListener('click', (e) => {
    e.stopPropagation();
    playerOneCoordinates = getCoordinatesFromDragAndDrop();

    dragAndDropInterface('player');
    const startButtonTwo = document.querySelector('.startButton');
    startButtonTwo.addEventListener('click', (event) => {
      event.stopPropagation();
      playerTwoCoordinates = getCoordinatesFromDragAndDrop();

      makeGame(playerOneCoordinates, playerTwoCoordinates);
    });

    inBetween('player', 'Switch to Player 2 click when ready');
  });
};
