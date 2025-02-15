import { twoPlayerSetup, inBetween, renderPlayersBoards, renderBoard } from './domChanger';
import { dragAndDropInterface, getPosition } from './dragAndDrop';
import './playerVsPlayerStyles.css';
import Player from './Player';
import { getCornerShots, getSurroundingPositions } from './coordinates';

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

function makeGame(playerOneCoordinates, playerTwoCoordinates){
  renderPlayersBoards();
  const indexPlayer = new Player();

  const playerOneBoard = indexPlayer.realPlayer.gameBoard;
  const playerTwoBoard = indexPlayer.computerPlayer.gameBoard;

  for (let i = 0; i < playerOneCoordinates.length; i += 1) {
    playerOneBoard.setShipAt(...playerOneCoordinates[i]);
    playerTwoBoard.setShipAt(...playerTwoCoordinates[i]);
  }

  const board = document.querySelector('.player');
  const realPlayerHitNotSunk = [];


  board.addEventListener('click', (e) => {
      const clicked = e.target;
      const clickedType = clicked.classList[0];

      if(clickedType === 'coordinate'){
        const clickedPosition = clicked.classList[1].slice(1, 3).split('');
        
        const hitOrMiss = playerTwoBoard.receiveAttack(clickedPosition);

        if (hitOrMiss === 'Hit') {
          realPlayerHitNotSunk.push(clickedPosition);
          const cornerCoordinates = getCornerShots(clickedPosition);
          for (let i = 0; i < cornerCoordinates.length; i += 1) {
            playerTwoBoard.receiveAttack(cornerCoordinates[i]);
          }

          const isSunk = playerTwoBoard
            .getGrid()
            [clickedPosition[0]][clickedPosition[1]].isSunk();

          if (isSunk) {
            const allSunk = [];
            for (let i = 0; i < realPlayerHitNotSunk.length; i += 1) {
              const currCoord = realPlayerHitNotSunk[i];
              const currCoordSunk = playerTwoBoard
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
              playerTwoBoard.receiveAttack(surroundingCoordinates[j]);
            }
          }
        }
        renderBoard(
          'player',
          playerTwoBoard.getGrid(),
          playerTwoBoard.getMissedShots(),
          playerTwoBoard.getHitShots()
        );
        if (playerTwoBoard.allSunk() === true) {
          // gameOver('realPlayer', 'player');
        }
        
      }
  });
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
