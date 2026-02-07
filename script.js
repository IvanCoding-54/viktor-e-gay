/* ============================
   VIKTOR.RGB - Main JavaScript
   Enhanced & Optimized Version
============================ */

// ========================================
// UTILITY FUNCTIONS
// ========================================

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ========================================
// LEADERBOARD (FIREBASE)
// ========================================

async function renderLeaderboard() {
  const list = document.getElementById("leaderboard-list");
  if (!list || typeof loadLeaderboard !== "function") return;

  list.innerHTML = "<li>Зареждане...</li>";

  try {
    const entries = await loadLeaderboard();

    if (entries.length === 0) {
      list.innerHTML = "<li>Няма записани резултати още.</li>";
      return;
    }

    list.innerHTML = "";
    entries.forEach((entry, i) => {
      const li = document.createElement("li");
      li.setAttribute("data-rank", i + 1);
      li.textContent = `${entry.name} – ${entry.score} точки`;

      if (i === 0) li.classList.add("rank-1");
      else if (i === 1) li.classList.add("rank-2");
      else if (i === 2) li.classList.add("rank-3");

      list.appendChild(li);
    });
  } catch (e) {
    console.error("Грешка при зареждане на класацията:", e);
    list.innerHTML = "<li>Грешка при зареждане</li>";
  }
}

async function renderAimLeaderboard() {
  const list = document.getElementById("aim-leaderboard-list");
  if (!list) return;

  list.innerHTML = "<li>Зареждане...</li>";

  try {
    const entries = await loadAimLeaderboard();

    if (entries.length === 0) {
      list.innerHTML = "<li>Няма записани резултати още.</li>";
      return;
    }

    list.innerHTML = "";
    entries.forEach((e, i) => {
      const li = document.createElement("li");
      li.setAttribute("data-rank", i + 1);
      li.textContent = `${e.name} – ${e.score} точки`;
      
      if (i === 0) li.classList.add("rank-1");
      else if (i === 1) li.classList.add("rank-2");
      else if (i === 2) li.classList.add("rank-3");
      
      list.appendChild(li);
    });
  } catch (e) {
    console.error("Грешка при зареждане на aim класацията:", e);
    list.innerHTML = "<li>Грешка при зареждане</li>";
  }
}

// ========================================
// TAB SYSTEM
// ========================================

function openTab(tabName, btn) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active-tab'));
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
  });

  const activeSection = document.getElementById(tabName);
  if (!activeSection) return;

  activeSection.classList.add('active-tab');
  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');

  if (activeSection.classList.contains('reveal')) {
    activeSection.classList.add('visible');
  }

  // Smooth scroll to top on mobile
  if (window.innerWidth < 800) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.getAttribute('data-tab');
      if (tabName) {
        openTab(tabName, btn);
      }
    });
  });
}

window.openTab = openTab;

// ========================================
// THEME SYSTEM
// ========================================

function toggleThemeMenu() {
  const menu = document.getElementById("theme-menu");
  const toggle = document.getElementById("theme-toggle-btn");
  if (!menu) return;
  
  const isVisible = menu.classList.toggle("visible");
  if (toggle) {
    toggle.setAttribute('aria-expanded', isVisible);
  }
}

function setTheme(theme) {
  const body = document.body;
  const validThemes = ["light", "dark", "rgb", "sakura", "cyber", "ocean"];
  
  if (!validThemes.includes(theme)) {
    console.warn(`Invalid theme: ${theme}`);
    return;
  }

  body.classList.remove(...validThemes);
  body.classList.add(theme);
  
  const menu = document.getElementById("theme-menu");
  if (menu) menu.classList.remove("visible");
  
  const toggle = document.getElementById("theme-toggle-btn");
  if (toggle) toggle.setAttribute('aria-expanded', 'false');

  // Save preference
  try {
    localStorage.setItem('viktor-theme', theme);
  } catch (e) {
    console.warn('Could not save theme preference:', e);
  }
}

// Load saved theme
function loadSavedTheme() {
  try {
    const saved = localStorage.getItem('viktor-theme');
    if (saved) setTheme(saved);
  } catch (e) {
    console.warn('Could not load theme preference:', e);
  }
}

function initThemeSystem() {
  const toggleBtn = document.getElementById("theme-toggle-btn");
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleThemeMenu);
  }
  
  const themeButtons = document.querySelectorAll('#theme-menu button[data-theme]');
  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme');
      if (theme) {
        setTheme(theme);
      }
    });
  });
  
  // Close theme menu when clicking outside
  document.addEventListener('click', (e) => {
    const menu = document.getElementById("theme-menu");
    const toggle = document.getElementById("theme-toggle-btn");
    if (menu && toggle && !menu.contains(e.target) && !toggle.contains(e.target)) {
      menu.classList.remove('visible');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

window.toggleThemeMenu = toggleThemeMenu;
window.setTheme = setTheme;

// ========================================
// REVEAL ON SCROLL
// ========================================

function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  revealElements.forEach(el => observer.observe(el));
}

// ========================================
// INTERACTIVE FACTS
// ========================================

function initInteractiveFacts() {
  document.querySelectorAll('.fact-item').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('expanded');
    });
  });
}

// ========================================
// MINI CLICK GAME
// ========================================

function initMiniClickGame() {
  let score = 0;
  let time = 0;
  let interval = null;
  let running = false;

  const btn = document.getElementById("game-start");
  const scoreEl = document.getElementById('game-score');
  const timeEl = document.getElementById('game-time');

  if (!btn || !scoreEl || !timeEl) return;

  btn.addEventListener('click', () => {
    if (running) {
      // Clicking during game
      score++;
      scoreEl.textContent = score;
      return;
    }

    // Start new game
    running = true;
    score = 0;
    time = 5;

    scoreEl.textContent = score;
    timeEl.textContent = time;
    btn.textContent = 'Кликни!';

    interval = setInterval(() => {
      time--;
      timeEl.textContent = time;

      if (time <= 0) {
        clearInterval(interval);
        running = false;
        btn.textContent = `Резултат: ${score} точки! Кликни за ново начало`;
        
        setTimeout(() => {
          btn.textContent = 'Старт отново';
        }, 2000);
      }
    }, 1000);
  });
}

// ========================================
// AIM TRAINER
// ========================================

let aimScore = 0;
let aimTime = 20;
let aimInterval = null;
let aimSpawnInterval = null;
let aimRunning = false;

// Preload sound effect
let popSound = null;
try {
  popSound = new Audio("sounds/pop.mp3");
  popSound.preload = "auto";
  popSound.volume = 0.5;
} catch (e) {
  console.warn('Could not preload sound effect:', e);
}

function playPopSound() {
  try {
    if (popSound) {
      // Clone the audio to allow multiple simultaneous plays
      const sound = popSound.cloneNode();
      sound.volume = 0.5;
      sound.play().catch(e => console.log('Audio play failed:', e));
    }
  } catch (e) {
    console.log('Audio error:', e);
  }
}

function spawnAimTarget() {
  const aimArea = document.getElementById("aim-area");
  if (!aimArea || !aimRunning) return;

  const target = document.createElement("div");
  target.className = "aim-target aim-flag-rainbow";

  // Create rainbow stripes
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
    if (!aimRunning) return;
    
    aimScore++;
    document.getElementById("aim-score").textContent = aimScore;

    // Animation
    target.classList.add("fade-out");

    // Play sound effect
    playPopSound();

    // Remove after animation
    setTimeout(() => target.remove(), 400);
  };

  aimArea.appendChild(target);

  // Auto-remove if not clicked
  setTimeout(() => {
    if (target.parentElement) target.remove();
  }, 900);
}

function stopAimTrainer() {
  aimRunning = false;
  clearInterval(aimInterval);
  clearInterval(aimSpawnInterval);
  
  const aimArea = document.getElementById("aim-area");
  if (aimArea) aimArea.innerHTML = "";
  
  const timeEl = document.getElementById("aim-time");
  if (timeEl) timeEl.textContent = "0";
}

function initAimTrainer() {
  const startBtn = document.getElementById("aim-start");
  const stopBtn = document.getElementById("aim-stop");

  if (!startBtn || !stopBtn) return;

  startBtn.onclick = async () => {
    if (aimRunning) return;

    aimRunning = true;
    aimScore = 0;
    aimTime = 20;

    document.getElementById("aim-score").textContent = aimScore;
    document.getElementById("aim-time").textContent = aimTime;
    
    const aimArea = document.getElementById("aim-area");
    if (aimArea) aimArea.innerHTML = "";

    clearInterval(aimInterval);
    clearInterval(aimSpawnInterval);

    aimInterval = setInterval(async () => {
      aimTime--;
      document.getElementById("aim-time").textContent = aimTime;

      if (aimTime <= 0) {
        stopAimTrainer();

        const name = prompt("Край! Твоят резултат: " + aimScore + "\nВъведи име:");
        if (name && name.trim()) {
          try {
            await saveAimScore(name.trim(), aimScore);
            await renderAimLeaderboard();
          } catch (e) {
            console.error("Грешка при запис:", e);
            alert("Грешка при записване на резултата");
          }
        }
      }
    }, 1000);

    aimSpawnInterval = setInterval(spawnAimTarget, 450);
  };

  stopBtn.onclick = () => {
    stopAimTrainer();
  };
}

// ========================================
// RAINBOW CATCH — POPUP VERSION
// ========================================

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
  if (!flagGameOverlay) return;
  flagGameOverlay.classList.add('active');
  startFlagGame();
}

function closeFlagGame() {
  stopFlagGame(false);
  if (flagGameOverlay) flagGameOverlay.classList.remove('active');
}

function initFlagGameCloseButton() {
  const closeBtn = document.getElementById('flag-game-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeFlagGame);
  }
}

window.closeFlagGame = closeFlagGame;

function startFlagGame() {
  flagGameRunning = true;
  flagScore = 0;
  if (flagScoreEl) flagScoreEl.textContent = flagScore;
  flags = [];
  if (flagGameArea) flagGameArea.innerHTML = '';
  flagTimer = 120;
  
  const timerEl = document.getElementById("flag-timer");
  if (timerEl) timerEl.textContent = flagTimer;

  flagTimerInterval = setInterval(() => {
    flagTimer--;
    const timerEl = document.getElementById("flag-timer");
    if (timerEl) timerEl.textContent = flagTimer;

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
  if (flagGameArea) flagGameArea.innerHTML = '';

  if (triggerEnd) endFlagGame();
}

function spawnFlag() {
  const count = 2;
  for (let i = 0; i < count; i++) createFlag();
}

function createFlag() {
  if (!flagGameArea) return;
  
  const width = flagGameArea.clientWidth;
  const x = Math.random() * (width - 110);

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
      if (flagScoreEl) flagScoreEl.textContent = flagScore;
      
      // Play pop sound
      playPopSound();
      
      div.remove();
      flags = flags.filter(f => f !== flagObj);
    }
  });

  flags.push(flagObj);
  flagGameArea.appendChild(div);
}

function updateFlags() {
  if (!flagGameArea) return;
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

  if (name && name.trim() && typeof saveScore === "function") {
    try {
      await saveScore(name.trim(), flagScore);
      await renderLeaderboard();
    } catch (e) {
      console.error("Грешка при запис:", e);
      alert("Грешка при записване на резултата");
    }
  }

  if (flagGameOverlay) flagGameOverlay.classList.remove("active");
}

function initFlagGame() {
  flagGameOverlay = document.getElementById('flag-game-overlay');
  flagGameArea = document.getElementById('flag-game-area');
  flagScoreEl = document.getElementById('flag-score');

  const startBtn = document.getElementById("flag-game-start");
  if (startBtn) {
    startBtn.addEventListener('click', openFlagGame);
  }
}

// ========================================
// AI CHAT
// ========================================

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

// Allow Enter key to send message
function initChatEnterKey() {
  const input = document.getElementById("chat-input");
  if (!input) return;
  
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
}

function initChatSendButton() {
  const sendBtn = document.getElementById("chat-send-btn");
  if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
  }
}

window.sendMessage = sendMessage;

// ========================================
// MOUSE PARTICLE EFFECT
// ========================================

let particleCount = 0;
const MAX_PARTICLES = 50;

const createParticle = debounce((e) => {
  if (particleCount >= MAX_PARTICLES) return;

  const particle = document.createElement('div');
  particle.className = 'particle';
  document.body.appendChild(particle);
  particleCount++;

  const size = Math.random() * 8 + 2;
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  
  const colors = ['#ff006a', '#00f0ff', '#7cff00', '#ffed00'];
  particle.style.background = colors[Math.floor(Math.random() * colors.length)];

  particle.style.left = `${e.clientX}px`;
  particle.style.top = `${e.clientY}px`;

  const destinationX = (Math.random() - 0.5) * 100;
  const destinationY = (Math.random() - 0.5) * 100;

  particle.animate([
    { transform: 'translate(0, 0)', opacity: 1 },
    { transform: `translate(${destinationX}px, ${destinationY}px)`, opacity: 0 }
  ], {
    duration: 1000,
    easing: 'ease-out'
  }).onfinish = () => {
    particle.remove();
    particleCount--;
  };
}, 50);

function initParticleEffect() {
  document.addEventListener('mousemove', createParticle);
}

// ========================================
// VIKTOR SECRET MODE
// ========================================

let inputSequence = "";
let viktorModeActive = false;
const secretWordEn = "viktor";
const secretWordBg = "виктор";

function activateViktorMode() {
  // Prevent multiple activations
  if (viktorModeActive) return;
  viktorModeActive = true;

  console.log("🌪️ VIKTOR MODE: ACTIVATING...");

  // Flash effect
  const flash = document.createElement('div');
  flash.className = 'secret-flash';
  document.body.appendChild(flash);
  
  setTimeout(() => flash.remove(), 1000);

  // Disable interactions during spin
  document.body.style.pointerEvents = "none";

  // Activate mega spin
  document.body.classList.add('mega-spin');

  // Switch to RGB theme
  setTimeout(() => {
    if (typeof setTheme === "function") {
      setTheme('rgb');
    } else {
      document.body.classList.remove('light', 'dark', 'sakura', 'cyber', 'ocean');
      document.body.classList.add('rgb');
    }
  }, 500);

  // Create rainbow particles explosion
  createRainbowExplosion();

  // Play celebration sound if available
  try {
    if (popSound) {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          const sound = popSound.cloneNode();
          sound.volume = 0.3;
          sound.playbackRate = 1 + (i * 0.2);
          sound.play().catch(e => console.log('Sound failed:', e));
        }, i * 200);
      }
    }
  } catch (e) {
    console.log('Audio error:', e);
  }

  // Stop spin after 10 seconds
  setTimeout(() => {
    document.body.classList.remove('mega-spin');
    document.body.style.pointerEvents = "auto";
    viktorModeActive = false;
    
    // Show celebration message
    const message = document.createElement('div');
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #ff006a, #00f0ff);
      color: white;
      padding: 30px 50px;
      border-radius: 20px;
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      z-index: 999999;
      box-shadow: 0 0 50px rgba(255, 0, 106, 0.8);
      animation: message-pop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;
    message.textContent = "Добре дошли в пълния спектър на Виктор! 🌈";
    document.body.appendChild(message);

    setTimeout(() => {
      message.style.animation = 'message-pop 0.3s reverse';
      setTimeout(() => message.remove(), 300);
    }, 3000);
    
    console.log("🌪️ VIKTOR MODE: COMPLETE!");
  }, 10000);

  console.log("🌪️ VIKTOR MODE: ACTIVATED");
}

function createRainbowExplosion() {
  const colors = ['#ff006a', '#00f0ff', '#7cff00', '#ffed00', '#ff00ff', '#00ff00'];
  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    setTimeout(() => {
      const particle = document.createElement('div');
      particle.className = 'viktor-explosion-particle';
      
      const size = Math.random() * 20 + 10;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.position = 'fixed';
      particle.style.left = '50%';
      particle.style.top = '50%';
      particle.style.borderRadius = '50%';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '99999';
      particle.style.boxShadow = `0 0 20px ${particle.style.background}`;
      
      document.body.appendChild(particle);

      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = Math.random() * 300 + 200;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;

      particle.animate([
        { 
          transform: 'translate(-50%, -50%) scale(1)',
          opacity: 1
        },
        { 
          transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`,
          opacity: 0
        }
      ], {
        duration: 2000,
        easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
      }).onfinish = () => particle.remove();
    }, i * 20);
  }
}

function initSecretMode() {
  document.addEventListener('keydown', (e) => {
    // Ignore if typing in input fields
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }

    inputSequence += e.key.toLowerCase();

    // Keep only last 10 characters
    if (inputSequence.length > 10) {
      inputSequence = inputSequence.substring(inputSequence.length - 10);
    }

    // Check for secret words
    if (inputSequence.includes(secretWordEn) || inputSequence.includes(secretWordBg)) {
      activateViktorMode();
      inputSequence = "";
    }
  });

  console.log("🔐 Secret mode initialized. Type 'viktor' or 'виктор' to activate!");
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Инициализиране на Viktor.RGB...");

  // Load theme preference
  loadSavedTheme();

  // Initialize UI components
  initTabs();
  initThemeSystem();
  initScrollReveal();
  initInteractiveFacts();
  
  // Initialize games
  initMiniClickGame();
  initAimTrainer();
  initFlagGame();
  initFlagGameCloseButton();
  
  // Initialize chat
  initChatEnterKey();
  initChatSendButton();
  
  // Initialize effects
  initParticleEffect();
  initSecretMode();

  // Load leaderboards
  renderLeaderboard();
  renderAimLeaderboard();

  console.log("✅ Viktor.RGB готов!");
});
