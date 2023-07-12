let fps=60;
let fpsInterval = 1000 / fps;
let lastFrameTime = Date.now();
let lastframe=0
let frameCount = 0;
let currentFps = 0;

let board;
let context;
let boardWidth = 700;
let boardHeight = 600;

let playerWidth = 80;
let playerHeight = 12;
let playerVelX = 3;

let ballWidth = 12;
let ballHeight = 12;
let ballVelX = 2;
let ballVelY = 1.3;
let maxBallVelX = ballVelX + 1;
let maxBallVelY = ballVelY + 0.7;
let minBallVelX = ballVelX - 1;
let minBallVelY = ballVelY - 0.7;

let ball = {
    x: (boardWidth - ballWidth) / 2,
    y: boardHeight / 2,
    width: ballWidth,
    height: ballHeight,
    velX: ballVelX,
    velY: ballVelY
}

let player = {
    x: boardWidth / 2 - playerWidth / 2,
    y: boardHeight - playerHeight - 15,
    width: playerWidth,
    height: playerHeight,
    velX: playerVelX
}

let blockArr = [];
let blockWidth = 61;
let blockHeight = 15;
let blockColumns = 9;
let blockRows = 3;
let blockMaxRows = 10;
let blockCount = 0;

let blockX = 16;
let blockY = 55;

let score = 0;
let gameOver = false;
let level = 1;
let ballCollidingWithPlayer = false;
let lives = 3;
let maxLives = 4;
let gameStarted = false;
let paused = false;


let countdown = 3;
let countdownActive = false;

let leftArrowDown = false;
let rightArrowDown = false;

let heartImage = new Image();
heartImage.src = './Assets/heart.png';

let heartOutlineImage = new Image();
heartOutlineImage.src = "./Assets/heart-outline.png";

//music

let bounceWallAud = new Audio();
bounceWallAud.src = "./Assets/Sounds/ball_bounce.mp3";
bounceWallAud.volume = "0.3";

let bouncePaddleAud = new Audio();
bouncePaddleAud.src = "./Assets/Sounds/ball_bounce_paddle.mp3";
bouncePaddleAud.volume = "0.5";

let blockBreakAud = new Audio();
blockBreakAud.src = "./Assets/Sounds/block_break.mp3";
blockBreakAud.volume = "0.6";

let countdownAud = new Audio();
countdownAud.src = "./Assets/Sounds/3sec countdown.mp3";
countdownAud.volume = "0.6";

let lifeGainAud = new Audio();
lifeGainAud.src = "./Assets/Sounds/life_gained.mp3";
lifeGainAud.volume = "0.2";

let lifeLostAud = new Audio();
lifeLostAud.src = "./Assets/Sounds/ball_falls.mp3";

let gameOverAud = new Audio();
gameOverAud.src = "./Assets/Sounds/game_over.mp3";

let powerUpAud = new Audio();
powerUpAud.src = "./Assets/Sounds/Power_up.mp3";

let levelCompleteAud = new Audio();
levelCompleteAud.src = "./Assets/Sounds/level_complete.mp3";
levelCompleteAud.volume = "0.4";

let backgroundAud = new Audio();
backgroundAud.src = "./Assets/Sounds/background_music -david_fesliyan.mp3";
backgroundAud.volume = 0.1;
backgroundAud.loop = true;

let allSounds = [bounceWallAud, bouncePaddleAud, blockBreakAud, countdownAud, lifeGainAud, lifeLostAud, gameOverAud, powerUpAud, levelCompleteAud];
let muted = false;
let bgmMuted = false;


document.getElementById('bgmVolume').addEventListener('input', function (e) {
    backgroundAud.volume = e.target.value;
    backgroundAud.play();
});

document.getElementById('muteBgm').addEventListener('click', function () {
    if (backgroundAud.muted) {
        backgroundAud.muted = false;
        bgmMuted = false;
        this.textContent = 'Mute Music';
    }
    else {
        backgroundAud.muted = true;
        bgmMuted = true;
        this.textContent = 'Unmute Music';
    }
});

document.getElementById('muteAll').addEventListener('click', function () {
    if (muted) {
        allSounds.forEach(sound => sound.muted = false);
        muted = false;
        this.textContent = 'Mute All SFX';
    }
    else {
        allSounds.forEach(sound => sound.muted = true);
        muted = true;
        this.textContent = 'Unmute All SFX';
    }
});

document.addEventListener('keydown', function (e) {
    if (e.key === 'm') {
        if (bgmMuted) {
            backgroundAud.muted = false;
            bgmMuted = false;
            document.getElementById('muteBgm').textContent = 'Mute BG Music(m)';
        } else {
            backgroundAud.muted = true;
            bgmMuted = true;
            document.getElementById('muteBgm').textContent = 'Unmute BG Music(m)';
        }
    }
});

document.addEventListener('keydown', function (e) {
    if (e.code === 'ArrowLeft') {
        leftArrowDown = true;
        gameStarted = true;
        backgroundAud.play();
    }
    else if (e.code === 'ArrowRight') {
        rightArrowDown = true;
        gameStarted = true;
        backgroundAud.play();
    }
});

document.addEventListener('keyup', function (e) {
    if (e.code === 'ArrowLeft') {
        leftArrowDown = false;
    }
    else if (e.code === 'ArrowRight') {
        rightArrowDown = false;
    }
});

document.addEventListener('touchstart', function (event) {
    if (gameOver) {
        resetGame();
        return;
    }
    let touchX = event.touches[0].clientX;
    let screenWidth = window.innerWidth;

    if (touchX < screenWidth / 2) {
        leftArrowDown = true;
        gameStarted = true;
        backgroundAud.play();
    } else {
        rightArrowDown = true;
        gameStarted = true;
        backgroundAud.play();
    }
}, false);

document.addEventListener('touchend', function (event) {
    leftArrowDown = false;
    rightArrowDown = false;
}, false);

//pause
document.addEventListener('keydown', function (e) {
    if (e.key === 'p') {
        paused = !paused;
    }
    if (paused) {
        document.getElementById("isPaused").textContent = 'Resume Game';
    } else {
        document.getElementById("isPaused").textContent = 'Pause Game';
    }
});

document.getElementById('isPaused').addEventListener('click', function () {
    paused = !paused;
    if (paused) {
        this.textContent = 'Resume Game';
    } else {
        this.textContent = 'Pause Game';
    }
});

window.onload = function () {
    //board
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    //blocks
    createBlocks();

    //player
    context.fillStyle = "red";
    context.fillRect(player.x, player.y, playerWidth, playerHeight);

    requestAnimationFrame(update);
    document.addEventListener("keydown", reset);
    backgroundAud.play();
}

function update(timestamp) {
    let now = Date.now();
    let deltaTime = (now - lastFrameTime) / 8;
    lastFrameTime = now;

    if (paused) {
        requestAnimationFrame(update);
        return;
    }
    requestAnimationFrame(update);

    if (gameOver || countdownActive || paused) {
        return;
    }
    context.clearRect(0, 0, boardWidth, boardHeight)

    // Calculate and display FPS
    frameCount++;
    let elapsedTime = timestamp - lastframe;
    if (elapsedTime > fpsInterval) {
        currentFps = Math.round(frameCount / (elapsedTime / 1000));
        frameCount = 0;
        lastframe = timestamp;
    }
    context.shadowColor = "transparent";
    context.fillStyle = 'rgba(255,255,255,0.5)';
    context.font = "10px sans-serif";
    context.fillText("FPS: " + currentFps, 10, 10);

    //player paddle
    context.fillStyle = "red";
    context.shadowColor = "rgba(255,0,0, 0.9)";
    context.shadowBlur = 20;
    context.fillRect(player.x, player.y, playerWidth, playerHeight);

    //ball
    context.fillStyle = "white";
    context.shadowColor = "rgba(255,355,255, 0.7)";
    context.shadowBlur = 40;
    if (gameStarted) {
        ball.x += ball.velX * deltaTime;
        ball.y += ball.velY * deltaTime;
    }
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

    // limit ball velocity to range between min and max values
    if (Math.abs(ball.velX) > maxBallVelX) {
        console.log("vel before was greater")
        ball.velX = maxBallVelX * Math.sign(ball.velX);
    }
    else if (Math.abs(ball.velX) < minBallVelX) {
        ball.velX = minBallVelX * Math.sign(ball.velX);
    }
    if (Math.abs(ball.velY) > maxBallVelY) {
        ball.velY = maxBallVelY * Math.sign(ball.velY);
    }
    else if (Math.abs(ball.velY) < minBallVelY) {
        ball.velY = minBallVelY * Math.sign(ball.velY);
    }

    //ball bounce off walls
    ballBounceWall();

    //ball bounce off player paddle
    ballBouncePaddle();

    //drawing blocks
    context.fillStyle="rgba(6, 0, 20,0.7)";
    context.strokeStyle = "skyblue";
    context.lineWidth=2;
    context.shadowColor = "rgba(135,106,235, 0.7)";
    context.shadowBlur = 10;
    for(let i=0; blockArr.length>i; i++){
        let block=blockArr[i];
        if(!block.break){
            if (topCollision(ball, block) || bottomCollisions(ball, block)) {
                block.break = true;
                ball.velY *= -1;
                ball.velY += getRandomDeviation();
                blockCount -= 1;
                score += 100;
                blockBreakAud.currentTime = 0;
                blockBreakAud.play();
            } 
            else if (leftCollision(ball, block) || rightCollision(ball, block)) {
                block.break = true;
                ball.velX *= -1;
                ball.velX += getRandomDeviation();
                blockCount -= 1;
                score += 100;
                blockBreakAud.currentTime = 0;
                blockBreakAud.play();
            }
            context.fillRect(block.x, block.y, block.width, block.height);
            context.strokeRect(block.x, block.y, block.width, block.height);
        }
    }

    //next level
    if (blockCount == 0) {
        levelUp();
    }

    //score
    context.fillStyle = "lightgreen";
    context.font = "20px sans-serif";
    context.fillText("Score: " + score, 10, 30)

    // level
    context.fillText("Level: " + level, boardWidth - 80, 30);

    //lives
    context.shadowColor = "rgba(255,0,0, 0.5)";
    context.shadowBlur = 10;
    for (let i = 0; i < 3; i++) {
        let x = boardWidth / 2 - 40 + i * 30;
        let y = 15;
        let width = 20;
        let height = 20;
        if (i < lives) {
            context.drawImage(heartImage, x, y, width, height);
        } else {
            context.drawImage(heartOutlineImage, x, y, width, height);
        }
    }

    //player move
    if (leftArrowDown) {
        let nextPlayerx = player.x - player.velX *deltaTime;
        if (!outOfBounds(nextPlayerx)) {
            player.x = nextPlayerx;
        }
    } else if (rightArrowDown) {
        let nextPlayerx = player.x + player.velX * deltaTime;
        if (!outOfBounds(nextPlayerx)) {
            player.x = nextPlayerx;
        }
    }
}

function levelUp() {
    score += 100 * blockRows * blockColumns;
    blockRows = Math.min(blockRows + 1, blockMaxRows);
    level++;
    playerWidth += 10; // increase paddle size
    if (player.x + playerWidth > boardWidth) {
        player.x = boardWidth - playerWidth;
    }
    powerUpAud.play();
    setTimeout(() => levelCompleteAud.play(), 300);
    if (level % 3 === 0 && lives < maxLives) {
        lives++; // gain an extra life
        setTimeout(() => lifeGainAud.play(), 600);
    }
    createBlocks();
}

function getRandomDeviation() {
    return (Math.random() - 4) / 10;
}

function getRelativeMovement() {
    if (leftArrowDown) {
        return ball.velX - player.velX;
    } else if (rightArrowDown) {
        return ball.velX + player.velX;
    } else {
        return ball.velX;
    }
}

function outOfBounds(xposition) {
    return (xposition < 0 || xposition + playerWidth > boardWidth)
}

function reset(e) {
    if (gameOver) {
        if (e.code == "Space") {
            resetGame();
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
}

function leftCollision(ball, block) {
    let currentBallLeft = ball.x;
    let currentBallRight = ball.x + ball.width;
    let currentBallTop = ball.y;
    let currentBallBottom = ball.y + ball.height;

    let nextBallLeft = currentBallLeft + ball.velX;
    let nextBallRight = currentBallRight + ball.velX;

    return  nextBallRight > block.x && 
            nextBallLeft < block.x + block.width && 
            currentBallBottom > block.y && 
            currentBallTop < block.y + block.height;
}

function rightCollision(ball, block) {
    return leftCollision(ball, block);
}

function topCollision(ball, block) {
    let currentBallLeft = ball.x;
    let currentBallRight = ball.x + ball.width;
    let currentBallTop = ball.y;
    let currentBallBottom = ball.y + ball.height;

    let nextBallTop = currentBallTop + ball.velY;
    let nextBallBottom = currentBallBottom + ball.velY;

    return  nextBallBottom > block.y && 
            nextBallTop < block.y + block.height && 
            currentBallRight > block.x && 
            currentBallLeft < block.x + block.width;
}

function bottomCollisions(ball, block) {
    return topCollision(ball, block);
}

function createBlocks() {
    blockArr = [];
    for (let c = 0; c < blockColumns; c++) {
        for (let r = 0; r < blockRows; r++) {
            let block = {
                x: blockX + c * blockWidth + c * 11 + 15,
                y: blockY + r * blockHeight + r * 10,
                width: blockWidth,
                height: blockHeight,
                break: false
            }
            blockArr.push(block);
        }
    }
    blockCount = blockArr.length;
}

function ballBounceWall() {
    if (ball.y <= 0 && ball.velY < 0) {
        ball.velY *= -1;
        bounceWallAud.play();
    } else if (ball.x <= 0 && ball.velX < 0) {
        ball.velX *= -1;
        bounceWallAud.play();
    } else if ((ball.x + ball.width) >= boardWidth && ball.velX > 0) {
        ball.velX *= -1;
        bounceWallAud.play();
    } else if (ball.y + ball.height >= boardHeight && ball.velY > 0) {
        lives--;
        lifeLostAud.play();
        if (lives === 0) {
            context.font = "20px sans-serif";
            context.fillText("Gameover: Press 'space' or -tap screen- to restart", 220, 400);
            gameOver = true;
            backgroundAud.pause();
            gameOverAud.play();
        } else {
            backgroundAud.pause();
            startCountdown();
        }
    }
}

function ballBouncePaddle() {
    let ballNextX = ball.x + ball.velX;
    let ballNextY = ball.y + ball.velY;

    let sweptBall = {
        x: Math.min(ball.x, ballNextX),
        y: Math.min(ball.y, ballNextY),
        width: Math.abs(ball.x - ballNextX) + ball.width,
        height: Math.abs(ball.y - ballNextY) + ball.height
    };

    if (!ballCollidingWithPlayer && detectCollision(sweptBall, player)) {
        let relativeMovement = getRelativeMovement();
        ball.velY *= -1;
        ball.velY += getRandomDeviation() - relativeMovement / 15;
        ball.velX += getRandomDeviation() + relativeMovement / 15;
        ballCollidingWithPlayer = true;
        bouncePaddleAud.play();
    } else if (!detectCollision(sweptBall, player)) {
        ballCollidingWithPlayer = false;
    }
}


function resetGame() {
    gameOver = false;
    player = {
        x: boardWidth / 2 - playerWidth / 2,
        y: boardHeight - playerHeight - 15,
        width: playerWidth,
        height: playerHeight,
        velX: playerVelX
    }
    ball = {
        x: (boardWidth + 40) / 2,
        y: boardHeight / 2,
        width: ballWidth,
        height: ballHeight,
        velX: ballVelX,
        velY: ballVelY
    }

    blockArr = [];
    score = 0;
    level = 1;
    lives = 3;
    blockRows = 3;
    backgroundAud.play();
    startCountdown();
    createBlocks();
}

function startCountdown() {
    // start countdown
    countdownActive = true;
    countdownAud.play();
    countdown = 3;
    context.fillStyle = "white";
    context.font = "50px sans-serif";
    context.fillText(countdown, boardWidth / 2, boardHeight / 2);
    let countdownInterval = setInterval(() => {
        countdown--;
        if (countdown === 0) {
            clearInterval(countdownInterval);
            //reset ball and player positions
            ball.x = (boardWidth + 40) / 2;
            ball.y = boardHeight / 2;
            player.x = boardWidth / 2 - playerWidth / 2;
            player.y = boardHeight - playerHeight - 15;
            ball.velX = maxBallVelX - 1;
            ball.velY = maxBallVelY - 1;
            countdownActive = false;
            backgroundAud.play();
        } else {
            drawGameObjects();
            context.fillStyle = "white";
            context.font = "50px sans-serif";
            context.fillText(countdown, boardWidth / 2, boardHeight / 2);
        }
    }, 1000);
}

function drawGameObjects() {
    context.clearRect(0, 0, boardWidth, boardHeight);

    // draw player paddle
    context.fillStyle = "red";
    context.shadowColor = "rgba(255,0,0, 0.9)";
    context.shadowBlur = 20;
    context.fillRect(player.x, player.y, playerWidth, playerHeight);

    // draw ball
    context.fillStyle = "white";
    context.shadowColor = "rgba(255,355,255, 0.7)";
    context.shadowBlur = 40;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

    // draw blocks
    context.fillStyle = "rgba(6, 0, 20,0.7)";
    context.strokeStyle = "skyblue";
    context.lineWidth = 2;
    context.shadowColor = "rgba(135,106,235, 0.7)";
    context.shadowBlur = 10;
    for (let i = 0; blockArr.length > i; i++) {
        let block = blockArr[i];
        if (!block.break) {
            context.fillRect(block.x, block.y, block.width, block.height);
            context.strokeRect(block.x, block.y, block.width, block.height);
        }
    }

    // draw score
    context.fillStyle = "lightgreen";
    context.font = "20px sans-serif";
    context.fillText("Score: " + score, 10, 25);

    // level
    context.fillText("Level: " + level, boardWidth - 80, 25);

    //lives
    context.shadowColor = "rgba(255,0,0, 0.5)";
    context.shadowBlur = 10;
    for (let i = 0; i < 3; i++) {
        let x = boardWidth / 2 - 40 + i * 30;
        let y = 10;
        let width = 20;
        let height = 20;
        if (i < lives) {
            context.drawImage(heartImage, x, y, width, height);
        } else {
            context.drawImage(heartOutlineImage, x, y, width, height);
        }
    }
}