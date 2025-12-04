document.addEventListener('DOMContentLoaded', function() {

// Buttons
const restartBtn = document.getElementById("restart-btn");
const hintsBtn = document.getElementById("hints-btn");

// Player name elements
const nameForm = document.getElementById("name-form");
const playerNameInput = document.getElementById("player-name");

// Game stats
let attempts = 0;
let score = 0;
let timer = 0;
let timerInterval;
let flippedCards = [];
let matchedCount = 0;

// Board and colors
const board = document.getElementById("createBoard");
const colors = [
  "red", "red",
  "blue", "blue",
  "green", "green",
  "yellow", "yellow",
  "purple", "purple",
  "orange", "orange",
  "pink", "pink",
  "cyan", "cyan"
];
let cards = [...colors];


// Player name form
nameForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = playerNameInput.value.trim();

  if (name) {
    localStorage.setItem("playerName", name);
    startGame(name);
    document.getElementById("player-form").style.display = "none";
    alert(`Welcome, ${name}! Let's play! 🎉`);
  } else {
    playerNameInput.classList.add("is-invalid");
  }
});


// Saved player name
const savedName = localStorage.getItem("playerName");
if (savedName) {
  startGame(savedName);
  document.getElementById("player-form").style.display = "none";
}


// Start game 
function startGame(playerName) {
  matchedCount = 0;
  flippedCards = [];
  score = 0;
  timer = 0;
  attempts = 0;

  document.getElementById("score").textContent = score;
  document.getElementById("timer").textContent = timer;
  document.getElementById("attempts").textContent = attempts;
  document.getElementById("player-display").textContent = `Player: ${playerName}`;

  // Reset and start timer
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer++;
    document.getElementById("timer").textContent = timer;
  }, 1000);

  // Initialize board
  createBoard();
}


// Shuffle
function shuffle(array, seed = Math.random()) {
  const seededRandom = () => {
    seed = Math.sin(seed) * 10000;
    return seed - Math.floor(seed);
  };
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  console.log(" Cards shuffled!");
  return array;
}


// Game board
function createBoard() {
  board.innerHTML = "";
  shuffle(cards);

  cards.forEach((color) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.color = color;

    const front = document.createElement("div");
    front.classList.add("card-front");
    front.style.backgroundColor = color;

    const back = document.createElement("div");
    back.classList.add("card-back");

    card.appendChild(front);
    card.appendChild(back);

    card.addEventListener("click", flipCard);
    board.appendChild(card);
  });
}


// Flip card
function flipCard(e) {
  const card = e.currentTarget;
  if (card.classList.contains("flipped") || flippedCards.length === 2) return;

  card.classList.add("flipped");
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    attempts++;
    document.getElementById("attempts").textContent = attempts;
    checkMatch();
  }
}


// Check for matching 
function checkMatch() {
  const [card1, card2] = flippedCards;

  if (card1.dataset.color === card2.dataset.color) {
    matchedCount++;
    score += 10;
    document.getElementById("score").textContent = score;

    flippedCards = [];

    if (matchedCount === colors.length / 2) {
      clearInterval(timerInterval);
      setTimeout(() => {
        alert(`🎉 You matched all colors in ${timer} seconds! Final score: ${score}`);
      }, 300);
    }
  } else {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      flippedCards = [];
    }, 800);
  }
}
// Event listeners
restartBtn.addEventListener("click", restartGame);
hintsBtn.addEventListener("click", showHints);

// Restart game 
function restartGame() {
  clearInterval(timerInterval);
  localStorage.removeItem("playerName");

  document.getElementById("player-form").style.display = "block";
  board.innerHTML = "";

  flippedCards = [];
  matchedCount = 0;
  score = 0;
  timer = 0;
  attempts = 0;

  document.getElementById("score").textContent = score;
  document.getElementById("timer").textContent = timer;
  document.getElementById("attempts").textContent = attempts;
  document.getElementById("player-display").textContent = "";
}


// HINTS
function showHints(e) {
  e.preventDefault();
  const allCards = document.querySelectorAll(".card");

  allCards.forEach(card => card.classList.add("flipped"));
  setTimeout(() => {
    allCards.forEach(card => {
      if (!card.classList.contains("matched")) {
        card.classList.remove("flipped");
      }
    });
  }, 1500);
}
fetch('data/projects.json')
  .then(r => r.json())
  .then(data => {
    const game = data.achievements[0];
    console.log(`${game.title} – ${game.metrics.accessibilityScore}/100 a11y!`);
  });
});