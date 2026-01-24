/* TAB SYSTEM */
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

/* THEME SWITCH */
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

/* FLAG GAME: RAINBOW CATCH */

let flagGameRunning = false;
let flagScore = 0;
let flagSpawnInterval = null;
let flagFallInterval = null;
let flags = [];
let leaderboard = [];

const flagGameOverlay = document.getElementById('flag-game-overlay');
const flagGameArea = document.getElementById('flag-game-area');
const flagScoreEl = document.getElementById('flag-score');
const flagGameStartBtn = document.getElementById('flag-game-start');
const leaderboardList = document.getElementById('leaderboard-list');

const flagTypes = [
  { type: 'lgbt', label: 'LGBTQ+' },
  { type: 'bi', label: 'BI' },
  { type: 'trans', label: 'TRANS' },
  { type: 'pan', label: 'PAN' },
  { type: 'straight', label: 'STRAIGHT' }
];

function openFlagGame() {
  if (!flagGameOverlay || !flagGameArea) return;
  flagGameOverlay.classList.add('active');
  startFlagGame();
}

function closeFlagGame() {
  if (!flagGameOverlay) return;
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
  if (flagGameArea) flagGameArea.innerHTML = '';

  if (triggerEnd) {
    endFlagGame();
  }
}

function spawnFlag() {
  if (!flagGameRunning || !flagGameArea) return;

  const width = flagGameArea.clientWidth;
  const x = Math.random() * (width - 70);

  const isStraight = Math.random() < 0.2; // 20% шанс да е straight
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
  if (!flagGameRunning || !flagGameArea) return;

  const height = flagGameArea.clientHeight;

  flags.forEach(f => {
    f.y += f.speed;
    f.el.style.top = `${f.y}px`;
  });

  flags = flags.filter(f => {
    if (f.y > height + 40) {
      if (f.el.dataset.type !== 'straight') {
        // изпуснато добро знаме – не губиш, просто го махаме
      }
      if (flagGameArea.contains(f.el)) {
        flagGameArea.removeChild(f.el);
      }
      return false;
    }
    return true;
  });
}

function endFlagGame() {
  const name = prompt(`Играта свърши! Точки: ${flagScore}\nВъведи име за класацията:`);
  if (!name) return;

  leaderboard.push({ name: name.trim(), score: flagScore });
  leaderboard.sort((a, b) => b.score - a.score);

  renderLeaderboard();
}

function renderLeaderboard() {
  if (!leaderboardList) return;
  leaderboardList.innerHTML = '';

  leaderboard.forEach(entry => {
    const li = document.createElement('li');
    li.textContent = `${entry.name} – ${entry.score} дъги`;
    leaderboardList.appendChild(li);
  });
}

/* FAKE AI CHAT – ПО-УМЕН */

const aiRepliesDefault = [
  "Разбирам те. Това, което чувстваш, има значение.",
  "Интересно е как го описваш. Кажи ми още.",
  "Не си сам в това усещане, дори да ти изглежда така.",
  "Различен не значи грешен. Различен значи интересен.",
  "Понякога е трудно да бъдеш себе си, но е по-честно.",
  "Харесва ми как се изразяваш. Продължи.",
  "Понякога просто е нужно някой да те чуе."
];

const aiRepliesByKeyword = [
  {
    keywords: ["sad", "тъжен", "тъжно", "депрес", "сам", "самота"],
    replies: [
      "Звучи тежко. Дори да се чувстваш сам, това, което носиш в себе си, е важно.",
      "Понякога е окей да не си окей. Не си длъжен да си силен през цялото време.",
      "Това, че се чувстваш така, не те прави слаб. Прави те истински. Как би описал това чувство с една дума?"
    ]
  },
  {
    keywords: ["gay", "гей", "сексуалност", "ориентация", "лгбт", "lgbt"],
    replies: [
      "Сексуалността ти не е проблем за оправяне, а част от това кой си.",
      "Няма нищо грешно в това кого обичаш. Точка.",
      "Да си гей не те прави по-малко ценен. Напротив – прави те по-истински. Как се чувстваш с това днес?"
    ]
  },
  {
    keywords: ["различен", "странен", "weird", "не като другите"],
    replies: [
      "Различното често е най-интересното нещо в един човек.",
      "Ако всички бяхме еднакви, щеше да е ужасно скучно.",
      "Твоето „различно“ е точно това, което те прави запомнящ се. В какво най-много се усещаш различен?"
    ]
  },
  {
    keywords: ["страх", "уплашен", "притеснен", "тревожен"],
    replies: [
      "Страхът е нормална реакция, особено когато си честен със себе си.",
      "Можеш да си уплашен и смел едновременно. Това, че продължаваш, вече е сила.",
      "От какво те е най-много страх в момента?"
    ]
  },
  {
    keywords: ["щастлив", "добре", "радост", "яко"],
    replies: [
      "Радвам се, че се чувстваш така. Разкажи ми какво те направи щастлив.",
      "Тези моменти са важни. Запомни ги – те ти напомнят защо си струва.",
      "Обичам да чувам за хубавите неща. Какво точно ти донесе това чувство?"
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
    return "Хубав въпрос. Какво е твоето усещане за отговора?";
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

/* expose for inline onclick */
window.sendMessage = sendMessage;
window.closeFlagGame = closeFlagGame;
