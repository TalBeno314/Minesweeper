let zeroChanges = 0;
let doRoll = true;

function ai() {
    let changes = 0;
    for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
            let cell = board[i][j];
            if (!cell.isHidden) {
                if (cell.value > 0) {
                    let hiddenNeighbors = 0;
                    let flaggedNeighbors = 0;
                    for (let di = -1; di <= 1; di++) {
                        for (let dj = -1; dj <= 1; dj++) {
                            if (((i + di) >= 0 && (i + di) < w) && ((j + dj) >= 0 && (j + dj) < h)) {
                                if (board[i + di][j + dj].isHidden) {
                                    hiddenNeighbors++;
                                }
                                if (board[i + di][j + dj].isFlagged) {
                                    flaggedNeighbors++;
                                }
                            }
                        }
                    }

                    if (hiddenNeighbors == cell.value) {
                        for (let di = -1; di <= 1; di++) {
                            for (let dj = -1; dj <= 1; dj++) {
                                if (((i + di) >= 0 && (i + di) < w) && ((j + dj) >= 0 && (j + dj) < h)) {
                                    if (board[i + di][j + dj].isHidden && !board[i + di][j + dj].isFlagged) {
                                        board[i + di][j + dj].isFlagged = !board[i + di][j + dj].isFlagged;
                                        flags += (board[i + di][j + dj].isFlagged) ? (-1) : (1);
                                        if (board[i + di][j + dj].isBomb) {
                                            bombs += (board[i + di][j + dj].isFlagged) ? (-1) : (1);
                                        }
                                        $('#flags')[0].innerHTML = flags.toString();

                                    }
                                }
                            }
                        }
                    }
                    if (flaggedNeighbors == cell.value) {
                        for (let di = -1; di <= 1; di++) {
                            for (let dj = -1; dj <= 1; dj++) {
                                if (((i + di) >= 0 && (i + di) < w) && ((j + dj) >= 0 && (j + dj) < h)) {
                                    if (!board[i + di][j + dj].isFlagged && board[i + di][j + dj].isHidden) {
                                        reveal(board, i + di, j + dj);
                                        changes++;
                                    }
                                }
                            }
                        }
                    }
                    if (zeroChanges == 5 && flaggedNeighbors < cell.value && hiddenNeighbors > (cell.value - flaggedNeighbors) && flaggedNeighbors > 0) {
                        let roll = true;
                        while (roll) {
                            let di = floor(random(-1, 2));
                            let dj = floor(random(-1, 2));
                            if (((i + di) >= 0 && (i + di) < w) && ((j + dj) >= 0 && (j + dj) < h)) {
                                if (!board[i + di][j + dj].isFlagged && board[i + di][j + dj].isHidden) {
                                    reveal(board, i + di, j + dj);
                                    roll = false;
                                    zeroChanges = 0;
                                    console.log(i + di, j + dj);
                                    doRoll = false;
                                    changes++;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    if (changes == 0) {
        zeroChanges++;
        if (zeroChanges >= 10) {
            let roll = true;
            let x = floor(random(0, w));
            let y = floor(random(0, h));
            if (board[x][y].isHidden && !board[x][y].isFlagged) {
                reveal(board, x, y);
                roll = false;
            }
        }
    } else if (zeroChanges > 0) {
        zeroChanges = 0;
    }
}