function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

export default (availableCoordinates) =>{
  const index = getRandomNumber(0,availableCoordinates.length);
  return availableCoordinates[index];
}
