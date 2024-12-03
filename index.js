// Selecting DOM elements
const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.querySelector("#scoreDisplay");
const restartButton = document.querySelector("#restartButton");

// Game settings
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const backgroundColor = "#2b2b2b"; // Dark mode background
const playerPaddleColor = "#00bfff"; // Player 1 paddle color (light blue)
const cpuPaddleColor = "#ff4500"; // Player 2 paddle color (red-orange)
const paddleBorderColor = "#ffffff"; // Paddle border color (white)
const ballFillColor = "#f4e04d"; // Ball color (bright yellow)
const ballBorderColor = "#000000"; // Ball border color (black)
const ballRadius = 12.5; // Radius of the ball
const paddleSpeed = 50; // Speed of paddle movement

// Game variables
let intervalID; // To store the game loop timer
let ballSpeed; // Current speed of the ball
let ballX = canvasWidth / 2; // Ball's X position
let ballY = canvasHeight / 2; // Ball's Y position
let ballXDirection = 0; // Ball's horizontal direction
let ballYDirection = 0; // Ball's vertical direction
let playerScore = 0; // Player 1 score
let cpuScore = 0; // Player 2 score

// Paddle dimensions and positions
let playerPaddle = { width: 25, height: 100, x: 0, y: 0 }; // Player paddle on the left
let cpuPaddle = { width: 25, height: 100, x: canvasWidth - 25, y: canvasHeight - 100 }; // CPU paddle on the right

// Event listeners
window.addEventListener("keydown", handlePaddleMovement);
restartButton.addEventListener("click", resetGame);

// Start the game
initializeGame();

// Function to start the game
function initializeGame() {
    setupBall(); // Create and position the ball
    gameLoop(); // Start the game loop
}

// Game loop
function gameLoop() {
    intervalID = setTimeout(() => {
        clearCanvas(); // Clear the canvas for the next frame
        drawPaddles(); // Draw paddles
        updateBallPosition(); // Move the ball
        drawBall(ballX, ballY); // Draw the ball
        checkCollisions(); // Check for collisions
        gameLoop(); // Repeat the loop
    }, 10);
}

// Clear the canvas
function clearCanvas() {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight); // Fill canvas with background color
}

// Draw paddles
function drawPaddles() {
    // Draw Player 1's paddle
    ctx.fillStyle = playerPaddleColor;
    ctx.strokeStyle = paddleBorderColor;
    ctx.fillRect(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height);
    ctx.strokeRect(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height);

    // Draw Player 2's paddle
    ctx.fillStyle = cpuPaddleColor;
    ctx.fillRect(cpuPaddle.x, cpuPaddle.y, cpuPaddle.width, cpuPaddle.height);
    ctx.strokeRect(cpuPaddle.x, cpuPaddle.y, cpuPaddle.width, cpuPaddle.height);
}

// Setup the ball with random directions
function setupBall() {
    ballSpeed = 1; // Initial speed
    ballXDirection = Math.random() > 0.5 ? 1 : -1; // Randomize horizontal direction
    ballYDirection = Math.random() > 0.5 ? Math.random() : -Math.random(); // Randomize vertical direction
    ballX = canvasWidth / 2; // Reset ball position to the center
    ballY = canvasHeight / 2;
    drawBall(ballX, ballY);
}

// Update ball position based on its speed and direction
function updateBallPosition() {
    ballX += ballSpeed * ballXDirection;
    ballY += ballSpeed * ballYDirection;
}

// Draw the ball
function drawBall(x, y) {
    ctx.fillStyle = ballFillColor;
    ctx.strokeStyle = ballBorderColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, 2 * Math.PI); // Draw a circle
    ctx.stroke();
    ctx.fill();
}

// Check for collisions with paddles, walls, and scoring areas
function checkCollisions() {
    // Ball collision with top and bottom walls
    if (ballY <= 0 + ballRadius || ballY >= canvasHeight - ballRadius) {
        ballYDirection *= -1; // Reverse vertical direction
    }

    // Scoring conditions
    if (ballX <= 0) { // Ball goes past Player 1
        cpuScore++;
        updateScore();
        setupBall();
        return;
    }
    if (ballX >= canvasWidth) { // Ball goes past Player 2
        playerScore++;
        updateScore();
        setupBall();
        return;
    }

    // Ball collision with Player 1 paddle
    if (ballX <= playerPaddle.x + playerPaddle.width + ballRadius &&
        ballY > playerPaddle.y &&
        ballY < playerPaddle.y + playerPaddle.height) {
        ballX = playerPaddle.x + playerPaddle.width + ballRadius; // Prevent ball from sticking
        ballXDirection *= -1; // Reverse horizontal direction
        ballSpeed += 0.5; // Increase ball speed
    }

    // Ball collision with Player 2 paddle
    if (ballX >= cpuPaddle.x - ballRadius &&
        ballY > cpuPaddle.y &&
        ballY < cpuPaddle.y + cpuPaddle.height) {
        ballX = cpuPaddle.x - ballRadius; // Prevent ball from sticking
        ballXDirection *= -1; // Reverse horizontal direction
        ballSpeed += 0.5; // Increase ball speed
    }
}

// Handle paddle movement
function handlePaddleMovement(event) {
    const key = event.keyCode;
    const playerUp = 87; // 'W'
    const playerDown = 83; // 'S'
    const cpuUp = 38; // Arrow Up
    const cpuDown = 40; // Arrow Down

    switch (key) {
        case playerUp: // Move Player 1 paddle up
            if (playerPaddle.y > 0) playerPaddle.y -= paddleSpeed;
            break;
        case playerDown: // Move Player 1 paddle down
            if (playerPaddle.y < canvasHeight - playerPaddle.height) playerPaddle.y += paddleSpeed;
            break;
        case cpuUp: // Move Player 2 paddle up
            if (cpuPaddle.y > 0) cpuPaddle.y -= paddleSpeed;
            break;
        case cpuDown: // Move Player 2 paddle down
            if (cpuPaddle.y < canvasHeight - cpuPaddle.height) cpuPaddle.y += paddleSpeed;
            break;
    }
}

// Update the score display
function updateScore() {
    scoreDisplay.textContent = `${playerScore} : ${cpuScore}`;
}

// Reset the game
function resetGame() {
    playerScore = 0;
    cpuScore = 0;
    playerPaddle.y = 0;
    cpuPaddle.y = canvasHeight - cpuPaddle.height;
    ballSpeed = 1;
    setupBall();
    updateScore();
    clearInterval(intervalID); // Stop the current game loop
    initializeGame(); // Restart the game
}
