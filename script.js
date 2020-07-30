/* global createCanvas, colorMode, HSB, background, loadImage
   collideCircleCircle, triangle, key, keyIsPressed
   ellipse, width, height, random, image, rect, noStroke, fill
   keyCode, keyIsDown, UP_ARROW, DOWN_ARROW, RIGHT_ARROW, LEFT_ARROW, SHIFT */

let playerImage,
  player,
  playerX,
  playerY,
  playerSpeed,
  playerHealth,
  healthCooldown;
let enemyImage, enemy, enemyX, enemyY, enemySpeed;
let hitPlayerEnemy;
let bullet;

function setup() {
  // canvas and color settings
  createCanvas(600, 600);
  colorMode(HSB, 360, 100, 100);
  background(95);

  // player setup
  playerImage = loadImage(
    "https://cdn.glitch.com/9bac5ca1-9183-4706-b233-c51d36a29982%2Fkirby.png?v=1595787366725"
  );
  playerX = width / 2;
  playerY = height / 2;
  playerSpeed = 3;
  playerHealth = 70;
  healthCooldown = 0;
  // playerDirection = "up";
  player = new Player();

  // enemy setup
  enemy = [];
  enemyImage = loadImage(
    "https://cdn.glitch.com/9bac5ca1-9183-4706-b233-c51d36a29982%2Fbutch.png?v=1596082687501"
  );
  for (var i = 0; i < 2; i++) {
    enemy[i] = new Enemy();
  }

  bullet = new Bullet();
}

function draw() {
  background(95);
  healthCooldown++;
  player.showSelf();
  checkKeys();

  bullet.showSelf();

  for (var i = 0; i < enemy.length; i++) {
    enemy[i].showSelf();
    enemy[i].moveSelf(player.getLocation());
    hitPlayerEnemy = collideCircleCircle(
      playerX,
      playerY,
      35,
      enemy[i].x,
      enemy[i].y,
      10
    );
  }

  // check collision and health
  player.updateHealth();
  if (hitPlayerEnemy && playerHealth > 0 && healthCooldown % 5 == 0) {
    playerHealth--;
    healthCooldown = 0;
  }
}

class Player {
  constructor() {
    this.size = 50;
  }

  moveSelf(direction) {
    if (direction == "up") {
      playerY -= playerSpeed;
    } else if (direction == "down") {
      playerY += playerSpeed;
    }

    if (direction == "right") {
      playerX += playerSpeed;
    } else if (direction == "left") {
      playerX -= playerSpeed;
    }
  }

  updateHealth() {
    noStroke();
    fill("RED");
    rect(playerX, playerY - 10, 70, 10);
    fill("GREEN");
    rect(playerX, playerY - 10, playerHealth, 10);
  }

  showSelf() {
    ellipse(playerX + 35, playerY + 35, 40);
    image(playerImage, playerX, playerY, 70, 70);
  }

  getLocation() {
    var playerLocation = [playerX + 35, playerY + 35];
    return playerLocation;
  }
}

class Bullet {
  constructor() {
    this.xChange = 5;
  }
  
  moveSelf(direction) {
    var change = 3;
    if (direction == "up") {
      triangle(
        playerX + 25,
        playerY + 5,
        playerX + 45,
        playerY + 5,
        playerX + 35,
        playerY - 15
      );
    } else if (direction == "down") {
      triangle(
        playerX + 25,
        playerY + 65,
        playerX + 45,
        playerY + 65,
        playerX + 35,
        playerY + 85
      );
    } else if (direction == "right") {
      triangle(
        playerX - 5,
        playerY + 25,
        playerX - 5,
        playerY + 45,
        playerX - 25,
        playerY + 35
      );
    } else if (direction == "left"){
      triangle(
        playerX + 75,
        playerY + 25,
        playerX + 75,
        playerY + 45,
        playerX + 95,
        playerY + 35
      );
    }
  }

  showSelf(direction) {
    fill('BLUE');
    if (direction == "up") {
      triangle(
        playerX + 25,
        playerY + 5,
        playerX + 45,
        playerY + 5,
        playerX + 35,
        playerY - 15
      );
    } else if (direction == "down") {
      triangle(
        playerX + 25,
        playerY + 65,
        playerX + 45,
        playerY + 65,
        playerX + 35,
        playerY + 85
      );
    } else if (direction == "right") {
      triangle(
        playerX - 5,
        playerY + 25,
        playerX - 5,
        playerY + 45,
        playerX - 25,
        playerY + 35
      );
    } else if (direction == "left"){
      triangle(
        playerX + 75,
        playerY + 25,
        playerX + 75,
        playerY + 45,
        playerX + 95,
        playerY + 35
      );
    }
  }
}

class Enemy {
  constructor() {
    this.size = 34;
    this.x = random(width);
    this.y = 0;
  }

  moveSelf(playerLocation) {
    var dx = this.x - playerLocation[0];
    var dy = this.y - playerLocation[1];
    if (dx > -35) {
      this.x--;
    } else {
      this.x++;
    }
    if (dy > -40) {
      this.y--;
    } else {
      this.y++;
    }
  }

  showSelf() {
    fill("BLACK");
    ellipse(this.x + 35, this.y + 40, this.size);
    image(enemyImage, this.x, this.y, 60, 70);
  }
}

function checkKeys() {
  // checks keys to control player
  if (keyIsDown(UP_ARROW)) {
    player.moveSelf("up");
  } else if (keyIsDown(DOWN_ARROW)) {
    player.moveSelf("down");
  }
  if (keyIsDown(RIGHT_ARROW)) {
    player.moveSelf("right");
  } else if (keyIsDown(LEFT_ARROW)) {
    player.moveSelf("left");
  }
}

function keyPressed() {
  // if (keyCode === SHIFT) {
  //   bullet.showSelf("up");
  // }
}