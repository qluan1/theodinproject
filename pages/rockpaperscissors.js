const ROCKPAPERSCISSORS = ["rock", "paper", "scissors"];

function computerPlay (){
    return Math.floor(3 * Math.random());    
}

function playRound (p1, p2) {
    // the value of s1 and s2 must be integers from 0, 1, and 2
    let win;
    let res;
    if (p1 - p2 == 1 || p1 - p2 == -2) {
        res = `You Win! ${ROCKPAPERSCISSORS[p1]} beats ${ROCKPAPERSCISSORS[p2]}`;
        win = 1;
    } else if ( p1 == p2) {
        res = "Draw!";
        win = 0;
    } else {
        res = `You Lose! ${ROCKPAPERSCISSORS[p2]} beats ${ROCKPAPERSCISSORS[p1]}`;
        win = -1;
    }
    return win, res;
}

function parseSelection (s) {
    let playerSelection = s.toLowerCase();
    if (playerSelection === "rock") {
        return 0;
    } else if (playerSelection === "paper") {
        return 1;
    } else if (playerSelection === "scissors") {
        return 2;
    } else {
        return -1;
    }
}

function game() {
    let win, winlog, playerSelection;
    let score = 0;
    for (let i = 0; i < 5; i++) {
        while ( true ){
            playerSelection = parseSelection(prompt("Please enter your selection from rock, paper, and scissors", "rock"));
            if (playerSelection != -1) {
                break;
            }          
        }
        win, winlog = playRound(playerSelection, computerPlay());
        score += win;
        console.log(winlog);
    }
    if (score > 0) {
        alert("You won!");
    } else if (score == 0) {
        alert("Draw!");
    } else {
        alert("You lost!");
    }
    return;
}

game();

