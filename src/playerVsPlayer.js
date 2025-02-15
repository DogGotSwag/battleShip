import { twoPlayerSetup } from './domChanger';
import { dragAndDropInterface, getPosition } from './dragAndDrop';
import './playerVsPlayerStyles.css';

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

function addClassToNodeList(nodeList, className) {
  for (let i = 0; i < nodeList.length; i += 1) {
    nodeList[i].classList.add(className);
  }
}

function removeClassToNodeList(nodeList, className) {
  for (let i = 0; i < nodeList.length; i += 1) {
    nodeList[i].classList.remove(className);
  }
}

function inBetween(player, message) {
  const board = document.querySelector(`.${player}`);
  board.classList.add('whiteWallArea');
  const boardChildren = document.querySelectorAll(`.${player} > *`);

  addClassToNodeList(boardChildren, 'disappear');

  const whiteWall = document.createElement('div');
  whiteWall.classList.add('whiteWall');
  whiteWall.innerText = message;

  board.appendChild(whiteWall);

  whiteWall.addEventListener('click', () => {
    board.removeChild(whiteWall);
    board.classList.remove('whiteWallArea');
    removeClassToNodeList(boardChildren, 'disappear');
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
    });

    inBetween('player', 'Switch to Player 2 click when ready');
  });
};
