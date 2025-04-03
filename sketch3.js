let player;
let gravity = 0.8;
let jumpForce = -12;
let platforms = [];
let cameraX = 0;
let groundSections = [];
let flag;

function setup() {
  createCanvas(800, 400);
  player = new Player();

  // Build ground with variable platform and hole sizes
  let levelLength = 5000;
  let x = 0;
  while (x < levelLength) {
    let groundWidth = random(200, 400);
    let holeWidth = random(60, 120);
    groundSections.push(new Platform(x, height - 20, groundWidth, 20));
    x += groundWidth + holeWidth;
  }

  // Floating platforms
  platforms.push(new Platform(600, 280, 100, 10));
  platforms.push(new Platform(1000, 240, 100, 10));
  platforms.push(new Platform(1600, 200, 100, 10));
  platforms.push(new Platform(2200, 160, 100, 10));
  platforms.push(new Platform(3000, 300, 100, 10));

  // End-of-level flag
  flag = new Flag(x - 100, height - 100, 20, 80);
}

function draw() {
  background(110, 180, 255);

  cameraX = player.x - width / 2;
  push();
  translate(-cameraX, 0);

  for (let ground of groundSections) {
    ground.show();
  }

  for (let plat of platforms) {
    plat.show();
  }

  if (keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW)) {
    player.move(-1);
  } else if (keyIsDown(RIGHT_ARROW) && !keyIsDown(LEFT_ARROW)) {
    player.move(1);
  } else {
    player.stop();
  }

  player.update();
  player.checkCollisions([...groundSections, ...platforms]);

  flag.show();
  if (flag.touches(player)) {
    player.reset();
  }

  player.show();

  pop();
}

function keyPressed() {
  if (keyCode === 32 || keyCode === UP_ARROW) {
    player.jumpPressed = true;
    player.jump();
  }
}

function keyReleased() {
  if (keyCode === 32 || keyCode === UP_ARROW) {
    player.jumpPressed = false;
    player.jumpHoldTime = 0;
    player.jumpBufferTime = 0;
  }
}

class Player {
  constructor() {
    this.w = 30;
    this.h = 30;
    this.reset();
    this.speed = 5;

    this.jumpPressed = false;
    this.jumpHoldTime = 0;
    this.jumpHoldMax = 10;
    this.jumpBoost = -0.5;

    this.jumpBufferTime = 0;
    this.jumpBufferMax = 10;

    this.frameCounter = 0;
  }

  reset() {
    this.x = 50;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
  }

  update() {
    this.frameCounter++;

    if (this.jumpPressed && this.vy < 0 && this.jumpHoldTime < this.jumpHoldMax) {
      this.vy += this.jumpBoost;
      this.jumpHoldTime++;
    }

    if (this.jumpPressed) {
      this.jumpBufferTime = this.jumpBufferMax;
    } else if (this.jumpBufferTime > 0) {
      this.jumpBufferTime--;
    }

    this.vy += gravity;
    this.x += this.vx;
    this.y += this.vy;

    if (this.y > height + 100) {
      this.reset();
    }

    this.onGround = false;
  }

  checkCollisions(platforms) {
    for (let plat of platforms) {
      if (
        this.x < plat.x + plat.w &&
        this.x + this.w > plat.x &&
        this.y < plat.y + plat.h &&
        this.y + this.h > plat.y
      ) {
        let overlapBottom = plat.y + plat.h - this.y;
        let overlapTop = this.y + this.h - plat.y;
        let overlapLeft = this.x + this.w - plat.x;
        let overlapRight = plat.x + plat.w - this.x;

        let minOverlap = min(overlapBottom, overlapTop, overlapLeft, overlapRight);

        if (minOverlap === overlapTop) {
          this.y = plat.y - this.h;
          this.vy = 0;

          if (!this.onGround && this.jumpBufferTime > 0) {
            this.vy = jumpForce;
            this.jumpHoldTime = 0;
            if (!this.jumpPressed) this.jumpBufferTime = 0;
          }

          this.onGround = true;
        } else if (minOverlap === overlapBottom) {
          this.y = plat.y + plat.h;
          this.vy = 0;
        } else if (minOverlap === overlapLeft) {
          this.x = plat.x - this.w;
        } else if (minOverlap === overlapRight) {
          this.x = plat.x + plat.w;
        }
      }
    }
  }

  move(dir) {
    this.vx = dir * this.speed;
  }

  stop() {
    this.vx = 0;
  }

  jump() {
    if (this.onGround) {
      this.vy = jumpForce;
      this.jumpHoldTime = 0;
    } else {
      this.jumpBufferTime = this.jumpBufferMax;
    }
  }

  show() {
    push();
    noStroke();
    translate(this.x, this.y);

    // Shoes
    fill(139, 69, 19);
    rect(4, this.h - 5, 6, 5);  // left shoe
    rect(20, this.h - 5, 6, 5); // right shoe

    // Legs (darker blue)
    fill(0, 51, 153);
    rect(6, 22, 6, 8);   // left leg
    rect(18, 22, 6, 8);  // right leg

    // Arms
    fill(255, 224, 189);

    if (!this.onGround) {
      // Arms up in air
      rect(2, -2, 4, 10);   // left arm up
      rect(24, -2, 4, 10);  // right arm up
    } else if (this.vx !== 0) {
      // Swinging arms when walking
      let swing = sin(this.frameCounter * 0.2) * 2;
      rect(2, 14 + swing, 4, 10);   // left
      rect(24, 14 - swing, 4, 10);  // right
    } else {
      // Idle arms
      rect(2, 14, 4, 10);
      rect(24, 14, 4, 10);
    }

    // Overalls (torso)
    fill(0, 102, 204);
    rect(6, 15, 18, 8);     // torso
    rect(6, 10, 5, 5);      // left strap
    rect(19, 10, 5, 5);     // right strap

    // Head
    fill(255, 224, 189);
    rect(8, 0, 14, 10);     // face

    // Cap
    fill(200, 0, 0);
    rect(6, -3, 18, 5);     // brim
    rect(8, -6, 14, 3);     // top

    pop();
  }
}


class Platform {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  show() {
    fill(0, 200, 0);
    rect(this.x, this.y, this.w, this.h);
  }
}

class Flag {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  show() {
    fill(255, 255, 0);
    rect(this.x, this.y, this.w, this.h);
    fill(255, 0, 0);
    triangle(this.x + this.w, this.y, this.x + this.w + 20, this.y + 10, this.x + this.w, this.y + 20);
  }

  touches(player) {
    return (
      player.x < this.x + this.w &&
      player.x + player.w > this.x &&
      player.y < this.y + this.h &&
      player.y + player.h > this.y
    );
  }
}
