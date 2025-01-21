import './style.css';
import Player from './Player';
import {
  renderPlayersBoards,
  renderBoard,
  gameOver,
  makeCoordinateForm,
} from './domChanger';
import computerAttack from './computerAttack';
import generateRandomCoordinates from './generateRandomCoordinates';

function playerVsComputer( allCoordinates) {
  const indexPlayer = new Player();

  const realPlayerBoard = indexPlayer.realPlayer.gameBoard;
  const computerPlayerBoard = indexPlayer.computerPlayer.gameBoard;

  for(let i = 0; i < allCoordinates.length; i +=1){
    realPlayerBoard.setShipAt(...allCoordinates[i]);
  }
  const makeCoordinates = new generateRandomCoordinates();
  const computerCoordinates = makeCoordinates.generateAllCoordinates();
  for(let i = 0; i < computerCoordinates.length; i +=1){
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
            continueAttack = realPlayerBoard.receiveAttack(
              computerAttack(realPlayerBoard.availableCoordinates())
            );
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

function getAllCoordinates(){
  const classes = [
    'four',
    'three',
    'threeTwo',
    'two',
    'twoTwo',
    'twoThree',
    'one',
    'oneTwo',
    'oneThree',
    'oneFour',
  ];
  const allCoordinates = [];
  for (let i = 0; i < classes.length; i += 1) {
    const currInput = document.querySelector(`#${classes[i]}`);
    const [value] = [currInput.value];
    const coordinates = value.replaceAll(')', '').replaceAll('(','').split(',');
    const shipCoordinates = [];
    for(let j = 0; j < coordinates.length; j += 2){
      const array = [];
      array[0] = coordinates[j];      
      array[1] = coordinates[1+j];     
      shipCoordinates.push(array); 
    }
    allCoordinates.push(shipCoordinates);
  }
  return allCoordinates;
}

export default () => {
  makeCoordinateForm('player');
  const form = document.querySelector('.getCoordinateForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const allShipCoordinates = getAllCoordinates();
    playerVsComputer(allShipCoordinates);
  });
};
