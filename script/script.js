// dom elements
const playBoard = document.querySelector("main");
const modal = document.querySelector(".modal");
const scoreElement = document.querySelector(".score");
const recordElement = document.querySelector(".record");
const controls = document.querySelectorAll(".commands div");
const musicBtn = document.getElementById("music");

// music and sounds effect
let mySound = new Audio('Clown.mp3');
let isMusic = true;
let appleBite = new Audio('apple_bite.wav');
let gameOverSound = new Audio('game_over.wav');

// set Interval
let setIntervalId

// game over flag
let isGameOver = false;

// apple coordinates
let appleX;
let appleY;

// snake coordinates
let snakeX = 10;
let snakeY = 10;
let snakeBody = [];

//velocity
let velocityX = 0;
let velocityY = 0;

//score
let score = 0;
let record = localStorage.getItem("record") || 0;
recordElement.innerText = `Record ${record}`;

//modal message
let message = `
    <div class="alert">
        <div class="d-flex">
            <div>
             <p> Mi dispiace, hai perso.<br>
                    Clicca sul tasto per giocare ancora!</p>
            </div>
            <div class="sad-face">:(</div>
        </div>
        <button class="btn" type="button">Gioca</button>
    </div>
       
    `


//* FUNCTIONS
// music
const playMusic = () => {
    mySound.volume = 0.2;
    mySound.play();
};

// play or stop music at click
musicBtn.addEventListener('click', () => {
    if (isMusic) {
        mySound.pause();
        isMusic = false;
        musicBtn.innerHTML = `
        <i class="fa-solid fa-play"></i>
        <span class="pl-10">Play music</span>`;
        return
    };

    if (!isMusic) {
        mySound.play();
        isMusic = true;
        musicBtn.innerHTML = `
        <i class="fa-solid fa-pause"></i>
        <span class="pl-10">Stop music</span>`;
        return
    }
});

// game over
const handleGameOver = () => {
    clearInterval(setIntervalId);
    gameOverSound.play();
    modal.innerHTML = message;

    // getting button and creating event on click
    const btn = document.querySelector(".btn");
    btn.addEventListener('click', () => location.reload())
};


//change apple position
const changeApplePosition = () => {
    appleX = Math.floor(Math.random() * 30) + 1;
    appleY = Math.floor(Math.random() * 25) + 1;
};

// change direction
const changeDirection = (e) => {

    // changing velocity based on key press
    if (e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
};

controls.forEach(key => {
    key.addEventListener("click", () => changeDirection({ key: key.dataset.key }))
});


// function that initialize the game
const initGame = () => {
    if (isGameOver) handleGameOver();

    let item = `<div class="apple" style="grid-area: ${appleY} / ${appleX}"></div>`;

    // updating snake head position based on current velocity
    snakeX += velocityX;
    snakeY += velocityY;

    // setting collision with borders
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 25) {
        isGameOver = true;
        return;
    }

    // events after snake's head hit apple
    if (snakeX === appleX && snakeY === appleY) {
        appleBite.play();
        changeApplePosition();
        snakeBody.push([appleX, appleY]);
        score++;

        record = score >= record ? score : record;
        localStorage.setItem('record', record);

        scoreElement.innerText = `Punteggio ${score}`;
        recordElement.innerText = `Record ${record}`;
    }

    // shifting the elements in the snake's body
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];

    for (let i = 0; i < snakeBody.length; i++) {
        // adding div for each part of snake's body
        item += `<div class="snake" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;

        // checking if snake's head hit its body, in that case game over is true
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            isGameOver = true;
        }
    }


    playBoard.innerHTML = item;
};

playMusic();
changeApplePosition();
setIntervalId = setInterval(initGame, 125);
document.addEventListener("keydown", changeDirection);
