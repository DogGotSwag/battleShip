import './style.css';
import Player from './Player';
import { renderPlayersBoards } from './domChanger';

const indexPlayer = new Player();

const realPlayerBoard = indexPlayer.realPlayer.gameBoard;
const computerPlayerBoard = indexPlayer.computerPlayer.gameBoard;

realPlayerBoard.setShipAt([0, 1], [0, 2], [0, 3]);
computerPlayerBoard.setShipAt([6, 3], [7, 3], [8, 3], [9, 3]);

renderPlayersBoards();
