function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const availableShots = [
  [0, 0],
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [0, 6],
  [0, 7],
  [0, 8],
  [0, 9],
  [1, 0],
  [1, 1],
  [1, 2],
  [1, 3],
  [1, 4],
  [1, 5],
  [1, 6],
  [1, 7],
  [1, 8],
  [1, 9],
  [2, 0],
  [2, 1],
  [2, 2],
  [2, 3],
  [2, 4],
  [2, 5],
  [2, 6],
  [2, 7],
  [2, 8],
  [2, 9],
  [3, 0],
  [3, 1],
  [3, 2],
  [3, 3],
  [3, 4],
  [3, 5],
  [3, 6],
  [3, 7],
  [3, 8],
  [3, 9],
  [4, 0],
  [4, 1],
  [4, 2],
  [4, 3],
  [4, 4],
  [4, 5],
  [4, 6],
  [4, 7],
  [4, 8],
  [4, 9],
  [5, 0],
  [5, 1],
  [5, 2],
  [5, 3],
  [5, 4],
  [5, 5],
  [5, 6],
  [5, 7],
  [5, 8],
  [5, 9],
  [6, 0],
  [6, 1],
  [6, 2],
  [6, 3],
  [6, 4],
  [6, 5],
  [6, 6],
  [6, 7],
  [6, 8],
  [6, 9],
  [7, 0],
  [7, 1],
  [7, 2],
  [7, 3],
  [7, 4],
  [7, 5],
  [7, 6],
  [7, 7],
  [7, 8],
  [7, 9],
  [8, 0],
  [8, 1],
  [8, 2],
  [8, 3],
  [8, 4],
  [8, 5],
  [8, 6],
  [8, 7],
  [8, 8],
  [8, 9],
  [9, 0],
  [9, 1],
  [9, 2],
  [9, 3],
  [9, 4],
  [9, 5],
  [9, 6],
  [9, 7],
  [9, 8],
  [9, 9],
];

function removeCoordinate(coordinate) {
  for (let i = 0; i < availableShots.length; i += 1) {
    const curr = availableShots[i];
    if (JSON.stringify(curr) === JSON.stringify(coordinate)) {
      availableShots.splice(i, 1);
      break;
    }
  }
}

function isAvailable(coordinate) {
  for (let i = 0; i < availableShots.length; i += 1) {
    const curr = availableShots[i];
    if (JSON.stringify(curr) === JSON.stringify(coordinate)) {
      return true;
    }
  }
  return false;
}

function getNextCoordinatesVertical(coordinate, dir, amount) {
  const direction = dir === 'down' ? 1 : -1;
  const array = [];
  for (let i = 1; i < amount; i += 1) {
    const [...value] = [coordinate[0] + i * direction, coordinate[1]];
    if (isAvailable(value) === false) return false;
    array.push(value);
  }
  return array;
}

function getNextCoordinatesHorizontal(coordinate, dir, amount) {
  const direction = dir === 'right' ? 1 : -1;
  const array = [];
  for (let i = 1; i < amount; i += 1) {
    const [...value] = [coordinate[0], coordinate[1] + i * direction];
    if (isAvailable(value) === false) return false;
    array.push(value);
  }
  return array;
}

function getSurroundingCoordinates(coordinate) {
  const indexZero = coordinate[0];
  const indexOne = coordinate[1];
  const topLeft = [indexZero - 1, indexOne - 1];
  const top = [indexZero - 1, indexOne];
  const topRight = [indexZero - 1, indexOne + 1];
  const left = [indexZero, indexOne - 1];
  const right = [indexZero, indexOne + 1];
  const bottomLeft = [indexZero + 1, indexOne - 1];
  const bottom = [indexZero + 1, indexOne];
  const bottomRight = [indexZero + 1, indexOne + 1];
  return [topLeft, top, topRight, left, right, bottomLeft, bottom, bottomRight];
}

function removeSurroundingCoordinates(coordinate) {
  const surroundingCoordinates = getSurroundingCoordinates(coordinate);
  for (let i = 0; i < surroundingCoordinates.length; i += 1) {
    removeCoordinate(surroundingCoordinates[i]);
  }
}

function generate(length) {
  const index = getRandomNumber(0, availableShots.length);
  const coordinate = availableShots[index];

  const downCoordinates = getNextCoordinatesVertical(
    coordinate,
    'down',
    length
  );
  const upCoordinates = getNextCoordinatesVertical(coordinate, 'up', length);
  const rightCoordinates = getNextCoordinatesHorizontal(
    coordinate,
    'right',
    length
  );
  const leftCoordinates = getNextCoordinatesHorizontal(
    coordinate,
    'left',
    length
  );

  const coordinateOptions = [];
  if (downCoordinates !== false) coordinateOptions.push(downCoordinates);
  if (upCoordinates !== false) coordinateOptions.push(upCoordinates);
  if (rightCoordinates !== false) coordinateOptions.push(rightCoordinates);
  if (leftCoordinates !== false) coordinateOptions.push(leftCoordinates);

  if (coordinateOptions.length === 0) return generate(length);

  const finalCoordinates = [
    coordinate,
    ...coordinateOptions[getRandomNumber(0, coordinateOptions.length)],
  ];
  for (let i = 0; i < finalCoordinates.length; i += 1) {
    removeCoordinate(finalCoordinates[i]);
    removeSurroundingCoordinates(finalCoordinates[i]);
  }
  return finalCoordinates;
}

function generateAllCoordinates() {
  return [
    generate(4),
    generate(3),
    generate(3),
    generate(2),
    generate(2),
    generate(2),
    generate(1),
    generate(1),
    generate(1),
    generate(1),
  ];
}

export default generateAllCoordinates;
