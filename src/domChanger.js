import './domChangerStyles.css';
import './dragAndDrop.css';
import generateRandomCoordinates from './generateRandomCoordinates';

function renderPlayersBoards(players = 'player') {
  const boards = document.querySelectorAll(`.${players}`);

  for (let i = 0; i < boards.length; i += 1) {
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
        coordinateBox.classList = `coordinate k${j}${k} target`;

        const statusCircle = document.createElement('div');
        statusCircle.classList = 'statusCircle';

        coordinateBox.appendChild(statusCircle);
        row.appendChild(coordinateBox);
      }
    }
  }
}

function renderBoard(player, grid, missedShots, hitShots) {
  renderPlayersBoards(player);

  for (let i = 0; i < missedShots.length; i += 1) {
    const shot = missedShots[i];
    const box = document.querySelector(`.${player} .k${shot[0]}${shot[1]}`);
    box.classList.add('missed');
  }

  for (let i = 0; i < hitShots.length; i += 1) {
    const shot = hitShots[i];
    const ship = grid[shot[0]][shot[1]];

    const box = document.querySelector(`.${player} .k${shot[0]}${shot[1]}`);

    if (ship.isSunk()) box.classList.add('sunk');

    box.classList.add('hitShot');
  }
}

function disablePlay() {
  const playerBoard = document.querySelector('.computerPlayer');
  playerBoard.classList.add('disabled');
}

function displayWinner(player) {
  const winner = document.querySelector(`.${player}`);
  winner.classList.add('winner');
}

function displayLoser(player) {
  const loser = document.querySelector(`.${player}`);
  loser.classList.add('loser');
}

function gameOver(winner, loser) {
  displayWinner(winner);
  displayLoser(loser);
  disablePlay();
}

function makeCoordinateForm(player) {
  const container = document.querySelector(`.${player}`);
  const frag = document.createDocumentFragment();

  const form = document.createElement('form');
  form.classList.add('getCoordinateForm');
  frag.appendChild(form);

  const fieldSet = document.createElement('fieldset');
  fieldSet.classList.add('formFieldSet');

  const legend = document.createElement('legend');
  legend.innerText = 'Set Coordinates';
  form.appendChild(fieldSet);
  fieldSet.appendChild(legend);

  const forAttrArray = [
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
  const labelTexts = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

  const ul = document.createElement('ul');
  for (let i = 0; i < forAttrArray.length; i += 1) {
    const li = document.createElement('li');
    const label = document.createElement('label');
    label.setAttribute('for', forAttrArray[i]);
    label.innerText = `Ship Size ${labelTexts[i]} :`;
    const input = document.createElement('input');
    input.required = true;
    input.setAttribute('id', forAttrArray[i]);

    li.appendChild(label);
    li.appendChild(input);
    ul.appendChild(li);
  }
  fieldSet.appendChild(ul);

  const buttonArea = document.createElement('div');
  buttonArea.classList.add('buttonArea');

  const randomizerButton = document.createElement('button');
  randomizerButton.innerText = 'Randomize';
  randomizerButton.setAttribute('type', 'button');
  randomizerButton.classList.add('randomize');

  randomizerButton.addEventListener('click', () => {
    const obj = new generateRandomCoordinates();
    const randomCoordinates = obj.generateAllCoordinates();
    const inputs = document.querySelectorAll('input');
    for (let i = 0; i < inputs.length; i += 1) {
      const shipCoordinates = randomCoordinates[i];
      let word = '';
      for (let j = 0; j < shipCoordinates.length - 1; j += 1) {
        word += `(${shipCoordinates[j]}),`;
      }
      word += `(${shipCoordinates[shipCoordinates.length - 1]})`;

      inputs[i].value = word;
    }
  });

  const resetButton = document.createElement('button');
  resetButton.innerText = 'Reset';
  resetButton.setAttribute('type', 'reset');

  const submitButton = document.createElement('button');
  submitButton.innerText = 'Submit';

  buttonArea.appendChild(randomizerButton);
  buttonArea.appendChild(resetButton);
  buttonArea.appendChild(submitButton);

  form.appendChild(buttonArea);

  container.appendChild(frag);
}

function setDragAndDropShips(player, shipCoordinates) {
  for (let i = 0; i < shipCoordinates.length; i += 1) {
    for (let j = 0; j < shipCoordinates[i].length; j += 1) {
      const shot = shipCoordinates[i][j];
      const box = document.querySelector(`.${player} .k${shot[0]}${shot[1]}`);
      box.innerHTML = '';
      const dragBox = document.createElement('div');
      dragBox.classList.add('drag');
      dragBox.draggable = true;
      box.append(dragBox);
    }
  }
}

function dragAndDropInterface(player) {
  renderPlayersBoards(player);
  const obj = new generateRandomCoordinates();
  const randomCoordinates = obj.generateAllCoordinates();
  setDragAndDropShips(player, randomCoordinates);
}

export {
  renderPlayersBoards,
  renderBoard,
  gameOver,
  makeCoordinateForm,
  dragAndDropInterface,
};
