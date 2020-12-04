class Cell {
    constructor(value, hidden, flagged) {
        this.value = value;
        this.hidden = hidden;
        this.flagged = flagged;
    }
}

let diff;

let h = 16;
let w = 30;
let flags = 99;
let bombs = flags;
let resetFlag = flags;
let cell;
let can;

let board = new Array(w);
for (let i = 0; i < w; i++) {
    board[i] = new Array(h);
    for (let j = 0; j < h; j++) {
        board[i][j] = new Cell("", true, false);
    }
}

console.log(board);

function setup() {
    if (windowWidth >= windowHeight) {
        cell = windowHeight / 25;
    } else {
        cell = windowWidth / 30;
    }

    let title = createElement('h1', "Minesweeper");
    title.style("margin-top: 0%; color: white; text-align: center; font-family: Arial, Helvetica, sans-serif; fon-size: " + cell * 2 + ";");

    can = createCanvas(w * cell, h * cell);
    can.position(windowWidth / 2 - w * cell / 2, cell * 3);

    let el = createElement('h1', flags + ' bombs left').id('status');
    el.style("text-align: center; color: white; font-size: " + cell * 0.8 + ";");
    el.size(cell * 8);
    el.position((windowWidth - 30 * cell) / 2 + cell * 5, cell * 0.7);

    let play = createButton('Reset')
    play.style('font-size: ' + cell * 0.8 + 'px; color: white; border-color: white; background-color: black; border-width: 5px');
    play.size(cell * 3);
    play.position(windowWidth / 2 - cell * 1.5, cell * 1.5);
    play.mousePressed(reset);

    diff = createSelect();
    diff.option('expert');
    diff.option('intermidiate');
    diff.option('begginer');
    diff.position((windowWidth) / 2 + cell * 3, cell * 1.5);
    diff.style('font-size: ' + cell * 0.8 + 'px; color: white; border-color: white; background-color: black; border-width: 5px');
    diff.changed(difficulty);
}

function draw() {
    background(0);
    stroke(255);
    strokeWeight(1);
    fill(255);
    textSize(0.8 * cell);

    for (let i = 0; i <= w; i++) {
        line(i * cell, 0, i * cell, h * cell);
    }

    for (let i = 0; i <= h; i++) {
        line(0, i * cell, w * cell, i * cell);
    }

    for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
            if (!board[i][j].hidden) {
                if (board[i][j].value == "B") {
                    fill(255);
                    text(board[i][j].value, i * cell + cell / 4, j * cell + cell * 3 / 4);
                } else if (board[i][j].value > 0) {
                    fill(255);
                    text(board[i][j].value, i * cell + cell / 4, j * cell + cell * 3 / 4);
                }
            } else {
                fill(100);
                square(i * cell, j * cell, cell);
                if (board[i][j].flagged) {
                    fill(255);
                    text("F", i * cell + cell / 4, j * cell + cell * 3 / 4);
                }
            }
        }
    }
}

let click = false;

function mouseClicked() {
    let i = floor(mouseX / cell);
    let j = floor(mouseY / cell);

    if (i >= 0 && j >= 0 && i < w && j < h) {
        if (!click) {
            bomb(board, i, j);
            addNumbers(board);
            reveal(board, i, j);
            click = true;
        } else {
            if (board[i][j].hidden) {
                if (!board[i][j].flagged) {
                    if (board[i][j].value == "B") {
                        document.getElementById('status').innerHTML = "GAME OVER";
                        for (let i = 0; i < w; i++) {
                            for (let j = 0; j < h; j++) {
                                if (board[i][j].value == "B") {
                                    board[i][j].hidden = false;
                                }
                            }
                        }
                    }
                    reveal(board, i, j);
                }
            }
        }
    }
}

function keyPressed() {
    if (keyCode === 70) {
        let i = floor(mouseX / cell);
        let j = floor(mouseY / cell);

        if (board[i][j].hidden) {
            if (board[i][j].value == "B") {
                (board[i][j].flagged) ? (bombs++) : (bombs--);
            }
            board[i][j].flagged = !board[i][j].flagged;

            (board[i][j].flagged) ? (flags--) : (flags++);
            document.getElementById('status').innerHTML = flags + " bombs left";

            if (bombs == 0) {
                document.getElementById('status').innerHTML = "WIN!";
                for (let i = 0; i < w; i++) {
                    for (let j = 0; j < h; j++) {
                        board[i][j].hidden = false;
                    }
                }
            }
        }
    }
}

function bomb(board, x, y) {
    let bombCount = 0;
    for (let i = 0; i < bombs; i++) {
        if (true) {
            let bombx = Math.floor(Math.random() * w);
            let bomby = Math.floor(Math.random() * h);

            while (board[bombx][bomby].value == "B") {
                bombx = Math.floor(Math.random() * w);
                bomby = Math.floor(Math.random() * h);
            }

            while (Math.abs(bombx - x) < 2 && Math.abs(bomby - y) < 2) {
                bombx = Math.floor(Math.random() * w);
                bomby = Math.floor(Math.random() * h);
            }

            board[bombx][bomby].value = "B";

            if (board[bombx][bomby].value == "B") {
                bombCount++;
            }
        }
    }
}

function addNumbers(board) {
    for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
            let bombCount = 0;
            if (board[i][j].value == "") {
                for (let l = -1; l <= 1; l++) {
                    for (let k = -1; k <= 1; k++) {
                        if (!((i + l <= -1) || (i + l >= w) || (j + k <= -1) || (j + k >= h))) {
                            if (board[i + l][j + k].value == "B") {
                                bombCount++;
                            }
                        }
                    }
                }

                board[i][j].value = bombCount;
            }
        }
    }
}

function reveal(board, x, y) {
    if (board[x][y].value == 0) {
        board[x][y].hidden = false;

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (!((x + i == -1) || (x + i == w) || (y + j == -1) || (y + j == h))) {
                    if (!(i == 0 && j == 0)) {
                        if (board[x + i][y + j].hidden) {
                            if (board[x + i][y + j].value > 0) {
                                board[x + i][y + j].hidden = false;
                            } else if (board[x + i][y + j].value == 0) {
                                board[x + i][y + j].hidden = false;
                                reveal(board, x + i, y + j);
                            }
                        }
                    }
                }
            }
        }
    } else if (board[x][y].value > 0) {
        board[x][y].hidden = false;
    }
}

function reset() {
    board = new Array(w);
    for (let i = 0; i < w; i++) {
        board[i] = new Array(h);
        for (let j = 0; j < h; j++) {
            board[i][j] = new Cell("", true, false);
        }
    }

    click = false;
    flags = resetFlag;
    bombs = resetFlag;
    document.getElementById('status').innerHTML = flags + " bombs left";
}

function difficulty() {
    switch (diff.value()) {
        case 'begginer':
            h = 9;
            w = 9;
            bombs = 10;
            break;
        case 'intermidiate':
            h = 16;
            w = 16;
            bombs = 40;
            break;
        case 'expert':
            h = 16;
            w = 30;
            bombs = 99
            break;
    }

    flags = bombs;
    resetFlag = flags;
    click = false;
    can.position(windowWidth / 2 - w * cell / 2, cell * 3);
    reset();
}