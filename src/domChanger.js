import './domChangerStyles.css';

function renderPlayersBoards(players = 'player') {
  const boards = document.querySelectorAll(`.${players}`);
  
  for(let i = 0; i < boards.length; i += 1){
    boards[i].innerHTML = '';
  }
 

  for (let i = 0; i < boards.length; i += 1) {
    const current = boards[i];
    for (let j = 0; j < 10; j += 1) {
      const row = document.createElement('div');
      row.className = 'boardRow';
      current.appendChild(row);

      for (let k = 0; k < 10; k += 1) {
        const coordinateBox = document.createElement('div');
        coordinateBox.classList = `coordinate k${j}${k}`;

        const statusCircle = document.createElement('div');
        statusCircle.classList = 'statusCircle';

        coordinateBox.appendChild(statusCircle);
        row.appendChild(coordinateBox);
      }
    }
  }
}


function renderBoard(player, grid, missedShots, hitShots){
  renderPlayersBoards(player);

  for(let i = 0; i < missedShots.length; i += 1){
    const shot = missedShots[i];
    const box = document.querySelector(`.${player} .k${shot[0]}${shot[1]}`);
    box.classList.add('missed');
  }

  for(let i = 0; i < hitShots.length; i += 1){
    const shot = hitShots[i];
    const ship = grid[shot[0]][shot[1]];
    
    const box = document.querySelector(`.${player} .k${shot[0]}${shot[1]}`);

    if(ship.isSunk()) box.classList.add('sunk');

    box.classList.add('hitShot');
  }
}

function disablePlay(){
  const playerBoard = document.querySelector('.computerPlayer');
  playerBoard.classList.add('disabled');
}

function displayWinner(){

}
export { renderPlayersBoards, renderBoard, disablePlay, displayWinner };
