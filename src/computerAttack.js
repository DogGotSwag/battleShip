import { getAdjacentShots } from './coordinates';

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function adjacentAttack(coordinate, availableCoordinates){
  const adjacentCoordinates = getAdjacentShots(coordinate);
  const available = [];

  for(let i = 0; i < adjacentCoordinates.length; i +=1){
    const currAdjCoordinates = adjacentCoordinates[i];
    let allowIn = false;
    for(let j = 0; j < availableCoordinates.length; j+=1){
      const currAvailableCoordinates = availableCoordinates[j];
      if( JSON.stringify(currAdjCoordinates) === JSON.stringify(currAvailableCoordinates)){
        allowIn = true;
      }
    }
    if(allowIn) available.push(currAdjCoordinates);
  }
  
  return available;
}

export default (availableCoordinates) =>{
  const index = getRandomNumber(0,availableCoordinates.length);
  return availableCoordinates[index];
}

export {adjacentAttack};
