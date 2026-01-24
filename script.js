/* ============================
   LEADERBOARD (FIREBASE)
============================ */

async function renderLeaderboard() {
  const list = document.getElementById("leaderboard-list");
  if (!list || typeof loadLeaderboard !== "function") return;

  list.innerHTML = "";

  try {
    const entries = await loadLeaderboard();

    entries.forEach((entry, i) => {
      const li = document.createElement("li");
      li.setAttribute("data-rank", i + 1);
      li.textContent = `${entry.name} – ${entry.score} точки`;

      if (i === 0) li.classList.add("rank-1");
      if (i === 1) li.classList.add("rank-2");
      if (i === 2) li.classList.add("rank-3");

      list.appendChild(li);
    });
  } catch (e) {
    console.error("Грешка при зареждане на класацията:", e);
  }
}

/* ============================
   TAB SYSTEM
============================ */

function openTab(tabName, btn) {
  const tabs = document.querySelectorAll('.tab');
  const buttons = document.querySelectorAll('.tab-btn');

  tabs.forEach(tab => tab.classList.remove('active-tab'));
  buttons.forEach(b => b.classList.remove('active'));

  const activeSection = document.getElementById(tabName);
  if (!activeSection) return;

  activeSection.classList.add('active-tab');
  btn.classList.add('active');

  if (activeSection.classList.contains('reveal')) {
    activeSection.classList.add('visible');
  }
}

window.openTab = openTab;

/* ============================
   THEME SWITCH
============================ */

function toggleTheme() {
  document.body.classList.toggle('alt-theme');
}

window.toggleTheme = toggleTheme;

/* ============================
   REVEAL ON SCROLL
============================ */

document.addEventListener("DOMContentLoaded", () => {
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
});

/* ============================
   INTERACTIVE FACTS
============================ */

document.addEventListener("DOMContentLoaded", () => {
  const factItems = document.querySelectorAll('.fact-item');

  factItems.forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('expanded');
    });
  });
});

/* ============================
   MINI CLICK GAME
============================ */

document.addEventListener("DOMContentLoaded", () => {
  let gameScore = 0;
  let gameTime = 0;
  let gameInterval = null;
  let gameRunning = false;

  const gameStartBtn = document.getElementById('game-start');
  const gameScoreEl = document.getElementById('game-score');
  const gameTimeEl = document.getElementById('game-time');

  if (!gameStartBtn || !gameScoreEl || !gameTimeEl) return;

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
});

/* ============================
   FLAG GAME (RAINBOW CATCH)
============================ */

let flagGameRunning = false;
let flagScore = 0;
let flagSpawnInterval = null;
let flagFallInterval = null;
let flags = [];

const flagTypes = [
  { type: 'lgbt', label: 'LGBTQ+' },
  { type: 'bi', label: 'BI' },
  { type: 'trans', label: 'TRANS' },
  { type: 'pan', label: 'PAN' },
  { type: 'straight', label: 'STRAIGHT' }
];

let flagTimer = 120;
let flagTimerInterval = null;

let flagGameOverlay;
let flagGameArea;
let flagScoreEl;
let flagGameStartBtn;

function openFlagGame() {
  if (!flagGameOverlay || !flagGameArea || !flagScoreEl) return;

  flagGameOverlay.classList.add('active');
  startFlagGame();
}

function closeFlagGame() {
  stopFlagGame(false);
  if (flagGameOverlay) {
    flagGameOverlay.classList.remove('active');
  }
}

window.closeFlagGame = closeFlagGame;

function startFlagGame() {
  if (!flagGameArea || !flagScoreEl) return;

  flagGameRunning = true;
  flagScore = 0;
  flagScoreEl.textContent = flagScore;
  flags = [];
  flagGameArea.innerHTML = '';
  flagTimer = 120;
  document.getElementById("flag-timer").textContent = flagTimer;

  flagTimerInterval = setInterval(() => {
  flagTimer--;
  document.getElementById("flag-timer").textContent = flagTimer;

  if (flagTimer <= 0) {
    stopFlagGame(true);
  }
}, 1000);

  flagSpawnInterval = setInterval(spawnFlag, 225);
  flagFallInterval = setInterval(updateFlags, 40);
}

function stopFlagGame(triggerEnd = true) {
  clearInterval(flagTimerInterval);
  flagGameRunning = false;
  clearInterval(flagSpawnInterval);
  clearInterval(flagFallInterval);
  flags = [];
  if (flagGameArea) {
    flagGameArea.innerHTML = '';
  }

  if (triggerEnd) endFlagGame();
}

function spawnFlag() {
  if (!flagGameRunning || !flagGameArea) return;

  // Колко флага да се spawn-ват наведнъж
  const count = 2; // смени на 3, 4, 5...

  for (let i = 0; i < count; i++) {
    createFlag();
  }
}
function createFlag() {
  const width = flagGameArea.clientWidth || 300;
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
    speed: 4 + Math.random() * 3
  };

  div.addEventListener('click', () => {
    if (!flagGameRunning) return;

    if (div.dataset.type === 'straight') {
      stopFlagGame(true);
    } else {
      flagScore++;
      if (flagScoreEl) {
        flagScoreEl.textContent = flagScore;
      }
      if (flagGameArea.contains(div)) {
        flagGameArea.removeChild(div);
      }
      flags = flags.filter(f => f !== flagObj);
    }
  });

  flags.push(flagObj);
  flagGameArea.appendChild(div);
}


function updateFlags() {
  if (!flagGameRunning || !flagGameArea) return;

  const height = flagGameArea.clientHeight || 320;

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
    if (flagGameOverlay) {
      flagGameOverlay.classList.remove("active");
    }
    return;
  }

  if (typeof saveScore === "function") {
    try {
      await saveScore(name, flagScore);
      await renderLeaderboard();
    } catch (e) {
      console.error("Грешка при запис на резултат:", e);
    }
  }

  if (flagGameOverlay) {
    flagGameOverlay.classList.remove("active");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  flagGameOverlay = document.getElementById('flag-game-overlay');
  flagGameArea = document.getElementById('flag-game-area');
  flagScoreEl = document.getElementById('flag-score');
  flagGameStartBtn = document.getElementById('flag-game-start');

  if (flagGameStartBtn) {
    flagGameStartBtn.addEventListener('click', openFlagGame);
  }

  renderLeaderboard();
});

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
console.log("SCRIPT LOADED");

function toggleThemeMenu() {
  const menu = document.getElementById("theme-menu");
  menu.classList.toggle("visible");
}

function setTheme(theme) {
  const body = document.body;
  body.classList.remove("light", "dark", "rgb");
  body.classList.add(theme);
  document.getElementById("theme-menu").classList.remove("visible");
}






