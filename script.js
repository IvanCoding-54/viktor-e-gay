/* ============================
   LEADERBOARD (FIREBASE)
============================ */

async function renderLeaderboard() {
  const list = document.getElementById("leaderboard-list");
  if (!list) return;

  list.innerHTML = "";

  const entries = await loadLeaderboard();

  entries.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.name} – ${entry.score} точки`;
    list.appendChild(li);
  });
}

/* ============================
   TAB SYSTEM
============================ */

function openTab(tabName, btn) {
  const tabs = document.querySelectorAll('.tab');
  const buttons = document.querySelectorAll('.tab-btn');

  tabs.forEach(tab => tab.classList.remove('active-tab'));
  buttons.forEach(b => b.classList.remove('active'));

  document.getElementById(tabName).classList.add('active-tab');
  btn.classList.add('active');

  const activeSection = document.getElementById(tabName);
  if (activeSection.classList.contains('reveal')) {
    activeSection.classList.add('visible');
  }
}

/* ============================
   THEME SWITCH
============================ */

function toggleTheme() {
  document.body.classList.toggle('alt-theme');
}

/* ============================
   REVEAL ON SCROLL
============================ */

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

/* ============================
   INTERACTIVE FACTS
============================ */

const factItems = document.querySelectorAll('.fact-item');

factItems.forEach(item => {
  item.addEventListener('click', () => {
    item.classList.toggle('expanded');
  });
});

/* ============================
   MINI CLICK GAME
============================ */

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

/* ============================
   FLAG GAME (RAINBOW CATCH)
============================ */

let flagGameRunning = false;
let flagScore = 0;
let flagSpawnInterval = null;
let flagFallInterval = null;
let flags = [];

const flagGameOverlay = document.getElementById('flag-game-overlay');
const flagGameArea = document.getElementById('flag-game-area');
const flagScoreEl = document.getElementById('flag-score');
const flagGameStartBtn = document.getElementById('flag-game-start');

const flagTypes = [
  { type: 'lgbt', label: 'LGBTQ+' },
  { type: 'bi', label: 'BI' },
  { type: 'trans', label: 'TRANS' },
  { type: 'pan', label: 'PAN' },
  { type: 'straight', label: 'STRAIGHT' }
];

function openFlagGame() {
  flagGameOverlay.classList.add('active');
  startFlagGame();
}

function closeFlagGame() {
  stopFlagGame(false);
  flagGameOverlay.classList.remove('active');
}

if (flagGameStartBtn) {
  flagGameStartBtn.addEventListener('click', openFlagGame);
}

function startFlagGame() {
  flagGameRunning = true;
  flagScore = 0;
  flagScoreEl.textContent = flagScore;
  flags = [];
  flagGameArea.innerHTML = '';

  flagSpawnInterval = setInterval(spawnFlag, 700);
  flagFallInterval = setInterval(updateFlags, 40);
}

function stopFlagGame(triggerEnd = true) {
  flagGameRunning = false;
  clearInterval(flagSpawnInterval);
  clearInterval(flagFallInterval);
  flags = [];
  flagGameArea.innerHTML = '';

  if (triggerEnd) endFlagGame();
}

function spawnFlag() {
  if (!flagGameRunning) return;

  const width = flagGameArea.clientWidth;
  const x = Math.random() * (width - 70);

  const isStraight = Math.random() < 0.2;
  const goodFlags = flagTypes.filter(f => f.type !== 'straight');
  const chosen = isStraight
    ? flagTypes.find(f => f.type === 'straight')
    : goodFlags[Math.floor(Math.random() * goodFlags.length)];

  const div = document.createElement('div');
  div.classList.add('flag', chosen.type);
  div.style.left = `${x}px`;
  div.dataset.type = chosen.type;
  div.textContent = chosen.label;

  const flagObj = {
    el: div,
    y: -40,
    speed: 2 + Math.random() * 2
  };

  div.addEventListener('click', () => {
    if (!flagGameRunning) return;

    if (div.dataset.type === 'straight') {
      stopFlagGame(true);
    } else {
      flagScore++;
      flagScoreEl.textContent = flagScore;
      flagGameArea.removeChild(div);
      flags = flags.filter(f => f !== flagObj);
    }
  });

  flags.push(flagObj);
  flagGameArea.appendChild(div);
}

function updateFlags() {
  if (!flagGameRunning) return;

  const height = flagGameArea.clientHeight;

  flags.forEach(f => {
    f.y += f.speed;
    f.el.style.top = `${f.y}px`;
  });

  flags = flags.filter(f => {
    if (f.y > height + 40) {
      if (flagGameArea.contains(f.el)) {
        flagGameArea.removeChild(f.el);
      }
      return false;
    }
    return true;
  });
}

async function endFlagGame() {
  const name = prompt(`Играта свърши! Точки: ${flagScore}\nВъведи име:`);

  if (!name) {
    flagGameOverlay.classList.remove("active");
    return;
  }

  await saveScore(name, flagScore);
  await renderLeaderboard();

  flagGameOverlay.classList.remove("active");
}

/* ============================
   AI CHAT
============================ */

const aiRepliesDefault = [
  "Разбирам те. Това, което чувстваш, има значение.",
  "Интересно е как го описваш. Кажи ми още.",
  "Не си сам в това усещане.",
  "Различен не значи грешен.",
  "Понякога е трудно да бъдеш себе си.",
  "Харесва ми как се изразяваш.",
  "Понякога просто е нужно някой да те чуе."
];

const aiRepliesByKeyword = [
  {
    keywords: ["sad", "тъжен", "депрес", "сам"],
    replies: [
      "Звучи тежко. Разкажи ми още.",
      "Понякога е окей да не си окей.",
      "Това, че се чувстваш така, не те прави слаб."
    ]
  },
  {
    keywords: ["gay", "гей", "ориентация", "lgbt"],
    replies: [
      "Сексуалността ти е част от това кой си.",
      "Няма нищо грешно в това кого обичаш.",
      "Да си гей не те прави по-малко ценен."
    ]
  }
];

function getAiReply(userText) {
  const lower = userText.toLowerCase();

  for (const group of aiRepliesByKeyword) {
    if (group.keywords.some(k => lower.includes(k))) {
      return group.replies[Math.floor(Math.random() * group.replies.length)];
    }
  }

  if (lower.endsWith("?")) {
    return "Хубав въпрос. Какво мислиш ти?";
  }

  return aiRepliesDefault[Math.floor(Math.random() * aiRepliesDefault.length)];
}

function sendMessage() {
  const input = document.getElementById("chat-input");
  const messages = document.getElementById("chat-messages");
  if (!input || !messages) return;

  const text = input.value.trim();
  if (!text) return;

  const userMsg = document.createElement("div");
  userMsg.classList.add("chat-message", "user");
  userMsg.textContent = text;
  messages.appendChild(userMsg);

  input.value = "";
  messages.scrollTop = messages.scrollHeight;

  const typing = document.createElement("div");
  typing.classList.add("typing");
  typing.textContent = "Виктор пише...";
  messages.appendChild(typing);
  messages.scrollTop = messages.scrollHeight;

  const replyText = getAiReply(text);

  setTimeout(() => {
    typing.remove();

    const aiMsg = document.createElement("div");
    aiMsg.classList.add("chat-message", "ai");
    aiMsg.textContent = replyText;
    messages.appendChild(aiMsg);

    messages.scrollTop = messages.scrollHeight;
  }, 900);
}

window.sendMessage = sendMessage;
window.closeFlagGame = closeFlagGame;

document.addEventListener("DOMContentLoaded", () => { 
   renderLeaderboard(); 
});
