document.addEventListener('DOMContentLoaded', function () {
  const gameContainer = document.querySelector('.game-container');
  const player = document.querySelector('.player');
  const failsDisplay = document.querySelector('.fails');
  const scoreDisplay = document.querySelector('.score');
  const startBtn = document.querySelector('.start-btn');
  const restartBtn = document.querySelector('.restart-btn');
  const startScreen = document.querySelector('.start-screen');

  let isGameOver = false;
  let failCount = 0;
  let score = 0;
  const maxFails = 3;

  function updateFailsDisplay() {
    failsDisplay.textContent = `Fallos: ${Number(failCount) || 0} / ${maxFails}`;
  }

  function updateScoreDisplay() {
    scoreDisplay.textContent = `Puntos: ${Number(score) || 0}`;
  }

  function movePlayer(event) {
    if (!isGameOver) {
      const x = event.clientX;
      const containerLeft = gameContainer.offsetLeft;
      const containerWidth = gameContainer.offsetWidth;
      const playerWidth = player.offsetWidth;

      let newX = x - containerLeft - playerWidth / 2;
      newX = Math.max(0, Math.min(newX, containerWidth - playerWidth));

      player.style.left = newX + 'px';
    }
  }

  document.addEventListener('mousemove', movePlayer);

  function shoot() {
    const bullet = document.createElement('div');
    bullet.classList.add('bullet');
    bullet.style.left = player.offsetLeft + player.offsetWidth / 2 + 'px';
    bullet.style.top = player.offsetTop + 'px';
    gameContainer.appendChild(bullet);

    const shootingInterval = setInterval(() => {
      bullet.style.top = bullet.offsetTop - 10 + 'px';

      const obstacles = document.querySelectorAll('.obstacle');
      obstacles.forEach((obstacle) => {
        const bulletRect = bullet.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();
        if (
          bulletRect.bottom >= obstacleRect.top &&
          bulletRect.top <= obstacleRect.bottom &&
          bulletRect.right >= obstacleRect.left &&
          bulletRect.left <= obstacleRect.right
        ) {
          clearInterval(shootingInterval);
          bullet.remove();
          obstacle.remove();
          score++;
          updateScoreDisplay();
        }
      });

      if (bullet.offsetTop <= 0) {
        clearInterval(shootingInterval);
        bullet.remove();
      }
    }, 20);
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
      shoot();
    }
  });

  function createObstacle() {
    if (!isGameOver) {
      const obstacle = document.createElement('div');
      obstacle.classList.add('obstacle');
      const containerWidth = gameContainer.offsetWidth;
      const obstacleWidth = 50;
      const maxLeft = containerWidth - obstacleWidth;
      const left = Math.floor(Math.random() * maxLeft);
      obstacle.style.left = left + 'px';
      gameContainer.appendChild(obstacle);

      const fallInterval = setInterval(() => {
        if (!isGameOver) {
          obstacle.style.top = (obstacle.offsetTop + 10) + 'px';

          if (obstacle.offsetTop > gameContainer.offsetHeight) {
            clearInterval(fallInterval);
            obstacle.remove();
            registerFail(); // cuenta como fallo si cae al fondo
          }

          const playerRect = player.getBoundingClientRect();
          const obstacleRect = obstacle.getBoundingClientRect();

          if (
            playerRect.bottom >= obstacleRect.top &&
            playerRect.top <= obstacleRect.bottom &&
            playerRect.right >= obstacleRect.left &&
            playerRect.left <= obstacleRect.right
          ) {
            clearInterval(fallInterval);
            obstacle.remove(); // atrapado correctamente
            score++;
            updateScoreDisplay();
          }
        } else {
          clearInterval(fallInterval);
        }
      }, 50);
    }
  }

  function registerFail() {
    failCount++;
    updateFailsDisplay();
    if (failCount >= maxFails) {
      gameOver();
    }
  }

  function gameOver() {
    isGameOver = true;
    alert('¡Se acabaron tus intentos amor! TE AMOOOO');
    restartBtn.style.display = 'block';
  }

  function restartGame() {
    isGameOver = false;
    failCount = 0;
    score = 0;
    updateFailsDisplay();
    updateScoreDisplay();
    restartBtn.style.display = 'none';

    // Eliminar obstáculos y balas
    document.querySelectorAll('.obstacle').forEach(el => el.remove());
    document.querySelectorAll('.bullet').forEach(el => el.remove());
  }

  startBtn.addEventListener('click', () => {
    startScreen.style.display = 'none';
    gameContainer.style.display = 'block';
    restartGame();
  });

  restartBtn.addEventListener('click', restartGame);

  setInterval(createObstacle, 2000);
  updateFailsDisplay();
  updateScoreDisplay();
});
