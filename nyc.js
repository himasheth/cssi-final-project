let playerImage, enemyImage, bg, bulletImage, end, zombie;
let player, playerX, playerY;
let enemy = [],
  bullet = [];
let gameTimer = 0,
  score = 0;
let spawnRate = 1;
let restart, oneBullet;

function setup() {
  // canvas and color settings
  createCanvas(600, 600);
  angleMode(DEGREES);

  // image setup
  bg = loadImage(
    "https://cdn.glitch.com/0c2f14c2-a955-443f-9af4-4cf6636c6245%2Fimageedit_10_4981688642.png?v=1596174439975"
  );
  playerImage = loadImage(
    "https://cdn.glitch.com/0c2f14c2-a955-443f-9af4-4cf6636c6245%2Fimageedit_18_2464200036.png?v=1596175216995"
  );
  enemyImage = loadImage(
    "https://cdn.glitch.com/0c2f14c2-a955-443f-9af4-4cf6636c6245%2Fimageedit_16_2677801188.png?v=1596174666594"
  );
  bulletImage = loadImage(
    "https://cdn.glitch.com/ed6390d6-faba-4c19-b2c2-4194ddadbe00%2Fbullet.webp?v=1596167295549"
  );
  end = loadImage(
    "https://cdn.glitch.com/0c2f14c2-a955-443f-9af4-4cf6636c6245%2Fimageedit_23_3930215719.jpg?v=1596176274224"
  );
  zombie = loadImage(
    "https://cdn.glitch.com/7cf7bcda-0dff-42d0-89c4-8abe95c3426c%2Fimageedit_8_3466395450.png?v=1596170545020"
  );

  restart = createButton("RESTART");
  restart.hide();

  player = new Player(300, 300);
  playerX = 300;
  playerY = 300;
}

function draw() {
  background(bg);

  drawTarget();

  gameTimer++;

  let spawnTime = int(100 / spawnRate);
  if (gameTimer % spawnTime == 0) {
    let newEnemy = new Enemy();
    enemy.push(newEnemy);
    score++;
  }

  for (var i = 0; i < bullet.length; i++) {
    bullet[i].showSelf();
    bullet[i].moveSelf();
    if (bullet[i].removeSelf()) {
      bullet.splice(i, 1);
    } else if (bullet[i].checkHit()) {
      bullet.splice(i, 1);
    }
  }

  for (var i = 0; i < enemy.length; i++) {
    enemy[i].showSelf();
    enemy[i].moveSelf();
    if (enemy[i].removeSelf()) {
      enemy.splice(i, 1);
    }
  }

  spawnRate += 0.001;

  player.showSelf();
  player.moveSelf();
  if (player.checkHit()) {
    gameOver();
  }

  fill("WHITE");
  textSize(20);
  text(`SCORE: ${score}`, 20, 40);

  if (score == 40) {
    levelComplete();
  }
}

function mousePressed() {
  let mouseVector = getMouseVector();
  bullet[0] = new Bullet(mouseVector.x, mouseVector.y);
  bullet.push(bullet[0]);
}

class Player {
  constructor() {}

  showSelf() {
    push();
    fill("BLACK");
    ellipse(playerX, playerY, 40);
    image(playerImage, playerX - 45, playerY - 76, 100, 120);
    pop();
  }

  moveSelf() {
    if ((keyIsDown(65) || keyIsDown(LEFT_ARROW)) && playerX > 5) {
      playerX -= 2;
    }
    if ((keyIsDown(68) || keyIsDown(RIGHT_ARROW)) && playerX < width - 5) {
      playerX += 2;
    }
    if ((keyIsDown(87) || keyIsDown(UP_ARROW)) && playerY > 5) {
      playerY -= 2;
    }
    if ((keyIsDown(83) || keyIsDown(DOWN_ARROW)) && playerY < height - 5) {
      playerY += 2;
    }
  }

  checkHit() {
    for (var i = 0; i < enemy.length; i++) {
      var collision = collideCircleCircle(
        playerX,
        playerY,
        50,
        enemy[i].getX(),
        enemy[i].getY(),
        enemy[i].getR()
      );
      if (collision) {
        return true;
      }
    }
    return false;
  }
}

class Bullet {
  constructor(speedX, speedY) {
    this.x = playerX;
    this.y = playerY;
    this.speedX = 5 * speedX;
    this.speedY = 5 * speedY;
  }

  moveSelf() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedX *= 0.995;
    this.speedY *= 0.995;
  }

  showSelf() {
    push();
    fill("BLUE");
    ellipse(this.x, this.y, 10);
    image(bulletImage, this.x - 28, this.y - 28, 50, 50);
    pop();
  }

  removeSelf() {
    return (
      this.x > width + 10 ||
      this.x < -10 ||
      this.y > height + 10 ||
      this.y < -10
    );
  }

  checkHit() {
    for (var i = 0; i < enemy.length; i++) {
      var collision = collideCircleCircle(
        this.x,
        this.y,
        10,
        enemy[i].getX(),
        enemy[i].getY(),
        enemy[i].getR()
      );
      if (collision) {
        enemy.splice(i, 1);
        score += 1;
        return true;
      }
    }
    return false;
  }
}

class Enemy {
  constructor() {
    this.side = int(random(4));
    if (this.side == 0) {
      this.x = 0;
      this.y = int(random(height));
    } else if (this.side == 1) {
      this.x = int(random(width));
      this.y = 0;
    } else if (this.side == 2) {
      this.x = width;
      this.y = int(random(height));
    } else {
      this.x = int(random(width));
      this.y = height;
    }
    this.targetX = playerX;
    this.targetY = playerY;
    this.direction = createVector(this.targetX - this.x, this.targetY - this.y);
    this.direction.normalize();
    this.speedX = this.direction.x * spawnRate;
    this.speedY = this.direction.y * spawnRate;
    this.r = 12 * spawnRate;
    this.image = int(random(2));
  }

  moveSelf() {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  showSelf() {
    push();
    fill("RED");
    ellipse(this.x, this.y, 35);
    if (this.image == 1) {
      image(enemyImage, this.x - 30, this.y - 27, 60, 70);
    } else {
      image(zombie, this.x - 35, this.y - 27, 70, 80);
    }
    pop();
  }

  removeSelf() {
    return (
      this.x > width + 10 ||
      this.x < -10 ||
      this.y > height + 10 ||
      this.y < -10
    );
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  getR() {
    return this.r;
  }
}

function getMouseVector() {
  let posX = mouseX - playerX;
  let posY = mouseY - playerY;
  let direction = createVector(posX, posY);
  direction.normalize();
  return direction;
}

function drawTarget() {
  noFill();
  strokeWeight(1.5);
  stroke("WHITE");
  ellipse(mouseX, mouseY, 20);
  //stroke(80, 160, 200, 125);
  line(mouseX - 14, mouseY - 14, mouseX + 14, mouseY + 14);
  line(mouseX + 14, mouseY - 14, mouseX - 14, mouseY + 14);
  //stroke(80, 160, 200, 125);
  line(playerX, playerY, mouseX, mouseY);
}

function levelComplete() {
  push();
  background(end);
  pop();
  noLoop();
}

function gameOver() {
  push();
  fill("WHITE");
  textSize(40);
  text("GAME OVER", 180, 400);

  restart.show();
  restart.position(280, 450);
  restart.size(100, 30);
  restart.style("background-color", "#202020");
  restart.style("color", "#FFFFFF");
  restart.mousePressed(reset);

  pop();
  noLoop();
}

function reset() {
  restart.hide();
  bullet = [];
  enemy = [];
  playerX = 300;
  playerY = 300;
  spawnRate = 2;
  score = 0;
  loop();
}
