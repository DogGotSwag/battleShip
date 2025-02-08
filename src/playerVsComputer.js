import './style.css';
import Player from './Player';
import {
  renderPlayersBoards,
  renderBoard,
  gameOver,
} from './domChanger';

import { dragAndDropInterface, getPosition } from './dragAndDrop';
import computerAttack from './computerAttack';
import generateRandomCoordinates from './generateRandomCoordinates';

function inBounds(coordinate) {
  const indexOne = parseInt(coordinate[0], 10);
  const indexTwo = parseInt(coordinate[1], 10);
  if (indexOne < 0 || indexOne > 9) return false;
  if (indexTwo < 0 || indexTwo > 9) return false;
  return true;
}

function getCornerShots(coordinate) {
  const indexOne = parseInt(coordinate[0], 10);
  const indexTwo = parseInt(coordinate[1], 10);
  const inboundCoordinates = [];

  const topLeft = [indexOne - 1, indexTwo - 1];
  const topRight = [indexOne - 1, indexTwo + 1];
  const bottomLeft = [indexOne + 1, indexTwo - 1];
  const bottomRight = [indexOne + 1, indexTwo + 1];

  if (inBounds(topLeft)) inboundCoordinates.push(topLeft);
  if (inBounds(topRight)) inboundCoordinates.push(topRight);
  if (inBounds(bottomLeft)) inboundCoordinates.push(bottomLeft);
  if (inBounds(bottomRight)) inboundCoordinates.push(bottomRight);

  return inboundCoordinates;
}

function playerVsComputer(allCoordinates) {
  const indexPlayer = new Player();

  const realPlayerBoard = indexPlayer.realPlayer.gameBoard;
  const computerPlayerBoard = indexPlayer.computerPlayer.gameBoard;

  for (let i = 0; i < allCoordinates.length; i += 1) {
    realPlayerBoard.setShipAt(...allCoordinates[i]);
  }
  const makeCoordinates = new generateRandomCoordinates();
  const computerCoordinates = makeCoordinates.generateAllCoordinates();
  for (let i = 0; i < computerCoordinates.length; i += 1) {
    computerPlayerBoard.setShipAt(...computerCoordinates[i]);
  }

  renderPlayersBoards();

  const boards = document.querySelectorAll('.player');

  boards.forEach((board) => {
    board.addEventListener('click', (e) => {
      const clicked = e.target;
      const clickedType = clicked.classList[0];      
      
      const parent = clicked.parentNode.parentNode.classList[0];
      if (clickedType === 'coordinate' && parent === 'computerPlayer') {
        const clickedPosition = clicked.classList[1].slice(1, 3).split('');
        const hitOrMiss = computerPlayerBoard.receiveAttack(clickedPosition);

        if (hitOrMiss === 'Hit') {
          const cornerCoordinates = getCornerShots(clickedPosition);
          for (let i = 0; i < cornerCoordinates.length; i += 1) {
            computerPlayerBoard.receiveAttack(cornerCoordinates[i]);
          }
        }
        renderBoard(
          'computerPlayer',
          computerPlayerBoard.getGrid(),
          computerPlayerBoard.getMissedShots(),
          computerPlayerBoard.getHitShots()
        );
        if (computerPlayerBoard.allSunk() === true) {
          gameOver('realPlayer', 'computerPlayer');
        }

        if (hitOrMiss === 'Miss') {
          let continueAttack;
          do {
            const attackPosition = computerAttack(
              realPlayerBoard.availableCoordinates()
            );
            continueAttack = realPlayerBoard.receiveAttack(attackPosition);

            if (continueAttack === 'Hit') {
              const cornerCoordinates = getCornerShots(attackPosition);
              for (let i = 0; i < cornerCoordinates.length; i += 1) {
                realPlayerBoard.receiveAttack(cornerCoordinates[i]);
              }
            }

            renderBoard(
              'realPlayer',
              realPlayerBoard.getGrid(),
              realPlayerBoard.getMissedShots(),
              realPlayerBoard.getHitShots()
            );

            if (realPlayerBoard.allSunk() === true) {
              gameOver('computerPlayer', 'realPlayer');
              continueAttack = '';
            }
          } while (continueAttack === 'Hit');
        }
      }
    });
  });
}


export default () => {
  dragAndDropInterface('realPlayer');
  const startButton = document.querySelector('.startButton');

  startButton.addEventListener('click', () => {
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
