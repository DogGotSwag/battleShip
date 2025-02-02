import { renderPlayersBoards } from './domChanger';
import GenerateRandomCoordinates from './generateRandomCoordinates';
import './dragAndDrop.css';


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
  const obj = new GenerateRandomCoordinates();
  const randomCoordinates = obj.generateAllCoordinates();
  setDragAndDropShips(player, randomCoordinates);
}

export default dragAndDropInterface;
