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

/* MINI GAME */
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

/* FAKE AI CHAT */

// Основни отговори
const aiRepliesDefault = [
  "Разбирам те. Това, което чувстваш, има значение.",
  "Интересно е как го описваш. Кажи ми още.",
  "Не си сам в това усещане, дори да ти изглежда така.",
  "Различен не значи грешен. Различен значи интересен.",
  "Понякога е трудно да бъдеш себе си, но е по-честно.",
  "Харесва ми как се изразяваш. Продължи.",
  "Понякога просто е нужно някой да те чуе."
];

// Отговори по ключови думи
const aiRepliesByKeyword = [
  {
    keywords: ["sad", "тъжен", "тъжно", "депрес", "сам"],
    replies: [
      "Звучи тежко. Дори да се чувстваш сам, това, което носиш в себе си, е важно.",
      "Понякога е окей да не си окей. Не си длъжен да си силен през цялото време.",
      "Това, че се чувстваш така, не те прави слаб. Прави те истински."
    ]
  },
  {
    keywords: ["gay", "гей", "сексуалност", "ориентация"],
    replies: [
      "Сексуалността ти не е проблем за оправяне, а част от това кой си.",
      "Няма нищо грешно в това кого обичаш. Точка.",
      "Да си гей не те прави по-малко ценен. Напротив – прави те по-истински."
    ]
  },
  {
    keywords: ["различен", "странен", "weird"],
    replies: [
      "Различното често е най-интересното нещо в един човек.",
      "Ако всички бяхме еднакви, щеше да е ужасно скучно.",
      "Твоето „различно“ е точно това, което те прави запомнящ се."
    ]
  }
];

// Функция за избор на отговор
function getAiReply(userText) {
  const lower = userText.toLowerCase();

  for (const group of aiRepliesByKeyword) {
    if (group.keywords.some(k => lower.includes(k))) {
      return group.replies[Math.floor(Math.random() * group.replies.length)];
    }
  }

  return aiRepliesDefault[Math.floor(Math.random() * aiRepliesDefault.length)];
}

/* SEND MESSAGE */
function sendMessage() {
  const input = document.getElementById("chat-input");
  const messages = document.getElementById("chat-messages");
  if (!input || !messages) return;

  const text = input.value.trim();
  if (!text) return;

  // Показваме твоето съобщение
  const userMsg = document.createElement("div");
  userMsg.classList.add("chat-message", "user");
  userMsg.textContent = text;
  messages.appendChild(userMsg);

  input.value = "";
  messages.scrollTop = messages.scrollHeight;

  // typing animation
  const typing = document.createElement("div");
  typing.classList.add("typing");
  typing.textContent = "Виктор пише...";
  messages.appendChild(typing);
  messages.scrollTop = messages.scrollHeight;

  // AI отговор
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
