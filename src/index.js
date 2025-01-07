import './style.css';
import Player from './Player';
import { renderPlayersBoards, renderBoard } from './domChanger';
import computerAttack from './computerAttack';

const indexPlayer = new Player();

const realPlayerBoard = indexPlayer.realPlayer.gameBoard;
const computerPlayerBoard = indexPlayer.computerPlayer.gameBoard;

realPlayerBoard.setShipAt([0, 1], [0, 2], [0, 3]);
computerPlayerBoard.setShipAt([6, 3], [7, 3], [8, 3], [9, 3]);

renderPlayersBoards();

const boards = document.querySelectorAll('.player');

boards.forEach((board) => {
  board.addEventListener('click', (e) => {
    const clicked = e.target;
    const clickedType = clicked.classList[0];
    if (clickedType === 'coordinate') {
      const parent = clicked.parentNode.parentNode.classList[0];
      const clickedPosition = clicked.classList[1].slice(1, 3).split('');

      if (parent === 'computerPlayer') {
        const hitOrMiss = computerPlayerBoard.receiveAttack(clickedPosition);
        renderBoard(
          'computerPlayer',
          computerPlayerBoard.getGrid(),
          computerPlayerBoard.getMissedShots(),
          computerPlayerBoard.getHitShots()
        );

        if (hitOrMiss === 'Miss') {
          realPlayerBoard.receiveAttack(computerAttack());
          renderBoard(
            'realPlayer',
            realPlayerBoard.getGrid(),
            realPlayerBoard.getMissedShots(),
            realPlayerBoard.getHitShots()
          );
        }
      }
    }
  });
});
