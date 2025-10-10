const restartBtn = document.getElementById("restart-btn");
const hintsBtn = document.getElementById("hints-btn");

restartBtn.addEventListener("click", restartGame);
hintsBtn.addEventListener("click", showHints);

// Player name 
const nameForm = document.getElementById("name-form");
const playerNameInput = document.getElementById("player-name");

// Load saved name
const savedName = localStorage.getItem("playerName");
if (savedName) {
  startGame(savedName);
  document.getElementById("player-form").style.display = "none";
}

// Handle form submit
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

// Card colors
const board = document.getElementById("game-board");

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
let flippedCards = [];
let matchedCount = 0;

// switch cards around 
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Board fucntions 
function createBoard() {
  board.innerHTML = "";
  shuffle(cards);

  cards.forEach((color, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.color = color;

    // Front and Back
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

//Flip Card
function flipCard(e) {
  const card = e.currentTarget;
  if (card.classList.contains("flipped") || flippedCards.length === 2) return;

  card.classList.add("flipped");
  flippedCards.push(card);

  if (flippedCards.length === 2) checkMatch();
}

// Match
function checkMatch() {
  const [card1, card2] = flippedCards;

  if (card1.dataset.color === card2.dataset.color) {
    matchedCount++;
    flippedCards = [];
    if (matchedCount === colors.length / 2) {
      setTimeout(() => alert("🎉 You matched all colors!"), 300);
    }
  } else {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      flippedCards = [];
    }, 800);
  }
}

// start game 
function startGame(playerName) {
  matchedCount = 0;
  flippedCards = [];
  createBoard();
}

// restart game 
function restartGame() {
  localStorage.removeItem("playerName");
  document.getElementById("player-form").style.display = "block";
  board.innerHTML = "";
  flippedCards = [];
  matchedCount = 0;
}

// Hints
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


