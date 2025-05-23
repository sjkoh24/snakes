// 1. Initialize Canvas and Context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 20; // Size of each tile in pixels
const tileCountX = canvas.width / tileSize; // Number of tiles horizontally
const tileCountY = canvas.height / tileSize; // Number of tiles vertically

// Adjust canvas size to fit tiles perfectly if not already set in HTML or CSS
canvas.width = tileCountX * tileSize;
canvas.height = tileCountY * tileSize;


// 2. Snake Implementation (Initial)
let snake = [
    { x: Math.floor(tileCountX / 2), y: Math.floor(tileCountY / 2) } // Start in the middle
];
let snakeSpeed = 1; // Tiles per game loop iteration
let velocityX = snakeSpeed; // Initial velocity: moving right
let velocityY = 0;

// 3. Food Implementation (Initial)
let foodX;
let foodY;

function placeFood() {
    foodX = Math.floor(Math.random() * tileCountX);
    foodY = Math.floor(Math.random() * tileCountY);

    // Ensure food does not spawn on the snake
    for (let segment of snake) {
        if (segment.x === foodX && segment.y === foodY) {
            placeFood(); // Recursively call if food spawns on snake
            return;
        }
    }
}

placeFood(); // Place initial food

// 4. Game Loop
function gameLoop() {
    // Clear the canvas
    ctx.fillStyle = 'black'; // Background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update snake position
    const head = { x: snake[0].x + velocityX, y: snake[0].y + velocityY };
    snake.unshift(head); // Add new head

    // Implement eating food
    if (head.x === foodX && head.y === foodY) {
        placeFood(); // Move food to new random position
        // Snake growth will be handled by not popping the tail segment
    } else {
        snake.pop(); // Remove tail segment if no food eaten
    }

    // Draw the snake
    ctx.fillStyle = 'lime';
    for (const segment of snake) {
        ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize - 2, tileSize - 2); // -2 for grid effect
    }

    // Draw the food
    ctx.fillStyle = 'red';
    ctx.fillRect(foodX * tileSize, foodY * tileSize, tileSize - 2, tileSize - 2);


    // Implement basic collision detection (hitting the wall)
    if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY) {
        console.log("Game Over - Wall Hit");
        // For now, just stop the game by not requesting the next frame
        // A more formal game over state will be added later.
        // We can also reset the game or show a message.
        // For simplicity, we'll just stop the loop for now.
        // To restart, the user would need to refresh.
        // Consider adding a game over message on the canvas.
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
        return; // Stop the game loop
    }
    
    // Collision with self
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            console.log("Game Over - Self Collision");
            ctx.fillStyle = 'white';
            ctx.font = '30px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
            return; // Stop the game loop
        }
    }


    // Call gameLoop repeatedly
    setTimeout(gameLoop, 150); // Adjust speed as needed (150ms)
}

// 5. Input Handling (Basic)
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (velocityY === 0) { // Prevent reversing direction
                velocityX = 0;
                velocityY = -snakeSpeed;
            }
            break;
        case 'ArrowDown':
            if (velocityY === 0) { // Prevent reversing direction
                velocityX = 0;
                velocityY = snakeSpeed;
            }
            break;
        case 'ArrowLeft':
            if (velocityX === 0) { // Prevent reversing direction
                velocityX = -snakeSpeed;
                velocityY = 0;
            }
            break;
        case 'ArrowRight':
            if (velocityX === 0) { // Prevent reversing direction
                velocityX = snakeSpeed;
                velocityY = 0;
            }
            break;
    }
});

// Start the game loop
gameLoop();
