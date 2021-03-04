let w = 30;
let h = 16;
let max = 99;
let con = true;
let time = 0;
let timerStart;
let h2, canvas, button, buttonAI, p, diff;

class Cell {
    isBomb = false;
    value = 0;
    isHidden = true;
    isFlagged = false;
    misplaced = false;
}

let generated = false;
let flags = max;
let bombs = max;

let board = new Array(w);
for (let i = 0; i < w; i++) {
    board[i] = new Array(h);
    for (let j = 0; j < h; j++) {
        board[i][j] = new Cell();
    }
}

function generateBoard(board, i, j) {
    let bombs = max;
    while (bombs > 0) {
        let x = floor(random(0, w));
        let y = floor(random(0, h));
        if ((abs(x - i) > 1 || abs(y - j) > 1) && !board[x][y].isBomb) {
            board[x][y].isBomb = true;
            bombs--;
        }
    }
    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            let count = 0;
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    if (dx != 0 || dy != 0) {
                        if (((x + dx) >= 0 && (x + dx) < w) && ((y + dy) >= 0 && (y + dy) < h)) {
                            if (board[x + dx][y + dy].isBomb) {
                                count++;
                            }
                        }
                    }
                }
            }
            board[x][y].value = count;
        }
    }
}

function reveal(board, x, y) {
    if (!board[x][y].isBomb) {
        board[x][y].isHidden = false;
    }
    if (board[x][y].value == 0 && !board[x][y].isBomb) {
        board[x][y].isHidden = false;
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx != 0 || dy != 0) {
                    if (((x + dx) >= 0 && (x + dx) < w) && ((y + dy) >= 0 && (y + dy) < h)) {
                        if (!(board[x + dx][y + dy].isBomb) && board[x + dx][y + dy].isHidden) {
                            if (board[x + dx][y + dy].value > 0) {
                                board[x + dx][y + dy].isHidden = false;
                            } else {
                                board[x + dx][y + dy].isHidden = false;
                                reveal(board, x + dx, y + dy);
                            }
                        }
                    }
                }
            }
        }
    }
    if (board[x][y].isBomb) {
        end(board);
    }
}

function end(board) {
    for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
            if (board[i][j].isFlagged && !board[i][j].isBomb) {
                board[i][j].misplaced = true;
                board[i][j].isFlagged = false;
                console.log("misplaced:", i, j);
                console.log("misplaced: ", board[i][j].misplaced);
            }
            board[i][j].isHidden = false;
            board[i][j].isFlagged = false;
        }
    }
    clearInterval(timerStart);
    time = 0;
}

function reset() {
    board = new Array(w);
    for (let i = 0; i < w; i++) {
        board[i] = new Array(h);
        for (let j = 0; j < h; j++) {
            board[i][j] = new Cell();
        }
    }
    flags = max;
    bombs = max;
    generated = false;
    $('#flags')[0].innerHTML = flags.toString();
    con = true;
    zeroChanges = 0;
    clearInterval(timerStart);
    time = 0;
    $("#timer")[0].innerHTML = time.toString();
}

function gameOver() {
    let notHidden = 0;
    let hidden = 0;
    for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
            /*if (!board[i][j].isHidden && board[i][j].isBomb) {
                notHidden++;
                console.log("not hidden");
            }*/
            if (!board[i][j].isHidden) {
                hidden++;
            }
        }
    }

    if (hidden == (w * h - max)) {
        clearInterval(timerStart);
        time = 0;
        revealAll();
        return true;
    }

    return false;
}

function revealAll() {
    for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
            if (board[i][j].isHidden && !board[i][j].isFlagged && !board[i][j].isBomb) {
                board[i][j].isHidden = false;
            }
            if (board[i][j].isBomb) {
                board[i][j].isFlagged = true;
            }
        }
    }
}

function startTimer() {
    time = 0;
    timerStart = setInterval(() => {
        time++;
        $("#timer")[0].innerHTML = time.toString();
    }, 1000);
}