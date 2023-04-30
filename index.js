let gameTurn = 0;
let currentPlayer;
let currentPlayerXO;
let board;
let isPlayerXHuman;
let isPlayerYHuman;

let gameEndHideEl = function () {
  setHTMLvisibilityForInputGameMode(false);
  setHTMLvisibilityForInputHumanCoordinates(false);
  setHTMLvisibilityForInputAiCoordinatesInput(false);
  setHTMLvisibilityForButtonLabeledReset(true);
};

function setGameMode(selectedValue) {
  switch (selectedValue) {
    case "human-human":
      isPlayerXHuman = true;
      isPlayerYHuman = true;
      break;
    case "human-ai":
      isPlayerXHuman = true;
      isPlayerYHuman = false;
      break;
  }
  resetBoard();
  setHTMLvisibilityForInputGameMode(false);
  setHTMLvisibilityForInputHumanCoordinates(true);
  setHTMLvisibilityForInputAiCoordinatesInput(false);
  setHTMLvisibilityForButtonLabeledReset(true);
  displayMessage("Player X's turn");
}

function isInputValid(string) {
  const validInt = parseInt(string.substring(1)) < 4 ? true : false;
  let validStr = false;
  if (
    string.substring(0, 1) === "A" ||
    string.substring(0, 1) === "B" ||
    string.substring(0, 1) === "C"
  ) {
    validStr = true;
  }
  return validInt && validStr;
}
function processHumanCoordinate(input) {
  if (gameTurn % 2 === 0) {
    currentPlayer = "diamond";
    currentPlayerXO = "X";
    displayMessage("Player O's turn");
    if (!isPlayerYHuman && isInputValid(input)) {
      setHTMLvisibilityForInputHumanCoordinates(false);
      setHTMLvisibilityForInputAiCoordinatesInput(true);
    }
  } else {
    currentPlayer = "pets";
    currentPlayerXO = "O";
    displayMessage("Player X's turn");
    if (!isPlayerYHuman) {
      setHTMLvisibilityForInputHumanCoordinates(false);
      setHTMLvisibilityForInputAiCoordinatesInput(true);
    }
  }

  let coordinates = extractCoordinates(input);
  if (!board[coordinates.x][coordinates.y]) {
    board[coordinates.x][coordinates.y] = currentPlayer;
    gameTurn++;
  } else {
    displayMessage("Position is already taken on board");
    setHTMLvisibilityForInputHumanCoordinates(true);
    setHTMLvisibilityForInputAiCoordinatesInput(false);
  }

  const winningPlayer = getWinningPlayer(board);
  if (winningPlayer) {
    displayMessage(`Player ${currentPlayerXO} has won !`);
  }
  if (gameTurn === 9 && !winningPlayer) {
    displayMessage("It's a tie!");
    gameEndHideEl();
  }
  displayBoard(board);
}

function calcAiIndex(arr) {
  let count = 0;
  let oneEmptyStr = false;
  let index;
  count = arr.reduce((acc, curr) => (curr === "pets" ? acc + 1 : acc), 0);
  oneEmptyStr = arr.some((element) => element === "");
  index = arr.indexOf("");
  if (count === 2 && oneEmptyStr) {
    return index;
  }
  return undefined;
}

function getUnbeatableAiCoordinates(map) {
  let mainDiagonal = [];
  let secondaryDiagonal = [];

  for (let i = 0; i < map.length; i++) {
    if (calcAiIndex(map[i]) !== undefined) {
      return { x: i, y: calcAiIndex(map[i]) };
    }
  }
  for (let i = 0; i < map.length; i++) {
    const column = map.map((row) => row[i]);
    if (calcAiIndex(column) !== undefined) {
      return { x: calcAiIndex(column), y: i };
    }
  }

  for (let i = 0; i < map.length; i++) {
    mainDiagonal.push(map[i][i]);
    secondaryDiagonal.push(map[i][map.length - 1 - i]);
  }
  console.log("main Diag", mainDiagonal);
  console.log("sec Diag", secondaryDiagonal);
  console.log("main index", calcAiIndex(mainDiagonal));
  console.log("second index", calcAiIndex(secondaryDiagonal));
  if (calcAiIndex(mainDiagonal) !== undefined) {
    console.log("Main Diagonal");
    return { x: calcAiIndex(mainDiagonal), y: calcAiIndex(mainDiagonal) };
  }
  if (calcAiIndex(secondaryDiagonal) !== undefined) {
    console.log("Secondary Diagonal");
    return {
      x: calcAiIndex(secondaryDiagonal),
      y: board.length - 1 - calcAiIndex(secondaryDiagonal),
    };
  }
  return undefined;
}

function processAICoordinate() {
  if (gameTurn % 2 === 0) {
    currentPlayer = "diamond";
    currentPlayerXO = "X";
    displayMessage("Player O's turn");
    setHTMLvisibilityForInputHumanCoordinates(false);
    setHTMLvisibilityForInputAiCoordinatesInput(true);
  } else {
    currentPlayer = "pets";
    currentPlayerXO = "O";
    displayMessage("Player X's turn");
    setHTMLvisibilityForInputHumanCoordinates(true);
    setHTMLvisibilityForInputAiCoordinatesInput(false);
  }
  if (getUnbeatableAiCoordinates(board)) {
    let x = getUnbeatableAiCoordinates(board).x;
    let y = getUnbeatableAiCoordinates(board).y;
    board[x][y] = currentPlayer;
  } else {
    let emptyBoard = [];
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (!board[i][j]) {
          let empty = {
            x: i,
            y: j,
          };
          emptyBoard.push(empty);
        }
      }
    }
    let random = Math.floor(Math.random() * emptyBoard.length);
    board[emptyBoard[random].x][emptyBoard[random].y] = currentPlayer;
    console.log("random");
  }

  gameTurn++;
  displayBoard(board);
  const winningPlayer = getWinningPlayer(board);
  if (winningPlayer) {
    displayMessage(`Player ${currentPlayerXO} has won !`);
  }
  if (gameTurn === 9 && !winningPlayer) {
    displayMessage("It's a tie!");
    gameEndHideEl();
  }
}

function resetGame() {
  // resetBoard();
  // displayBoard(board);
  // gameTurn = 0;
  // setHTMLvisibilityForInputGameMode(true);
  // setHTMLvisibilityForInputHumanCoordinates(false);
  // setHTMLvisibilityForInputAiCoordinatesInput(false);
  // setHTMLvisibilityForButtonLabeledReset(false);
  // displayMessage("Player X's turn");
  location.reload();
}
function extractCoordinates(input) {
  switch (input) {
    case "A1":
      return { x: 0, y: 0 };
      break;
    case "A2":
      return { x: 0, y: 1 };
      break;
    case "A3":
      return { x: 0, y: 2 };
      break;
    case "B1":
      return { x: 1, y: 0 };
      break;
    case "B2":
      return { x: 1, y: 1 };
      break;
    case "B3":
      return { x: 1, y: 2 };
      break;
    case "C1":
      return { x: 2, y: 0 };
      break;
    case "C2":
      return { x: 2, y: 1 };
      break;
    case "C3":
      return { x: 2, y: 2 };
      break;
    default:
      displayMessage("Invalid coordinate entered");
  }
}

function getWinningPlayer(board) {
  //Checks if there is a horizontal line
  for (let i = 0; i < board.length; i++) {
    if (board[i].every((element) => element === "diamond")) {
      gameEndHideEl();
      return "X";
    }
    if (board[i].every((element) => element === "pets")) {
      gameEndHideEl();
      return "O";
    }
  }

  //Checks if there is a vertical line
  for (let i = 0; i < board.length; i++) {
    const column = board.map((row) => row[i]);
    if (column.every((element) => element === "diamond")) {
      gameEndHideEl();
      return "X";
    }
    if (column.every((element) => element === "pets")) {
      gameEndHideEl();
      return "O";
    }
  }

  //Checks if there is a diagonal line
  let mainDiagonal = [];
  let secondaryDiagonal = [];
  for (let i = 0; i < board.length; i++) {
    mainDiagonal.push(board[i][i]);
    secondaryDiagonal.push(board[i][board.length - 1 - i]);
  }
  if (
    mainDiagonal.every((element) => element === "diamond") ||
    secondaryDiagonal.every((element) => element === "diamond")
  ) {
    return "X";
  }
  if (
    mainDiagonal.every((element) => element === "pets") ||
    secondaryDiagonal.every((element) => element === "pets")
  ) {
    return "O";
  }

  return undefined;
}
