// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 600;
document.getElementById("game").appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "img/bg.jpg";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "img/German-tank/bernhard.png";

// creep image
var creepReady = false;
var creepLeftImage = new Image();
var creepRightImage = new Image();

creepLeftImage.onload = function () {
    creepReady = true;
};
creepRightImage.onload = function () {
    creepReady = true;
};
creepLeftImage.src = "img/Soviet-tank/tankLeftShadow.png";
creepRightImage.src = "img/Soviet-tank/tankRightShadow.png";


// Game objects
var hero = {
    speed: 250 // movement speed
};

function creep(speed,x,y,side){
    this.speed = 100;
    this.x = x;
    this.y = y;
    this.side = side;
}

var creepCount = 50; // number of creeps
var creeps = [];  

for (var i = 0; i < creepCount; i++){
    creeps[i] = new creep();
}
var health = 100;
var lvl = 1;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
});

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
});

// Reset the game when the player catches a creep
var reset = function () {
    hero.x = canvas.width / 2;
    hero.y = canvas.height - canvas.height/9;

    // Throw the creep somewhere on the screen randomly
 
    for (i = 0; i < creepCount; i++) {
        //Spawn creeps going left
        creeps[i].x = 32 + (Math.random() * (canvas.width - 164));
        creeps[i].y = 64 + (Math.random() * (canvas.height - 164));
        creeps[i].side = "right"; 
        //Spawn creeps goirng right
        if(i > creepCount/2){
             creeps[i].x = 32 + (Math.random() * (canvas.width - 164));
             creeps[i].y = 64 + (Math.random() * (canvas.height - 164)); 
             creeps[i].side = "left";
        }       
    }
};

// Update game objects
var update = function (modifier) {

    if (38 in keysDown) { // Player holding up
        heroImage.src = "img/German-tank/bernhard.png";
        hero.y -= hero.speed * modifier;
 
    }
    if (40 in keysDown) { // Player holding down
        heroImage.src = "img/German-tank/bernhard-down.png";
        hero.y += hero.speed * modifier;
 
    }
    if (37 in keysDown) { // Player holding left
        heroImage.src = "img/German-tank/tank-left.png";
        hero.x -= hero.speed * modifier;
 
    }
    if (39 in keysDown) { // Player holding right
         heroImage.src = "img/German-tank/tank-right.png";
        hero.x += hero.speed * modifier;
 
    }
    if(38 in keysDown && 39 in keysDown){ // 45 degrees up and right
         heroImage.src = "img/German-tank/upRight45.png";        
    }
    if(38 in keysDown && 37 in keysDown){ // 45 degrees up and left
         heroImage.src = "img/German-tank/upLeft45.png";        
    }
    if(40 in keysDown && 39 in keysDown){ // 45 degrees down and right
         heroImage.src = "img/German-tank/downRight45.png";        
    }
    if(40 in keysDown && 37 in keysDown){ // 45 degrees down and right
         heroImage.src = "img/German-tank/downLeft45.png";        
    }

    for (var i = 0; i < creepCount; i++) {
        
        if (i > creepCount/2){
            creeps[i].x -= creeps[i].speed * modifier; // tanks going left
        } else {
            creeps[i].x += creeps[i].speed * modifier; // tanks going right
        }  

        // if block, where collision occurs
        if (
            hero.x <= (creeps[i].x + 32)
            && creeps[i].x <= (hero.x + 32)
            && hero.y <= (creeps[i].y + 15)
            && creeps[i].y <= (hero.y + 42)
        ) {
            
            health -= 10;
            creeps[i].x = this.x;
            creeps[i].y = this.y;
            
        }

        // Field borders for CREEPS
        if (creeps[i].x > canvas.width || creeps[i].x < -64) {
            if (i > creepCount / 2){
                creeps[i].x = canvas.width; 
            }else{
                creeps[i].x = -64;
            }
            creeps[i].y = Math.random() * (canvas.height - 100);
        }
        // Field borders for HERO
        if (hero.x > canvas.width -  64) {
            hero.x = canvas.width - 64;
        }
        if (hero.x < 0) {
            hero.x = 0;
        }
        if (hero.y > canvas.height - 50) {
            hero.y = canvas.height - 50;
        }


        // LEVEL FINISH LINE
        if (hero.y < 15){
            reset()
            lvl++;
        }

    }
};
var mover = 0;
// Draw everything
var render = function () {
    if (bgReady) {
        ctx.globalAlpha = 0.3; // changes the dynamic opacity of the background
        ctx.drawImage(bgImage, 0, mover);
        mover+= 0.01;
    }

    if (heroReady) {
        ctx.globalAlpha = 1; // opacity for everything else
        ctx.drawImage(heroImage, hero.x, hero.y);
    }
    for (i = 0; i < creepCount; i++) {
        if (creepReady && creeps[i].side == "left") {
            ctx.drawImage(creepLeftImage, creeps[i].x, creeps[i].y);
        }
        if (creepReady && creeps[i].side == "right") {
            ctx.drawImage(creepRightImage, creeps[i].x, creeps[i].y);
        }
    }

    // UI
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0,canvas.width,50);

    // HEALTH BAR, DEATH and LEVEL 
    if (health <= 0) {
        ctx.fillStyle = "black";
        ctx.fillRect(0,50,canvas.width,canvas.height - 50);

        ctx.fillStyle = "#FF0000";
        ctx.font = "2p6x Helvetica bold";
        ctx.textBaseline = "top";
        ctx.textAlign = "left";
        ctx.fillText("GAME OVER", 400, canvas.height/2);
        if (health <= -9000) {
            ctx.fillStyle = "#00FF00";
            ctx.fillText("It's UNDER 9000. Wow.", 150, canvas.height/2 + 30); // XAXAXAX
        }
    } else if (health <= 20) {
        ctx.fillStyle = "red";
        ctx.fillRect(0,50,canvas.width / 5, 5);    
    } else if (health <= 40) {
        ctx.fillStyle = "orange";
        ctx.fillRect(0,50,canvas.width / 3, 5);    
    } else if (health <= 80) {
        ctx.fillStyle = "yellow";
        ctx.fillRect(0,50,canvas.width / 1.5, 5);
    } else if (health <= 100) {
        ctx.fillStyle = "green";
        ctx.fillRect(0,50,canvas.width, 5);
    }
    

    // Score
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "24px Helvetica bold";
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillText("HP: " + health, 10, 10);
    // Level
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "24px Helvetica bold";
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillText("LEVEL: " + lvl, 110, 10);
};

// The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;
    update(delta / 1000);
    render();

    then = now;

    // Request to do this again ASAP
    requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Start the game
var then = Date.now();
reset();
main();
