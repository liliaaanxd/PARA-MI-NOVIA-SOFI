const cards = document.querySelectorAll('.memory-card');
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matches = 0;
let moves = 0;

shuffleCards();
cards.forEach(card => card.addEventListener('click', flipCard));

function flipCard() {
  if (lockBoard || this === firstCard || this.classList.contains('matched')) return;

  this.classList.add('revealed');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;
  moves++;
  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  if (isMatch) {
    disableCards();
    matches++;
    if (matches === cards.length / 2) {
      setTimeout(() => alert(`¡Juego completado en ${moves} movimientos!`), 500);
    }
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.classList.add('matched');
  secondCard.classList.add('matched');
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove('revealed');
    secondCard.classList.remove('revealed');
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function shuffleCards() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * cards.length);
    card.style.order = randomPos;
  });
}

