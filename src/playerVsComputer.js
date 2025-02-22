import './style.css';
import Player from './Player';
import {
  renderPlayersBoards,
  renderBoard,
  gameOver,
  singlePlayerSetup,
} from './domChanger';

import { getCoordinatesFromNodeList, getCornerShots, getSurroundingPositions } from './coordinates';
import { dragAndDropInterface, getPosition } from './dragAndDrop';
import computerAttack, { adjacentAttack } from './computerAttack';
import GenerateRandomCoordinates from './generateRandomCoordinates';
import { setBoard, sendAttacks, checkIfSunk } from './commonGameFunctions';

function realHit( oppositeBoard, clickedPosition, hitNotSunk) {
  hitNotSunk.push(clickedPosition);
  const cornerCoordinates = getCornerShots(clickedPosition);
  sendAttacks(cornerCoordinates, oppositeBoard);

  const isSunk = checkIfSunk(oppositeBoard, clickedPosition);

  if (isSunk) {
    const allSunk = [];
    for (let i = 0; i < hitNotSunk.length; i += 1) {
      const currCoord = hitNotSunk[i];
      const currCoordSunk = checkIfSunk(oppositeBoard, currCoord);

      if (currCoordSunk) {
        allSunk.push(currCoord);
        hitNotSunk.splice(i, 1);
        i -= 1;
      }
    }
    const surroundingCoordinates = getSurroundingPositions(allSunk);
    sendAttacks(surroundingCoordinates, oppositeBoard);
  }
}

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
  // const realPlayerHitNotSunk = [];
  const computerPlayerHitNotSunk = [];

  boards.forEach((board) => {
    board.addEventListener('click', (e) => {
      const clicked = e.target;
      const clickedType = clicked.classList[0];

      const parent = clicked.parentNode.parentNode.classList[0];
      if (clickedType === 'coordinate' && parent === 'computerPlayer') {
        const clickedPosition = clicked.classList[1].slice(1, 3).split('');
        
        const hitNotSunk = document.querySelectorAll('.computerPlayer .hitShot:not(.sunk)');
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
        if (computerPlayerBoard.allSunk() === true) {
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
              adjacentShots = adjacentAttack(
                attackPosition,
                realPlayerBoard.availableCoordinates()
              );

              computerPlayerHitNotSunk.push(attackPosition);
              const cornerCoordinates = getCornerShots(attackPosition);
              sendAttacks(cornerCoordinates, realPlayerBoard);

              const isSunk = checkIfSunk(realPlayerBoard, attackPosition);

              if (isSunk) {
                const allSunk = [];
                for (let i = 0; i < computerPlayerHitNotSunk.length; i += 1) {
                  const currCoord = computerPlayerHitNotSunk[i];

                  const currCoordSunk = checkIfSunk(realPlayerBoard, currCoord);

                  if (currCoordSunk) {
                    allSunk.push(currCoord);
                    computerPlayerHitNotSunk.splice(i, 1);
                    i -= 1;
                  }
                }

                const surroundingCoordinates = getSurroundingPositions(allSunk);
                sendAttacks(surroundingCoordinates, realPlayerBoard);
              }
            }

            renderBoard(
              'realPlayer',
              realPlayerBoard.getGrid(),
              realPlayerBoard.getMissedShots(),
              realPlayerBoard.getHitShots()
            );

            if (realPlayerBoard.allSunk() === true) {
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
    const letters = 'ABCDEFGHIJ';
    const allCoordinates = [];
    for (let i = 0; i < letters.length; i += 1) {
      const shipCoordinates = [];
      const shipGroup = document.querySelectorAll(`.drag.${letters[i]}`);
      for (let j = 0; j < shipGroup.length; j += 1) {
        shipCoordinates.push(getPosition(shipGroup[j].parentNode));
      }
      allCoordinates.push(shipCoordinates);
    }
    playerVsComputer(allCoordinates);
  });
};
