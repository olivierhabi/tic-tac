class Play {
  static EMPTY = " ";
  static HUMAN = "x";
  static COMPUTER = "o";
  static SIDE_LENGTH = 3; // board length
  static gameGrid = [[], [], []];
  static newBoard;

  static async getBoard(req, res) {
    const { board } = req.query;

    if (board == null || board.length == 0 || board.length !== 9) {
      return res.status(400).send("Bad Request");
    } else {
      //Replace x with space
      const boardInit = board.replace(/\+/g, " ");

      //   Check if game have valid input
      for (var i = 0; i < boardInit.length; i++) {
        if (
          boardInit[i] != Play.HUMAN &&
          boardInit[i] != Play.COMPUTER &&
          boardInit[i] != Play.EMPTY
        ) {
          res.status(400).send("Invalid Input");
        }
      }

      // Initialize the board
      Play.initializeGrid(boardInit);

      // Start to play
      Play.playGame();

      // Return the new played board
      for (var i = 0; i < Play.SIDE_LENGTH; i++) {
        for (var j = 0; j < Play.SIDE_LENGTH; j++) {
          Play.newBoard += Play.gameGrid[i][j];
        }
      }

      return res.status(200).send(Play.newBoard);
    }
  }

  static initializeGrid(board) {
    Play.newBoard = "";
    let boardCounter = 0;

    for (let i = 0; i < Play.SIDE_LENGTH; i++) {
      for (let j = 0; j < Play.SIDE_LENGTH; j++) {
        Play.gameGrid[i][j] = board.charAt(boardCounter);
        boardCounter++;
      }
    }
  }
  static playGame() {
    while (true) {
      // To check if there's a winner or it's a draw
      if (Play.isWinner()) {
        break;
      } else if (Play.isDraw()) {
        break;
      } else {
        for (var i = 0; i < Play.SIDE_LENGTH; i++) {
          for (var j = 0; j < Play.SIDE_LENGTH; j++) {
            if (Play.gameGrid[i][j] == Play.COMPUTER) {
              if (Play.isComputerMoved(i, j)) {
                // Break the next move to wait for input from HUMAN
                return;
              }
            }
          }
        }
        // Computer checks where to move in order to prevent HUMAN to win
        for (var i = 0; i < Play.SIDE_LENGTH; i++) {
          for (var j = 0; j < Play.SIDE_LENGTH; j++) {
            if (Play.gameGrid[i][j] == Play.EMPTY) {
              if (Play.isComputerMoved(i, j)) {
                // Break the next move to wait for input from HUMAN
                return;
              }
            }
          }
        }

        // Computer moves to a random empty position if it was unable to move for WIN or prevent HUMAN to win
        while (true) {
          const randRow = Play.randomNumber(0, 2);
          const randCol = Play.randomNumber(0, 2);
          if (Play.gameGrid[randRow][randCol] == Play.EMPTY) {
            Play.gameGrid[randRow][randCol] = Play.COMPUTER;
            return;
          }
        }
      }
    }
  }

  static isComputerMoved(row, col) {
    //Check all cases on position [0,0], [2,2], [0,2] or [2,0]
    if (
      (row == col && (row == 0 || row == 2)) ||
      (row == 0 && col == 2) ||
      (row == 2 && row == 0)
    ) {
      // Computer seeking to win
      if (Play.gameGrid[row][col] == Play.COMPUTER) {
        // Row checking
        if (
          Play.gameGrid[row][col] == Play.gameGrid[row][1] &&
          Play.gameGrid[row][2 - col] == Play.EMPTY
        ) {
          Play.gameGrid[row][2 - col] = Play.COMPUTER;
          return true;
        }
        if (
          Play.gameGrid[row][col] == Play.gameGrid[row][2 - col] &&
          Play.gameGrid[row][1] == Play.EMPTY
        ) {
          Play.gameGrid[row][1] = Play.COMPUTER;
          return true;
        }

        // Column checking
        if (
          Play.gameGrid[row][col] == Play.gameGrid[1][col] &&
          Play.gameGrid[2 - row][col] == Play.EMPTY
        ) {
          Play.gameGrid[2 - row][col] = Play.COMPUTER;
          return true;
        }
        if (
          Play.gameGrid[row][col] == Play.gameGrid[2 - row][col] &&
          Play.gameGrid[1][col] == Play.EMPTY
        ) {
          Play.gameGrid[1][col] = Play.COMPUTER;
          return true;
        }

        // Diagonal checking
        if (
          Play.gameGrid[row][col] == Play.gameGrid[1][1] &&
          Play.gameGrid[2 - row][2 - col] == Play.EMPTY
        ) {
          Play.gameGrid[2 - row][2 - col] = Play.COMPUTER;
          return true;
        }
        if (
          Play.gameGrid[row][col] == Play.gameGrid[2 - row][2 - col] &&
          Play.gameGrid[1][1] == Play.EMPTY
        ) {
          Play.gameGrid[1][1] = Play.COMPUTER;
          return true;
        }
      } else {
        // Computer prevents HUMAN to win
        if (
          Play.gameGrid[row][1] == Play.gameGrid[row][2 - col] &&
          Play.gameGrid[row][1] != Play.EMPTY
        ) {
          Play.gameGrid[row][col] = Play.COMPUTER;
          return true;
        }
        if (
          Play.gameGrid[1][col] == Play.gameGrid[2 - row][col] &&
          Play.gameGrid[1][col] != Play.EMPTY
        ) {
          Play.gameGrid[row][col] = Play.COMPUTER;
          return true;
        }
        if (
          Play.gameGrid[1][1] == Play.gameGrid[2 - row][2 - col] &&
          Play.gameGrid[1][1] != Play.EMPTY
        ) {
          Play.gameGrid[row][col] = Play.COMPUTER;
          return true;
        }
      }
    }

    //Check all cases on position [1,1]
    if (row == col && row == 1) {
      // Computer seeks to win
      if (Play.gameGrid[row][col] == Play.COMPUTER) {
        // Row checking
        if (
          Play.gameGrid[row][col] == Play.gameGrid[row][0] &&
          Play.gameGrid[row][2] == Play.EMPTY
        ) {
          Play.gameGrid[row][2] = Play.COMPUTER;
          return true;
        }
        if (
          Play.gameGrid[row][col] == Play.gameGrid[row][2] &&
          Play.gameGrid[row][0] == Play.EMPTY
        ) {
          Play.gameGrid[row][0] = Play.COMPUTER;
          return true;
        }

        // Column checking
        if (
          Play.gameGrid[row][col] == Play.gameGrid[0][col] &&
          Play.gameGrid[2][col] == Play.EMPTY
        ) {
          Play.gameGrid[2][col] = Play.COMPUTER;
          return true;
        }
        if (
          Play.gameGrid[row][col] == Play.gameGrid[2][col] &&
          Play.gameGrid[0][col] == Play.EMPTY
        ) {
          Play.gameGrid[0][col] = Play.COMPUTER;
          return true;
        }

        // Diagonal checking
        if (
          Play.gameGrid[row][col] == Play.gameGrid[0][0] &&
          Play.gameGrid[2][2] == Play.EMPTY
        ) {
          Play.gameGrid[2][2] = Play.COMPUTER;
          return true;
        }
        if (
          Play.gameGrid[row][col] == Play.gameGrid[2][2] &&
          Play.gameGrid[0][0] == Play.EMPTY
        ) {
          Play.gameGrid[0][0] = Play.COMPUTER;
          return true;
        }
        if (
          Play.gameGrid[row][col] == Play.gameGrid[0][2] &&
          Play.gameGrid[2][0] == Play.EMPTY
        ) {
          Play.gameGrid[2][0] = Play.COMPUTER;
          return true;
        }
        if (
          Play.gameGrid[row][col] == Play.gameGrid[2][0] &&
          Play.gameGrid[0][2] == Play.EMPTY
        ) {
          Play.gameGrid[0][2] = Play.COMPUTER;
          return true;
        }
      } else {
        //Computer prevents HUMAN to win
        if (
          Play.gameGrid[row][0] == Play.gameGrid[row][2] &&
          Play.gameGrid[row][0] != Play.EMPTY
        ) {
          Play.gameGrid[row][col] = Play.COMPUTER;
          return true;
        }
        if (
          Play.gameGrid[0][col] == Play.gameGrid[2][col] &&
          Play.gameGrid[0][col] != Play.EMPTY
        ) {
          Play.gameGrid[row][col] = Play.COMPUTER;
          return true;
        }
        if (
          Play.gameGrid[0][0] == Play.gameGrid[2][2] &&
          Play.gameGrid[0][0] != Play.EMPTY
        ) {
          Play.gameGrid[row][col] = Play.COMPUTER;
          return true;
        }
        if (
          Play.gameGrid[0][2] == Play.gameGrid[2][0] &&
          Play.gameGrid[0][2] != Play.EMPTY
        ) {
          Play.gameGrid[row][col] = Play.COMPUTER;
          return true;
        }
      }
    }

    //Check all cases on position [0,1], [2,1]
    if ((row == 0 && col == 1) || (row == 2 && col == 1)) {
      // Computer seeks to win
      if (Play.gameGrid[row][col] == Play.COMPUTER) {
        // Row checking
        if (
          Play.gameGrid[row][col] == Play.gameGrid[row][col - 1] &&
          Play.gameGrid[row][col + 1] == Play.EMPTY
        ) {
          Play.gameGrid[row][col + 1] = Play.COMPUTER;
          return true;
        }
        if (
          Play.gameGrid[row][col] == Play.gameGrid[row][col + 1] &&
          Play.gameGrid[row][col - 1] == Play.EMPTY
        ) {
          Play.gameGrid[row][col - 1] = Play.COMPUTER;
          return true;
        }

        // Column checking
        if (
          Play.gameGrid[row][col] == Play.gameGrid[1][1] &&
          Play.gameGrid[2 - row][col] == Play.EMPTY
        ) {
          Play.gameGrid[2 - row][col] = Play.COMPUTER;
          return true;
        }
        if (
          Play.gameGrid[row][col] == Play.gameGrid[2 - row][col] &&
          Play.gameGrid[1][1] == Play.EMPTY
        ) {
          Play.gameGrid[1][1] = Play.COMPUTER;
          return true;
        }
      } else {
        //  Computer prevents HUMAN to win
        if (
          Play.gameGrid[row][col - 1] == Play.gameGrid[row][col + 1] &&
          Play.gameGrid[row][col - 1] != Play.EMPTY
        ) {
          Play.gameGrid[row][col] = Play.COMPUTER;
          return true;
        }
        if (
          Play.gameGrid[1][1] == Play.gameGrid[2 - row][col] &&
          Play.gameGrid[1][1] != Play.EMPTY
        ) {
          Play.gameGrid[row][col] = Play.COMPUTER;
          return true;
        }
      }
    }

    // Check all cases on position [1,0], [1,2]
    if ((row == 1 && col == 0) || (row == 1 && col == 2)) {
      //Computer seeks to win
      if (Play.gameGrid[row][col] == Play.COMPUTER) {
        // Row checking
        if (
          Play.gameGrid[row][col] == Play.gameGrid[1][1] &&
          Play.gameGrid[row][2 - col] == Play.EMPTY
        ) {
          Play.gameGrid[row][2 - col] = Play.COMPUTER;
          return true;
        }
        if (
          Play.gameGrid[row][col] == Play.gameGrid[row][2 - col] &&
          Play.gameGrid[1][1] == Play.EMPTY
        ) {
          Play.gameGrid[1][1] = Play.COMPUTER;
          return true;
        }

        // Column checking
        if (
          Play.gameGrid[row][col] == Play.gameGrid[row - 1][col] &&
          Play.gameGrid[row + 1][col] == Play.EMPTY
        ) {
          Play.gameGrid[row + 1][col] = Play.COMPUTER;
          return true;
        }
        if (
          Play.gameGrid[row][col] == Play.gameGrid[row + 1][col] &&
          Play.gameGrid[row - 1][col] == Play.EMPTY
        ) {
          Play.gameGrid[row - 1][col] = Play.COMPUTER;
          return true;
        }
      } else {
        //Computer prevents HUMAN to win
        if (
          Play.gameGrid[1][1] == Play.gameGrid[row][2 - col] &&
          Play.gameGrid[1][1] != Play.EMPTY
        ) {
          Play.gameGrid[row][col] = Play.COMPUTER;
          return true;
        }
        if (
          Play.gameGrid[row - 1][col] == Play.gameGrid[row + 1][col] &&
          Play.gameGrid[row - 1][col] != Play.EMPTY
        ) {
          Play.gameGrid[row][col] = Play.COMPUTER;
          return true;
        }
      }
    }

    return false;
  }

  static isDraw() {
    for (var i = 0; i < Play.SIDE_LENGTH; i++) {
      for (var j = 0; j < Play.SIDE_LENGTH; j++) {
        if (Play.gameGrid[i][j] == Play.EMPTY) return false;
      }
    }
    return true;
  }
  static isWinner() {
    if (
      Play.gameGrid[0][0] == Play.gameGrid[1][0] &&
      Play.gameGrid[1][0] == Play.gameGrid[2][0] &&
      (Play.gameGrid[0][0] == Play.HUMAN ||
        Play.gameGrid[0][0] == Play.COMPUTER)
    )
      return true;
    else if (
      Play.gameGrid[0][1] == Play.gameGrid[1][1] &&
      Play.gameGrid[1][1] == Play.gameGrid[2][1] &&
      (Play.gameGrid[0][1] == Play.HUMAN ||
        Play.gameGrid[0][1] == Play.COMPUTER)
    )
      return true;
    else if (
      Play.gameGrid[0][2] == Play.gameGrid[1][2] &&
      Play.gameGrid[1][2] == Play.gameGrid[2][2] &&
      (Play.gameGrid[0][2] == Play.HUMAN ||
        Play.gameGrid[0][2] == Play.COMPUTER)
    )
      return true;
    else if (
      Play.gameGrid[0][0] == Play.gameGrid[0][1] &&
      Play.gameGrid[0][1] == Play.gameGrid[0][2] &&
      (Play.gameGrid[0][0] == Play.HUMAN ||
        Play.gameGrid[0][0] == Play.COMPUTER)
    )
      return true;
    else if (
      Play.gameGrid[1][0] == Play.gameGrid[1][1] &&
      Play.gameGrid[1][1] == Play.gameGrid[1][2] &&
      (Play.gameGrid[1][0] == Play.HUMAN ||
        Play.gameGrid[1][0] == Play.COMPUTER)
    )
      return true;
    else if (
      Play.gameGrid[2][0] == Play.gameGrid[2][1] &&
      Play.gameGrid[2][1] == Play.gameGrid[2][2] &&
      (Play.gameGrid[2][0] == Play.HUMAN ||
        Play.gameGrid[2][0] == Play.COMPUTER)
    )
      return true;
    else if (
      Play.gameGrid[0][0] == Play.gameGrid[1][1] &&
      Play.gameGrid[1][1] == Play.gameGrid[2][2] &&
      (Play.gameGrid[0][0] == Play.HUMAN ||
        Play.gameGrid[0][0] == Play.COMPUTER)
    )
      return true;
    else if (
      Play.gameGrid[2][0] == Play.gameGrid[1][1] &&
      Play.gameGrid[1][1] == Play.gameGrid[0][2] &&
      (Play.gameGrid[2][0] == Play.HUMAN ||
        Play.gameGrid[2][0] == Play.COMPUTER)
    )
      return true;
    else return false;
  }

  static randomNumber(min, max) {
    return Math.floor(Math.random() * max) + min;
  }
}

export default Play;
