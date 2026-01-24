function openTab(tabName, btn) {
  const tabs = document.querySelectorAll('.tab');
  const buttons = document.querySelectorAll('.tab-btn');

  tabs.forEach(tab => tab.classList.remove('active-tab'));
  buttons.forEach(b => b.classList.remove('active'));

  document.getElementById(tabName).classList.add('active-tab');
  btn.classList.add('active');

  // при смяна на таб – да се активира reveal ефекта
  const activeSection = document.getElementById(tabName);
  if (activeSection.classList.contains('reveal')) {
    activeSection.classList.add('visible');
  }
}

function toggleTheme() {
  document.body.classList.toggle('alt-theme');
}

/* REVEAL ON SCROLL */

const revealElements = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.2 }
);

revealElements.forEach(el => observer.observe(el));

/* INTERACTIVE FACTS */

const factItems = document.querySelectorAll('.fact-item');

factItems.forEach(item => {
  item.addEventListener('click', () => {
    item.classList.toggle('expanded');
  });
});

/* MINI GAME: CLICK GAME */

let gameScore = 0;
let gameTime = 0;
let gameInterval = null;
let gameRunning = false;

const gameStartBtn = document.getElementById('game-start');
const gameScoreEl = document.getElementById('game-score');
const gameTimeEl = document.getElementById('game-time');

if (gameStartBtn) {
  gameStartBtn.addEventListener('click', () => {
    if (gameRunning) return;
    gameRunning = true;
    gameScore = 0;
    gameTime = 5;
    gameScoreEl.textContent = gameScore;
    gameTimeEl.textContent = gameTime;
    gameStartBtn.textContent = 'Кликни!';
    gameStartBtn.disabled = false;

    const clickHandler = () => {
      if (!gameRunning) return;
      gameScore++;
      gameScoreEl.textContent = gameScore;
    };

    gameStartBtn.addEventListener('click', clickHandler);

    gameInterval = setInterval(() => {
      gameTime--;
      gameTimeEl.textContent = gameTime;
      if (gameTime <= 0) {
        clearInterval(gameInterval);
        gameRunning = false;
        gameStartBtn.textContent = 'Старт отново';
        gameStartBtn.removeEventListener('click', clickHandler);
      }
    }, 1000);
  });
}

/* FAKE CHAT */

const chatMessages = document.getElementById('chat-messages');

const chatScript = [
  { from: 'user', text: 'Понякога се чувствам много различен.' },
  { from: 'viktor', text: 'Различен не значи грешен. Значи интересен.' },
  { from: 'user', text: 'Страх ме е дали хората ще ме приемат.' },
  { from: 'viktor', text: 'Най-важното е ти да приемеш себе си. Останалото идва по-късно.' },
  { from: 'user', text: 'А ако никой не ме разбере?' },
  { from: 'viktor', text: 'Ще има хора, които ще те разберат. Понякога просто се появяват по-късно.' }
];

let chatIndex = 0;

function nextChatMessage() {
  if (!chatMessages) return;
  if (chatIndex >= chatScript.length) return;

  const msg = chatScript[chatIndex];
  const div = document.createElement('div');
  div.classList.add('chat-message');
  if (msg.from === 'viktor') {
    div.classList.add('from-viktor');
    div.innerHTML = `<span class="chat-name">Виктор:</span> ${msg.text}`;
  } else {
    div.classList.add('from-user');
    div.innerHTML = `<span class="chat-name">Ти:</span> ${msg.text}`;
  }
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  chatIndex++;
}

window.nextChatMessage = nextChatMessage;
