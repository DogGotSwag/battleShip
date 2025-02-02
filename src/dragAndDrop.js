/* eslint-disable no-loop-func */
import { renderPlayersBoards } from './domChanger';
import GenerateRandomCoordinates from './generateRandomCoordinates';
import './dragAndDrop.css';

let currDrag = [];

function setDragAndDropShips(player, shipCoordinates) {
  const shipLetter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  for (let i = 0; i < shipCoordinates.length; i += 1) {
    const currShipLetter = shipLetter[i];

    for (let j = 0; j < shipCoordinates[i].length; j += 1) {
      const shot = shipCoordinates[i][j];
      const box = document.querySelector(`.${player} .k${shot[0]}${shot[1]}`);
      const dragBox = document.createElement('div');
      dragBox.classList.add('drag');
      dragBox.classList.add(`ship_${shipCoordinates[i].length}`);
      dragBox.classList.add(`number_${j}`);
      dragBox.classList.add(`${currShipLetter}`);

      dragBox.draggable = true;

      dragBox.addEventListener('dragstart', () => {
        const length = dragBox.classList[1].split('_')[1];
        const shipNumber = dragBox.classList[2].split('_')[1];
        const letter = dragBox.classList[3];
        for (let k = 0; k < length; k += 1) {
          const element = document.querySelector(
            `.ship_${length}.number_${k}.${letter}`
          );
          currDrag.append(element);
        }
      });
      box.append(dragBox);

    }
  }
}

function setUpGridBoxes(player) {
  const targets = document.querySelectorAll(`.${player} .coordinate`);
  for (let i = 0; i < targets.length; i += 1) {
    targets[i].innerHTML = '';
    targets[i].addEventListener('dragover', (e) => {
      e.preventDefault();
    });
    targets[i].addEventListener('dragleave', (e) => {
      e.preventDefault();
    });
    targets[i].addEventListener('drop', () => {
      for (let j = 0; j < currDrag.length; j += 1) {
        targets[i].prepend(currDrag[j]);
      }
      currDrag = [];
    });
  }
}
function dragAndDropInterface(player) {
  renderPlayersBoards(player);
  const obj = new GenerateRandomCoordinates();
  const randomCoordinates = obj.generateAllCoordinates();
  setUpGridBoxes(player);
  setDragAndDropShips(player, randomCoordinates);
}

export default dragAndDropInterface;
