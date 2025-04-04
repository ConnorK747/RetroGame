let player;
let gravity = 0.8;
let jumpForce = -12;
let platforms = [];
let cameraX = 0;
let groundSections = [];
let flag;
let enemies = [];
let startTime;
let timeTaken = 0;  // Time taken to complete the level (in milliseconds)
let levelCompleted = false; // To track if the level is completed
let coinsCollected
let coinPositions = [
 {x: 758.0,  y: 120.0},  
 {x: 783.0,  y: 120.0},  
 {x: 808.0,  y: 120.0},  
 {x: 1040.0, y: 68.0},  
 {x: 1065.0, y: 68.0}, 
 {x: 928.0,  y: 319.0},  
 {x: 1403.0, y: 179.0},  
 {x: 1438.0, y: 179.0},  
 {x: 1691.0, y: 120.0},  
 {x: 1721.0, y: 120.0},  
 {x: 1746.0, y: 120.0},  
 {x: 1776.0, y: 120.0},  
 {x: 2403.0, y: 151.0},  
 {x: 2433.0, y: 151.0},  
 {x: 2628.0, y: 120.0},  
 {x: 2658.0, y: 120.0},  
 {x: 2742.0, y: 120.0},  
 {x: 2772.0, y: 120.0},  
 {x: 3193.0, y: 352.0},  
 {x: 3223.0, y: 352.0},  
 {x: 3253.0, y: 352.0},  
 {x: 3391.0, y: 151.0},  
 {x: 3421.0, y: 151.0}  
];

let coins = [];


// Accessing modal and buttons
const modal = document.getElementById('modal');
const startButton = document.getElementById('startButton');
const exitButton = document.getElementById('exitButton');
modal.style.display = 'block';

// Event listener for the "Start Game" button
startButton.addEventListener('click', function() {
    modal.style.display = 'none';
    gravity = 0.8
    jumpForce = -8
   // Start the clock when the game begins
  startTime = millis();  // Store the start time when the game starts
});
// Event listener for the "Exit" button
exitButton.addEventListener('click', function() {
    modal.style.display = 'none';
    gravity = 0.8;
    jumpForce = -12;
   // Start the clock when the game begins
  startTime = millis();  // Store the start time when the game starts
});



function setup() {
 
  createCanvas(800, 400);
  player = new Player();

  // Build ground with variable platform and hole sizes
  let levelLength = 5000;
  let x = 0;
  // while (x < levelLength) {
  //   let groundWidth = random(200, 400);
  //   let holeWidth = random(60, 120);
  //   groundSections.push(new Platform(x, height - 20, groundWidth, 20));
  //   x += groundWidth + holeWidth;
  // }

  // Floating platforms
platforms.push(new Platform(488, 341, 128, 33));
platforms.push(new Platform(-11, 370, 453, 33));
platforms.push(new Platform(3644, 370, 1422, 33));
platforms.push(new Platform(663, 256, 234, 33));
platforms.push(new Platform(723, 142, 142, 33));
platforms.push(new Platform(897, 341, 84, 33));
platforms.push(new Platform(981, 231, 139, 33));
platforms.push(new Platform(1120, 109, 203, 33));
platforms.push(new Platform(1403, 374, 113, 33));
platforms.push(new Platform(1662, 374, 140, 33));
platforms.push(new Platform(1834, 374, 140, 33));
platforms.push(new Platform(1974, 261, 82, 33));
platforms.push(new Platform(2143, 175, 170, 26));
platforms.push(new Platform(2936, 205, 227, 26));
platforms.push(new Platform(2764, 315, 112, 26));
platforms.push(new Platform(3193, 374, 81, 26));
platforms.push(new Platform(3274, 261, 117, 26));
platforms.push(new Platform(3446, 260, 117, 26));
platforms.push(new Platform(3446, 260, 117, 26));
platforms.push(new Platform(3901, 260, 168, 114));
platforms.push(new Platform(3954, 201, 115, 59));
platforms.push(new Platform(1686, 142, 116, 33));
platforms.push(new Platform(1446, 175, 87, 12, 2, 120));
platforms.push(new Platform(2425, 231, 87, 12, 2, 200));
platforms.push(new Platform(2655, 261, 87, 12, 2, 200));
platforms.push(new Platform(3697, 176, 87, 12, 1.5, 100));
platforms.push(new Platform(4011, 145, 58, 59));

   // Add flying enemies
  // enemies.push(new FlyingEnemy(2100, 70, 30, 30, 1.5, 80)); // FlyingEnemy flying up and down with speed 1.5 and range 80px
  enemies.push(new FlyingEnemy(3230, 100, 30, 30, 1.5, 80)); // FlyingEnemy flying up and down with speed 1.5 and range 80px

  
  // Add crawling enemies
enemies.push(new CrawlingEnemy(platforms[4].x + 50, platforms[4].y - 20, 40, 20, 1, 50));
enemies.push(new CrawlingEnemy(platforms[7].x + 50, platforms[7].y - 20, 40, 20, 1, 25));
enemies.push(new CrawlingEnemy(platforms[7].x + 140, platforms[7].y - 20, 40, 20, 1.5, 25));
enemies.push(new CrawlingEnemy(platforms[12].x + 90, platforms[12].y - 20, 40, 20, 1, 40));
enemies.push(new CrawlingEnemy(platforms[13].x + 90, platforms[13].y - 20, 40, 20, 1, 40)); 
  enemies.push(new CrawlingEnemy(platforms[2].x + 50, platforms[2].y - 20, 40, 20, 1, 50));
  
    // Create coin objects
  coins = coinPositions.map(pos => new Coin(pos.x, pos.y));
  
  // End-of-level flag
  flag = new Flag(4299, height - 100, 20, 80);
}

function draw() {
  background(110, 180, 255);

  
    if (levelCompleted) {
    // Stop the timer when the level is completed
    displayFinishedScreen(); // Show the "Finished" screen
    return; // Stop further updates to the game
  }
   // Check if the level is completed
  if (!levelCompleted) {
    timeTaken = millis() - startTime;  // Calculate the elapsed time in milliseconds
  }
  
  cameraX = player.x - width / 2;
  push();
  translate(-cameraX, 0);

  for (let ground of groundSections) {
    ground.show();
  }

  for (let plat of platforms) {
        plat.update();  // Update the moving platforms' position
    plat.show();
  }
  
  // Update and display all enemies
  for (let enemy of enemies) {
    enemy.update();  // Update enemy's position
    enemy.show();    // Display the enemy
    if (enemy.touches(player)) {
      // Handle player-enemy collision (reset player, for example)
      player.reset(); // Reset the player if it touches the enemy
    }
  }

  //Update and Display Coins
  for (let coin of coins) {
    coin.show();
    coin.collect(player);
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
    levelCompleted = true; // Stop the clock when the player reaches the flag
  }

  player.show();

  pop();
  
  // Display the clock (time taken to complete the level)
  displayTimeTaken();

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
    coinsCollected = 0;
      coins = [];
  for (let pos of coinPositions) {
    coins.push(new Coin(pos.x, pos.y));
  }
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
  constructor(x, y, w, h, moveSpeed = 0, moveRange = 0) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.moveSpeed = moveSpeed;  // Speed at which the platform moves
    this.moveRange = moveRange;  // How far the platform can move
    this.originalX = x;  // Keep track of the original position
    this.direction = 1;  // 1 for right, -1 for left
  }
  // Update the platform's position if it moves
  update() {
    if (this.moveSpeed !== 0) {
      this.x += this.moveSpeed * this.direction;
      if (this.x >= this.originalX + this.moveRange || this.x <= this.originalX - this.moveRange) {
        this.direction *= -1; // Change direction when hitting the range limit
      }
    }
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

class FlyingEnemy {
  constructor(x, y, w, h, speed = 2, range = 100) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.speed = speed;  // Speed at which the enemy moves
    this.range = range;  // How far the enemy can move up and down
    this.originalY = y;  // Keep track of the original position
    this.direction = 1;  // 1 for moving up, -1 for moving down
  }

  // Update the enemy's position
  update() {
    this.y += this.speed * this.direction;
    if (this.y >= this.originalY + this.range || this.y <= this.originalY - this.range) {
      this.direction *= -1; // Reverse direction when reaching the range limit
    }
  }

  // Show the enemy on screen
  show() {
    fill(255, 0, 0); // Red color for the enemy
    ellipse(this.x, this.y, this.w, this.h); // Draw a circular enemy
  }

  // Check if the player touches the enemy
  touches(player) {
    return (
      player.x < this.x + this.w &&
      player.x + player.w > this.x &&
      player.y < this.y + this.h &&
      player.y + player.h > this.y
    );
  }
}

class CrawlingEnemy {
  constructor(x, y, w, h, speed = 2, range = 100) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.speed = speed;  // Speed at which the enemy moves
    this.range = range;  // How far the enemy can move left and right
    this.originalX = x;  // Keep track of the original position
    this.direction = 1;  // 1 for moving right, -1 for moving left
  }

  // Update the enemy's position
  update() {
    this.x += this.speed * this.direction;
    if (this.x >= this.originalX + this.range || this.x <= this.originalX - this.range) {
      this.direction *= -1; // Reverse direction when reaching the range limit
    }
  }

  // Show the crawling enemy on screen
  show() {
    fill(255, 0, 0); // Red color for the enemy
    rect(this.x, this.y, this.w, this.h); // Draw a rectangular enemy (crawling)
  }

  // Check if the player touches the crawling enemy
  touches(player) {
    return (
      player.x < this.x + this.w &&
      player.x + player.w > this.x &&
      player.y < this.y + this.h &&
      player.y + player.h > this.y
    );
  }
}
class Coin {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 20;
    this.collected = false;
  }

  show() {
    if (!this.collected) {
      fill(255, 223, 0); // gold color
      ellipse(this.x, this.y, this.size);
    }
  }

  collect(player) {
    let d = dist(player.x, player.y, this.x, this.y);
    if (d < this.size + player.w / 2) {
      this.collected = true;
    }
  }
}

// Function to display the time taken to complete the level
function displayTimeTaken() {
  fill(0);
  textSize(32);
  textAlign(RIGHT, TOP);

  // Format time taken to display as MM:SS
  let minutes = floor(timeTaken / 60000); // Convert milliseconds to minutes
  let seconds = floor((timeTaken % 60000) / 1000); // Get remaining seconds
  let milliseconds = timeTaken % 1000;
    coinsCollected = coins.filter(c => c.collected).length;
    textAlign(RIGHT, TOP);
  // Display time in MM:SS format
  text(`Coins: ${coinsCollected} / ${coins.length} Time: ${nf(minutes, 2)}:${nf(seconds, 2)}`, width - 20, 20);
}
// Function to display the "Finished" screen after the player crosses the flag
function displayFinishedScreen() {
  fill(0);
  textSize(48);
  textAlign(CENTER, CENTER);

  // Display "Level Finished" message
  text("Level Finished!", width / 2, height / 2 - 40);

  // Display the time taken
  let minutes = floor(timeTaken / 60000); // Convert milliseconds to minutes
  let seconds = floor((timeTaken % 60000) / 1000); // Get remaining seconds
  textSize(32);
  text(`Time Taken: ${nf(minutes, 2)}:${nf(seconds, 2)}`, width / 2, height / 2 + 40);
  
    // Display the Coin Score
  textSize(32);
  text(`Coins: ${coinsCollected} / ${coins.length}`, width / 2, height / 2 + 40);

  // Display Restart or Exit options
  textSize(24);
  text("Press 'R' to Restart or ESC to Exit", width / 2, height / 2 + 100);
}

// Function to reset the level if the player presses 'R'
function keyPressed() {
  if (keyCode === 82) { // 'R' key to restart
    levelCompleted = false;
    startTime = millis(); // Restart the timer
    player.reset(); // Reset the player
    groundSections = [];
    platforms = [];
    enemies = []; // Reset enemies
    setup(); // Reinitialize the level
    modal.style.display = 'block'; // Show the modal when restarting the game
  }

    // Optionally, handle exit with 'Esc' key
  if (keyCode === ESCAPE) {
    // Exit or stop the game
    noLoop(); // Stop the game loop
  }
  
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
