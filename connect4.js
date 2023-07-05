"use strict";

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  for (let y = 0; y < HEIGHT; y++) {
    const subArr = [];
    for (let x = 0; x < WIDTH; x++) {
      subArr.push(null);

    }
    board.push(subArr);
  }

}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  const htmlBoard = document.getElementById('board');

  // this code is creating the top row of the game board
  // then adding an ID and event listener to it
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // this code is going to add cells to the top of the game board
  // then adding an ID to each cell
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", `top-${x}`);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // dynamically creates the main part of html board
  // uses HEIGHT to create table rows
  // uses WIDTH to create table cells for each row
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.id = `c-${y}-${x}`;
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return bottom empty y (null if filled) */

function findSpotForCol(x) {
  // if the first row is full, return null
  if (board[0][x]) { return null; }
  let y = 1;
  // stop if the next row is out of bounds
  // stop if the next row is not empty
  // otherwise move to next row
  while (y < HEIGHT && !board[y][x]) { y++; }
  // the value for y is either out of bounds or full, so choose prior row
  return y-1;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  const piece = document.createElement('div');
  piece.classList.add("piece");
  piece.classList.add(`p${currPlayer}`);

  const cell = document.getElementById(`c-${y}-${x}`);
  cell.append(piece);
}

/**
 * Place the current player's number in the board at specified x / y
 */

function placeInBoard(y, x) {
  board[y][x] = currPlayer;
}

/** endGame: announce game end */

function endGame(msg) {
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let targetId = evt.target.id;
  let targetIdAsArray = targetId.split("");
  let x = Number(targetIdAsArray[targetIdAsArray.length - 1]);

  // get next spot in column (if none, ignore click)
  var y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);

  // update the JS board state
  placeInBoard(y, x);

  // check for win
  if (checkForWin()) {
    console.log("win game");
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  const isTie = board.every(array => {
    return array.every(n => n !== null);
  })
  if (isTie) {
    console.log("tie game");
    return endGame("It's a tie!");
  }

  // switch players
  if (currPlayer === 1) {
    currPlayer = 2;
  } else {
    currPlayer = 1;
  }
  // currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {

  /** _win:
   * takes input array of 4 cell coordinates [ [y, x], [y, x], [y, x], [y, x] ]
   * returns true if all are legal coordinates for a cell & all cells match
   * currPlayer
   */
  function _win(cells) {

    // Check four cells to see if they're all legal & all color of current
    // player
    for (const coords of cells) {
      try {
        // check if all cells are legal and if not, return false;
        if (coords[0] >= HEIGHT || coords[1] >= WIDTH) { return false;}
        // cells are all legal, are they all color of current player?
        if (board[coords[0]][coords[1]] !== currPlayer) { return false;}
      } catch (err) {
        debugger;
        console.log(err);
      }
    }
    return true;
  }

  // using HEIGHT and WIDTH, generate "check list" of coordinates
  // for 4 cells (starting here) for each of the different
  // ways to win: horizontal, vertical, diagonalDR, diagonalDL
  // loop through the rows
  for (let y = 0; y < HEIGHT; y++) {
    // loop throught the columns (cells) in the row
    for (let x = 0; x < WIDTH; x++) {
      // generate set of four in all directions
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDL = [[y, x], [y - 1, x - 1], [y - 2, x - 2], [y - 3, x - 3]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];

      // find winner (only checking each win-possibility as needed)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
