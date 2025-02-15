import {
  twoPlayerSetup,
  inBetween,
  renderPlayersBoards,
  renderBoard,
} from "./domChanger";
import { dragAndDropInterface, getPosition } from "./dragAndDrop";
import "./playerVsPlayerStyles.css";
import Player from "./Player";
import { getCornerShots, getSurroundingPositions } from "./coordinates";

function getCoordinates() {
  const letters = "ABCDEFGHIJ";
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

function makeGame(playerOneCoordinates, playerTwoCoordinates) {
  renderPlayersBoards();
  const indexPlayer = new Player();

  const playerOneBoard = indexPlayer.realPlayer.gameBoard;
  const playerTwoBoard = indexPlayer.computerPlayer.gameBoard;

  const playerArray = [playerOneBoard, playerTwoBoard];
  let index = 1;

  for (let i = 0; i < playerOneCoordinates.length; i += 1) {
    playerOneBoard.setShipAt(...playerOneCoordinates[i]);
    playerTwoBoard.setShipAt(...playerTwoCoordinates[i]);
  }

  const board = document.querySelector(".player");

  const playerOneHitNotSunk = [];
  const playerTwoHitNotSunk = [];

  const hitNotSunkArray = [playerOneHitNotSunk, playerTwoHitNotSunk];


  board.addEventListener("click", (e) => {
    const clicked = e.target;
    const clickedType = clicked.classList[0];

    if (clickedType === "coordinate") {
      const clickedPosition = clicked.classList[1].slice(1, 3).split("");

      const hitOrMiss = playerArray[index].receiveAttack(clickedPosition);

      if (hitOrMiss === "Hit") {
        hitNotSunkArray[index].push(clickedPosition);
        const cornerCoordinates = getCornerShots(clickedPosition);
        for (let i = 0; i < cornerCoordinates.length; i += 1) {
          playerArray[index].receiveAttack(cornerCoordinates[i]);
        }

        const isSunk = playerArray[index]
          .getGrid()
          [clickedPosition[0]][clickedPosition[1]].isSunk();

        if (isSunk) {
          const allSunk = [];
          for (let i = 0; i < hitNotSunkArray[index].length; i += 1) {
            const currCoord = hitNotSunkArray[index][i];
            const currCoordSunk = playerArray[index]
              .getGrid()
              [currCoord[0]][currCoord[1]].isSunk();

            if (currCoordSunk) {
              allSunk.push(currCoord);
              hitNotSunkArray[index].splice(i, 1);
              i -= 1;
            }
          }

          const surroundingCoordinates = getSurroundingPositions(allSunk);
          for (let j = 0; j < surroundingCoordinates.length; j += 1) {
            playerArray[index].receiveAttack(surroundingCoordinates[j]);
          }
        }

        if (playerArray[index].allSunk() === true) {
          // gameOver('realPlayer', 'player');
        }

        renderBoard(
          "player",
          playerArray[index].getGrid(),
          playerArray[index].getMissedShots(),
          playerArray[index].getHitShots()
        );
      } else {
        renderBoard(
          "player",
          playerArray[index].getGrid(),
          playerArray[index].getMissedShots(),
          playerArray[index].getHitShots()
        );
      }
    }
  });
}

export default () => {
  twoPlayerSetup("player");

  let playerOneCoordinates = [];
  let playerTwoCoordinates = [];

  dragAndDropInterface("player");
  const startButton = document.querySelector(".startButton");
  startButton.addEventListener("click", (e) => {
    e.stopPropagation();
    playerOneCoordinates = getCoordinates();

    dragAndDropInterface("player");
    const startButtonTwo = document.querySelector(".startButton");
    startButtonTwo.addEventListener("click", (event) => {
      event.stopPropagation();
      playerTwoCoordinates = getCoordinates();

      makeGame(playerOneCoordinates, playerTwoCoordinates);
    });

    inBetween("player", "Switch to Player 2 click when ready");
  });
};
