

//splash screen
var backgroundDiv = document.createElement("div");
backgroundDiv.style.backgroundImage = "url('img/zombie_background.jpg')";
backgroundDiv.style.padding = "25px";
backgroundDiv.style.left = "0px";
backgroundDiv.style.top = "0px";
backgroundDiv.style.width = "1000px";
backgroundDiv.style.height = "600px";
backgroundDiv.style.display = "flex";
backgroundDiv.style.flexDirection = "column";
backgroundDiv.style.alignItems = "center";
backgroundDiv.style.justifyContent = "space-between";
document.body.appendChild(backgroundDiv);

//title
var title = document.createElement("div");
title.style.color = "white";
title.style.font = "italic bold 110px arial";
var titleText = document.createTextNode("Ninja Vs Zombies");
title.appendChild(titleText);
backgroundDiv.appendChild(title);


// start button
var startButton = document.createElement("input");
startButton.setAttribute("type", "button");
startButton.setAttribute("value", "START GAME");
startButton.addEventListener("click", startGame);
startButton.style.color = "black";
startButton.style.width = "350px";
backgroundDiv.appendChild(startButton);

//control description
var controlDiscription = document.createElement("div");
controlDiscription.style.color = "white";
controlDiscription.style.font = "italic bold 25px arial";
var controlDiscriptionText = document.createTextNode("Arrow Keys: Control Ninja / Spacebar: Throw Ninja Stars");
controlDiscription.appendChild(controlDiscriptionText);
backgroundDiv.appendChild(controlDiscription);

//end screen
var endScreenDiv = document.createElement("div");
endScreenDiv.style.backgroundImage = "url('img/end.jpg')";
endScreenDiv.style.padding = "0 350px 560px 300px";
endScreenDiv.style.left = "0px";
endScreenDiv.style.top = "0px";
endScreenDiv.style.width = "800px";
endScreenDiv.style.height = "600px";
endScreenDiv.style.display = "flex";
endScreenDiv.style.flexDirection = "column";
endScreenDiv.style.alignItems = "center";
endScreenDiv.style.justifyContent = "space-between";
document.body.appendChild(endScreenDiv);



function hideEnd(){
    endScreenDiv.style.display = "none";
}

function hideSplash(){
    backgroundDiv.style.display = "none"
    startButton.disabled = "true";
}

function showEnd(){
    myGameArea.canvas.style.display = "none";
    hero.style.display = "none";
    endScreenDiv.style.display = "initial";
}

window.addEventListener('load', hideEnd());


var hero = document.createElement('div');
var enemies = [];
var stars = [];
var background;
var score;

function startGame(){
    
    hideSplash();
    myGameArea.start();
    background = new component(1000, 600, "img/black_bg.jpg", 10, 10, "image");
    score = new component("30px", "Consolas", "white", 280, 40, "text");
    drawHero();
}

var myGameArea = {
    canvas :  document.createElement("canvas"),

    start : function(){
        this.canvas.width = 1000;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
    },

    clear : function(){
        this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
    },

    stop : function(){
        clearInterval(this.interval);
    }
}

function component(width, height, color, x, y, type){
    this.type = type;
    if(type == "image"){
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function(){
        ctx = myGameArea.context;
        if(type == "image"){
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
        else if(this.type == "text"){
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }        
        else{
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    this.newPos = function(){
        this.x += this.speedX;
        this.y += this.speedY;
    }

    //crash detection for stars and enemies
    this.crashWith = function(otherobj){
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true; 
        if((mybottom < othertop) || (mytop > otherbottom)|| (myright < otherleft) || (myleft > otherright)){
            crash = false;
        }
        return crash;
    }
    
}

//enemy creation
function enemyCreation(){
    myGameArea.frameNo += 1;
    var randomNumber = Math.floor((Math.random() * 450) + 100);
    var enemyRandomNumber = Math.floor((Math.random() * 3) + 1);
    var x, y;
    if(myGameArea.frameNo == 1 || everyinterval(150)){
        x = myGameArea.canvas.width;
        y = myGameArea.canvas.height - randomNumber; // make random height
        enemies.push(new component(100, 125, "img/zombie"+enemyRandomNumber+".gif", x, y, "image"));
    }
}

//enemy movement
function enemyMovement(){
    for(i=0;i<enemies.length;i+=1){
        if(enemies[i].x < 15){
            myGameArea.stop();
            showEnd();
        }
        else{
        enemies[i].x += -3;
        enemies[i].update();
        }
    }
}

//enemy crash
function enemyCrash(){
    for(i=0;i<enemies.length;i++){
        for(j=0;j<enemies.length;j++){
            if(stars[i].crashWith(enemies[j])){
                enemies.splice(enemies[j],1);
                stars.splice(stars[i],1);

            }
        }
    }
}

//throwing stars movement
function moveStars(){
    for(i=0;i<stars.length;i++){
        if(stars[i].x > myGameArea.canvas.width){
            stars.shift();
        }
        else{
        stars[i].x += 5;
        stars[i].update()
        }
    }
}


//hero creation and movement

var leftValue = 50, topValue = 100, direction = "down", step = 1;
function drawHero(){
    if(step == 1){
        step = 2;
    }else{
        step = 1;
    }
    hero.id = 'hero';
    hero.style.position = 'absolute';
    hero.style.left = leftValue + "px";
    hero.style.top = topValue + "px";
    hero.style.width = "59px";
    hero.style.height = "86px";
    hero.style.backgroundImage = "url('img/"+direction+step+".png')";
    document.body.appendChild(hero);
}

document.onkeydown = function(e){
    if(e.keyCode == 37 && leftValue > 25){//left
        leftValue = leftValue - 10;
        direction = "left";
    }
    if(e.keyCode == 39 && leftValue < 400){//right
        leftValue = leftValue + 10;
        direction = "right";
    }
    if(e.keyCode == 40 && topValue < 515){//down
        topValue = topValue + 10;
        direction = "down";
    }
    if(e.keyCode == 38 && topValue > 10){//up
        topValue = topValue - 10;
        direction = "top";
    }

    // throwing star creation
    if(e.keyCode == 32 && stars.length < 3 && direction == "right"){//spacebar
        stars.push(new component(39, 40, "img/star.png", leftValue, topValue, "image"));
    }
drawHero();

}





// gameloop
function updateGameArea(){
    
    myGameArea.clear();

    background.newPos();
    background.update();

    score.text = "SCORE: " + myGameArea.frameNo;
    score.update();
    
    moveStars();

    enemyCreation();
    enemyMovement();
    enemyCrash();
}

function everyinterval(n){
    if((myGameArea.frameNo / n) % 1 == 0){
        return true;
    }
    return false;
}



/******************************* 
fixes 

- get stars to kill more than just the first enemy
- increase game speed after a certain number of enemies
- fix crash detection with hero
- consider boss
- make ninja not appear on splash screen

**************************/