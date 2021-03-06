document.oncontextmenu = function() {
    return false;
}

let textColor = {
    1: "#0100fe",
    2: "#017f01",
    3: "#fe0000",
    4: "#010080",
    5: "#810102",
    6: "#008081",
    7: "#000000",
    8: "#404040"
}

let mine, unhidden, hidden, flag;
let cellSize = 30;
let gameIsOver = false;

function preload() {
    mine = loadImage("https://i.imgur.com/7JQHBVM.png");
    unhidden = loadImage("https://i.imgur.com/Z8jKF74.png");
    hidden = loadImage("https://i.imgur.com/iYh26qM.png");
    flag = loadImage("https://i.imgur.com/Zb3lunD.png");
}

function setup() {
    h2 = createElement('h2', flags.toString()).id('flags').style(`color: white; position: absolute; font-size: 50px; left: ${windowWidth / 2 - cellSize * w / 2}px; margin-top: 0%;`);
    canvas = createCanvas(w * cellSize, h * cellSize).style(`position: absolute; top: 10%; left: ${windowWidth / 2 - cellSize * w / 2}px;`);
    button = createButton('new game').position(windowWidth / 2 - cellSize * 1.7, cellSize * 0.3).mousePressed(reset).size(cellSize * 3.4, cellSize * 2).style("font-size: 22px; font-weight: bolder;");
    buttonAI = createButton('AI').position(windowWidth / 2 + width / 2 - cellSize * 2.5, cellSize * 0.3).size(cellSize * 2.5, cellSize * 2).style("font-size: 22px; font-weight: bolder;").mousePressed(start);
    p = createElement('p', '0').id('timer').style(`color: white; border: white; position: absolute; font-size: 50px; left: ${windowWidth / 2 - cellSize * w / 2 + cellSize * 3}px; margin-top: 0%;`);
    diff = createSelect().style("font-size: 22px; font-weight: bolder; text-align: center;");
    diff.option("expert");
    diff.option("intermediate");
    diff.option("begginer");
    diff.position(windowWidth / 2 - cellSize * 3, cellSize * 0.3 + cellSize * (h + 2.5)).size(cellSize * 6, cellSize * 2);
    diff.changed(selectDiff);
    diff.id("diff");
    //createElement('div', "The AI is currently very dumb and won't win every time").style(`width: 100%; position: absolute; top: ${windowHeight - cellSize}px; text-align: center; color: white;`);
}

function draw() {
    background(255);

    for (let i = 0; i < w; i++) {
        stroke(0);
        for (let j = 0; j < h; j++) {
            let cell = board[i][j];

            image(unhidden, cellSize * i, cellSize * j, cellSize, cellSize);
            if (cell.isBomb) {
                image(mine, cellSize * i, cellSize * j, cellSize, cellSize);
            } else if (cell.value > 0) {
                //textFont("Impact");
                strokeWeight(0);
                fill(textColor[cell.value]);
                textSize(25);
                textAlign(CENTER);
                text(cell.value, (i + 0.5) * cellSize, (j + 0.75) * cellSize);
            }
            if (cell.misplaced) {
                strokeWeight(3);
                image(mine, cellSize * i, cellSize * j, cellSize, cellSize);
                stroke(255, 0, 0);
                line(cellSize * i + 5, cellSize * j + 5, cellSize * (i + 1) - 5, cellSize * (j + 1) - 5);
                line(cellSize * i + 5, cellSize * (j + 1) - 5, cellSize * (i + 1) - 5, cellSize * j + 5);
            }
            if (cell.isHidden) {
                image(hidden, cellSize * i, cellSize * j, cellSize, cellSize);
            }
            if (cell.isFlagged) {
                image(flag, cellSize * i, cellSize * j, cellSize, cellSize);
            }
        }
    }

    if (con && generated && !gameOver()) {
        ai();
    }
    gameOver();
}

function mousePressed() {
    let i = floor(mouseX / cellSize);
    let j = floor(mouseY / cellSize);

    if (i >= 0 && j >= 0 && i < w && j < h) {
        if (!generated) {
            generateBoard(board, i, j);
            reveal(board, i, j);
            generated = true;
            con = false;
            startTimer();
        }

        if (mouseButton === RIGHT) {
            if (board[i][j].isHidden) {
                if ((flags > 0 && !board[i][j].isFlagged) || board[i][j].isFlagged) {
                    board[i][j].isFlagged = !board[i][j].isFlagged;
                    flags += (board[i][j].isFlagged) ? (-1) : (1);
                    if (board[i][j].isBomb) {
                        bombs += (board[i][j].isFlagged) ? (-1) : (1);
                    }
                    $('#flags')[0].innerHTML = flags.toString();
                }
            }
        }

        if (mouseButton === LEFT) {
            if (!(board[i][j].isFlagged)) {
                if (board[i][j].isBomb) {
                    end(board);
                } else {
                    reveal(board, i, j);
                }
            }
        }
    }
}

function start() {
    let i = floor(w / 2);
    let j = floor(h / 2);
    if (!generated) {
        generateBoard(board, i, j);
        reveal(board, i, j);
        generated = true;
        con = true;
        startTimer();
        frameRate(20);
        timeAI = new Date();
    }
}

function rerun() {
    canvas = createCanvas(w * cellSize, h * cellSize).style(`position: absolute; top: 10%; left: ${windowWidth / 2 - cellSize * w / 2}px;`);
    diff.position(windowWidth / 2 - cellSize * 3, cellSize * 0.3 + cellSize * (h + 2.5)).size(cellSize * 6, cellSize * 2);
}

function selectDiff() {
    let difficulty = $('#diff')[0].value;
    console.log(difficulty);
    switch (difficulty) {
        case "expert":
            w = 30;
            h = 16;
            max = 99;
            break;
        case "intermediate":
            w = 16;
            h = 16;
            max = 40;
            break;
        case "begginer":
            w = 9;
            h = 9;
            max = 10;
            break;

    }
    reset();
    rerun();
    reset();
}