import { renderPlayersBoards } from './domChanger';
import GenerateRandomCoordinates from './generateRandomCoordinates';
import './dragAndDrop.css';

import {
  allInBounds,
  getPosition,
  getCoordinatesFromNodeList,
  getNewOrientationCoordinates,
  checkSurroundingCoordinates,
  transformedCoordinates,
  getTransform,
} from './coordinates';

function removeClass(className) {
  const allInUse = document.querySelectorAll(`.${className}`);
  for (let j = 0; j < allInUse.length; j += 1) {
    allInUse[j].classList.remove(className);
  }
}

function horizontalOrVertical(elementOne, elementTwo) {
  const positionOne = getPosition(elementOne.parentNode);
  const positionTwo = getPosition(elementTwo.parentNode);

  let orientation;

  if (positionOne[0] + 1 === positionTwo[0]) {
    orientation = 'vertical';
  }
  if (positionOne[1] + 1 === positionTwo[1]) {
    orientation = 'horizontal';
  }

  return orientation;
}

function moveToNewOrientation(newCoordinates, shipGroup, player) {
  for (let k = 0; k < newCoordinates.length; k += 1) {
    const currCoordinate = newCoordinates[k];
    const newBoxPosition = document.querySelector(
      `.${player} .k${currCoordinate[0]}${currCoordinate[1]}`
    );
    newBoxPosition.append(shipGroup[k + 1]);
  }
}

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
        dragBox.classList.add('index');

        for (let k = 0; k < length; k += 1) {
          const element = document.querySelector(
            `.ship_${length}.number_${k}.${letter}`
          );
          element.classList.add('inUse');
        }
      });

      if (length > 1) {
        dragBox.addEventListener('dblclick', () => {
          const shipGroup = document.querySelectorAll(
            `.ship_${length}.${letter}`
          );

          const orientation = horizontalOrVertical(shipGroup[0], shipGroup[1]);

          const newCoordinates = getNewOrientationCoordinates(
            orientation,
            shipGroup[0],
            length
          );
          const withinBounds = allInBounds(newCoordinates);
          const noConflicts = checkSurroundingCoordinates(
            newCoordinates,
            player,
            getPosition(shipGroup[0].parentNode),
            getPosition(shipGroup[1].parentNode)
          );

          if (withinBounds && noConflicts) {
            moveToNewOrientation(newCoordinates, shipGroup, player);
          } else {
            for (let k = 0; k < shipGroup.length; k += 1) {
              const currPosition = shipGroup[k];
              currPosition.classList.add('rejected');
            }
          }
        });
      }

      dragBox.addEventListener('animationend', (e) => {
        e.target.classList.remove('rejected');
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

    targets[i].addEventListener('dragenter', (e) => {
      e.preventDefault();

      const transform = getTransform(e.target);
      removeClass('valid');
      removeClass('invalid');

      const inUse = document.querySelectorAll('.inUse');
      const allCoordinates = getCoordinatesFromNodeList(inUse);
      const newLocation = transformedCoordinates(allCoordinates, transform);

      const isAllInBounds = allInBounds(newLocation);

      const noConflicts = checkSurroundingCoordinates(
        newLocation,
        player,
        ...allCoordinates
      );

      if (isAllInBounds && noConflicts) {
        for (let j = 0; j < inUse.length; j += 1) {
          const currBox = inUse[j];
          const currBoxOldPosition = getPosition(currBox.parentNode);
          const currBoxNewPosition = [
            currBoxOldPosition[0] + transform[0],
            currBoxOldPosition[1] + transform[1],
          ];

          const box = document.querySelector(
            `.${player} .k${currBoxNewPosition[0]}${currBoxNewPosition[1]}`
          );
          box.classList.add('valid');
        }
      } else {
        for (let j = 0; j < inUse.length; j += 1) {
          const currBox = inUse[j];
          const currBoxOldPosition = getPosition(currBox.parentNode);
          const currBoxNewPosition = [
            currBoxOldPosition[0] + transform[0],
            currBoxOldPosition[1] + transform[1],
          ];

          const box = document.querySelector(
            `.${player} .k${currBoxNewPosition[0]}${currBoxNewPosition[1]}`
          );
          box.classList.add('invalid');
        }
      }
    });

    targets[i].addEventListener('dragleave', (e) => {
      e.preventDefault();
    });

    targets[i].addEventListener('drop', (e) => {
      const validBoxes = document.querySelectorAll('.valid');

      if (validBoxes.length > 0) {
        const transform = getTransform(e.target);
        const inUse = document.querySelectorAll('.inUse');

        for (let j = 0; j < inUse.length; j += 1) {
          const currBox = inUse[j];
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
      removeClass('valid');
      removeClass('invalid');
      removeClass('inUse');
      removeClass('index');
    });
  }
}

function addStartButton(player) {
  const board = document.querySelector(`.${player}`);
  const button = document.createElement('button');
  button.innerText = 'Start';
  button.setAttribute('type', 'button');
  button.classList.add('startButton');
  board.appendChild(button);
}

function addRandomButton(player) {
  const board = document.querySelector(`.${player}`);
  const button = document.createElement('button');
  button.innerText = 'Random';
  button.setAttribute('type', 'button');
  button.classList.add('randomButton');
  board.appendChild(button);

  button.addEventListener('click', () => {
    const obj = new GenerateRandomCoordinates();
    const randomCoordinates = obj.generateAllCoordinates();
    setUpGridBoxes(player);
    setDragAndDropShips(player, randomCoordinates);
  });
}

function dragAndDropInterface(player) {
  renderPlayersBoards(player);
  const obj = new GenerateRandomCoordinates();
  const randomCoordinates = obj.generateAllCoordinates();
  setUpGridBoxes(player);
  setDragAndDropShips(player, randomCoordinates);
  addStartButton(player);
  addRandomButton(player);
}

export { dragAndDropInterface, getPosition };
