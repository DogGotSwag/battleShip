import './style.css';
import Player from './Player';
import { renderPlayersBoards, renderRealPlayer } from './domChanger';

const indexPlayer = new Player();

const realPlayerBoard = indexPlayer.realPlayer.gameBoard;
const computerPlayerBoard = indexPlayer.computerPlayer.gameBoard;

realPlayerBoard.setShipAt([0, 1], [0, 2], [0, 3]);
computerPlayerBoard.setShipAt([6, 3], [7, 3], [8, 3], [9, 3]);

renderPlayersBoards();

const coordinates = document.querySelectorAll('.coordinate');
coordinates.forEach((box) => {
  box.addEventListener('click', (e) => {
    const parent = e.target.parentNode.parentNode.classList[0];
    const clickedPosition = box.classList[1].split(',');

    if (parent === 'realPlayer') {
        realPlayerBoard.receiveAttack(clickedPosition);
    }
    if (parent === 'computerPlayer') {
      computerPlayerBoard.receiveAttack(clickedPosition);
    }
  });
});
