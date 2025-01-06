function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function generateRandomCoordinate(){
    const newCoordinate = [];
    newCoordinate[0] = getRandomNumber(0,10);
    newCoordinate[1] = getRandomNumber(0,10);
    return newCoordinate;
}

export default () =>{
    return generateRandomCoordinate();
}