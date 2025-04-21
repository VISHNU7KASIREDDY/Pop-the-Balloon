let score = 0;
let timeLeft = 60;
let gameRunning = true;
let speed = 2; // Balloon float speed
let spawnRate = 1000; // Start with 1 balloon per second
let balloonInterval;

const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const highScoreDisplay = document.getElementById('highScore');
const restartBtn = document.getElementById('restartBtn');
const level=document.getElementById('level')

// 🎵 Sound Effects
const popSound = new Audio('pop.mp3');
const levelUpSound = new Audio('level-up.mp3');
const countdownSound = new Audio('countdown.mp3');
const gameOverSound = new Audio('game-over.mp3');

// Get high score from localStorage
let highScore = localStorage.getItem('highScore') || 0;
highScoreDisplay.textContent = `High Score: ${highScore}`;

// Array of balloon images
const balloonImages = ['balloon-red.png', 'balloon-blue.png', 'balloon-green.png', 'balloon-gold.png'];

function spawnBalloon() {
    if (!gameRunning) return;

    const balloon = document.createElement('img');
    balloon.classList.add('balloon');

    // Randomly decide if it's a golden power-up balloon (10% chance)
    const isGolden = Math.random() < 0.1;
    if (isGolden) {
        balloon.classList.add('golden');
        balloon.src = 'balloon-gold.png';
    } else {
        const randomImage = balloonImages[Math.floor(Math.random() * 3)];
        balloon.src = randomImage;
    }

    // Set random position at the bottom
    const randomX = Math.random() * (window.innerWidth - 50);
    balloon.style.left = `${randomX}px`;
    balloon.style.bottom = '0px';

    // Append balloon to game area
    gameArea.appendChild(balloon);

    // Animate balloon floating upwards
    let floatInterval = setInterval(() => {
        const currentBottom = parseFloat(balloon.style.bottom);
        if (currentBottom < window.innerHeight) {
            balloon.style.bottom = `${currentBottom + speed}px`;
        } else {
            clearInterval(floatInterval);
            balloon.remove(); // Remove balloon if it goes off screen
        }
    }, 20);

    // Add click event to pop the balloon
    balloon.addEventListener('click', () => {
        if (!gameRunning) return;

        popSound.play(); // 🎵 Play pop sound

        if (isGolden) {
            score += 5; // Golden balloon gives 5 points
        } else {
            score++;
        }

        scoreDisplay.textContent = `Score: ${score}`;
        balloon.style.transform = 'scale(0)'; // Pop effect
        setTimeout(() => balloon.remove(), 200);
        clearInterval(floatInterval);
    });
}

// Start spawning balloons
function startSpawningBalloons() {
    balloonInterval = setInterval(spawnBalloon, spawnRate);
}

// Timer function
function startTimer() {
    const timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            timerDisplay.textContent = `Time: ${timeLeft}s`;

            // 🎵 Play countdown sound in last 5 seconds
            if (timeLeft === 5) {
                countdownSound.play();
            }

            // Every 10 seconds, increase difficulty
            if (timeLeft % 10 === 0) {
                level++;
                localStorage.setItem('level', level);
                level.textContent=`Level:${level}`
                speed += 0.5; // Increase balloon speed
                spawnRate = Math.max(300, spawnRate - 150); // Increase spawn rate (max 3 balloons/sec)

                clearInterval(balloonInterval);
                startSpawningBalloons();

                levelUpSound.play(); // 🎵 Play level-up sound
            }

        } else {
            clearInterval(timerInterval);
            clearInterval(balloonInterval);
            gameRunning = false;

            gameOverSound.play(); // 🎵 Play game over sound

            // Update high score
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('highScore', highScore);
                highScoreDisplay.textContent = `High Score: ${highScore}`;
            }

            restartBtn.style.display = "block"; // Show restart button
        }
    }, 1000);
}

// Restart Game
function restartGame() {
    score = 0;
    timeLeft = 60;
    speed = 2;
    spawnRate = 1000; // Reset spawn rate
    gameRunning = true;

    scoreDisplay.textContent = `Score: 0`;
    timerDisplay.textContent = `Time: 60s`;
    restartBtn.style.display = "none";

    startTimer();
    startSpawningBalloons();
}

// Start game
startTimer();
startSpawningBalloons();
