import {
  getCornerShots,
  getSurroundingPositions,
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

function realHit(oppositeBoard, clickedPosition, hitNotSunk) {
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



export {setBoard, sendAttacks, checkIfSunk, realHit};