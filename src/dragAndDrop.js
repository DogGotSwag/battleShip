import { renderPlayersBoards } from './domChanger';
import GenerateRandomCoordinates from './generateRandomCoordinates';
import './dragAndDrop.css';

function getPosition(parent) {
  const row = Number(parent.classList[1].split('')[1]);
  const col = Number(parent.classList[1].split('')[2]);
  return [row, col];
}

function getCoordinatesFromNodeList(nodeList) {
  const coordinates = [];
  for (let i = 0; i < nodeList.length; i += 1) {
    const curr = nodeList[i];
    coordinates.push(getPosition(curr.parentNode));
  }
  return coordinates;
}

function inBounds(coordinate) {
  if (coordinate[0] < 0 || coordinate[0] > 9) return false;
  if (coordinate[1] < 0 || coordinate[1] > 9) return false;
  return true;
}

function allInBounds(coordinateList) {
  for (let i = 0; i < coordinateList.length; i += 1) {
    if (inBounds(coordinateList[i]) === false) return false;
  }
  return true;
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

function getNewHorizontalCoordinates(firstShip, length) {
  const position = getPosition(firstShip.parentNode);
  const newPositions = [];

  for (let i = 1; i < length; i += 1) {
    const currPos = [position[0], position[1] + i];
    newPositions.push(currPos);
  }

  return newPositions;
}
function getNewVerticalCoordinates(firstShip, length) {
  const position = getPosition(firstShip.parentNode);
  const newPositions = [];

  for (let i = 1; i < length; i += 1) {
    const currPos = [position[0] + i, position[1]];
    newPositions.push(currPos);
  }

  return newPositions;
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

function getNewOrientationCoordinates(orientation, shipGroup, length) {
  let newCoordinates;
  if (orientation === 'vertical') {
    newCoordinates = getNewHorizontalCoordinates(shipGroup, length);
  } else newCoordinates = getNewVerticalCoordinates(shipGroup, length);

  return newCoordinates;
}

function getSurroundingPositions(coordinateList) {
  const surroundingCoordinates = [];
  for (let i = 0; i < coordinateList.length; i += 1) {
    const curr = coordinateList[i];
    const top = [curr[0] - 1, curr[1]];
    const topLeft = [curr[0] - 1, curr[1] - 1];
    const topRight = [curr[0] - 1, curr[1] + 1];
    const left = [curr[0], curr[1] - 1];
    const right = [curr[0], curr[1] + 1];
    const bottom = [curr[0] + 1, curr[1]];
    const bottomLeft = [curr[0] + 1, curr[1] - 1];
    const bottomRight = [curr[0] + 1, curr[1] + 1];

    if (inBounds(top)) surroundingCoordinates.push(top);
    if (inBounds(topLeft)) surroundingCoordinates.push(topLeft);
    if (inBounds(topRight)) surroundingCoordinates.push(topRight);
    if (inBounds(left)) surroundingCoordinates.push(left);
    if (inBounds(right)) surroundingCoordinates.push(right);
    if (inBounds(bottom)) surroundingCoordinates.push(bottom);
    if (inBounds(bottomLeft)) surroundingCoordinates.push(bottomLeft);
    if (inBounds(bottomRight)) surroundingCoordinates.push(bottomRight);
    if (inBounds(curr)) surroundingCoordinates.push(curr);
  }
  return surroundingCoordinates;
}

function removeDuplicates(coordinateList) {
  const noDupes = [];
  for (let i = 0; i < coordinateList.length; i += 1) {
    const curr = coordinateList[i];
    let isThereDupe = false;
    for (let j = 0; j < noDupes.length; j += 1) {
      if (JSON.stringify(noDupes[j]) === JSON.stringify(curr)) {
        isThereDupe = true;
      }
    }
    if (isThereDupe === false) noDupes.push(curr);
  }
  return noDupes;
}

function removeException(coordinateList, exception, exceptionTwo) {
  const final = [];
  for (let i = 0; i < coordinateList.length; i += 1) {
    const curr = coordinateList[i];
    if (
      JSON.stringify(curr) !== JSON.stringify(exception) &&
      JSON.stringify(curr) !== JSON.stringify(exceptionTwo)
    ) {
      final.push(curr);
    }
  }
  return final;
}

function checkForConflicts(coordinateList, player){
  let noConflicts = true;
  for (let i = 0; i < coordinateList.length; i += 1) {
    const curr = coordinateList[i];
    const box = document.querySelector(`.${player} .k${curr[0]}${curr[1]}`);
    if (box.innerHTML !== '') noConflicts = false;
  }
  return noConflicts;
}

function checkSurroundingCoordinates(
  coordinateList,
  exception,
  exceptionTwo,
  player
) {
  const surroundingCoordinates = getSurroundingPositions(coordinateList);
  const noDuplicateCoordinates = removeDuplicates(surroundingCoordinates);
  const finalWithException = removeException(
    noDuplicateCoordinates,
    exception,
    exceptionTwo
  );

  return checkForConflicts(finalWithException, player);
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
            getPosition(shipGroup[0].parentNode),
            getPosition(shipGroup[1].parentNode),
            player
          );

          if (withinBounds && noConflicts) {
            moveToNewOrientation(newCoordinates, shipGroup, player);
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

function getTransform(target) {
  const initial = document.querySelector('.index');
  const position = getPosition(initial.parentNode);
  let newPosition;
  if (target.classList[0] === 'coordinate') {
    newPosition = getPosition(target);
  } else {
    newPosition = getPosition(target.parentNode);
  }

  return [newPosition[0] - position[0], newPosition[1] - position[1]];
}

function transformedCoordinates(coordinateList, transform) {
  const coordinates = [];
  for (let i = 0; i < coordinateList.length; i += 1) {
    const currBox = coordinateList[i];
    const currBoxNewPosition = [
      currBox[0] + transform[0],
      currBox[1] + transform[1],
    ];
    coordinates.push(currBoxNewPosition);
  }
  return coordinates
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

      const inUse = document.querySelectorAll('.inUse');
      const allCoordinates = getCoordinatesFromNodeList(inUse);
      const newLocation = transformedCoordinates(allCoordinates, transform);
      console.log(newLocation);
      
      
      const isAllInBounds = allInBounds(allCoordinates);

      if (isAllInBounds) {
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
      removeValidBoxes();
      removeInUse();
      const inUse = document.querySelectorAll('.inUse');
      for (let j = 0; j < inUse.length; j += 1) {
        inUse[j].classList.remove('inUse');
      }
      const index = document.querySelector('.index');
      index.classList.remove('index');
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
