import './domChangerStyles.css';

function renderPlayersBoards() {
  const boards = document.querySelectorAll('.player');

  for (let i = 0; i < 2; i += 1) {
    const current = boards[i];
    for (let j = 0; j < 10; j += 1) {
      const row = document.createElement('div');
      row.className = 'boardRow';
      current.appendChild(row);

      for (let k = 0; k < 10; k += 1) {
        const coordinateBox = document.createElement('div');
        coordinateBox.classList = `coordinate k${j}${k}`;
        row.appendChild(coordinateBox);
      }
    }
  }
}


function renderBoard(player, grid, missedShots, hitShots){
  console.log(player, grid, missedShots, hitShots);
}
export { renderPlayersBoards, renderBoard };
