const suits = ["♠", "♥", "♦", "♣"];
const values = [
  "A", "2", "3", "4", "5",
  "6", "7", "8", "9", "10",
  "J", "Q", "K"
];

let deck = [];

let playerHand = [];
let dealerHand = [];

let balance = 1000;
let currentBet = 0;

let gameActive = false;

function createDeck() {
  deck = [];

  for (let suit of suits) {
    for (let value of values) {
      deck.push({
        suit,
        value
      });
    }
  }

  shuffleDeck();
}

function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));

    [deck[i], deck[randomIndex]] =
      [deck[randomIndex], deck[i]];
  }
}

function drawCard(hand) {
  hand.push(deck.pop());
}

function getCardValue(card) {
  if (["J", "Q", "K"].includes(card.value)) {
    return 10;
  }

  if (card.value === "A") {
    return 11;
  }

  return parseInt(card.value);
}

function calculateHand(hand) {
  let total = 0;
  let aces = 0;

  hand.forEach(card => {
    total += getCardValue(card);

    if (card.value === "A") {
      aces++;
    }
  });

  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }

  return total;
}

function placeBet(amount) {
  if (gameActive) {
    showMessage("Finish the current game first.");
    return;
  }

  if (amount > balance) {
    showMessage("Not enough money.");
    return;
  }

  currentBet = amount;

  updateUI();
}

function startGame() {
  if (currentBet <= 0) {
    showMessage("Place a bet first.");
    return;
  }

  createDeck();

  playerHand = [];
  dealerHand = [];

  gameActive = true;

  balance -= currentBet;

  drawCard(playerHand);
  drawCard(playerHand);

  drawCard(dealerHand);
  drawCard(dealerHand);

  updateUI();

  const playerScore = calculateHand(playerHand);

  if (playerScore === 21) {
    blackjack();
  }
}

function blackjack() {
  const winnings = currentBet * 2.5;

  balance += winnings;

  showMessage("🃏 BLACKJACK! You win!");

  endRound();
}

function hit() {
  if (!gameActive) return;

  drawCard(playerHand);

  updateUI();

  const playerScore = calculateHand(playerHand);

  if (playerScore > 21) {
    showMessage("💥 Bust! You lose.");

    endRound();
  }
}

function stand() {
  if (!gameActive) return;

  while (calculateHand(dealerHand) < 17) {
    drawCard(dealerHand);
  }

  const dealerScore = calculateHand(dealerHand);
  const playerScore = calculateHand(playerHand);

  if (dealerScore > 21) {
    playerWins();
  }
  else if (playerScore > dealerScore) {
    playerWins();
  }
  else if (dealerScore > playerScore) {
    dealerWins();
  }
  else {
    push();
  }

  updateUI();
}

function playerWins() {
  balance += currentBet * 2;

  showMessage("🎉 You win!");
  
  endRound();
}

function dealerWins() {
  showMessage("😢 Dealer wins.");

  endRound();
}

function push() {
  balance += currentBet;

  showMessage("🤝 Push.");

  endRound();
}

function endRound() {
  gameActive = false;
  currentBet = 0;

  updateUI();

  if (balance <= 0) {
    showMessage("💀 Game Over.");
  }
}

function updateUI() {
  renderCards();

  document.getElementById("balance").textContent =
    balance;

  document.getElementById("bet-display").textContent =
    currentBet;

  document.getElementById("player-score").textContent =
    calculateHand(playerHand);

  document.getElementById("dealer-score").textContent =
    calculateHand(dealerHand);
}

function renderCards() {
  const playerContainer =
    document.getElementById("player-cards");

  const dealerContainer =
    document.getElementById("dealer-cards");

  playerContainer.innerHTML = "";
  dealerContainer.innerHTML = "";

  playerHand.forEach(card => {
    playerContainer.appendChild(createCard(card));
  });

  dealerHand.forEach(card => {
    dealerContainer.appendChild(createCard(card));
  });
}

function createCard(card) {
  const div = document.createElement("div");

  div.classList.add("card");

  div.textContent =
    `${card.value}${card.suit}`;

  return div;
}

function showMessage(text) {
  document.getElementById("message").textContent = text;
}

updateUI();
