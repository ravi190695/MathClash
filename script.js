let columns = 6;
let rows = 6;

let currentScore = 0;

let score = 0;

let target = 0;

let board = [];

function getId(row, column) {
  //take two numbers and return after concatenating them
  return row.toString() + column.toString();
}

function setter(element, value) {
  //
  document.getElementById(element).innerHTML = value;
}

function getElement(id) {
  return document.getElementById(id);
}
function createElement(tag) {
  return document.createElement(tag);
}

function initTarget() {
  // put a target random value between 10 and 60
  target = 10 + Math.ceil(Math.random() * 50);
  setter("target-sum", target);
}

function updateScore(score) {
  //on selecting/unselecting a cell, score will update according to that cell value
  setter("score", score);
}

function addCells() {
  // adding cells having random values between 1-9 in a row and that row will be added in board
  let arr = [];
  for (let i = 0; i < columns; ++i) {
    let t = {};
    t.value = Math.ceil(Math.random() * 9);
    t.selected = false;
    arr.push(t);
  }
  board.unshift(arr); // unshifts put  new row in front of the board
}

function updateBoard() {
  for (let i = 0; i < board.length; ++i) {
    for (let j = 0; j < board[i].length; ++j) {
      let id = getId(i, j);
      let element = getElement(id);
      //setter(id, board[i][j].value);
      element.innerHTML = board[i][j].value;

      if (board[i][j].selected === true) {
        element.classList.add("selected");
      } else if (element.classList.contains("selected")) {
        element.classList.remove("selected");
      }
    }
  }
}

function gameOver() {
  if (board.length !== rows) {
    return false;
  }

  for (let i = 0; i < columns; ++i) {
    if (board[rows - 1][i].value !== "") return true;
  }
  return false;
}

function startTimer() {
  let id = setInterval(() => {
    addCells();
    setTimeout(5000);
    updateBoard();

    if (gameOver()) {
      clearInterval(id);
      return;
    }
  }, 4000);
}

function initBoard() {
  setter("current-sum", 0);
  let b = getElement("board");
  let rowContainer = createElement("div");
  rowContainer.setAttribute("id", "row-container");

  for (let i = 0; i < rows; ++i) {
    let row = createElement("div");
    row.className = "row";

    for (let j = 0; j < columns; ++j) {
      let cell = createElement("div");
      cell.setAttribute("id", getId(i, j));
      cell.className = "cell";
      cell.addEventListener("click", () => handleCellClick(cell, i, j));
      row.appendChild(cell);
    }
    rowContainer.appendChild(row);
  }
  b.appendChild(rowContainer);
  initTarget();
  updateScore(0);
}

/* SCRIPT MAIN POINT */
initBoard();
startTimer();

function reset() {
  board = [];
  setter("current-sum", 0);
  let rowContainer = getElement("row-container");
  getElement("board").removeChild(rowContainer);
  initBoard();
  startTimer();
}

function deselectAll() {
  for (let i = 0; i < board.length; ++i) {
    for (let j = 0; j < board[i].length; ++j) {
      if (board[i][j].selected) {
        board[i][j].selected = false;
      }
    }
  }
}

function removeSelected() {
  let count = 0;
  for (let i = 0; i < board.length; ++i) {
    for (let j = 0; j < board[i].length; ++j) {
      if (board[i][j].selected) {
        count++;
        board[i][j].value = "";
        board[i][j].selected = false;
      }
    }
  }
  return count;
}

function handleCellClick(cell, i, j) {
  if (board[i][j] === "") return;
  board[i][j].selected = !board[i][j].selected;

  if (board[i][j].selected) currentScore += board[i][j].value;
  else currentScore -= board[i][j].value;

  if (currentScore > target) {
    currentScore = 0;
    deselectAll();
  } else if (currentScore === target) {
    let removed = removeSelected();
    score += removed;
    reset();
    initTarget();
    updateScore(score);
  }
  setter("current-sum", currentScore);
  updateBoard();
}
