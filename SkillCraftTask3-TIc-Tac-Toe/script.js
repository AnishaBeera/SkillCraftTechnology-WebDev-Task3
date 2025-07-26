const board = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
let currentPlayer = "X";
let gameState = Array(9).fill("");
let gameActive = false;
let mode = ""; 

const winningCombos = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function setMode(selectedMode) {
  mode = selectedMode;
  resetGame();
  statusText.textContent = `Mode: ${mode === 'user' ? 'Player vs Player' : 'Player vs Computer'} | X's Turn`;
  gameActive = true;
}

function handleClick(e) {
  const index = e.target.dataset.index;

  if (!gameActive || gameState[index] !== "") return;

  gameState[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  e.target.classList.add(currentPlayer); 

  const winIndex = checkWinner();
  if (winIndex !== -1) {
    statusText.textContent = `${currentPlayer} wins!`;
    showStrike(winIndex); 
    gameActive = false;
    return;
  }

  if (gameState.every(cell => cell !== "")) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `${currentPlayer}'s Turn`;

  if (mode === 'computer' && currentPlayer === "O") {
    setTimeout(computerMove, 500);
  }
}

function computerMove() {
  let available = gameState.map((val, i) => val === "" ? i : null).filter(i => i !== null);
  let move = available[Math.floor(Math.random() * available.length)];
  gameState[move] = "O";
  const cell = document.querySelector(`.cell[data-index="${move}"]`);
  cell.textContent = "O";
  cell.classList.add("O");

  const winIndex = checkWinner();
  if (winIndex !== -1) {
    statusText.textContent = "O wins!";
    showStrike(winIndex);
    gameActive = false;
    return;
  }

  if (gameState.every(cell => cell !== "")) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = "X";
  statusText.textContent = `${currentPlayer}'s Turn`;
}

function checkWinner() {
  for (let i = 0; i < winningCombos.length; i++) {
    const [a, b, c] = winningCombos[i];
    if (gameState[a] && gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
      return i; 
    }
  }
  return -1; 
}

function showStrike(index) {
  const strike = document.createElement("div");
  strike.classList.add("strike");

  const strikeMap = {
    0: "row-0",
    1: "row-1",
    2: "row-2",
    3: "col-0",
    4: "col-1",
    5: "col-2",
    6: "diag-0",
    7: "diag-1"
  };

  if (strikeMap[index]) {
    strike.classList.add(strikeMap[index]);
  }

  const existingStrike = document.querySelector(".strike");
  if (existingStrike) existingStrike.remove();

  document.querySelector(".board").appendChild(strike);
}

function resetGame() {
  gameState = Array(9).fill("");
  currentPlayer = "X";
  gameActive = !!mode;
  statusText.textContent = mode
    ? `Mode: ${mode === 'user' ? 'Player vs Player' : 'Player vs Computer'} | X's Turn`
    : "Select a mode to start";

  board.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("X", "O");
  });

  const existingStrike = document.querySelector(".strike");
  if (existingStrike) existingStrike.remove();
}

board.forEach(cell => {
  cell.addEventListener("click", handleClick);
});
