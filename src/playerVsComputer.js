import './style.css';
import Player from './Player';
import {
  renderPlayersBoards,
  renderBoard,
  gameOver,
  singlePlayerSetup,
} from './domChanger';

import { getCornerShots, getSurroundingPositions } from './coordinates';
import { dragAndDropInterface, getPosition } from './dragAndDrop';
import computerAttack, {adjacentAttack} from './computerAttack';
import GenerateRandomCoordinates from './generateRandomCoordinates';
import { setBoard, sendAttacks, checkIfSunk } from './commonGameFunctions';

function playerVsComputer(allCoordinates) {
  const indexPlayer = new Player();

  const realPlayerBoard = indexPlayer.realPlayer.gameBoard;
  const computerPlayerBoard = indexPlayer.computerPlayer.gameBoard;

  const makeCoordinates = new GenerateRandomCoordinates();
  const computerCoordinates = makeCoordinates.generateAllCoordinates();

  for (let i = 0; i < allCoordinates.length; i += 1) {
    realPlayerBoard.setShipAt(...allCoordinates[i]);
    computerPlayerBoard.setShipAt(...computerCoordinates[i]);
  }

  renderPlayersBoards();

  const boards = document.querySelectorAll('.player');
  const realPlayerHitNotSunk = [];
  const computerPlayerHitNotSunk = [];

  boards.forEach((board) => {
    board.addEventListener('click', (e) => {
      const clicked = e.target;
      const clickedType = clicked.classList[0];

      const parent = clicked.parentNode.parentNode.classList[0];
      if (clickedType === 'coordinate' && parent === 'computerPlayer') {
        const clickedPosition = clicked.classList[1].slice(1, 3).split('');
        const hitOrMiss = computerPlayerBoard.receiveAttack(clickedPosition);

        if (hitOrMiss === 'Hit') {
          realPlayerHitNotSunk.push(clickedPosition);
          const cornerCoordinates = getCornerShots(clickedPosition);
          for (let i = 0; i < cornerCoordinates.length; i += 1) {
            computerPlayerBoard.receiveAttack(cornerCoordinates[i]);
          }

          const isSunk = computerPlayerBoard
            .getGrid()
            [clickedPosition[0]][clickedPosition[1]].isSunk();

          if (isSunk) {
            const allSunk = [];
            for (let i = 0; i < realPlayerHitNotSunk.length; i += 1) {
              const currCoord = realPlayerHitNotSunk[i];
              const currCoordSunk = computerPlayerBoard
                .getGrid()
                [currCoord[0]][currCoord[1]].isSunk();

              if (currCoordSunk) {
                allSunk.push(currCoord);
                realPlayerHitNotSunk.splice(i, 1);
                i -= 1;
              }
            }

            const surroundingCoordinates = getSurroundingPositions(allSunk);
            for (let j = 0; j < surroundingCoordinates.length; j += 1) {
              computerPlayerBoard.receiveAttack(surroundingCoordinates[j]);
            }
          }
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

            if(adjacentShots.length === 0 ){
              attackPosition = computerAttack(
                realPlayerBoard.availableCoordinates()
              );
              continueAttack = realPlayerBoard.receiveAttack(attackPosition);
            }
            else{
              attackPosition = computerAttack(adjacentShots); 
              continueAttack = realPlayerBoard.receiveAttack(attackPosition);
              adjacentShots = [];
            }
          
            if (continueAttack === 'Hit') {
              adjacentShots = adjacentAttack(attackPosition, realPlayerBoard.availableCoordinates());
              
              computerPlayerHitNotSunk.push(attackPosition);
              const cornerCoordinates = getCornerShots(attackPosition);
              for (let i = 0; i < cornerCoordinates.length; i += 1) {
                realPlayerBoard.receiveAttack(cornerCoordinates[i]);
              }
              
              const isSunk = realPlayerBoard
                .getGrid()
                [attackPosition[0]][attackPosition[1]].isSunk();

              if (isSunk) {
                const allSunk = [];
                for (let i = 0; i < computerPlayerHitNotSunk.length; i += 1) {
                  const currCoord = computerPlayerHitNotSunk[i];

                  const currCoordSunk = realPlayerBoard
                    .getGrid()
                    [currCoord[0]][currCoord[1]].isSunk();

                  if (currCoordSunk) {
                    allSunk.push(currCoord);
                    computerPlayerHitNotSunk.splice(i, 1);
                    i -= 1;
                  }
                }

                const surroundingCoordinates = getSurroundingPositions(allSunk);
                for (let j = 0; j < surroundingCoordinates.length; j += 1) {
                  realPlayerBoard.receiveAttack(surroundingCoordinates[j]);
                }
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
