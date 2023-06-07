// Circle Game

// get canvas element
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// circle object
const player = {
  x: 200,
  y: 200,
  radius: 10,
  speed: 5,
  dx: 0, // horizontal velocity
  dy: 0, // vertical velocity
};

// array to hold the circles
const circles = [];

// array to hold the obstacles
const obstacles = [];

// flag to check if the game has started
let gameStarted = false;

// flag to check if the game is over
let gameOver = false;

// function to spawn circles
function spawnCircles() {
  const circle = {
    x: Math.random() * (canvas.width - 10),
    y: Math.random() * (canvas.height - 10),
    radius: 5,
  };
  circles.push(circle);
}

// function to spawn obstacles
function spawnObstacles() {
  const obstacle = {
    x: Math.random() * (canvas.width - 10),
    y: Math.random() * (canvas.height - 10),
    size: 10,
    color: 'yellow',
  };
  obstacles.push(obstacle);
}

// initialize the game with pre-spawned circles and obstacles
function initializeGame() {
  gameStarted = true;

  // spawn initial circles
  for (let i = 0; i < 10; i++) {
    spawnCircles();
  }

  // spawn initial obstacles
  for (let i = 0; i < 5; i++) {
    spawnObstacles();
  }
}

// update game objects
function update() {
  if (!gameStarted || gameOver) {
    return;
  }

  // move the player circle based on user input
  document.addEventListener('keydown', (event) => {
    switch (event.keyCode) {
      case 37: // left arrow key
        player.dx = -player.speed;
        player.dy = 0;
        break;
      case 38: // up arrow key
        player.dy = -player.speed;
        player.dx = 0;
        break;
      case 39: // right arrow key
        player.dx = player.speed;
        player.dy = 0;
        break;
      case 40: // down arrow key
        player.dy = player.speed;
        player.dx = 0;
        break;
    }
  });

  // update the position of the player based on its velocity
  player.x += player.dx;
  player.y += player.dy;

  // keep the player circle within the canvas boundaries
  if (player.x - player.radius < 0) {
    player.x = player.radius;
  }
  if (player.y - player.radius < 0) {
    player.y = player.radius;
  }
  if (player.x + player.radius > canvas.width) {
    player.x = canvas.width - player.radius;
  }
  if (player.y + player.radius > canvas.height) {
    player.y = canvas.height - player.radius;
  }

  // check for collision with circles
  for (let i = 0; i < circles.length; i++) {
    const circle = circles[i];

    if (
      player.x - player.radius < circle.x + circle.radius &&
      player.x + player.radius > circle.x - circle.radius &&
      player.y - player.radius < circle.y + circle.radius &&
      player.y + player.radius > circle.y - circle.radius
    ) {
      // if collision occurred remove the eaten circle and increase the size of the player
      circles.splice(i, 1);
      player.radius += 1;
    }
  }

  // check for collision with obstacles
  for (let i = 0; i < obstacles.length; i++) {
    const obstacle = obstacles[i];

    if (
      player.x - player.radius < obstacle.x + obstacle.size &&
      player.x + player.radius > obstacle.x &&
      player.y - player.radius < obstacle.y + obstacle.size &&
      player.y + player.radius > obstacle.y
    ) {
      // collision occurred with an obstacle, game over
      gameOver = true;
    }
  }

  // spawn new circles
  if (Math.random() < 0.01) {
    spawnCircles();
  }
}

// render game objects on the canvas
function render() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameStarted) {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Click to Begin', 150, 200);
  }

  // draw the player circle
  ctx.fillStyle = 'blue';
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();

  // draw the circles
  ctx.fillStyle = 'red';
  circles.forEach((circle) => {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  });

  // draw the obstacles
  ctx.fillStyle = 'yellow';
  obstacles.forEach((obstacle) => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.size, obstacle.size);
  });

  // draw instructions
  ctx.font = '16px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText('Move with arrow keys', 20, canvas.height - 60);
  ctx.fillText('Get big by eating circles', 20, canvas.height - 40);
  ctx.fillText('Avoid the yellow obstacles', 20, canvas.height - 20);

  // game over screen
  if (gameOver) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Game Over', 180, 200);
    ctx.fillText('Click space to try again', 140, 230);
  }
}

// start the game when the canvas is clicked
canvas.addEventListener('click', () => {
  if (!gameStarted) {
    initializeGame();
  }
});

// restart the game when space is pressed
document.addEventListener('keydown', (event) => {
  if (event.keyCode === 32 && gameOver) {
    // reset game state
    circles.length = 0;
    obstacles.length = 0;
    player.x = 200;
    player.y = 200;
    player.radius = 10;
    player.dx = 0;
    player.dy = 0;
    gameOver = false;
    initializeGame();
  }
});

// game loop
function gameLoop() {
  update();
  render();

  requestAnimationFrame(gameLoop);
}

// start the game loop
gameLoop();
