import './domChangerStyles.css';

function renderPlayersBoards() {
    const boards = document.querySelectorAll('.player');
    
    for(let i = 0; i < 2; i += 1){
        const current = boards[i];
        for(let j = 0; j < 10; j += 1){
            const row = document.createElement('div');
            current.appendChild(row);
        }
    }
}

export { renderPlayersBoards };
