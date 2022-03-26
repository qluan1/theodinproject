const gameBoardElement = document.getElementById('game-board');
const gameMessage = document.getElementById('game-message');
const startGameButton = document.getElementById('start-game-button');

let gameBoard = (function () {
    let array = [];

    for (let i = 0; i < 9; i++) {
        let gameGrid = document.createElement('div');
        gameGrid.textContent = '';
        array.push(gameGrid);
        gameGrid.className = "game-board-grid";
        gameBoardElement.appendChild(gameGrid);
    }

    function resetBoard () {
        for (let i = 0; i < 9; i++) {
            array[i].textContent = '';
        }
    }

    function isFull () {
        return (array[0].textContent != '' && array[1].textContent != '' &&
                array[2].textContent != '' && array[3].textContent != '' &&
                array[4].textContent != '' && array[5].textContent != '' &&
                array[6].textContent != '' && array[7].textContent != '' &&
                array[8].textContent != ''
        );
    }

    return {
        array: array,
        resetBoard: resetBoard,
        isFull: isFull,
    };
})();

let game = (function (){
    let _turn;
    let _players = [null, null];
    let _stop = false;

    function _getCurrentPlayer() {
        return _players[_turn%2];
    }

    function _checkWin (mark) {
        return (gameBoard.array[0].textContent === mark && gameBoard.array[1].textContent === mark && gameBoard.array[2].textContent === mark) ||
            (gameBoard.array[3].textContent === mark && gameBoard.array[4].textContent === mark && gameBoard.array[5].textContent === mark) ||
            (gameBoard.array[6].textContent === mark && gameBoard.array[7].textContent === mark && gameBoard.array[8].textContent === mark) ||
            (gameBoard.array[0].textContent === mark && gameBoard.array[3].textContent === mark && gameBoard.array[6].textContent === mark) ||
            (gameBoard.array[1].textContent === mark && gameBoard.array[4].textContent === mark && gameBoard.array[7].textContent === mark) ||
            (gameBoard.array[2].textContent === mark && gameBoard.array[5].textContent === mark && gameBoard.array[8].textContent === mark) ||
            (gameBoard.array[0].textContent === mark && gameBoard.array[4].textContent === mark && gameBoard.array[8].textContent === mark) ||
            (gameBoard.array[2].textContent === mark && gameBoard.array[4].textContent === mark && gameBoard.array[6].textContent === mark);
    }

    function _checkDrawGame () {
        return gameBoard.isFull();
    }

    function _followUp (){
        // follow up to check if game is finished after player or ai played
        if (_checkWin(_getCurrentPlayer().mark)) {
            _finishGame();
            gameMessage.textContent = _getCurrentPlayer().name + ' won!';
            return;
        }

        if (_checkDrawGame()){
            _finishGame();
            gameMessage.textContent = 'Draw Game!';
            return;
        }

        _turn += 1;
        gameMessage.textContent = _getCurrentPlayer().name + ' turn to play.';
        _aiAction();
    }

    function _prepareBoard() {
        for (let i = 0; i < 9; i++) {
            let grid = gameBoard.array[i];
            grid.addEventListener('click', _playerAction, { once: true });
        }
    }

    function _randomPlay() {
        if (_stop) {
            return;
        }
        let available = [];
        for (let i = 0; i<9; i++) {
            if (gameBoard.array[i].textContent == '') {
                available.push(i);
            }
        }
        let randPick = available[Math.floor(Math.random() * available.length)];
        gameBoard.array[randPick].textContent = _getCurrentPlayer().mark;
        _followUp();
    }

    function _checkAiDraw(tempBoard) {
        return (tempBoard[0] != 0 && tempBoard[1] != 0 &&
            tempBoard[2] != 0 && tempBoard[3] != 0 &&
            tempBoard[4] != 0 && tempBoard[5] != 0 &&
            tempBoard[6] != 0 && tempBoard[7] != 0 && 
            tempBoard[8] != 0);
    }

    function _checkAiWin(tempBoard, n) {
        // n == 1 check win
        // n == -1 check lose
        return (
            (tempBoard[0] == n && tempBoard[1] == n && tempBoard[2] == n) ||
            (tempBoard[3] == n && tempBoard[4] == n && tempBoard[5] == n) ||
            (tempBoard[6] == n && tempBoard[7] == n && tempBoard[8] == n) ||
            (tempBoard[0] == n && tempBoard[3] == n && tempBoard[6] == n) ||
            (tempBoard[1] == n && tempBoard[4] == n && tempBoard[7] == n) ||
            (tempBoard[2] == n && tempBoard[5] == n && tempBoard[8] == n) ||
            (tempBoard[0] == n && tempBoard[4] == n && tempBoard[8] == n) ||
            (tempBoard[2] == n && tempBoard[4] == n && tempBoard[6] == n)
        );
    }

    function _compareScore(s1, s2) {
        // return negative if s1 smaller s2
        if (s1.length == 0) {
            return -1;
        }

        if (s2.length == 0) {
            return 1;
        }

        let p1 = s1.length - 1;
        let p2 = s2.length - 1;
        while (p1 > -1 && p2 > -1) {
            if ( s1[p1] < s2[p2]) {
                return -1;
            }
            if ( s1[p1] > s2[p2]) {
                return 1;
            }
            p1 -= 1;
            p2 -= 1;
        }

        if (p1 == -1) {
            return -1;
        }
        return 1;
    }

    function _combineScore(s1, s2){
        if (s1.length < s2.length) {
            let temp = s1;
            s1 = s2;
            s2 = temp;
        }
        let p1 = s1.length - 1;
        let p2 = s2.length - 1;
        while ( p2 > -1) {
            s1[p1] += s2[p2];
            p1 -= 1;
            p2 -= 1;
        }
        return s1;
    }


    function _moveScore(tempBoard) {
        if (_checkAiWin(tempBoard, 1)){
            return [];
        }
        if ( _checkAiDraw(tempBoard) ) {
            return [];
        }
        let count = 0;
        let score = [];
        let opponentMove = [];
        for (let i = 0; i < 9; i++) {
            if (tempBoard[i] == 0) {
                opponentMove.push(i);
            }
        }
        while (opponentMove.length != 0) {
            let curOppMove = opponentMove.pop();
            tempBoard[curOppMove] = -1;
            if (_checkAiWin(tempBoard, -1)) {
                tempBoard[curOppMove] = 0;
                count += 1;
                continue;
            }
            let nextMove = [];
            for (let i = 0; i < 9; i++) {
                if (tempBoard[i] == 0) {
                    nextMove.push(i);
                }
            }            
            while (nextMove.length != 0) {
                let curMove = nextMove.pop();
                tempBoard[curMove] = 1;
                score = _combineScore(score, _moveScore(tempBoard));
                tempBoard[curMove] = 0;
            }
            tempBoard[curOppMove] = 0;
        }
        score.push(count);
        return score;
    }

    function _optimalMove() {
        let tempBoard = [];
        let possibleMove = [];
        for (let i = 0; i < 9; i++) {
            let grid = gameBoard.array[i];
            switch (grid.textContent) {
                case '':
                    tempBoard.push(0);
                    possibleMove.push(i);
                    break;
                case _getCurrentPlayer().mark:
                    tempBoard.push(1);
                    break;
                default:
                    tempBoard.push(-1);
                    break;
            }
        }
        let minScore = [100000]; // 100000 is an arbitrary value simply to make sure it is greater than any meaningful score
        let optMove = null;
        while(possibleMove.length != 0){
            let curMove = possibleMove.pop()
            tempBoard[curMove] = 1;
            let curScore = _moveScore(tempBoard);
            if (_compareScore(curScore, minScore)<0) {
                minScore = curScore;
                optMove = curMove;
            } 
            tempBoard[curMove] = 0;
        }
        return optMove;
    }

    function _optimalPlay() {
        if (_stop) {
            return;
        }
        let move = _optimalMove();
        gameBoard.array[move].textContent = _getCurrentPlayer().mark;
        _followUp();
    }

    function _aiAction() {
        let curPlayer = _getCurrentPlayer();
        if (curPlayer.isHuman){
            return;
        }
        if (curPlayer.random) {
            setTimeout(_randomPlay, 500);
            return;
        }
        setTimeout(_optimalPlay, 500);
    }

    function _playerAction(e) {
        // current player takes action and game follows up
        let curPlayer = _getCurrentPlayer();
        if (e.currentTarget.textContent != '' || !curPlayer.isHuman){
            return;
        }
        e.currentTarget.textContent = curPlayer.mark;
        _followUp();
    }

    function _finishGame() {
        _stop = true;
        for (let i = 0; i < 9; i++) {
            let grid = gameBoard.array[i];
            grid.removeEventListener('click', _playerAction);
        }
        startGameButton.disabled = false;
    }

    function resetGame() {
        _finishGame();
        gameBoard.resetBoard();
        gameMessage.textContent = "Game Reset";
    }

    function startGame(p1, p2) {
        gameBoard.resetBoard();
        _finishGame();
        _prepareBoard();
        _stop = false;
        _turn = 0;
        _players = [p1, p2];
        gameMessage.textContent = _getCurrentPlayer().name + ' turn to play.';
        startGameButton.disabled = true;
        _aiAction();
    }

    return {
        startGame: startGame,
        resetGame: resetGame,
    };
})();

function createPlayer(playerName, playerIsHuman, AiIsRandom, mark) {
    return { 
        name: playerName,
        isHuman: playerIsHuman,
        random: AiIsRandom,
        mark: mark,
     };
}

function start(){
    let playerOneName = document.getElementById('player1-name').value.trim();
    let playerTwoName = document.getElementById('player2-name').value.trim();

    if (typeof(playerOneName) != 'string' || playerOneName == '') {
        gameMessage.textContent = 'Player One Name Invalid';
        return;
    }

    if (typeof(playerTwoName) != 'string' || playerTwoName == '') {
        gameMessage.textContent = 'Player Two Name Invalid';
        return;
    }

    if (playerOneName == playerTwoName) {
        gameMessage.textContent = 'Same Name';
        return;
    }


    if (document.getElementById('player1-player').checked) {
        playerOneIsHuman = true;
        playerOneIsRandom = false;
    } else if (document.getElementById('player1-ai-easy').checked) {
        playerOneIsHuman = false;
        playerOneIsRandom = true;        
    } else {
        playerOneIsHuman = false;
        playerOneIsRandom = false;    
    }
  
    if (document.getElementById('player2-player').checked) {
        playerTwoIsHuman = true;
        playerTwoIsRandom = false;
    } else if (document.getElementById('player2-ai-easy').checked) {
        playerTwoIsHuman = false;
        playerTwoIsRandom = true;        
    } else {
        playerTwoIsHuman = false;
        playerTwoIsRandom = false;    
    }

    let p1 = createPlayer(playerOneName, playerOneIsHuman, playerOneIsRandom, 'X');
    let p2 = createPlayer(playerTwoName, playerTwoIsHuman, playerTwoIsRandom, 'O');
    game.startGame(p1, p2);   
}
