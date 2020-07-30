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
let hitPlayerEnemy, hitBulletEnemy;
let x1, y1, x2, y2, x3, y3;
let bullet, moveBullet, gameTimer;

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
  player = new Player();

  // enemy setup
  enemy = [];
  enemyImage = loadImage(
    "https://cdn.glitch.com/9bac5ca1-9183-4706-b233-c51d36a29982%2Fbutch.png?v=1596082687501"
  );
  for (var i = 0; i < 2; i++) {
    enemy[i] = new Enemy();
  }

  bullet = [];
  gameTimer = 0;
}

function draw() {
  background(95);
  healthCooldown++;
  player.showSelf();
  checkKeys();

  gameTimer++;
  if (gameTimer % 150 == 0) {
    enemy.push(new Enemy());
  }
  
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
  if (hitPlayerEnemy && playerHealth > 0) {
    playerHealth--;
    healthCooldown = 0;
  }

  // check bullets
  for (var i = 0; i < bullet.length; i++) {
    bullet[i].showSelf("up");
    bullet[i].moveSelf("up");
    //bullet[i].removeSelf();
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
    x1 = playerX + 25;
    y1 = playerY + 5;
    x2 = playerX + 45;
    y2 = playerY + 5;
    x3 = playerX + 35;
    y3 = playerY - 15;
    this.change = 0;
    this.x = x1 + 10;
    this.y = y1 - 5;
  }

  moveSelf(direction) {
    this.change -= 5;
  }

  showSelf(direction) {
    fill("BLUE");
    ellipse(x1 + 10, y1 - 5 + this.change, 10);
    // triangle(x1, y1 + this.change, x2, y2 + this.change, x3, y3 + this.change);
  }

  removeSelf() {
    for (var i = 0; i < bullet.length; i++) {
      if (
        bullet[i].x < 0 ||
        bullet[i].x > width ||
        bullet[i].y < 0 ||
        bullet[i].y > height
      ) {
        bullet.pop();
        this.change = 0;
      }
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
    } else if (dx == -35) {
      enemy.pop();
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
  if (keyCode === SHIFT) {
    bullet.push(new Bullet());
    enemy.pop();
  }
}
