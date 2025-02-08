function inBounds(coordinate) {
  if (coordinate[0] < 0 || coordinate[0] > 9) return false;
  if (coordinate[1] < 0 || coordinate[1] > 9) return false;
  return true;
}

function getCornerShots(coordinate) {
  const indexOne = parseInt(coordinate[0], 10);
  const indexTwo = parseInt(coordinate[1], 10);
  const inboundCoordinates = [];

  const topLeft = [indexOne - 1, indexTwo - 1];
  const topRight = [indexOne - 1, indexTwo + 1];
  const bottomLeft = [indexOne + 1, indexTwo - 1];
  const bottomRight = [indexOne + 1, indexTwo + 1];

  if (inBounds(topLeft)) inboundCoordinates.push(topLeft);
  if (inBounds(topRight)) inboundCoordinates.push(topRight);
  if (inBounds(bottomLeft)) inboundCoordinates.push(bottomLeft);
  if (inBounds(bottomRight)) inboundCoordinates.push(bottomRight);

  return inboundCoordinates;
}

function allInBounds(coordinateList) {
  for (let i = 0; i < coordinateList.length; i += 1) {
    if (inBounds(coordinateList[i]) === false) return false;
  }
  return true;
}

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

function removeExceptions(coordinateList, exceptions) {
  const final = [];
  for (let i = 0; i < coordinateList.length; i += 1) {
    const curr = coordinateList[i];
    let allowIn = true;
    for (let j = 0; j < exceptions.length; j += 1) {
      if (JSON.stringify(curr) === JSON.stringify(exceptions[j])) {
        allowIn = false;
      }
    }
    if (allowIn) final.push(curr);
  }
  return final;
}

function checkForConflicts(coordinateList, player) {
  let noConflicts = true;
  for (let i = 0; i < coordinateList.length; i += 1) {
    const curr = coordinateList[i];
    const box = document.querySelector(`.${player} .k${curr[0]}${curr[1]}`);
    if (box.innerHTML !== '') noConflicts = false;
  }
  return noConflicts;
}

function checkSurroundingCoordinates(coordinateList, player, ...exceptions) {
  const surroundingCoordinates = getSurroundingPositions(coordinateList);
  const noDuplicateCoordinates = removeDuplicates(surroundingCoordinates);
  const finalWithException = removeExceptions(
    noDuplicateCoordinates,
    exceptions
  );

  return checkForConflicts(finalWithException, player);
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
  return coordinates;
}

export {
  inBounds,
  getCornerShots,
  allInBounds,
  getPosition,
  getCoordinatesFromNodeList,
  getNewHorizontalCoordinates,
  getNewVerticalCoordinates,
  getNewOrientationCoordinates,
  getSurroundingPositions,
  removeDuplicates,
  removeExceptions,
  checkForConflicts,
  checkSurroundingCoordinates,
  transformedCoordinates,
};
