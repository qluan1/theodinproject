const ROCKPAPERSCISSORS = ['rock', 'paper', 'scissors'];
const player = document.querySelector('#rps');
const buttonBox = document.querySelector('#button_box');
const buttonRock = document.querySelector('#rock');
const buttonPaper = document.querySelector('#paper');
const buttonScissors = document.querySelector('#scissors');
const buttonReset = document.querySelector('#rps_resetButton');
const computerDisplay = document.querySelector('#computer_display');
const playerDisplay = document.querySelector('#player_display');
const resultMessage = document.querySelector('#rps_message');
const gameScores = document.querySelector('#rps_scores');
const playerDisplayBox = document.querySelector('#player_display_box');
const computerDisplayBox = document.querySelector('#computer_display_box');

let playerScore = 0;
let computerScore = 0;

function resetGame(){
    if (!player.contains(buttonBox)) {
        player.insertBefore(buttonBox, resultMessage);
    }
    playerScore = 0;
    computerScore = 0;
    displayChoices(3, 3);
    displayRoundMessage('');
    displayScores();
    playerDisplayBox.style.backgroundColor = 'transparent';
    computerDisplayBox.style.backgroundColor = 'transparent';
}

function computerPlay (){
    return Math.floor(3 * Math.random());
}

function playerPlay (s) {
    if (s === 'rock') {
        return 0;
    } else if (s === 'paper') {
        return 1;
    } else if (s === 'scissors') {
        return 2;
    } else {
        return -1;
    }
}

function displayChoices(p1, p2) {
    switch (p1) {
        case 0:
            playerDisplay.textContent = 'ROCK';
            break;
        case 1:
            playerDisplay.textContent = 'PAPER';
            break;
        case 2:
            playerDisplay.textContent = 'SCISSORS';
            break;
        default:
            playerDisplay.textContent = '?';
    }

    switch (p2) {
        case 0:
            computerDisplay.textContent = 'ROCK';
            break;
        case 1:
            computerDisplay.textContent = 'PAPER';
            break;
        case 2:
            computerDisplay.textContent = 'SCISSORS';
            break;
        default:
            computerDisplay.textContent = '?';       
    }
}

function displayRoundMessage(m) {
    resultMessage.textContent = m;
}

function displayScores(){
    gameScores.textContent = `You ${playerScore} : ${computerScore} Computer`;
}

function checkGameState(){
    if (playerScore == 5) {
        displayRoundMessage('You Won!');
        player.removeChild(buttonBox);
    } else if (computerScore == 5){
        displayRoundMessage('Computer Won!');
        player.removeChild(buttonBox);
    }
}

function playRound (p1, p2) {
    // the value of s1 and s2 must be integers from 0, 1, and 2
    let roundMessage;
    displayChoices(p1, p2);
    if (p1 - p2 == 1 || p1 - p2 == -2) {
        roundMessage = `You Win! ${ROCKPAPERSCISSORS[p1]} beats ${ROCKPAPERSCISSORS[p2]}`;
        playerScore += 1;
        playerDisplayBox.style.backgroundColor = 'rgb(102, 255, 51)';
        computerDisplayBox.style.backgroundColor = 'rgb(255, 51, 0)';
    } else if ( p1 == p2) {
        roundMessage = 'Draw!';
        playerDisplayBox.style.backgroundColor = 'rgb(0, 153, 255)';
        computerDisplayBox.style.backgroundColor = 'rgb(0, 153, 255)';
    } else {
        roundMessage = `You Lose! ${ROCKPAPERSCISSORS[p2]} beats ${ROCKPAPERSCISSORS[p1]}`;
        computerScore += 1;
        playerDisplayBox.style.backgroundColor = 'rgb(255, 51, 0)';
        computerDisplayBox.style.backgroundColor = 'rgb(102, 255, 51)';
    }
    displayRoundMessage(roundMessage);
    displayScores();
    checkGameState();
}


buttonRock.addEventListener('click', () => playRound(playerPlay('rock'), computerPlay()));
buttonPaper.addEventListener('click', () => playRound(playerPlay('paper'), computerPlay()));
buttonScissors.addEventListener('click', () => playRound(playerPlay('scissors'), computerPlay()));
buttonReset.addEventListener('click', () => resetGame());













