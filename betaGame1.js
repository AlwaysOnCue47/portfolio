// beta game 1 script

// the canvas

const canvas = document.getElementById('canvas');
canvas.height = 420;
canvas.width = 680;
canvas.style.width = 680;
canvas.style.height = 420;
canvas.style.backgroundColor = "rgb(3, 0, 30)";
const ctx = canvas.getContext('2d');
let rect = canvas.getBoundingClientRect(); // get the canvas position relative to it's position on the page.

// event listeners

window.addEventListener('resize', ()=> {  // update rect values on window resize
  rect = canvas.getBoundingClientRect();
});

canvas.addEventListener("dragstart", (event) => { // prevents click and drag function on canvas element
  event.preventDefault();
});

document.getElementById('canvas').addEventListener('click', () => {
  if (gameRunning) {
    let x = 0;
  let y = -8;
    if (playerSprite.x <= canvas.width && playerSprite.x >= canvas.width - 100){
      x = -8;
      y = -6;
    }
    else if (playerSprite.x >= 0 && playerSprite.x <= 100){
      x = 8;
      y = -6;
    }
  initAmmo(playerSprite.x, playerSprite.y, x, y, ammoType);
  }
});

const newGameBtm = document.getElementById('newGameBtn');
newGameBtm.addEventListener('click', () =>{
  newGame(1);
});

document.addEventListener("keydown", (event)=> {
  switch (event.key){
    case 'p':
      gameRunning = !gameRunning;
      break;
  }
});

// images 

const alien1 = document.getElementById('alien1');
const alien2 = document.getElementById('alien2');
const alien3 = document.getElementById('alien3');
const alien4 = document.getElementById('alien4');
const playerShip = document.getElementById('playerShip');
const playerShipRight = document.getElementById('playerShipRightTurn');
const playerShipLeft = document.getElementById('playerShipLeftTurn');
const background = document.getElementById('backgroundShip');
const shieldPowerUpImage = document.getElementById('shieldPowerUp');
const weaponPowerUpImage = document.getElementById('weaponPowerUp');

// other variables and listeners

const shieldBox = document.getElementById('shields');
const lifeBox = document.getElementById('life');
const shipLifeBox = document.getElementById('transportShip');
const levelBox = document.getElementById('level');
function updateScoreBox() {
  if (playerSprite){
    shieldBox.innerHTML = ("Shield strength: " + playerShields.shields.strength);
    lifeBox.innerHTML = ("Player Health: " + playerSprite.hitPoints);
    shipLifeBox.innerHTML = ("Ship Health: " + shipHitPoints);
    levelBox.innerHTML = ("Level: " + gameLevel);

    if (shipHitPoints <= 5) {
      shipLifeBox.style.backgroundColor = "rgb(158, 0, 0)";
    }
    else shipLifeBox.style.removeProperty("background-color");

    if (playerShields.shields.strength >= 2 && playerShields.shields.strength <= 5) {
      shieldBox.style.backgroundColor = "rgb(148, 42, 0)";
    } 
    else if (playerShields.shields.strength <= 1){
      shieldBox.style.backgroundColor = "rgb(158, 0, 0)";
    } 
    else {shieldBox.style.removeProperty("background-color");}
    
    if (playerSprite.hitPoints == 3 || playerSprite.hitPoints == 2) {
      lifeBox.style.backgroundColor = "rgb(148, 42, 0)";
    }
    else if (playerSprite.hitPoints <= 1) {
      lifeBox.style.backgroundColor = "rgb(158, 0, 0)";
    } 
    else {lifeBox.style.removeProperty("background-color");}
  } 
};

let mouse = {x: 200, y: 200};
canvas.addEventListener('mousemove', (event)=> { // mouse position on the canvas 
mouse.x = event.clientX - rect.left;
mouse.y = event.clientY - rect.top;
});

// class constructors

class Sprite {
  constructor(x, y, radius, color, vx = 0, vy = 0, location = [], counter = 0) {
    this.x = x;
    this.y = y;
    this.startingX = x;
    this.startingY = y;
    this.radius = radius;
    this.color = color;
    this.velocity = {x: vx, y: vy};
    this.location = location;
    this.counter = counter;
    this.shotTimer = 100; // a default value
    this.shields = {strength: 0, hit: false, upCount: 0};
    this.hitPoints = 6; // a default value
    this.radians = 0
  };

  draw(){
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, Math.PI*2, false);
    ctx.fill();
    ctx.closePath();
  };

  playerUpdate() {

    if (this.x >= 0 && this.x <= 100) {
      this.y = this.x + 270;
    }

    if (this.x >= 580 && this.x <= canvas.width) {
      this.y = -(this.x - 580) + 370;
    }

    if (this.x >= 101 && this.x <= 579) {this.y == canvas.height - 50;}
    
    this.startingX += (mouse.x - this.startingX) *0.10;
    this.x = this.startingX;

    this.draw();
  }

  playerShieldsUpdate() {
    this.x = playerSprite.x;
    this.y = playerSprite.y;
    if (this.shields.hit){
      this.color = "rgba(0, 194, 0, 0.5)"
      this.shields.upCount -= 1;
      if (this.shields.strength <= 3){ this.color = "rgba(95, 16, 16, 0.73)"}
      if (this.shields.upCount <= 0){
        this.shields.hit = false;
      }
    } 
    else{
      this.color = "rgba(0,0,0,0)"
    }

   this.draw();
  }

  ammoUpdate() {
    let spliceThis = false;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    if (this.y <= 0){
      spliceThis = true;
    }
    this.draw();

    for (let i = 0; i < enemySprites.length; i++) {
      if (getDistance(this.x, this.y, enemySprites[i].x, enemySprites[i].y) - enemySprites[i].radius < 0){
        spliceThis = true;
        if (enemyShieldsStatus){
          kaboom2(this.x, this.y);
          enemySprites[i].y += -10;
          enemySprites[i].x += Math.floor((Math.random()*10));
        }
        if (!enemyShieldsStatus){
          kaboom1(this.x, this.y);
          enemySprites[i].hitPoints += -1
          if (enemySprites[i].hitPoints <= 0){
            initExplosion(enemySprites[i].x, enemySprites[i].y);
            enemySprites.splice(i, 1);
          }
        }
      }
    }

    for (let m = 0; m < enemySprites4.length; m++) {
      if (getDistance(this.x, this.y, enemySprites4[m].x, enemySprites4[m].y) - enemySprites4[m].radius < 0){
        spliceThis = true;
        if (enemyShieldsStatus2){
          kaboom2(this.x, this.y);
          enemySprites4[m].y += -10;
          enemySprites4[m].x += Math.floor((Math.random()*10));
          
        }
        if (!enemyShieldsStatus2){
          kaboom1(this.x, this.y);
          enemySprites4[m].hitPoints += -1
          if (enemySprites4[m].hitPoints <= 0){
            initExplosion(enemySprites4[m].x, enemySprites4[m].y);
            enemySprites4.splice(m, 1);
          }
        }
      }
    }

    for (let j = 0; j < enemyAmmo.length; j++) {
      if (getDistance(this.x, this.y, enemyAmmo[j].x, enemyAmmo[j].y) - enemyAmmo[j].radius*1.5 < 0){
        kaboom1(this.x, this.y);
        enemyAmmo.splice(j, 1);
        spliceThis = true;
      }
    }

    for (let k = 0; k < enemySprites2.length; k++ ){
      if (getDistance(this.x, this.y, enemySprites2[k].x, enemySprites2[k].y)- enemySprites2[k].radius*1.5 < 0){
        kaboom1(this.x, this.y);
        enemySprites2[k].hitPoints += -1;
        if (enemySprites2[k].hitPoints <= 0){
          initSmallExplosion(enemySprites2[k].x, enemySprites2[k].y);
          enemySprites2.splice(k, 1);
        }
        spliceThis = true;
      }
    }

    for (let l = 0; l < enemySprites3.length; l++) {
      if (getDistance(this.x, this.y, enemySprites3[l].x, enemySprites3[l].y)- enemySprites3[l].radius*1.5 < 0){
        kaboom1(this.x, this.y);
        enemySprites3[l].hitPoints += -1;
        if (enemySprites3[l].hitPoints <= 0){
          initSmallExplosion(enemySprites3[l].x, enemySprites3[l].y);
          enemySprites3.splice(l, 1);
        }
        spliceThis = true;
      }
    }

    for (let wpu = 0; wpu < weaponPowerUp.length; wpu++) {
      if (getDistance(this.x, this.y, weaponPowerUp[wpu].x, weaponPowerUp[wpu].y)-weaponPowerUp[wpu].radius <0){
        initSmallExplosion(this.x, this.y);
        weaponPowerUp.splice(wpu, 1);
        if (ammoType < 4) {
          ammoType += 1;
        }
        spliceThis = true;
      }
    }

    for (let spu = 0; spu < shieldPowerUp.length; spu++) {
      if (getDistance(this.x, this.y, shieldPowerUp[spu].x, shieldPowerUp[spu].y)-shieldPowerUp[spu].radius <0){
        initSmallExplosion(this.x, this.y);
        shieldPowerUp.splice(spu, 1);
        playerShields.shields.strength += 11;
        shieldHit();
        spliceThis = true;
      }
    }

    if (finalBossSprite) {
      if (getDistance(this.x, this.y, finalBossSprite.x, finalBossSprite.y)-50 <0){
        if (miniBosses.length >= 1 || littleEnemySprites.length >= 1){
          spliceThis = true;
          kaboom2(this.x, this.y);
        } else {
          spliceThis = true;
          kaboom1(this.x, this.y);
          finalBossSprite.hitPoints += -1;
          if (finalBossSprite.hitPoints <= 0){
            finalBossSprite = false;
            initExplosion(this.x, this.y);
            initExplosion(this.x+20, this.y+20);
            initExplosion(this.x-20, this.y-20);
            initExplosion(this.x-20, this.y+20);
            initExplosion(this.x+20, this.y-20);
          }
        }
        
      }
      for (let mb = 0; mb < miniBosses.length; mb++) {
        if (getDistance(this.x, this.y, miniBosses[mb].x, miniBosses[mb].y)-miniBosses[mb].radius <0){
          spliceThis = true;
          kaboom1(this.x, this.y);
          miniBosses[mb].hitPoints += -1;
          if (miniBosses[mb].hitPoints <= 0){
            initExplosion(miniBosses[mb].x, miniBosses[mb].y);
            initLittleEnemySprites(finalBossSprite.x, finalBossSprite.y);
            miniBosses.splice(mb, 1);
          }
        }
      }
      for (let les = 0; les < littleEnemySprites.length; les++) {
        if (getDistance(this.x, this.y, littleEnemySprites[les].x, littleEnemySprites[les].y)-littleEnemySprites[les].radius <0){
          spliceThis = true;
          initSmallExplosion(littleEnemySprites[les].x, littleEnemySprites[les].y);
          littleEnemySprites.splice(les, 1);
        }        
      }
    }
    if (spliceThis){playerAmmo.splice(this, 1);};
  }

  enemyUpdateRed() {
    if (this.location.x > this.x){
      this.velocity.x = redAlienXSpeed;
    } else {this.velocity.x = -redAlienXSpeed};

    if (this.location.y > this.y) {
      this.velocity.y = redAlienYSpeed;
    } else {this.velocity.y = -redAlienYSpeed};

    if (this.x - this.location.x >= -5 && this.x - this.location.x <= 5) {
      this.velocity.x = 0;
    };

    if (this.y - this.location.y >= -5 && this.y - this.location.y <= 5) {
      this.velocity.y = 0;
    };

    this.y += this.velocity.y;
    this.x += this.velocity.x;
    this.draw();

    if (this.velocity.x == 0 && this.velocity.y == 0 ){
      this.location.x = Math.floor(Math.random()* (canvas.width-160) +30);
      this.location.y = Math.floor(Math.random()* (canvas.height-200) +30);
    };

    this.counter += 1;
    if (this.counter >= this.shotTimer){
      initEnemyAmmo(this.x, this.y, 3);
      this.counter = Math.floor(Math.random()*60);
    };

  }

  enemyUpdate() {
    
    if (this.location.x > this.x){
      this.velocity.x = greenAlienXSpeed;
    } else {this.velocity.x = -greenAlienXSpeed};

    if (this.location.y > this.y) {
      this.velocity.y = greenAlienYSpeed;
    } else {this.velocity.y = -greenAlienYSpeed};

    if (this.x - this.location.x >= -5 && this.x - this.location.x <= 5) {
      this.velocity.x = 0;
    };

    if (this.y - this.location.y >= -5 && this.y - this.location.y <= 5) {
      this.velocity.y = 0;
    };

    this.y += this.velocity.y;
    this.x += this.velocity.x;
    this.draw();

    if (this.velocity.x == 0 && this.velocity.y == 0 ){
      this.location.x = Math.floor(Math.random()* (canvas.width-160) +30);
      this.location.y = Math.floor(Math.random()* (canvas.height-200) +30);
    };

    this.counter += 1;
    if (this.counter >= this.shotTimer){
      initEnemyAmmo(this.x, this.y, 2);
      this.counter = Math.floor(Math.random()*60);
    };
  }

  enemyAmmoUpdate() {
    switch (this.counter){
      case 0, 1, 2, 3, 4, 5: 
        this.color = "red"
        break;
      
      case 6, 7, 8, 9, 10:
        this.color ="darkorange"
        break;
      
      case 11:
        this.counter = 0;
        break;
    }
    this.counter += 1;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.draw();
  }

  enemyShieldsUpdate(){
    this.draw();
  }

  enemy2Update() {
    this.x += this.velocity.x;
    if (this.x <= -14){
      this.x = canvas.width + 14;
    }
    this.draw();
  }

  enemy3Update() {
    switch (this.counter){
      case 0, 1, 2, 3, 4, 5: 
        this.color = "green"
        break;
      
      case 6, 7, 8, 9, 10:
        this.color ="orange"
        break;
      
      case 11:
        this.counter = 0;
        break;
    }
    this.counter += 1;
    this.radians += this.velocity.y;
    this.y = this.startingY + Math.cos(this.radians)*50;
    this.x = this.startingX + Math.sin(this.radians)*50;
    this.draw(); 
    this.startingX += 1;
    if (this.startingX > canvas.width + 100){
      this.startingX = -20;
    }
  }

  finalBossUpdate() {
    this.x += this.velocity.x;
    if (this.y < canvas.height/3){
      this.y += this.velocity.y
    }
    if (this.x >= 540){this.velocity.x = -this.velocity.x};
    if (this.x <= 100){this.velocity.x = -this.velocity.x};
    this.draw();
    this.counter += 1;
    if (this.counter >= 200){
      initEnemyAmmo(this.x, this.y-20, 4, 0);
      initEnemyAmmo(this.x, this.y-20, 4, -2);
      initEnemyAmmo(this.x, this.y-20, 4, 2);
      this.counter = 0;
    }
  }

  miniBossUpdate() {
    this.radians += this.velocity.y;
    this.y = finalBossSprite.y + Math.cos(this.radians)*100;
    this.x = finalBossSprite.x + Math.sin(this.radians)*100;
    this.draw();
    this.counter += 1;
    if (this.counter >= this.shotTimer){
      initEnemyAmmo(this.x, this.y, 2)
      this.counter = 0;
    }
  }

  weaponPowerUpUpdate() {
    this.radians += this.velocity.y;
    this.x = this.startingX + Math.sin(this.radians)*50;
    this.draw(); 
    this.startingX += 1;
    if (this.startingX > canvas.width + 20){
      this.velocity.y = 0;
    }
  }

  kaboom1Update() {
    this.radius += 3;
    if (this.radius > 18) {
      this.color = "red";
    }
    this.draw();
  }

  explosionUpdate(){
    this.radius += 1;
    if (this.radius > 10) {
      this.color = "rgba(179, 153, 9, 0.6)"
    }
    if (this.radius > 22) {
      this.color = "rgba(185, 15, 15, 0.6)";
    }
    this.draw();
  }

  starFieldUpdate() {
    this.y += this.velocity.y;
    if (this.y > canvas.height + 5){
      this.y = -5;
      this.x = Math.random()* canvas.width;
    }
    this.draw();
  }
};

// functions with related variables

function shieldHit() {
  playerShields.shields.hit = true;
  playerShields.shields.upCount = 60;
  playerShields.shields.strength -= 1;
  if (playerShields.shields.strength <= 3) {
    playerShields.shields.upCount = 20;
  }
};

let shipHitPoints;
let playerSprite;
function initPlayer(){
  playerSprite = new Sprite(canvas.width/2, canvas.height-50, 15, "rgba(0, 0, 0, 0)");
  shipHitPoints = 15;
  playerSprite.draw();
  initPlayerShields();
};

let playerShields;
function initPlayerShields(){
  playerShields = new Sprite(canvas.width/2, canvas.height-45, 28, "rgba(0, 0, 0, 0)", 0, 0, [], 10);
  playerShields.shields.strength = 8;
};

let enemyShields = []
let enemyShields2 =[];
let enemyShieldsStatus = false;
let enemyShieldsStatus2 = false;
function initEnemyShields(){
  if (enemySprites.length > 0){
    enemyShieldsStatus = true;
  for (let i = 0; i < enemySprites.length; i++) {
    enemyShields.push(new Sprite(enemySprites[i].x, enemySprites[i].y, 30, "rgba(109, 17, 133, 0.5)"));
    }
  }
  
  if (enemySprites4.length > 0) {
    enemyShieldsStatus2 = true;
    for (let j = 0; j < enemySprites4.length; j++) {
      enemyShields2.push(new Sprite(enemySprites4[j].x, enemySprites4[j].y, 30, "rgba(20, 145, 15, 0.5)"));
    }
  }
};

let spawnWeaponPowerUp = false;
let weaponPowerUp = []
function initWeaponPowerUp() {
  weaponPowerUp.push(new Sprite(-15, canvas.height/2, 15, "green", 2, .05));
};

let spawnShieldPowerUp = false;
let shieldPowerUp = [];
function initShieldPowerUp() {
  shieldPowerUp.push(new Sprite(-15, canvas.height/4, 15, "purple", 2, .05));
};

let ammoType = 1;
let playerAmmo = [];
function initAmmo(x, y, vx, vy, type = 1){
  switch (type){
    case 1:
      y += -15;
      if (playerAmmo.length < 3){
        playerAmmo.push(new Sprite(x, y, 3, "rgb(8, 253, 0)", vx, vy+1));
      }
    break;
    case 2:
      y += -15;
      if (playerAmmo.length < 6 ){
        x += -15;
        playerAmmo.push(new Sprite(x, y, 3, "rgb(200, 222, 255)", vx, vy));
        x += 30;
        playerAmmo.push(new Sprite(x, y, 3, "rgb(200, 222, 252)", vx, vy));
      }
    break;
    case 3:
      y += -15;
      if (playerAmmo.length < 9){
        playerAmmo.push(new Sprite(x, y, 3, "rgb(211, 35, 23)", vx, vy));
        x += -15;
        playerAmmo.push(new Sprite(x, y, 3, "rgb(200, 255, 252)", vx, vy));
        x += 30;
        playerAmmo.push(new Sprite(x, y, 3, "rgb(200, 255, 252)", vx, vy));
      }
    break;
    case 4:
      y += -15;
      x1 = x;
      if (playerAmmo.length < 9){
        playerAmmo.push(new Sprite(x, y, 3, "rgb(91, 245, 124)", vx, vy-2));
        x += -15;
        playerAmmo.push(new Sprite(x, y, 3, "rgb(91, 245, 124)", vx-1, vy-2));
        x += 30;
        playerAmmo.push(new Sprite(x, y, 3, "rgb(91, 245, 124)", vx+1, vy-2));
      }
    break;
  }
};

let enemyAmmo = [];
function initEnemyAmmo(x, y, vy, vx = 0){
  enemyAmmo.push(new Sprite(x, y, 8, "darkorange", vx, vy,[], 1));
};

let greenAlienXSpeed = 1;
let greenAlienYSpeed = 1;
let redAlienXSpeed = 2;
let redAlienYSpeed = 2;
let enemySprites = [];
function initEnemySprites(howMany, hitPoints, shotTimer) {
  enemySprites = [];
  greenAlienXSpeed = 1;
  greenAlienYSpeed = 1;
  redAlienXSpeed = 2;
  redAlienYSpeed = 2;
  for (let i = 0; i < howMany; i++) {
    x1 = Math.floor(Math.random()*canvas.width);
    y1 = -15;
    x2 = Math.floor(Math.random()*canvas.width);
    y2 = Math.floor(Math.random()*((canvas.height - 60)))
    let location = {x: x2, y: y2};
    let timer = Math.floor(Math.random()*shotTimer);
    enemySprites.push(new Sprite(x1, y1, 16, "rgba(0,0,0,0)", 1, 1, location, timer));
    enemySprites[i].draw();
    enemySprites[i].hitPoints = hitPoints;
    enemySprites[i].shotTimer = shotTimer;
  }
  initEnemyShields();
};

let littleEnemySprites = [];
function initLittleEnemySprites(x, y){
  greenAlienXSpeed = 3;
  greenAlienYSpeed = 3;
  for (let i = 0; i < 8; i++) {
    x2 = Math.floor(Math.random()*canvas.width);
    y2 = Math.floor(Math.random()*((canvas.height - 60)))
    let location = {x: x2, y: y2};
    littleEnemySprites.push(new Sprite(x, y, 10, "rgba(0,0,0,0)", greenAlienXSpeed, greenAlienYSpeed, location, 0));
    littleEnemySprites[i].shotTimer = 1000;
    littleEnemySprites[i].hitPoints = 1;
  }
}

let enemySprites2 = [];
function initEnemySprites2(howMany, hitPoints) {
  enemySprites2 = [];
    x = canvas.width + 300;
    y = 20;
  for (let i = 0; i < howMany; i++) {
    enemySprites2.push(new Sprite(x, y, 12, "orange", -2, 0));
    x += -60;
    y += 20;
    enemySprites2[i].draw();
    enemySprites2[i].hitPoints = hitPoints;
  }
};

let enemySprites3 = [];
function initEnemySprites3(howMany, hitPoints){
  x = -30;
  y = 100;
  for (let i = 0; i < howMany; i++) {
    enemySprites3.push(new Sprite(x, y, 12, "rgba(0,0,0,0)", 2, .05));
    enemySprites3[i].hitPoints = hitPoints;
    enemySprites3[i].draw();
    x += -130;
  }
};

let enemySprites4 = [];
function initEnemySprites4(howMany, hitPoints, shotTimer){
  enemySprites4 = [];
  for (let i = 0; i < howMany; i++) {
    x1 = Math.floor(Math.random()*canvas.width);
    y1 = -15;
    x2 = Math.floor(Math.random()*canvas.width);
    y2 = Math.floor(Math.random()*((canvas.height - 60)))
    let location = {x: x2, y: y2};
    let timer = Math.floor(Math.random()*shotTimer);
    enemySprites4.push(new Sprite(x1, y1, 16, "red", 0, 0, location, timer));
    enemySprites4[i].draw();
    enemySprites4[i].hitPoints = hitPoints;
    enemySprites4[i].shotTimer = shotTimer;
    ctx.drawImage(alien4, enemySprites4[i].x - 22, enemySprites4[i].y -22, 45, 45);
  }
  initEnemyShields();
};

let finalBossSprite;
let miniBosses = [];
function initFinalBoss() {
  finalBossSprite = new Sprite(canvas.width/2, -40, 65, "rgb(80, 0, 67)", 1, 1);
  finalBossSprite.hitPoints = 100;
  radians = Math.PI/2;
  shotTimer = 400;
  for (let i = 0; i < 4; i++) {
    miniBosses.push(new Sprite(canvas.width/2, -40, 16, "black", 2, .025));
    miniBosses[i].radians = radians;
    miniBosses[i].shotTimer = shotTimer;
    miniBosses[i].hitPoints = 20;
    radians += Math.PI/2;
    shotTimer += 50;
  }
}

let boomSprite = [];
function kaboom1(x, y) {
  x += -5;
  boomSprite.push(new Sprite(x, y, 5, "orange"));
  x += 10;
  boomSprite.push(new Sprite(x, y, 5, "orange"));
  x += -5;
  y += 5;
  boomSprite.push(new Sprite(x, y, 5, "orange"));
  for (let i = 0; i < boomSprite.length; i++) {
    boomSprite[i].draw();
  };
};

let smallBoomSprite = [];
function kaboom2(x, y) {
  smallBoomSprite.push(new Sprite(x, y, 5, "lightblue"));
};

let explosionSprite = [];
function initExplosion(x, y) {
  let startingX = x;
  let startingY = y;
  let explosionRadius = 12;
  for (let i = 0; i < 6; i++) {
    x += 10;
    explosionSprite.push(new Sprite(x, y, explosionRadius, "rgba(185, 15, 15, 0.6)"))
    explosionRadius += -2;
  }
  explosionRadius = 12;
  x = startingX;
  for (let j = 0; j < 6; j++) {
    x += -10;
    explosionSprite.push(new Sprite(x, y, explosionRadius, "rgba(185, 15, 15, 0.6)"))
    explosionRadius += -2;
  }
  explosionRadius = 12;
  x = startingX;
  for (let k = 0; k < 6; k++) {
    y += 10;
    explosionSprite.push(new Sprite(x, y, explosionRadius, "rgba(185, 15, 15, 0.6)"))
    explosionRadius += -2;
  }
  y = startingY;
  explosionRadius = 12;
  for (let l = 0; l < 6; l++) {
    y += -10;
    explosionSprite.push(new Sprite(x, y, explosionRadius, "rgba(185, 15, 15, 0.6)"))
    explosionRadius += -2;
  }
  initSmallExplosion(startingX, startingY);
};

function initSmallExplosion(x, y){
  let startingX = x;
  let startingY = y;
  explosionRadius = 16;
  for (let m = 0; m < 3; m++) {
    y += 10
    x += 10
    explosionSprite.push(new Sprite(x, y, explosionRadius, "rgba(45, 2, 58, 0.8)"));
    explosionRadius += -4;
  }
  explosionRadius = 16;
  y = startingY;
  x = startingX;
  for (let n = 0; n < 3; n++) {
    y += 10
    x += -10
    explosionSprite.push(new Sprite(x, y, explosionRadius, "rgba(45, 2, 58, 0.8)"));
    explosionRadius += -4;
  }
  explosionRadius = 16;
  y = startingY;
  x = startingX;
  for (let p = 0; p < 3; p++) {
    y += -10
    x += 10
    explosionSprite.push(new Sprite(x, y, explosionRadius, "rgba(45, 2, 58, 0.8)"));
    explosionRadius += -4;
  }
  explosionRadius = 16;
  y = startingY;
  x = startingX;
  for (let q = 0; q < 3; q++) {
    y += -10
    x += -10
    explosionSprite.push(new Sprite(x, y, explosionRadius, "rgba(45, 2, 58, 0.8)"));
    explosionRadius += -4;
  }
};

let starField = [];
function initStarField() {
  let x;
  let y;
  let vy;
  let radius;
  let color = ["rgb(81, 87, 0)", "rgb(65, 31, 0)", "rgb(45, 49, 0)"];
  let thisColor;
  for (let i = 0; i < 60; i++) {
    x = Math.random()* canvas.width;
    y = Math.random()* canvas.height;
    vy = Math.random()* 1.4;
    radius = Math.random()*3;
    thisColor = color[Math.floor(Math.random()*3)];
    starField.push(new Sprite(x, y, radius, thisColor, 0, vy ));
    starField[i].draw();
  }
};

function getDistance(x1, y1, x2, y2) {
  let xDistance = x2 - x1;
  let yDistance = y2 - y1;
  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
};

// animation functions

function animatePlayer() {
  playerSprite.playerUpdate();
    if (playerSprite.x <= canvas.width && playerSprite.x >= canvas.width - 100){
      ctx.drawImage(playerShipLeft, playerSprite.x-24, playerSprite.y-24, 50, 50)
    }
    if (playerSprite.x >= 0 && playerSprite.x <= 100){
      ctx.drawImage(playerShipRight, playerSprite.x-24, playerSprite.y-24, 50, 50)
    }
    if (playerSprite.x > 100 && playerSprite.x < canvas.width -100){
      ctx.drawImage(playerShip, playerSprite.x-24, playerSprite.y-24, 50, 50);
    }
    playerShields.playerShieldsUpdate();
};

function animateEnemies(){
  
  if (enemySprites2.length > 0){
    for (let l = 0; l < enemySprites2.length; l++) {
      enemySprites2[l].enemy2Update();
      ctx.drawImage(alien2, enemySprites2[l].x - 25, enemySprites2[l].y -25, 50, 50);
    }
  }

  if (enemySprites.length > 0){
    for (let j = 0; j < enemySprites.length; j++) {
      enemySprites[j].enemyUpdate();
      ctx.drawImage(alien1, enemySprites[j].x - 23, enemySprites[j].y -23, 45, 45);
    }
  }

  if (enemySprites3.length > 0){
    for (let e3 = 0; e3 < enemySprites3.length; e3++) {
      enemySprites3[e3].enemy3Update();
      ctx.drawImage(alien3, enemySprites3[e3].x - 35, enemySprites3[e3].y -32, 68, 68);
    }
  }

  if (enemySprites4.length > 0){
    for (let k = 0; k < enemySprites4.length; k++) {
      enemySprites4[k].enemyUpdateRed();
      ctx.drawImage(alien4, enemySprites4[k].x - 23, enemySprites4[k].y -23, 45, 45);
    }
  }
  animateEnemyAmmo();
};

function animateExplosions(){
  if (boomSprite.length > 0 ){
    for (let m = 0; m < boomSprite.length; m++) {
      boomSprite[m].kaboom1Update();
      if (boomSprite[m].radius >= 26) {
        boomSprite.splice(m, 1);
      }
    }
  }
  
  if (smallBoomSprite.length > 0){
    for (let sb = 0; sb < smallBoomSprite.length; sb++) {
      smallBoomSprite[sb].kaboom1Update();
      if (smallBoomSprite[sb].radius >= 20) {
        smallBoomSprite.splice(sb, 1);
      }
    }
  }
  
  if (explosionSprite.length > 0 ){
    for (let exp = 0; exp < explosionSprite.length; exp++){
      explosionSprite[exp].explosionUpdate();
      if (explosionSprite[exp].radius >= 24){
        explosionSprite.splice(exp, 1);
      }
    }
  }
};

let shipExplosionTimer = 0; 
function animateEnemyAmmo() {
  for (let k = 0; k < enemyAmmo.length; k++) {
    spliceThis = false;
    enemyAmmo[k].enemyAmmoUpdate();
    if ((getDistance(enemyAmmo[k].x, enemyAmmo[k].y, playerShields.x, playerShields.y) - playerShields.radius *1.5 < 0) && (playerShields.shields.strength > 0)){
      shieldHit();
      kaboom2(enemyAmmo[k].x, enemyAmmo[k].y);
      spliceThis = true;
    }

    if ((getDistance(enemyAmmo[k].x, enemyAmmo[k].y, playerSprite.x, playerSprite.y)- playerSprite.radius < 0)){
      kaboom2(enemyAmmo[k].x, enemyAmmo[k].y);
      spliceThis = true;
      playerSprite.hitPoints += -1;
      if (playerSprite.hitPoints == 0){ playerDead();};
    }

    if (enemyAmmo[k].y >= canvas.height){
      kaboom1(enemyAmmo[k].x, enemyAmmo[k].y);
      spliceThis = true;
      shipHitPoints += -1;
      if (shipHitPoints <= 0 ){
        playerDead();
      }
    };

    if (spliceThis){
      enemyAmmo.splice(k, 1);
    }
  }
};

function animateWeaponUpgrade(){
  for (let wpu = 0; wpu < weaponPowerUp.length; wpu++) {
    weaponPowerUp[wpu].weaponPowerUpUpdate();
    ctx.drawImage(weaponPowerUpImage, weaponPowerUp[wpu].x-25, weaponPowerUp[wpu].y-25, 55, 55);
    weaponPowerUp[wpu].counter +=1;
    switch (weaponPowerUp[wpu].counter){
      case 1, 2, 3, 4, 5:
        weaponPowerUp[wpu].color = "rgb(168, 0, 28)";
      break;
      case 6, 7, 8, 9, 10:
        weaponPowerUp[wpu].color = "rgb(192, 196, 0)";
      break;
      case 11:
        weaponPowerUp[wpu].counter = 0;
      break;
    }
  }
};

function animateShieldUgrade() {
  for (let spu = 0; spu < shieldPowerUp.length; spu++) {
    shieldPowerUp[spu].weaponPowerUpUpdate();
    ctx.drawImage(shieldPowerUpImage, shieldPowerUp[spu].x-25, shieldPowerUp[spu].y-25, 55, 55);
    shieldPowerUp[spu].counter +=1;
    switch (shieldPowerUp[spu].counter){
      case 1, 2, 3, 4, 5:
        shieldPowerUp[spu].color = "rgb(21, 32, 179)";
        break;
      case 6, 7, 8, 9, 10:
        shieldPowerUp[spu].color = "rgb(9, 255, 0)";
        break;
      case 11:
        shieldPowerUp[spu].counter = 0;
        break;
    }
  }
};

let checkColor = false;
function animateFinalBoss(){
  finalBossSprite.finalBossUpdate();
  ctx.drawImage(alien1, finalBossSprite.x-60, finalBossSprite.y-60, 120, 120)
  for (let i = 0; i < miniBosses.length; i++) {
    miniBosses[i].miniBossUpdate();
    ctx.drawImage(alien1, miniBosses[i].x-23, miniBosses[i].y-23, 45, 45);
  }

  for (let j = 0; j < littleEnemySprites.length; j++) {
    littleEnemySprites[j].enemyUpdate();
    ctx.drawImage(alien1, littleEnemySprites[j].x-10, littleEnemySprites[j].y-10, 30, 30);
  }

  if (!checkColor){
    if (miniBosses.length == 0 && littleEnemySprites.length == 0) {
      finalBossSprite.color = 'rgba(0,0,0,0)';
      finalBossSprite.velocity.x *= 3;
      finalBossSprite.shotTimer = 200;
      checkColor = true;
    }
  }
};

// Main animation function

function animate(){   //                        <-- MAIN animation function
  animRe = requestAnimationFrame(animate);
  ctx.fillStyle = "rgba(3,0,30,0.8)";
  ctx.fillRect(0, 0,canvas.width, canvas.height)

  for (let n = 0; n < starField.length; n++) {
    starField[n].starFieldUpdate();
  }
  
  if (gameRunning){
    ctx.drawImage(background, -10, canvas.height - 80, canvas.width+20, 200);
  
    if (playerSprite.hitPoints >= 1){
      animatePlayer();
      for (let i = 0; i < playerAmmo.length; i++) {
      playerAmmo[i].ammoUpdate();
    }}  

    if (enemyShieldsStatus){
      for (let es = 0; es < enemySprites.length; es++) {
        enemyShields[es].x = enemySprites[es].x;
        enemyShields[es].y = enemySprites[es].y;
        enemyShields[es].enemyShieldsUpdate();
      }
      if (enemySprites2.length <= 0 ) {
        enemyShieldsStatus = false;
        greenAlienXSpeed = 2;
        greenAlienYSpeed = 2;
      }
    }

    if (enemyShieldsStatus2){
      for (let es2 = 0; es2 < enemySprites4.length; es2++) {
        enemyShields2[es2].x = enemySprites4[es2].x;
        enemyShields2[es2].y = enemySprites4[es2].y;
        enemyShields2[es2].enemyShieldsUpdate();
      }
      if (enemySprites3.length <= 0) {
        enemyShieldsStatus2 = false;
        redAlienXSpeed = 3;
        redAlienYSpeed = 3;
      }
    }

    switch (gameLevel){
      case 1:
        animateEnemies();
        if (enemySprites2.length <= 3 && !spawnWeaponPowerUp) {
          initWeaponPowerUp();
          spawnWeaponPowerUp = true;
        }
        if (isLevelCompleted()){
          nextLevel(2);
        }
        break;
      case 2: 
        animateEnemies();
        if (enemySprites3.length <= 3 && !spawnWeaponPowerUp) {
          initWeaponPowerUp();
          spawnWeaponPowerUp = true;
        }
        if (isLevelCompleted()){
          nextLevel(3);
        }
        break;
      case 3:
        animateEnemies();
        if (enemySprites2.length <= 0 && !spawnShieldPowerUp) {
          initShieldPowerUp();
          spawnShieldPowerUp = true;
        }
        if (enemySprites.length == 0 && enemySprites2.length == 0 && !spawnSecondWave) {
          initEnemySprites4(2, 10, 160);
          initEnemySprites3(4, 4);
          spawnSecondWave = true;
        }
        if (isLevelCompleted()){
          nextLevel(4);
        }
        break;
      case 4:
        animateEnemies();
        if (enemySprites3.length == 3 && !spawnShieldPowerUp) {
          initShieldPowerUp();
          spawnShieldPowerUp = true;
        }
        if (enemySprites2.length == 0 && !spawnSecondWave) {
          initEnemySprites3(4, 6,);
          initEnemySprites4(2, 10, 140);
          spawnSecondWave = true;
        }
        if (isLevelCompleted()){
          nextLevel(5);
        }
        break;
      case 5:
        animateEnemies();
        if (enemySprites2.length <= 6 && !spawnWeaponPowerUp) {
          initWeaponPowerUp();
          spawnWeaponPowerUp = true;
        }
        if (enemySprites2.length <= 4 && !spawnShieldPowerUp){
          initShieldPowerUp();
          spawnShieldPowerUp = true;
        }
        if (isLevelCompleted()){
          nextLevel(6);
        }
        break;
      case 6:
        if (finalBossSprite){
          animateEnemyAmmo();
          animateFinalBoss();
        }
        if (!finalBossSprite){
          nextLevel(1);
        }
        break;
      case 0:
        nextLevel(0);
        if (levelTimer == 299){
          gameRunning = false;
          levelTimer = 0;
          newGameBtm.style.display = 'block';
        }
      }
      animateExplosions();
      animateWeaponUpgrade();
      animateShieldUgrade();
    }
    updateScoreBox();
};

// new game, end game and next level functions

let gameLevel = 1;
levelTimer = 0;
function nextLevel(L){
  enemyAmmo = [];
  ctx.beginPath();
  ctx.fillStyle = 'rgba(42, 177, 30, 0.5)';
  ctx.fillRect(200, 100, 300, 200);
  ctx.font = "36px impact";
  ctx.fillStyle = "black";
  if (L == 0){
    ctx.fillText("Game Over", 270, 200);
    ctx.closePath();
  }else {
    ctx.fillText("Level Cleared", 250, 200);
    ctx.font = "20px Ariel";
    ctx.fillText("more enemies ahead!", 265, 225);
    ctx.closePath();
  }
  levelTimer += 1;
  if (levelTimer >= 300){
    spawnWeaponPowerUp = false;
    spawnShieldPowerUp = false;
    newGame(L);
    levelTimer = 0
  }
};

let spawnSecondWave = false;
let gameRunning = false;
function newGame(level = 1){
  gameRunning = true;
  newGameBtm.style.display = 'none';
  gameLevel = level;
  spawnSecondWave = false;
  clearAllEnemyArrays();
  switch (level){
    case 1:
      ammoType = 1;
      playerAmmo = [];
      spawnWeaponPowerUp = false;
      spawnShieldPowerUp = false;
      clearAllEnemyArrays();
      initPlayer();
      initEnemySprites(2, 8, 200);
      initEnemySprites2(6, 2);
      break;
    case 2:
      initPlayer();
      initEnemySprites4(2, 10, 160);
      initEnemySprites3(6, 4);
      break
    case 3:
      initPlayer();
      initEnemySprites(2, 8, 180);
      initEnemySprites2(4, 4);
      break;
    case 4: 
      initPlayer()
      initEnemySprites(3, 10, 180);
      initEnemySprites2(8, 6);
      break;
    case 5:
      initPlayer();
      initEnemySprites(6, 10, 250);
      initEnemySprites2(12, 6);
      break;
    case 6:
      checkColor = false;
      initPlayer();
      initFinalBoss();
      break;
    case 0:
      clearAllEnemyArrays();
    break;
  }
};

function isLevelCompleted(){
  if (enemySprites.length == 0 && enemySprites2.length == 0 && enemySprites3.length == 0 && enemySprites4.length == 0){
    shieldPowerUp = [];
    weaponPowerUp = [];
    return true;
  }
};

function playerDead(){
  initExplosion(playerSprite.x, playerSprite.y);
  x = 10;
  y = canvas.height - 25;
  for (let i = 0; i < 10; i++) {
    initSmallExplosion(x, y);
    explosionSprite[i].explosionUpdate();
    x += 80;
  }
  playerSprite.hitPoints = 0;
  gameLevel = 0;
  enemyShieldsStatus = false;
  enemyShieldsStatus2 = false;
};

function clearAllEnemyArrays(){
  enemySprites = [];
  enemySprites2 = [];
  enemySprites3 = [];
  enemySprites4 = [];
  enemyShieldsStatus = false;
  enemyShieldsStatus2 = false;
  enemyAmmo = [];
  finalBossSprite = false;
  miniBosses = [];
  littleEnemySprites = [];
  shieldPowerUp = [];
  weaponPowerUp = [];
};

// run when parsed
initStarField();
animate();
