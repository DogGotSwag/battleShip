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


export {setBoard, sendAttacks, checkIfSunk};