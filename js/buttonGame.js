const div = document.getElementById("canvasDiv");
let canvas = document.createElement("canvas");
let buttons = [];
let buttonMap = [];
let numButtons = 4;
let numAssociations = 1;

function resetGame() {
    buttons = [];
    buttonMap = [];
}

function startGame() {
    resetGame();
    gameBoard.start(0.7 * window.innerWidth, 0.9 * window.innerHeight);
    gameBoard.clear();
    numButtons = document.getElementById("numButtons").value;
    numAssociations = document.getElementById("numAssociations").value;
    console.log(numButtons, numAssociations);

    for (let i = 0; i < numButtons; i++) {
        buttonMap.push([]);
    }
    for (let i = 0; i < numButtons; i++) {
        for (let j = 0; j < numAssociations; j++) {
            while (buttonMap[i].length < j + 1) {
                let randNumber = Math.floor(Math.random() * numButtons);
                if (!buttonMap[i].includes(randNumber) && (randNumber != i)) {
                    buttonMap[i].push(randNumber);
                }
            }
        }
    }

    let numCols = Math.ceil(Math.sqrt(numButtons));
    let buttonSize = 50;
    if (numButtons <= 9) {
        buttonSize = 65;
    } else if (numButtons > 9 && numButtons <= 16) {
        buttonSize = 50;
    } else {
        buttonSize = 40;
    }
    console.log(numCols);
    for (let i = 0; i < numButtons; i++) {
        console.log(buttons);
        buttons.push(new Component(buttonSize, 1, 0.7 * Math.floor((i % numCols) + 1) * window.innerWidth / (numCols + 1), 0.9 * Math.floor((i / numCols) + 1) * window.innerHeight / (numCols + 1), (i + 1).toString(), buttonMap[i]));
    }
}

const gameBoard = {
    canvas: canvas,
    start: function (width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext("2d");
        div.appendChild(this.canvas);
        this.interval = setInterval(updateGameBoard, 20);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

canvas.addEventListener('click', function (event) {
    let x = event.pageX - canvas.offsetLeft,
        y = event.pageY - canvas.offsetTop;

    buttons.forEach(function (button) {
        let dx = x - button.x,
            dy = y - button.y;
        if (dx * dx + dy * dy < button.radius * button.radius) {
            button.update(1 - button.status);
            button.correspondingButtons.forEach(function (currButton) {
                buttons[currButton].update(1 - buttons[currButton].status);
            });
        }
    });
}, false);

function Component(radius, status, x, y, text, correspondingButtons) {
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.text = text;
    this.status = status;
    this.correspondingButtons = correspondingButtons;
    this.update = function (status = this.status) {
        this.status = status;
        context = gameBoard.context;
        if (this.status == 1) {
            context.fillStyle = "lightgreen";
        } else {
            context.fillStyle = "pink";
        }
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = '#003300';
        context.stroke();

        context.fillStyle = "black";
        context.textAlign = "center";
        context.verticalAlign = "middle";
        context.font = "bold 20px Arial";
        context.fillText(this.text, this.x, this.y + 5);
    }
}

function updateGameBoard() {
    gameBoard.clear();
    buttons.forEach(function (button) {
        button.update();
    });
    let success = allOff();
    if (success) {
        showCongratulationsScreen();
    }
}

function allOff() {
    if (buttons.length == 0) {
        return false;
    }
    for (let i = 0; i < numButtons; i++) {
        if (buttons[i].status == 1) {
            return false;
        }
    }
    return true;
}

function showCongratulationsScreen() {
    context = gameBoard.context;
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "green";
    context.textAlign = "center";
    context.verticalAlign = "middle";
    context.font = "bold 40px Arial";
    context.fillText("Congratulations, you won!!", canvas.width / 2, canvas.height / 2);
    context.font = "20px Arial";
    context.fillStyle = "black";
    context.fillText("Click on 'Reset Game' to play again with harder/different specifications!", canvas.width / 2, canvas.height / 2 + 30);
}
