let h = 16;
let w = 30;
let flags = 99;
let bombs = flags;
let bombP;

let cell;

let board = new Array(w);
for (let i = 0; i < w; i++) {
    board[i] = new Array(h);
    for (let j = 0; j < h; j++) {
        board[i][j] = ["", true, false];
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
    let can = createCanvas(w * cell, h * cell);
    can.position((windowWidth - width) / 2, cell * 1.5);
    let el = createElement('h1', flags + ' bombs left').id('status');
    el.style("text-align: center; color: white; font-size: " + cell * 0.8 + ";");
    el.size(cell * 8);
    el.position(windowWidth / 2 - cell * 4, cell * h + cell * 1.5);
    let play = createButton('Reset')
    play.style('font-size: ' + cell * 0.8 + 'px; color: white; border-color: white; background-color: black; border-width: 5px');
    play.size(cell * 3);
    play.position(windowWidth / 2 - cell * 1.5, cell * h + cell * 2.5 + cell * 1.5);
    play.mousePressed(reset);
}

function draw() {
    background(0);
    stroke(255);
    strokeWeight(1);

    for (let i = 0; i <= w; i++) {
        line(i * cell, 0, i * cell, h * cell);
    }

    for (let i = 0; i <= h; i++) {
        line(0, i * cell, w * cell, i * cell);
    }

    for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
            if (!board[i][j][1]) {
                if (board[i][j][0] == "B") {
                    fill(255)
                    textSize(0.8 * cell);
                    text(board[i][j][0], i * cell + cell / 4, j * cell + cell * 3 / 4);
                } else if (board[i][j][0] > 0) {
                    fill(255)
                    textSize(0.8 * cell);
                    text(board[i][j][0], i * cell + cell / 4, j * cell + cell * 3 / 4);
                }
            } else {
                fill(100);
                square(i * cell, j * cell, cell);

                if (board[i][j][2]) {
                    fill(255)
                    textSize(0.8 * cell);
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

    if (i < 30 && j < 16) {
        if (!click) {
            console.log(i + 1, j + 1);
            bomb(board, i, j);
            addNumbers(board);
            reveal(board, i, j);
            console.log(board);
            click = true;
        } else {
            if (board[i][j][1]) {
                if (!board[i][j][2]) {
                    if (board[i][j][0] == "B") {
                        document.getElementById('status').innerHTML = "GAME OVER";
                        for (let i = 0; i < w; i++) {
                            for (let j = 0; j < h; j++) {
                                if (board[i][j][0] == "B") {
                                    board[i][j][1] = false;
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

        console.log(board[i][j][1]);
        if (board[i][j][1]) {
            if (board[i][j][0] == "B") {
                (board[i][j][2]) ? (bombs++) : (bombs--);
            }
            console.log("flagged");
            board[i][j][2] = !board[i][j][2];

            (board[i][j][2]) ? (flags--) : (flags++);
            document.getElementById('status').innerHTML = flags + " bombs are left";

            if (bombs == 0) {
                document.getElementById('status').innerHTML = "WIN!";
                for (let i = 0; i < w; i++) {
                    for (let j = 0; j < h; j++) {
                        board[i][j][1] = false;
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

            while (board[bombx][bomby][0] == "B") {
                bombx = Math.floor(Math.random() * w);
                bomby = Math.floor(Math.random() * h);
            }

            while (Math.abs(bombx - x) < 2 && Math.abs(bomby - y) < 2) {
                bombx = Math.floor(Math.random() * w);
                bomby = Math.floor(Math.random() * h);
            }

            board[bombx][bomby][0] = "B";

            if (board[bombx][bomby][0] == "B") {
                bombCount++;
            }
        }
    }
}

function addNumbers(board) {
    for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
            let bombCount = 0;
            if (board[i][j][0] == "") {
                for (let l = -1; l <= 1; l++) {
                    for (let k = -1; k <= 1; k++) {
                        if (!((i + l == -1) || (i + l == w) || (j + k == -1) || (j + k == h))) {
                            if (board[i + l][j + k][0] == "B") {
                                bombCount++;
                            }
                        }
                    }
                }

                board[i][j][0] = bombCount;
            }
        }
    }
}

function reveal(board, x, y) {
    if (board[x][y][0] == 0) {
        board[x][y][1] = false;

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (!((x + i == -1) || (x + i == w) || (y + j == -1) || (y + j == h))) {
                    if (!(i == 0 && j == 0)) {
                        if (board[x + i][y + j][1]) {
                            if (board[x + i][y + j][0] > 0) {
                                board[x + i][y + j][1] = false;
                            } else if (board[x + i][y + j][0] == 0) {
                                board[x + i][y + j][1] = false;
                                reveal(board, x + i, y + j);
                            }
                        }
                    }
                }
            }
        }
    } else if (board[x][y][0] > 0) {
        board[x][y][1] = false;
    }
}

function reset() {
    board = new Array(w);
    for (let i = 0; i < w; i++) {
        board[i] = new Array(h);
        for (let j = 0; j < h; j++) {
            board[i][j] = ["", true, false];
        }
    }

    click = false;
}