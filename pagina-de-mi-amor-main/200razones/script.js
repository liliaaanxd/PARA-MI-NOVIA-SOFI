const container = document.getElementById("cards-container");
const nextBtn = document.getElementById("next-btn");
const counter = document.getElementById("reason-count");

let currentIndex = 0;

function createCard(index) {
  container.innerHTML = ""; // Limpiar tarjeta anterior
  const reason = reasons[index];
  const card = document.createElement("div");
  card.classList.add("card");

  card.innerHTML = `
    <div class="inner-card">
      <div class="card-front">Razón #${index + 1}</div>
      <div class="card-back">${reason}</div>
    </div>
  `;

  card.addEventListener("click", () => {
    card.classList.toggle("flipped");
  });

  container.appendChild(card);
  counter.textContent = index + 1;
}

// Mostrar la primera
createCard(currentIndex);

// Siguiente razón
nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % reasons.length;
  createCard(currentIndex);
});

const heartColors = ['#ffd1dc', '#fcd5ce', '#cdeffd', '#e0c3fc', '#d0f4de'];
const heartsContainer = document.getElementById("hearts-container");

function createFloatingHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.style.left = `${Math.random() * 100}vw`;
  heart.style.bottom = "-30px";
  heart.style.backgroundColor = heartColors[Math.floor(Math.random() * heartColors.length)];
  heart.style.setProperty('--duration', `${8 + Math.random() * 4}s`);
  heart.style.animationDuration = `${6 + Math.random() * 5}s`;
  heart.style.opacity = `${0.5 + Math.random() * 0.5}`;
  heart.style.transform = `scale(${0.8 + Math.random()}) rotate(-45deg)`;

  heartsContainer.appendChild(heart);

  // Remover después de animación
  setTimeout(() => {
    heart.remove();
  }, 10000);
}

// Generar muchos al iniciar
for (let i = 0; i < 30; i++) {
  setTimeout(createFloatingHeart, i * 300);
}

// Seguir generando cada segundo
setInterval(createFloatingHeart, 800);
