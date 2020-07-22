const readlineSync = require("readline-sync");

let x;
let y;
let x1;
let y1;

let N;
let greenCount = 0;

const generationZeroGrid = [];

// x and y
[x, y] = readlineSync
  .question()
  .split(",")
  .map((el) => Number(el.trim()));

for (let row = 0; row < y; row++) {
  const cellRow = readlineSync.question("", {
    limit: (cells) => cells.length === x,
    limitMessage: `The cell row must be ${x} character(s) long`,
  });

  generationZeroGrid.push(cellRow.split("").map((el) => Number(el)));
}

// x1, y1, and N
[x1, y1, N] = readlineSync
  .question()
  .split(",")
  .map((el) => Number(el.trim()));

// finds a cell in a grid and returns an object containing its row (y), its col (x), and its value
// if the cell is non-existent a value of null is set on all three properties
function getCell(grid, y, x) {
  let cellValue;

  try {
    if (grid[y][x] !== undefined) {
      cellValue = grid[y][x];
    }
  } catch (e) {
    y = null;
    x = null;
    cellValue = null;
  }

  return {
    row: y,
    col: x,
    value: cellValue,
  };
}

// finds the surrounding cells for a given cell in a grid
// and counts all the green and red surrounding cells
// then returns an object containing the surrounding cells and the green and red counts
function getSurroundingCells(grid, y, x) {
  const surroundingCells = {
    top: getCell(grid, y - 1, x).value,
    topLeft: getCell(grid, y - 1, x - 1).value,
    topRight: getCell(grid, y - 1, x + 1).value,
    bottom: getCell(grid, y + 1, x).value,
    bottomLeft: getCell(grid, y + 1, x - 1).value,
    bottomRight: getCell(grid, y + 1, x + 1).value,
    left: getCell(grid, y, x - 1).value,
    right: getCell(grid, y, x + 1).value,
    greenCount: 0,
    redCount: 0,
  };

  for (let surroundingCell in surroundingCells) {
    if (surroundingCells[surroundingCell] === 0) {
      surroundingCells.greenCount += 1;
    } else if (surroundingCells[surroundingCell] === 1) {
      surroundingCells.redCount += 1;
    }
  }

  return surroundingCells;
}

// Calculates the result - how many generations from Generation Zero until
// Generation N the given cell was green.
function setGreenCellCount() {
  for (let turn = 0; turn < N; turn++) {
    for (let row = 0; row < y; row++) {
      for (let col = 0; col < x; col++) {
        const red = 0;
        const green = 1;
        const cell = getCell(generationZeroGrid, row, col);
        const cellSurroundings = getSurroundingCells(
          generationZeroGrid,
          row,
          col
        );

        if (cell.value === red) {
          if (
            cellSurroundings.greenCount === 3 ||
            cellSurroundings.greenCount === 6
          ) {
            generationZeroGrid[row][col] = green;

            if (cell.row === row && cell.col === col) {
              greenCount += 1;
            }
          }
        } else if (cell.value === green) {
          if (
            cellSurroundings.greenCount === 0 ||
            cellSurroundings.greenCount === 1 ||
            cellSurroundings.greenCount === 4 ||
            cellSurroundings.greenCount === 5 ||
            cellSurroundings.greenCount === 7 ||
            cellSurroundings.greenCount === 8
          ) {
            generationZeroGrid[row][col] = red;
          }
        }
      }
    }
  }
}

setGreenCellCount();
console.log("Result:", greenCount);
