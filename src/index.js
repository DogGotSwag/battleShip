import dropMenu from 'didieral.button-module';

import playerVsComputer from './playerVsComputer';

playerVsComputer();
dropMenu('.dropButton');


const singlePlayer = document.querySelector('.singlePlayer');
const twoPlayer = document.querySelector('.twoPlayer');

singlePlayer.addEventListener('click', () => {
    playerVsComputer();
});

twoPlayer.addEventListener('click', () => {

});