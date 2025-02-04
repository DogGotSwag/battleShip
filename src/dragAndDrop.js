/* eslint-disable no-loop-func */
import { renderPlayersBoards } from './domChanger';
import GenerateRandomCoordinates from './generateRandomCoordinates';
import './dragAndDrop.css';

let currDrag = [];
let currShipIndex;

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
      const length = dragBox.classList[1].split('_')[1];
      const letter = dragBox.classList[3];

      dragBox.addEventListener('dragstart', () => {
        [currShipIndex] = [...dragBox.classList[2].split('_')[1]];

        for (let k = 0; k < length; k += 1) {
          const element = document.querySelector(
            `.ship_${length}.number_${k}.${letter}`
          );
          element.classList.add('inUse');
          currDrag.push(element);
        }
      });

      if(length > 1){
        dragBox.addEventListener('dblclick', () => {
          const shipGroup = document.querySelectorAll(
            `.ship_${length}.${letter}`
          );
          for( let k = 0; k < shipGroup.length; k +=1){
            console.log(shipGroup[k]);
          }
        });
      }
      box.append(dragBox);
    }

  }
}

function removeValidBoxes() {
  const allValidBoxes = document.querySelectorAll('.valid');
  for (let j = 0; j < allValidBoxes.length; j += 1) {
    allValidBoxes[j].classList.remove('valid');
  }
}

function removeInUse() {
  const allInUse = document.querySelectorAll('.inUse');
  for (let j = 0; j < allInUse.length; j += 1) {
    allInUse[j].classList.remove('inUse');
  }
}

function inBounds(coordinate) {
  if (coordinate[0] < 0 || coordinate[0] > 9) return false;
  if (coordinate[1] < 0 || coordinate[1] > 9) return false;
  return true;
}

function getPosition(parent) {
  const row = Number(parent.classList[1].split('')[1]);
  const col = Number(parent.classList[1].split('')[2]);
  return [row, col];
}

function getTransform(target) {
  const initial = currDrag[currShipIndex];
  const position = getPosition(initial.parentNode);
  let newPosition;
  if (target.classList[0] === 'coordinate') {
    newPosition = getPosition(target);
  } else {
    newPosition = getPosition(target.parentNode);
  }

  return [newPosition[0] - position[0], newPosition[1] - position[1]];
}

function setUpGridBoxes(player) {
  const targets = document.querySelectorAll(`.${player} .coordinate`);
  for (let i = 0; i < targets.length; i += 1) {
    targets[i].innerHTML = '';
    targets[i].addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    targets[i].addEventListener('dragenter', (e) => {
      e.preventDefault();

      const transform = getTransform(e.target);
      removeValidBoxes();

      for (let j = 0; j < currDrag.length; j += 1) {
        const currBox = currDrag[j];
        const currBoxOldPosition = getPosition(currBox.parentNode);
        const currBoxNewPosition = [
          currBoxOldPosition[0] + transform[0],
          currBoxOldPosition[1] + transform[1],
        ];

        if (!inBounds(currBoxNewPosition)) {
          removeValidBoxes();
          break;
        }
        const box = document.querySelector(
          `.${player} .k${currBoxNewPosition[0]}${currBoxNewPosition[1]}`
        );
        box.classList.add('valid');
      }
    });

    targets[i].addEventListener('dragleave', (e) => {
      e.preventDefault();
    });

    targets[i].addEventListener('drop', (e) => {
      const validBoxes = document.querySelectorAll('.valid');

      if (validBoxes.length > 0) {
        const transform = getTransform(e.target);

        for (let j = 0; j < currDrag.length; j += 1) {
          const currBox = currDrag[j];
          const currBoxOldPosition = getPosition(currBox.parentNode);
          const currBoxNewPosition = [
            currBoxOldPosition[0] + transform[0],
            currBoxOldPosition[1] + transform[1],
          ];

          const box = document.querySelector(
            `.${player} .k${currBoxNewPosition[0]}${currBoxNewPosition[1]}`
          );
          box.append(currBox);
        }
      }
    });

    targets[i].addEventListener('dragend', () => {
      removeValidBoxes();
      removeInUse();
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
