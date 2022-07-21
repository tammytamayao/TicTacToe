let tiles = document.querySelectorAll(".tile");
const player_x = "X";
const player_o = "O";
let turn = player_x;

let boardState = Array(tiles.length);
boardState.fill(null);


const strike = document.getElementById("strike");
const gameOverArea = document.getElementById("game-over-area");
const gameOverText = document.getElementById("game-over-text");
const playAgain = document.getElementById("play-again");
const boardHistory = document.querySelector(".board-history");

playAgain.addEventListener("click", startNewGame);
tiles.forEach((tile) => tile.addEventListener("click", tileClick));

function hoverText() {
  //remove all hover text
  tiles.forEach((tile) => {
    tile.classList.remove("x-hover");
    tile.classList.remove("o-hover");
  });

  const hoverClass = `${turn.toLowerCase()}-hover`;

  tiles.forEach((tile) => {
    if (tile.innerText == "") {
      tile.classList.add(hoverClass);
    }
  });
}

hoverText();

function tileClick(event) {
  if (gameOverArea.classList.contains("visible")) {
    return;
  }

  const tile = event.target;
  const tileNumber = tile.dataset.index;
  if (tile.innerText != "") {
    return;
  }

  if (turn === player_x) {
    tile.innerText = player_x;
    boardState[tileNumber] = player_x;
    document.querySelector(".player-turn").innerText = "Player O";
    turn = player_o;
  } else {
    tile.innerText = player_o;
    boardState[tileNumber] = player_o;
    document.querySelector(".player-turn").innerText = "Player X";
    turn = player_x;
  }


  addHistory();
  hoverText();
  checkWinner();
}

//Board state save
function addHistory() {
  const boardHistory = JSON.parse(JSON.stringify(boardState)); //Had to use this for pushing an array on an array; This is example of deep clone
  boardHistorySolid.push(boardHistory);
  console.log(boardHistorySolid);
}

let boardHistorySolid = [];

//Boardstate backtracking
function record() {
  for (i = 0; i <= boardHistorySolid.length; i++) {
    const addBoardStateNumbers = document.createElement("button");
    addBoardStateNumbers.classList.add("board-state-numbers");
    addBoardStateNumbers.innerHTML = i + 1;
    boardHistory.appendChild(addBoardStateNumbers);
  }
}

const buttonLeft = document.querySelector(".left");
const buttonRight = document.querySelector(".right");

buttonLeft.addEventListener('click', toLeft);
buttonRight.addEventListener('click', toRight);

function toLeft() {
  const currentView = boardHistorySolid[boardHistorySolid.length-2];
  console.log(currentView);

  for (i = 0; i <= currentView.length; i++) {
    tiles[i].innerHTML = currentView[i] || "";
  }
  console.log(boardState);
}

function toRight() {
  console.log(tiles[0]);
}



function checkWinner() {
  //Check for a winner
  for (const winningCombination of winningCombinations) {
    const { combo, strikeClass } = winningCombination;
    const tileValue1 = boardState[combo[0]];
    const tileValue2 = boardState[combo[1]];
    const tileValue3 = boardState[combo[2]];

    if (
      tileValue1 != null &&
      tileValue1 === tileValue2 &&
      tileValue1 === tileValue3
    ) {
      strike.classList.add(strikeClass);
      gameOverScreen(tileValue1);
      return;
    }
  }

  //Check for a draw
  const allTileFilledIn = boardState.every((tile) => tile !== null);
  if (allTileFilledIn) {
    gameOverScreen(null);
  }
}

function gameOverScreen(winnerText) {
  let text = "Draw!";
  if (winnerText != null) {
    text = `Winner is ${winnerText}!`;
  }
  gameOverArea.className = "visible";
  gameOverText.innerText = text;
  record();
}

function startNewGame() {
  strike.className = "strike";
  gameOverArea.className = "hidden";
  boardState.fill(null);
  tiles.forEach((tile) => (tile.innerText = ""));
  turn = player_x;
  boardHistorySolid = [];
  hoverText();
  removeNumbers();
}

function removeNumbers() {
  while (boardHistory.hasChildNodes()) {
    boardHistory.removeChild(boardHistory.firstChild);
  }
}

const winningCombinations = [
  //rows
  { combo: [0, 1, 2], strikeClass: "strike-row-1" },
  { combo: [3, 4, 5], strikeClass: "strike-row-2" },
  { combo: [6, 7, 8], strikeClass: "strike-row-3" },
  //columns
  { combo: [0, 3, 6], strikeClass: "strike-column-1" },
  { combo: [1, 4, 7], strikeClass: "strike-column-2" },
  { combo: [2, 5, 8], strikeClass: "strike-column-3" },
  //diagonals
  { combo: [0, 4, 8], strikeClass: "strike-diagonal-1" },
  { combo: [2, 4, 6], strikeClass: "strike-diagonal-2" },
];

