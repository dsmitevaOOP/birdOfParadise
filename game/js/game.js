// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 600;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "../img/background.jpg";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "../img/German-tank/bernhard.png";

// creep image
var creepReady = false;
var creepImage = new Image();
creepImage.onload = function () {
    creepReady = true;
};
creepImage.src = "../img/Soviet-tank/soviet_tank_body_pos1.png";

// Game objects
var hero = {
    speed: 100 // movement speed
};

function creep(speed,x,y){
    this.speed = 100;
    this.x = x;
    this.y = y;
}

var creepCount = 30; // number of creeps
var creeps = [];  

for (var i = 0; i < creepCount; i++){
    creeps[i] = new creep();
}
var health = 100;

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
    hero.y = canvas.height - canvas.height/6;

    // Throw the creep somewhere on the screen randomly

    for (i = 0; i < creepCount; i++) {
        creeps[i].x = 32 + (Math.random() * (canvas.width - 164));
        creeps[i].y = 32 + (Math.random() * (canvas.height - 164)); 
        if(i > creepCount/2){
             creeps[i].x = 32 + (Math.random() * (canvas.width - 164));
             creeps[i].y = 32 + (Math.random() * (canvas.height - 164)); 
        }       
    }
};

// Update game objects
var update = function (modifier) {

    if (38 in keysDown) { // Player holding up
        heroImage.src = "../img/German-tank/bernhard.png";
        hero.y -= hero.speed * modifier;
 
    }
    if (40 in keysDown) { // Player holding down
        heroImage.src = "../img/German-tank/bernhard-down.png";
        hero.y += hero.speed * modifier;
 
    }
    if (37 in keysDown) { // Player holding left
        // heroImage.src = "../img/German-tank/bernhard-left.png";
        hero.x -= hero.speed * modifier;
 
    }
    if (39 in keysDown) { // Player holding right
        // heroImage.src = "../img/German-tank/bernhard-right.png";
        hero.x += hero.speed * modifier;
 
    }

    for (var i = 0; i < creepCount; i++) {
        
        if (i > creepCount/2){
            creeps[i].x -= creeps[i].speed * modifier;
        }else{
            creeps[i].x += creeps[i].speed * modifier;
        }  

        // if block, where collision occurs
        if (
		    hero.x <= (creeps[i].x + 32)
		    && creeps[i].x <= (hero.x + 32)
		    && hero.y <= (creeps[i].y + 32)
		    && creeps[i].y <= (hero.y + 32)
        ) {
            
            health -= 20;
            creeps[i].x = this.x;
            creeps[i].y = this.y;
            
        }
        if (creeps[i].x > canvas.width || creeps[i].x < -64) {
            if (i > creepCount / 2){
                creeps[i].x = canvas.width; 
            }else{
                creeps[i].x = -64;
            }
            creeps[i].y = Math.random() * (canvas.height - 100);
        }
        if (hero.x > canvas.width - 110) {
            hero.x = canvas.width - 110;
        }
        if (hero.x < 40) {
            hero.x = 40;
        }
        if (hero.y > canvas.height - 50) {
            hero.y = canvas.height - 50;
        }

    }
    // Are they touching?
};
// Draw everything
var render = function () {
    if (bgReady) {
        ctx.globalAlpha = 0.3; // changes the dynamic opacity of the background
        ctx.drawImage(bgImage, 0, 0);
    }

    if (heroReady) {
        ctx.globalAlpha = 1; // opacity for everything else
        ctx.drawImage(heroImage, hero.x, hero.y);
    }
    for (i = 0; i < creepCount; i++) {
        if (creepReady) {
            ctx.drawImage(creepImage, creeps[i].x, creeps[i].y);
        }
    }

    // ctx.rotate(0.00025);
    // ctx.drawImage(hero, hero.x, hero.y);

    // UI
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0,canvas.width,50);



    // HEALTH BAR and DEATH
    if (health <= 0) {
        ctx.fillStyle = "black";
        ctx.fillRect(0,50,canvas.width,canvas.height - 50);
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
