import './style.css';
import Player from './Player';
import {
  renderPlayersBoards,
  renderBoard,
  gameOver,
  singlePlayerSetup,
} from './domChanger';

import {
  getCoordinatesFromNodeList
} from './coordinates';
import { dragAndDropInterface } from './dragAndDrop';
import computerAttack, { adjacentAttack } from './computerAttack';
import GenerateRandomCoordinates from './generateRandomCoordinates';
import { setBoard, realHit, getCoordinatesFromDragAndDrop } from './commonGameFunctions';

function playerVsComputer(allCoordinates) {
  const indexPlayer = new Player();

  const realPlayerBoard = indexPlayer.realPlayer.gameBoard;
  const computerPlayerBoard = indexPlayer.computerPlayer.gameBoard;

  const makeCoordinates = new GenerateRandomCoordinates();
  const computerCoordinates = makeCoordinates.generateAllCoordinates();

  setBoard(
    allCoordinates,
    computerCoordinates,
    realPlayerBoard,
    computerPlayerBoard
  );

  renderPlayersBoards();

  const boards = document.querySelectorAll('.player');

  boards.forEach((board) => {
    board.addEventListener('click', (e) => {
      const clicked = e.target;
      const clickedType = clicked.classList[0];

      const parent = clicked.parentNode.parentNode.classList[0];
      if (clickedType === 'coordinate' && parent === 'computerPlayer') {
        const clickedPosition = clicked.classList[1].slice(1, 3).split('');

        const hitNotSunk = document.querySelectorAll(
          '.computerPlayer .hitShot:not(.sunk)'
        );
        const hitNotSunkCoords = getCoordinatesFromNodeList(hitNotSunk);
        const hitOrMiss = computerPlayerBoard.receiveAttack(clickedPosition);

        if (hitOrMiss === 'Hit') {
          realHit(computerPlayerBoard, clickedPosition, hitNotSunkCoords);
        }
        renderBoard(
          'computerPlayer',
          computerPlayerBoard.getGrid(),
          computerPlayerBoard.getMissedShots(),
          computerPlayerBoard.getHitShots()
        );
        if (computerPlayerBoard.allSunk()) {
          gameOver('computerPlayer', 'realPlayer');
        }

        if (hitOrMiss === 'Miss') {
          let continueAttack;
          let adjacentShots = [];
          do {
            let attackPosition;

            if (adjacentShots.length === 0) {
              attackPosition = computerAttack(
                realPlayerBoard.availableCoordinates()
              );
              continueAttack = realPlayerBoard.receiveAttack(attackPosition);
            } else {
              attackPosition = computerAttack(adjacentShots);
              continueAttack = realPlayerBoard.receiveAttack(attackPosition);
              adjacentShots = [];
            }

            if (continueAttack === 'Hit') {
              const hitNotSunkReal = document.querySelectorAll(
                '.realPlayer .hitShot:not(.sunk)'
              );
              const hitNotSunkRealCoords =
                getCoordinatesFromNodeList(hitNotSunkReal);

              adjacentShots = adjacentAttack(
                attackPosition,
                realPlayerBoard.availableCoordinates()
              );
              realHit(realPlayerBoard, attackPosition, hitNotSunkRealCoords);
            }

            renderBoard(
              'realPlayer',
              realPlayerBoard.getGrid(),
              realPlayerBoard.getMissedShots(),
              realPlayerBoard.getHitShots()
            );

            if (realPlayerBoard.allSunk()) {
              gameOver('realPlayer', 'computerPlayer');
              continueAttack = '';
            }
          } while (continueAttack === 'Hit');
          adjacentShots = [];
        }
      }
    });
  });
}

export default () => {
  singlePlayerSetup();
  dragAndDropInterface('realPlayer');
  const startButton = document.querySelector('.startButton');

  startButton.addEventListener('click', (e) => {
    e.stopPropagation();
    const board = startButton.parentNode;
    board.removeChild(startButton);
    const dragAndCoordinates = getCoordinatesFromDragAndDrop();
    playerVsComputer(dragAndCoordinates);
  });
};
