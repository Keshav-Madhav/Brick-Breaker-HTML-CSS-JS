let board;
let context;
let boardWidth=600;
let boardHeight=600;

let playerWidth=80;
let playerHeight=10;
let playerVelX=3;

let ballWidth=10;
let ballHeight=10;
let ballVelX=2;
let ballVelY=1.33;

let ball={
    x:(boardWidth+40)/2,
    y: boardHeight/2,
    width: ballWidth,
    height: ballHeight,
    velX: ballVelX,
    velY: ballVelY
}

let player = {
    x : boardWidth/2-playerWidth/2,
    y : boardHeight-playerHeight-15,
    width : playerWidth,
    height : playerHeight,
    velX: playerVelX
}

let blockArr=[];
let blockWidth=54;
let blockHeight=15;
let blockColumns=9;
let blockRows=3;
let blockMaxRows=10;
let blockCount=0;

let blockX=15;
let blockY=45;

let score=0;
let gameOver=false;
let level=1;

let leftArrowDown = false;
let rightArrowDown = false;

document.addEventListener('keydown', function(e) {
    if (e.code === 'ArrowLeft') {
        leftArrowDown = true;
    } else if (e.code === 'ArrowRight') {
        rightArrowDown = true;
    }
});

document.addEventListener('keyup', function(e) {
    if (e.code === 'ArrowLeft') {
        leftArrowDown = false;
    } else if (e.code === 'ArrowRight') {
        rightArrowDown = false;
    }
});

window.onload=function(){
    //board
    board=document.getElementById("board");
    board.width=boardWidth;
    board.height=boardHeight;
    context=board.getContext("2d");
    
    //blocks
    createBlocks();

    //player
    context.fillStyle="red";
    context.fillRect(player.x, player.y, playerWidth, playerHeight);
    
    requestAnimationFrame(update);
    document.addEventListener("keydown", reset);
} 

function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }

    context.clearRect(0,0,boardWidth,boardHeight)

    context.fillStyle="red";
    context.fillRect(player.x, player.y, playerWidth, playerHeight);

    context.fillStyle="white";
    ball.x += ball.velX;
    ball.y += ball.velY;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);
    
    //ball bounce off walls
    //ball bounce off player paddle
    if(topCollision(ball,player) || bottomCollisions(ball,player)){
        ball.velY *=-1;
    }
    else if( leftCollision(ball,player) || rightCollision(ball,player)){
        ball.velX *=-1;
    }

    //ball bounce off player paddle
    if(topCollision(ball,player) || bottomCollisions(ball,player)){
        ball.velY *=-1;
    }
    else if( leftCollision(ball,player) || rightCollision(ball,player)){
        ball.velX *=-1;
    }

    //drawing blocks
    context.fillStyle="skyblue";
    for(let i=0; blockArr.length>i; i++){
        let block=blockArr[i];
        if(!block.break){
            if(topCollision(ball,block) || bottomCollisions(ball,block)){
                block.break=true;
                ball.velY *= -1;
                blockCount-=1;
                score+=100;
            }
            else if(leftCollision(ball,block) || rightCollision(ball,block)){
                block.break=true;
                ball.velX *= -1;
                blockCount-=1;
                score+=100;
            }
            context.fillRect(block.x, block.y, block.width, block.height);
            context.strokeRect(block.x, block.y, block.width, block.height);
        }
    }

    //next level
    if(blockCount==0){
        score+=100*blockRows*blockColumns;
        Math.min(blockRows+1,blockMaxRows);
        level++;
        createBlocks();
    }

    //score
    context.fillStyle="skyblue";
    context.font="20px sans-serif";
    context.fillText(score,10,25)

    // level
    context.fillText("Level: " + level, boardWidth - 80, 25);

    //player move
    if (leftArrowDown) {
        let nextPlayerx = player.x - player.velX;
        if (!outOfBounds(nextPlayerx)) {
            player.x = nextPlayerx;
        }
    } else if (rightArrowDown) {
        let nextPlayerx = player.x + player.velX;
        if (!outOfBounds(nextPlayerx)) {
            player.x = nextPlayerx;
        }
    }

}

function outOfBounds(xposition){
    return (xposition<0 || xposition+playerWidth > boardWidth)
}


function reset(e){
    if(gameOver){
        if(e.code=="Space"){
            resetGame();
        }
    }
}

function detectCollision(a,b){
    return  a.x < b.x + b.width &&
            a.x+a.width > b.x &&
            a.y < b.y+b.height &&
            a.y + a.height > b.y
}

function topCollision(ball, block){
    return detectCollision(ball,block) && (ball.y + ball.height) >=block.y;
}

function bottomCollisions(ball,block){
    return detectCollision(ball,block) && (block.y + block.height) >= ball.y;
} 

function leftCollision(ball,block){
    return detectCollision(ball,block) && (ball.x + ball.width + ball.velX) >= block.x; 
}

function rightCollision(ball,block){
    return detectCollision(ball,block) && (block.x + block.width) >= (ball.x + ball.velX);
}

function createBlocks(){
    blockArr=[];
    for (let c=0;c<blockColumns;c++){
        for (let r=0; r<blockRows;r++){
            let block ={
                x:blockX + c*blockWidth + c*11,
                y:blockY +r*blockHeight + r*10,
                width: blockWidth,
                height: blockHeight,
                break: false
            }
            blockArr.push(block);
        }
    }
    blockCount=blockArr.length;
}

function resetGame(){
    gameOver=false;
    player = {
        x : boardWidth/2-playerWidth/2,
        y : boardHeight-playerHeight-15,
        width : playerWidth,
        height : playerHeight,
        velX: playerVelX
    }
    ball={
        x:(boardWidth+40)/2,
        y: boardHeight/2,
        width: ballWidth,
        height: ballHeight,
        velX: ballVelX,
        velY: ballVelY
    }

    blockArr=[];
    score=0;
    level=1
    blockRows=3;
    createBlocks();
}
