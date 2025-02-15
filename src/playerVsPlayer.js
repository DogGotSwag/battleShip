import { twoPlayerSetup, inBetween } from './domChanger';
import { dragAndDropInterface, getPosition } from './dragAndDrop';
import './playerVsPlayerStyles.css';
import Player from './Player';

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
  const indexPlayer = new Player();

  const playerOneBoard = indexPlayer.realPlayer.gameBoard;
  const playerTwoBoard = indexPlayer.computerPlayer.gameBoard;

  for (let i = 0; i < playerOneCoordinates.length; i += 1) {
    playerOneBoard.setShipAt(...playerOneCoordinates[i]);
    playerTwoBoard.setShipAt(...playerTwoCoordinates[i]);
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
