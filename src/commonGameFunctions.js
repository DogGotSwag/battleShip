import {
  getCornerShots,
  getSurroundingPositions,
  getPosition,
  getCoordinatesFromNodeList
} from './coordinates';

function setBoard(one, two, playerOneBoard, playerTwoBoard) {
  for (let i = 0; i < one.length; i += 1) {
    playerOneBoard.setShipAt(...one[i]);
    playerTwoBoard.setShipAt(...two[i]);
  }
}

function sendAttacks(coordinates, board) {
  for (let i = 0; i < coordinates.length; i += 1) {
    board.receiveAttack(coordinates[i]);
  }
}

function checkIfSunk(board, position) {
  return board.getGrid()[position[0]][position[1]].isSunk();
}

function postHitEffects(oppositeBoard, clickedPosition, oppositeBoardClass) {
  const hitNotSunkDivs = document.querySelectorAll(
      `.${oppositeBoardClass} .hitShot:not(.sunk)`
  );
  const hitNotSunk =
    getCoordinatesFromNodeList(hitNotSunkDivs);

  hitNotSunk.push(clickedPosition);
  const cornerCoordinates = getCornerShots(clickedPosition);
  sendAttacks(cornerCoordinates, oppositeBoard);

  const isSunk = checkIfSunk(oppositeBoard, clickedPosition);

  if (isSunk) {
    const allSunk = [];
    for (let i = 0; i < hitNotSunk.length; i += 1) {
      const currCoord = hitNotSunk[i];
      const currCoordSunk = checkIfSunk(oppositeBoard, currCoord);

      if (currCoordSunk) {
        allSunk.push(currCoord);
        hitNotSunk.splice(i, 1);
        i -= 1;
      }
    }
    const surroundingCoordinates = getSurroundingPositions(allSunk);
    sendAttacks(surroundingCoordinates, oppositeBoard);
  }
}

function getCoordinatesFromDragAndDrop() {
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



export {setBoard, sendAttacks, checkIfSunk, postHitEffects, getCoordinatesFromDragAndDrop};