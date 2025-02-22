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
import { dragAndDropInterface, getPosition } from './dragAndDrop';
import './playerVsPlayerStyles.css';
import Player from './Player';
import { getCornerShots, getSurroundingPositions } from './coordinates';
import { setBoard, sendAttacks, checkIfSunk } from './commonGameFunctions';

function getCoordinates() {
  const letters = 'ABCDEFGHIJ';
  const coordinates = [];
  for (let i = 0; i < letters.length; i += 1) {
    const shipCoordinates = [];
    const shipGroup = document.querySelectorAll(`.drag.${letters[i]}`);
    for (let j = 0; j < shipGroup.length; j += 1) {
      shipCoordinates.push(getPosition(shipGroup[j].parentNode));
    }
    coordinates.push(shipCoordinates);
  }

  return coordinates;
}

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

  const hitNotSunkArray = [[], []];
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
          hitNotSunkArray[index].push(clickedPosition);
          const cornerCoordinates = getCornerShots(clickedPosition);
          sendAttacks(cornerCoordinates, playerArray[index]);

          const isSunk = checkIfSunk(playerArray[index], clickedPosition);

          if (isSunk) {
            const allSunk = [];
            for (let i = 0; i < hitNotSunkArray[index].length; i += 1) {
              const currCoord = hitNotSunkArray[index][i];
              const currCoordSunk = checkIfSunk(playerArray[index], currCoord);

              if (currCoordSunk) {
                allSunk.push(currCoord);
                hitNotSunkArray[index].splice(i, 1);
                i -= 1;
              }
            }

            const surroundingCoordinates = getSurroundingPositions(allSunk);
            sendAttacks(surroundingCoordinates, playerArray[index]);
          }

          if (playerArray[index].allSunk() === true) {
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
    playerOneCoordinates = getCoordinates();

    dragAndDropInterface('player');
    const startButtonTwo = document.querySelector('.startButton');
    startButtonTwo.addEventListener('click', (event) => {
      event.stopPropagation();
      playerTwoCoordinates = getCoordinates();

      makeGame(playerOneCoordinates, playerTwoCoordinates);
    });

    inBetween('player', 'Switch to Player 2 click when ready');
  });
};
