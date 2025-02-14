import { twoPlayerSetup } from "./domChanger";
import { dragAndDropInterface, getPosition } from "./dragAndDrop";
import './playerVsPlayerStyles.css';

function getCoordinates(){
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

function inBetween(player){
  const board = document.querySelector(`.${player}`);
  board.classList.add('whiteWallArea');
  const boardRows = document.querySelectorAll(`.${player} .boardRow`);
  const buttons = document.querySelectorAll(`.${player} button`);
  for(let i = 0; i < boardRows.length; i+=1){
    boardRows[i].classList.add('disappear');
  }
  buttons[0].classList.add('disappear');
  buttons[1].classList.add('disappear');

  const whiteWall = document.createElement('div');
  whiteWall.classList.add('whiteWall');
  whiteWall.innerText = "Switch to Player 2 click when ready";

  board.appendChild(whiteWall);

  whiteWall.addEventListener('click', ()=> {
    board.removeChild(whiteWall);
    board.classList.remove('whiteWallArea');

    for(let i = 0; i < boardRows.length; i+=1){
      boardRows[i].classList.remove('disappear');
    }
    buttons[0].classList.remove('disappear');
    buttons[1].classList.remove('disappear');
  });
}



export default () => {
  twoPlayerSetup("player");

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

    inBetween('player');

  });
};
