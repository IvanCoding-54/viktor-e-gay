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

async function renderAimLeaderboard() {
  const list = document.getElementById("aim-leaderboard-list");
  if (!list) return;

  list.innerHTML = "";
  const entries = await loadAimLeaderboard();

  if (entries.length === 0) {
    list.innerHTML = "<li>Няма записани резултати още.</li>";
    return;
  }

  entries.forEach((e, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${e.name} – ${e.score} точки`;
    list.appendChild(li);
  });
}

/* ============================
   TAB SYSTEM
============================ */

function openTab(tabName, btn) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active-tab'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

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

window.toggleThemeMenu = toggleThemeMenu;
window.setTheme = setTheme;
/* ============================
   REVEAL ON SCROLL
============================ */

document.addEventListener("DOMContentLoaded", () => {
  const revealElements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.2 });

  revealElements.forEach(el => observer.observe(el));
});

/* ============================
   INTERACTIVE FACTS
============================ */

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.fact-item').forEach(item => {
    item.addEventListener('click', () => item.classList.toggle('expanded'));
  });
});

/* ============================
   MINI CLICK GAME
============================ */

document.addEventListener("DOMContentLoaded", () => {
  let score = 0;
  let time = 0;
  let interval = null;
  let running = false;

  const btn = document.getElementById("game-start");
  const scoreEl = document.getElementById('game-score');
  const timeEl = document.getElementById('game-time');

  if (!btn) return;

  btn.addEventListener('click', () => {
    if (running) return;

    running = true;
    score = 0;
    time = 5;

    scoreEl.textContent = score;
    timeEl.textContent = time;
    btn.textContent = 'Кликни!';

    const clickHandler = () => {
      if (!running) return;
      score++;
      scoreEl.textContent = score;
    };

    btn.addEventListener('click', clickHandler);

    interval = setInterval(() => {
      time--;
      timeEl.textContent = time;

      if (time <= 0) {
        clearInterval(interval);
        running = false;
        btn.textContent = 'Старт отново';
        btn.removeEventListener('click', clickHandler);
      }
    }, 1000);
  });
});

/* ============================
   AIM TRAINER
============================ */

let aimScore = 0;
let aimTime = 20;
let aimInterval;
let aimSpawnInterval;

const aimArea = document.getElementById("aim-area");

function spawnAimTarget() {
  const target = document.createElement("div");
  target.className = "aim-target aim-flag-rainbow";

  for (let i = 0; i < 6; i++) {
    const stripe = document.createElement("div");
    stripe.className = "aim-target-stripe";
    target.appendChild(stripe);
  }

  const rect = aimArea.getBoundingClientRect();
  const x = Math.random() * (rect.width - 60);
  const y = Math.random() * (rect.height - 40);

  target.style.left = x + "px";
  target.style.top = y + "px";

  target.onclick = () => {
  aimScore++;
  document.getElementById("aim-score").textContent = aimScore;

  // Добавяме анимация
  target.classList.add("fade-out");

  // Пускаме звук
  const audio = new Audio("sounds/pop.mp3");
  audio.volume = 0.5;
  audio.play();

  // Премахваме елемента след анимацията
  setTimeout(() => target.remove(), 400);
};


  aimArea.appendChild(target);

  setTimeout(() => target.remove(), 900);
}
function stopAimTrainer() {
  clearInterval(aimInterval);        // спира таймера
  clearInterval(aimSpawnInterval);   // спира появата на знаменца
  aimArea.innerHTML = "";            // изчиства игралната зона
  document.getElementById("aim-time").textContent = "0"; // показва 0 секунди
}

document.getElementById("aim-start").onclick = async () => {
  aimScore = 0;
  aimTime = 20;

  document.getElementById("aim-score").textContent = aimScore;
  document.getElementById("aim-time").textContent = aimTime;
  aimArea.innerHTML = "";
   
  function stopAimTrainer() {
  clearInterval(aimInterval);        // спира таймера
  clearInterval(aimSpawnInterval);   // спира появата на знаменца
  aimArea.innerHTML = "";            // изчиства игралната зона
  document.getElementById("aim-time").textContent = "0"; // показва 0 секунди
}

  clearInterval(aimInterval);
  clearInterval(aimSpawnInterval);

  aimInterval = setInterval(async () => {
    aimTime--;
    document.getElementById("aim-time").textContent = aimTime;

    if (aimTime <= 0) {
      clearInterval(aimInterval);
      clearInterval(aimSpawnInterval);

      const name = prompt("Край! Твоят резултат: " + aimScore + "\nВъведи име:");
      if (name) {
        try {
          await saveAimScore(name, aimScore);
          await renderAimLeaderboard();
        } catch (e) {
          console.error("Грешка при запис:", e);
        }
      }
    }
  }, 1000);

  aimSpawnInterval = setInterval(spawnAimTarget, 450);
};
document.getElementById("aim-stop").onclick = () => {
  stopAimTrainer();
};


/* ============================
   RAINBOW CATCH — POPUP VERSION
============================ */

let flagGameRunning = false;
let flagScore = 0;
let flagSpawnInterval = null;
let flagFallInterval = null;
let flags = [];

let flagTimer = 120;
let flagTimerInterval = null;

let flagGameOverlay;
let flagGameArea;
let flagScoreEl;

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

window.closeFlagGame = closeFlagGame;

function startFlagGame() {
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

    if (flagTimer <= 0) stopFlagGame(true);
  }, 1000);

  flagSpawnInterval = setInterval(spawnFlag, 500);
  flagFallInterval = setInterval(updateFlags, 40);
}

function stopFlagGame(triggerEnd = true) {
  clearInterval(flagTimerInterval);
  clearInterval(flagSpawnInterval);
  clearInterval(flagFallInterval);

  flagGameRunning = false;
  flags = [];
  flagGameArea.innerHTML = '';

  if (triggerEnd) endFlagGame();
}

function spawnFlag() {
  const count = 2;
  for (let i = 0; i < count; i++) createFlag();
}

function createFlag() {
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
    speed: 4 + Math.random() * 3
  };

  div.addEventListener('click', () => {
    if (!flagGameRunning) return;

    if (div.dataset.type === 'straight') {
      stopFlagGame(true);
    } else {
      flagScore++;
      flagScoreEl.textContent = flagScore;
      div.remove();
      flags = flags.filter(f => f !== flagObj);
    }
  });

  flags.push(flagObj);
  flagGameArea.appendChild(div);
}

function updateFlags() {
  const height = flagGameArea.clientHeight;

  flags.forEach(f => {
    f.y += f.speed;
    f.el.style.top = `${f.y}px`;
  });

  flags = flags.filter(f => {
    if (f.y > height + 40) {
      f.el.remove();
      return false;
    }
    return true;
  });
}

async function endFlagGame() {
  const name = prompt(`Играта свърши! Точки: ${flagScore}\nВъведи име:`);

  if (name && typeof saveScore === "function") {
    await saveScore(name, flagScore);
    await renderLeaderboard();
  }

  flagGameOverlay.classList.remove("active");
}

document.addEventListener("DOMContentLoaded", () => {
  flagGameOverlay = document.getElementById('flag-game-overlay');
  flagGameArea = document.getElementById('flag-game-area');
  flagScoreEl = document.getElementById('flag-score');

  document.getElementById("flag-game-start").addEventListener('click', openFlagGame);

  renderLeaderboard();
  renderAimLeaderboard();
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
    keywords: ["sad", "тъжен", "депрес", "сам", "самота"],
    replies: [
      "Звучи тежко. Разкажи ми още.",
      "Понякога е окей да не си окей.",
      "Това, че се чувстваш така, не те прави слаб."
    ]
  },
  {
    keywords: ["gay", "гей", "ориентация", "lgbt", "лесбийка", "транс"],
    replies: [
      "Сексуалността ти е част от това кой си.",
      "Няма нищо грешно в това кого обичаш.",
      "Да си гей не те прави по-малко ценен."
    ]
  },
  {
    keywords: ["щастлив", "радост", "успех", "любов"],
    replies: [
      "Толкова се радвам за теб!",
      "Звучи прекрасно — сподели още!",
      "Тези моменти са безценни."
    ]
  }
];

function getAiReply(text) {
  const lower = text.toLowerCase();

  for (const group of aiRepliesByKeyword) {
    if (group.keywords.some(k => lower.includes(k))) {
      return group.replies[Math.floor(Math.random() * group.replies.length)];
    }
  }

  if (lower.endsWith("?")) return "Хубав въпрос. Какво мислиш ти?";

  return aiRepliesDefault[Math.floor(Math.random() * aiRepliesDefault.length)];
}

function sendMessage() {
  const input = document.getElementById("chat-input");
  const messages = document.getElementById("chat-messages");

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

  const reply = getAiReply(text);

  setTimeout(() => {
    typing.remove();

    const aiMsg = document.createElement("div");
    aiMsg.classList.add("chat-message", "ai");
    aiMsg.textContent = reply;
    messages.appendChild(aiMsg);

    messages.scrollTop = messages.scrollHeight;
  }, 900);
}

window.sendMessage = sendMessage;
document.addEventListener('mousemove', (e) => {
    const particle = document.createElement('div');
    particle.className = 'particle';
    document.body.appendChild(particle);

    const size = Math.random() * 8 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Случаен RGB цвят
    const colors = ['#ff006a', '#00f0ff', '#7cff00', '#ffed00'];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];

    particle.style.left = `${e.clientX}px`;
    particle.style.top = `${e.clientY}px`;

    // Анимация на движението
    const destinationX = (Math.random() - 0.5) * 100;
    const destinationY = (Math.random() - 0.5) * 100;

    particle.animate([
        { transform: 'translate(0, 0)', opacity: 1 },
        { transform: `translate(${destinationX}px, ${destinationY}px)`, opacity: 0 }
    ], {
        duration: 1000,
        easing: 'ease-out'
    }).onfinish = () => particle.remove();
});
/* --- VIKTOR SECRET MODE LOGIC --- */

let inputSequence = "";
const secretWordEn = "viktor";
const secretWordBg = "виктор";

document.addEventListener('keydown', (e) => {
    // Добавяме клавиша към поредицата
    inputSequence += e.key.toLowerCase();

    // Пазим само последните 10 символа
    if (inputSequence.length > 10) {
        inputSequence = inputSequence.substring(inputSequence.length - 10);
    }

    // Проверка за паролата (на английски или български)
    if (inputSequence.includes(secretWordEn) || inputSequence.includes(secretWordBg)) {
        activateViktorMode();
        inputSequence = ""; // Ресетваме, за да може да се пусне пак
    }
});

function activateViktorMode() {
    // 1. Създаваме светкавицата
    const flash = document.createElement('div');
    flash.className = 'secret-flash';
    document.body.appendChild(flash);
    
    // Премахваме светкавицата от DOM след 1 сек
    setTimeout(() => flash.remove(), 1000);

    // 2. Активираме въртенето
    document.body.classList.add('mega-spin');

    // 3. Сменяме темата на RGB (използваме твоята функция)
    if (typeof setTheme === "function") {
        setTheme('rgb');
    } else {
        document.body.classList.remove('light', 'dark');
        document.body.classList.add('rgb');
    }

    // 4. Спираме въртенето след 10 секунди
    setTimeout(() => {
        document.body.classList.remove('mega-spin');
        // Връщаме контрола над мишката
        document.body.style.pointerEvents = "auto"; 
        alert("Добре дошли в пълния спектър на Виктор! 🌈");
    }, 10000);

    console.log("🌪️ VIKTOR MODE: ACTIVATED");
}

console.log("✅ script.js зареден успешно");









