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
  const allTabs = document.querySelectorAll('.tab');
  const activeTab = document.querySelector('.tab.active-tab');
  
  // Prevent clicking same tab
  if (activeTab && activeTab.id === tabName) return;
  
  // Add page transition overlay
  const transitionOverlay = document.createElement('div');
  transitionOverlay.className = 'page-transition-overlay';
  document.body.appendChild(transitionOverlay);
  
  // Fade out current tab with slide
  if (activeTab) {
    activeTab.classList.add('tab-exit');
    
    setTimeout(() => {
      allTabs.forEach(t => {
        t.classList.remove('active-tab', 'tab-exit', 'tab-enter');
      });
      
      const newActiveTab = document.getElementById(tabName);
      if (newActiveTab) {
        newActiveTab.classList.add('active-tab', 'tab-enter');
        
        if (newActiveTab.classList.contains('reveal')) {
          newActiveTab.classList.add('visible');
        }
        
        // Remove enter animation after it completes
        setTimeout(() => {
          newActiveTab.classList.remove('tab-enter');
        }, 500);
      }
      
      // Remove transition overlay
      setTimeout(() => {
        transitionOverlay.remove();
      }, 300);
    }, 300);
  } else {
    // First tab load
    allTabs.forEach(t => t.classList.remove('active-tab'));
    const newActiveTab = document.getElementById(tabName);
    if (newActiveTab) {
      newActiveTab.classList.add('active-tab', 'tab-enter');
      if (newActiveTab.classList.contains('reveal')) {
        newActiveTab.classList.add('visible');
      }
      setTimeout(() => {
        newActiveTab.classList.remove('tab-enter');
      }, 500);
    }
    transitionOverlay.remove();
  }
  
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
  });

  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');

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
  const validThemes = ["light", "dark", "rgb", "sakura", "cyber", "ocean", "vaporwave", "neon", "pastel", "fire"];
  
  if (!validThemes.includes(theme)) {
    console.warn(`Invalid theme: ${theme}`);
    return;
  }

  // Add theme transition overlay
  const themeTransition = document.createElement('div');
  themeTransition.className = 'theme-transition-overlay';
  document.body.appendChild(themeTransition);
  
  // Trigger animation
  setTimeout(() => {
    themeTransition.classList.add('active');
  }, 10);
  
  // Change theme at peak of animation
  setTimeout(() => {
    body.classList.remove(...validThemes);
    body.classList.add(theme);
  }, 200);
  
  // Remove overlay
  setTimeout(() => {
    themeTransition.classList.remove('active');
    setTimeout(() => {
      themeTransition.remove();
    }, 300);
  }, 400);
  
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

// Combo system
let flagCombo = 0;
let flagComboTimer = null;
let flagComboMultiplier = 1;
const COMBO_TIMEOUT = 2000; // 2 seconds to maintain combo

let flagGameOverlay;
let flagGameArea;
let flagScoreEl;

const flagTypes = [
  { type: 'lgbt', label: 'LGBTQ+' },
  { type: 'bi', label: 'BI' },
  { type: 'trans', label: 'TRANS' },
  { type: 'pan', label: 'PAN' },
  { type: 'lesbian', label: 'LESBIAN' },
  { type: 'ace', label: 'ACE' },
  { type: 'nonbinary', label: 'NONBINARY' },
  { type: 'genderfluid', label: 'GENDERFLUID' },
  { type: 'aromantic', label: 'ARO' },
  { type: 'agender', label: 'AGENDER' },
  { type: 'intersex', label: 'INTERSEX' },
  { type: 'polyamory', label: 'POLY' },
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
  flagCombo = 0;
  flagComboMultiplier = 1;
  clearTimeout(flagComboTimer);
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

function resetCombo() {
  flagCombo = 0;
  flagComboMultiplier = 1;
  updateComboDisplay();
}

function increaseCombo() {
  flagCombo++;
  
  // Calculate multiplier based on combo
  if (flagCombo >= 10) {
    flagComboMultiplier = 3;
  } else if (flagCombo >= 5) {
    flagComboMultiplier = 2;
  } else {
    flagComboMultiplier = 1;
  }
  
  updateComboDisplay();
  
  // Reset combo timer
  clearTimeout(flagComboTimer);
  flagComboTimer = setTimeout(resetCombo, COMBO_TIMEOUT);
}

function updateComboDisplay() {
  // Find or create combo display element
  let comboDisplay = document.getElementById('flag-combo-display');
  
  if (!comboDisplay) {
    comboDisplay = document.createElement('div');
    comboDisplay.id = 'flag-combo-display';
    comboDisplay.className = 'flag-combo-display';
    
    const flagGameWindow = document.querySelector('.flag-game-window');
    if (flagGameWindow) {
      flagGameWindow.appendChild(comboDisplay);
    }
  }
  
  if (flagCombo > 1) {
    comboDisplay.style.display = 'block';
    comboDisplay.textContent = `🔥 COMBO x${flagCombo} (${flagComboMultiplier}x точки)`;
    
    // Add animation class
    comboDisplay.classList.remove('combo-pulse');
    void comboDisplay.offsetWidth; // Trigger reflow
    comboDisplay.classList.add('combo-pulse');
  } else {
    comboDisplay.style.display = 'none';
  }
}

function spawnFlag() {
  const count = 2;
  for (let i = 0; i < count; i++) createFlag();
}

function createFlag() {
  if (!flagGameArea) return;
  
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
      // Play error sound (different pitch)
      try {
        if (popSound) {
          const sound = popSound.cloneNode();
          sound.volume = 0.3;
          sound.playbackRate = 0.5; // Lower pitch for bad flag
          sound.play().catch(e => console.log('Audio play failed:', e));
        }
      } catch (e) {
        console.log('Audio error:', e);
      }
      
      resetCombo();
      stopFlagGame(true);
    } else {
      // Play pop sound
      playPopSound();
      
      // Increase combo
      increaseCombo();
      
      // Calculate points with multiplier
      const points = 1 * flagComboMultiplier;
      flagScore += points;
      
      if (flagScoreEl) flagScoreEl.textContent = flagScore;
      
      // Show points popup
      showPointsPopup(div, `+${points}`);
      
      div.remove();
      flags = flags.filter(f => f !== flagObj);
    }
  });

  flags.push(flagObj);
  flagGameArea.appendChild(div);
}

function showPointsPopup(element, text) {
  const popup = document.createElement('div');
  popup.className = 'points-popup';
  popup.textContent = text;
  popup.style.left = element.style.left;
  popup.style.top = element.style.top;
  
  if (flagGameArea) {
    flagGameArea.appendChild(popup);
    
    setTimeout(() => {
      popup.remove();
    }, 1000);
  }
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
      // Flag fell off screen - missed it!
      // Only reset combo if it was a good flag (not straight)
      if (f.el.dataset.type !== 'straight') {
        resetCombo();
      }
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
// MOUSE PARTICLE EFFECT & CURSOR TRAIL
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

// Cursor trail
let trailTimeout;
function createCursorTrail(e) {
  clearTimeout(trailTimeout);
  trailTimeout = setTimeout(() => {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    
    const colors = ['#ff006a', '#00f0ff', '#7cff00', '#ffed00', '#ff00ff'];
    trail.style.background = colors[Math.floor(Math.random() * colors.length)];
    trail.style.left = `${e.clientX - 6}px`;
    trail.style.top = `${e.clientY - 6}px`;
    
    document.body.appendChild(trail);
    
    setTimeout(() => trail.remove(), 500);
  }, 10);
}

function initParticleEffect() {
  document.addEventListener('mousemove', createParticle);
  document.addEventListener('mousemove', createCursorTrail);
}

// ========================================
// VIKTOR SECRET MODE & EASTER EGGS
// ========================================

let inputSequence = "";
let viktorModeActive = false;
const secretWordEn = "viktor";
const secretWordBg = "виктор";

// More easter eggs
const easterEggs = {
  "pride": () => {
    document.body.style.animation = 'rainbow-wave 2s ease-in-out';
    setTimeout(() => document.body.style.animation = '', 2000);
    showMessage("🌈 PRIDE POWER! 🌈");
  },
  "love": () => {
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.textContent = '❤️';
        heart.style.cssText = `
          position: fixed;
          font-size: 30px;
          left: ${Math.random() * 100}vw;
          top: -50px;
          pointer-events: none;
          z-index: 99999;
          animation: heart-fall 3s linear forwards;
        `;
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 3000);
      }, i * 100);
    }
    showMessage("💖 Love is Love! 💖");
  },
  "fabulous": () => {
    document.body.classList.add('sparkle-mode');
    setTimeout(() => document.body.classList.remove('sparkle-mode'), 5000);
    showMessage("✨ FABULOUS! ✨");
  },
  "rainbow": () => {
    createRainbowExplosion();
    showMessage("🌈 TASTE THE RAINBOW! 🌈");
  },
  "dance": () => {
    document.querySelector('.app').style.animation = 'wiggle 0.5s ease-in-out 5';
    showMessage("💃 DANCE TIME! 🕺");
  }
};

function showMessage(text) {
  const msg = document.createElement('div');
  msg.style.cssText = `
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
  msg.textContent = text;
  document.body.appendChild(msg);
  
  setTimeout(() => {
    msg.style.animation = 'message-pop 0.3s reverse';
    setTimeout(() => msg.remove(), 300);
  }, 2000);
}

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

    // Keep only last 15 characters
    if (inputSequence.length > 15) {
      inputSequence = inputSequence.substring(inputSequence.length - 15);
    }

    // Check for Viktor mode
    if (inputSequence.includes(secretWordEn) || inputSequence.includes(secretWordBg)) {
      activateViktorMode();
      inputSequence = "";
      return;
    }
    
    // Check for other easter eggs
    for (const [code, action] of Object.entries(easterEggs)) {
      if (inputSequence.includes(code)) {
        action();
        inputSequence = "";
        return;
      }
    }
  });

  console.log("🔐 Secret codes initialized!");
  console.log("Try typing: viktor, pride, love, fabulous, rainbow, dance");
}

// ========================================
// MUSIC PLAYER
// ========================================

let musicPlayer = {
  audio: null,
  ytPlayer: null,
  playlist: [],
  currentTrackIndex: 0,
  isPlaying: false,
  volume: 0.5,
  currentType: 'audio' // 'audio' or 'youtube'
};

function initMusicPlayer() {
  const toggleBtn = document.getElementById('music-player-toggle');
  const closeBtn = document.getElementById('music-player-close');
  const playBtn = document.getElementById('music-play');
  const prevBtn = document.getElementById('music-prev');
  const nextBtn = document.getElementById('music-next');
  const volumeSlider = document.getElementById('music-volume');
  const progressSlider = document.getElementById('music-progress');
  const uploadInput = document.getElementById('music-upload');
  const volumeIcon = document.getElementById('volume-icon');
  
  if (!toggleBtn) return;
  
  // Initialize audio element
  musicPlayer.audio = new Audio();
  musicPlayer.audio.volume = musicPlayer.volume;
  
  // DEFAULT PLAYLIST - Your MP3 songs
  // Add more MP3 files by putting them in the sounds/ folder
  
  const defaultPlaylist = [
    // Your MP3 file - This one WORKS!
    {
      name: 'Den Milame Idia Glossa 🎵',
      url: 'sounds/song1.mp3',
      type: 'audio'
    },
    {
      name: 'DJ Bobo - Pray',
      url: 'sounds/song2.mp3',
      type: 'audio'
    },
    {
      name: 'Modern Talking - Cheri Cheri Lady',
      url: 'sounds/song3.mp3',
      type: 'audio'
    },
    {
      name: 'Toni storaro /s priateli na masa',
      url: 'sounds/song4.mp3',
      type: 'audio'
    },
    {
      name: 'Орхан Мурад - Хиляди слънца',
      url: 'sounds/song5.mp3',
      type: 'audio'
    },
    {
      name: 'Орхан Мурад - Гурбетчии',
      url: 'sounds/song6.mp3',
      type: 'audio'
    },
    {
      name: 'СОФИ МАРИНОВА и УСТАТА - Бурята в сърцето ми',
      url: 'sounds/song7.mp3',
      type: 'audio'
    },
    {
      name: 'Vesna Zmijanac - Sto zivota',
      url: 'sounds/song8.mp3',
      type: 'audio'
    },
    {
      name: 'Валдес Рибна фиеста(и ловец съм, и рибар съм)',
      url: 'sounds/song9.mp3',
      type: 'audio'
    },
    {
      name: 'МИЛКО КАЛАЙДЖИЕВ - GSM',
      url: 'sounds/song10.mp3',
      type: 'audio'
    },
    {
      name: 'КОНДЬО - Доко, Доко',
      url: 'sounds/song11.mp3',
      type: 'audio'
    },
    // To add more MP3 songs:
    // 1. Put your MP3 files in the sounds/ folder
    // 2. Add them here like this:
    // {
    //   name: 'Your Song Name 🎵',
    //   url: 'sounds/your-song.mp3',
    //   type: 'audio'
    // },
    
  ];
  
  // Load default playlist
  musicPlayer.playlist = [...defaultPlaylist];
  renderPlaylist();
  
  // Auto-play on page load (with user interaction check)
  const tryAutoPlay = () => {
    if (musicPlayer.playlist.length > 0 && !musicPlayer.isPlaying) {
      loadAndPlayTrack().catch(() => {
        console.log('Auto-play blocked. User interaction required.');
        showMessageToast('🎵 Натисни ▶️ за да пуснеш музиката!', 'info');
      });
    }
  };
  
  // Try to autoplay after a small delay
  setTimeout(tryAutoPlay, 1000);
  
  // Also try on first user interaction
  const enableAutoPlay = () => {
    tryAutoPlay();
    document.removeEventListener('click', enableAutoPlay);
    document.removeEventListener('keydown', enableAutoPlay);
  };
  document.addEventListener('click', enableAutoPlay, { once: true });
  document.addEventListener('keydown', enableAutoPlay, { once: true });
  
  // Toggle player visibility
  toggleBtn.addEventListener('click', () => {
    const player = document.getElementById('music-player');
    if (player) {
      player.classList.toggle('visible');
    }
  });
  
  // Close player
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      const player = document.getElementById('music-player');
      if (player) player.classList.remove('visible');
    });
  }
  
  // Play/Pause
  if (playBtn) {
    playBtn.addEventListener('click', togglePlayPause);
  }
  
  // Previous track
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (musicPlayer.playlist.length === 0) return;
      musicPlayer.currentTrackIndex = (musicPlayer.currentTrackIndex - 1 + musicPlayer.playlist.length) % musicPlayer.playlist.length;
      loadAndPlayTrack();
    });
  }
  
  // Next track
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (musicPlayer.playlist.length === 0) return;
      musicPlayer.currentTrackIndex = (musicPlayer.currentTrackIndex + 1) % musicPlayer.playlist.length;
      loadAndPlayTrack();
    });
  }
  
  // Volume control
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      const vol = e.target.value / 100;
      musicPlayer.volume = vol;
      if (musicPlayer.audio) {
        musicPlayer.audio.volume = vol;
      }
      
      const volumeValue = document.getElementById('volume-value');
      if (volumeValue) {
        volumeValue.textContent = `${e.target.value}%`;
      }
      
      // Update volume icon
      if (volumeIcon) {
        if (vol === 0) {
          volumeIcon.textContent = '🔇';
        } else if (vol < 0.5) {
          volumeIcon.textContent = '🔉';
        } else {
          volumeIcon.textContent = '🔊';
        }
      }
      
      // Save volume preference
      try {
        localStorage.setItem('music-volume', vol);
      } catch (e) {}
    });
  }
  
  // Click volume icon to mute/unmute
  if (volumeIcon) {
    volumeIcon.addEventListener('click', () => {
      if (musicPlayer.audio.volume > 0) {
        musicPlayer.audio.volume = 0;
        volumeSlider.value = 0;
        volumeIcon.textContent = '🔇';
        document.getElementById('volume-value').textContent = '0%';
      } else {
        musicPlayer.audio.volume = musicPlayer.volume || 0.5;
        volumeSlider.value = (musicPlayer.volume || 0.5) * 100;
        volumeIcon.textContent = '🔊';
        document.getElementById('volume-value').textContent = `${Math.round((musicPlayer.volume || 0.5) * 100)}%`;
      }
    });
  }
  
  // Progress bar
  if (progressSlider) {
    progressSlider.addEventListener('input', (e) => {
      if (musicPlayer.audio && musicPlayer.audio.duration) {
        const time = (e.target.value / 100) * musicPlayer.audio.duration;
        musicPlayer.audio.currentTime = time;
      }
    });
  }
  
  // File upload
  if (uploadInput) {
    uploadInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        if (file.type.startsWith('audio/')) {
          const url = URL.createObjectURL(file);
          musicPlayer.playlist.push({
            name: file.name.replace(/\.[^/.]+$/, ""),
            url: url,
            file: file
          });
        }
      });
      
      renderPlaylist();
      
      // Auto-play first track if nothing is playing
      if (!musicPlayer.isPlaying && musicPlayer.playlist.length > 0) {
        loadAndPlayTrack();
      }
      
      showMessageToast('✅ Песни добавени в плейлиста!', 'success');
    });
  }
  
  // Audio event listeners
  if (musicPlayer.audio) {
    musicPlayer.audio.addEventListener('timeupdate', updateProgress);
    musicPlayer.audio.addEventListener('ended', () => {
      // Auto-play next track
      musicPlayer.currentTrackIndex = (musicPlayer.currentTrackIndex + 1) % musicPlayer.playlist.length;
      loadAndPlayTrack();
    });
    musicPlayer.audio.addEventListener('loadedmetadata', updateDuration);
  }
  
  // Load saved volume
  try {
    const savedVolume = localStorage.getItem('music-volume');
    if (savedVolume) {
      musicPlayer.volume = parseFloat(savedVolume);
      if (volumeSlider) volumeSlider.value = musicPlayer.volume * 100;
      if (musicPlayer.audio) musicPlayer.audio.volume = musicPlayer.volume;
    }
  } catch (e) {}
}

function togglePlayPause() {
  if (musicPlayer.playlist.length === 0) {
    showMessageToast('📁 Моля добави музикални файлове!', 'info');
    return;
  }
  
  if (musicPlayer.isPlaying) {
    // Pause current track
    if (musicPlayer.currentType === 'youtube' && musicPlayer.ytPlayer && musicPlayer.ytPlayer.pauseVideo) {
      musicPlayer.ytPlayer.pauseVideo();
    } else if (musicPlayer.audio) {
      musicPlayer.audio.pause();
    }
    musicPlayer.isPlaying = false;
    document.getElementById('music-play').textContent = '▶️';
  } else {
    // Resume or start playing
    const track = musicPlayer.playlist[musicPlayer.currentTrackIndex];
    if (!track) {
      loadAndPlayTrack();
    } else if (musicPlayer.currentType === 'youtube' && musicPlayer.ytPlayer && musicPlayer.ytPlayer.playVideo) {
      musicPlayer.ytPlayer.playVideo();
      musicPlayer.isPlaying = true;
      document.getElementById('music-play').textContent = '⏸️';
    } else if (musicPlayer.audio) {
      if (!musicPlayer.audio.src) {
        loadAndPlayTrack();
      } else {
        musicPlayer.audio.play();
        musicPlayer.isPlaying = true;
        document.getElementById('music-play').textContent = '⏸️';
      }
    }
  }
}

function loadAndPlayTrack() {
  if (musicPlayer.playlist.length === 0) return;
  
  const track = musicPlayer.playlist[musicPlayer.currentTrackIndex];
  
  // Stop any currently playing media
  if (musicPlayer.audio) {
    musicPlayer.audio.pause();
  }
  if (musicPlayer.ytPlayer && musicPlayer.ytPlayer.pauseVideo) {
    musicPlayer.ytPlayer.pauseVideo();
  }
  
  // Determine track type
  if (track.type === 'youtube' && track.youtubeId) {
    // Play YouTube video
    musicPlayer.currentType = 'youtube';
    loadYouTubeTrack(track);
  } else if (track.url) {
    // Play audio file
    musicPlayer.currentType = 'audio';
    musicPlayer.audio.src = track.url;
    musicPlayer.audio.play();
    musicPlayer.isPlaying = true;
  }
  
  const playBtn = document.getElementById('music-play');
  if (playBtn) playBtn.textContent = '⏸️';
  
  const trackName = document.getElementById('music-track-name');
  if (trackName) trackName.textContent = track.name;
  
  highlightCurrentTrack();
}

function loadYouTubeTrack(track) {
  // Create YouTube player container if it doesn't exist
  let ytContainer = document.getElementById('yt-player-container');
  if (!ytContainer) {
    ytContainer = document.createElement('div');
    ytContainer.id = 'yt-player-container';
    ytContainer.style.display = 'none'; // Hide the video
    document.body.appendChild(ytContainer);
  }
  
  // Initialize YouTube player if not already done
  if (!musicPlayer.ytPlayer) {
    if (typeof YT !== 'undefined' && YT.Player) {
      musicPlayer.ytPlayer = new YT.Player('yt-player-container', {
        height: '0',
        width: '0',
        videoId: track.youtubeId,
        playerVars: {
          autoplay: 1,
          controls: 0
        },
        events: {
          onReady: (event) => {
            event.target.setVolume(musicPlayer.volume * 100);
            event.target.playVideo();
            musicPlayer.isPlaying = true;
          },
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.ENDED) {
              // Auto-play next track
              musicPlayer.currentTrackIndex = (musicPlayer.currentTrackIndex + 1) % musicPlayer.playlist.length;
              loadAndPlayTrack();
            } else if (event.data === YT.PlayerState.PLAYING) {
              musicPlayer.isPlaying = true;
              startYouTubeProgressUpdate();
            }
          }
        }
      });
    } else {
      console.error('YouTube API not loaded yet');
      setTimeout(() => loadYouTubeTrack(track), 500);
    }
  } else {
    // Player already exists, just load new video
    musicPlayer.ytPlayer.loadVideoById(track.youtubeId);
    musicPlayer.ytPlayer.setVolume(musicPlayer.volume * 100);
    musicPlayer.isPlaying = true;
    startYouTubeProgressUpdate();
  }
}

let ytProgressInterval = null;

function startYouTubeProgressUpdate() {
  if (ytProgressInterval) clearInterval(ytProgressInterval);
  
  ytProgressInterval = setInterval(() => {
    if (musicPlayer.ytPlayer && musicPlayer.ytPlayer.getCurrentTime) {
      const currentTime = musicPlayer.ytPlayer.getCurrentTime();
      const duration = musicPlayer.ytPlayer.getDuration();
      
      if (duration) {
        const progress = (currentTime / duration) * 100;
        const progressSlider = document.getElementById('music-progress');
        if (progressSlider) progressSlider.value = progress;
        
        const currentTimeEl = document.getElementById('current-time');
        if (currentTimeEl) currentTimeEl.textContent = formatTime(currentTime);
        
        const totalTimeEl = document.getElementById('total-time');
        if (totalTimeEl) totalTimeEl.textContent = formatTime(duration);
      }
    }
  }, 500);
}

function updateProgress() {
  if (!musicPlayer.audio.duration) return;
  
  const progress = (musicPlayer.audio.currentTime / musicPlayer.audio.duration) * 100;
  const progressSlider = document.getElementById('music-progress');
  if (progressSlider) {
    progressSlider.value = progress;
  }
  
  const currentTimeEl = document.getElementById('current-time');
  if (currentTimeEl) {
    currentTimeEl.textContent = formatTime(musicPlayer.audio.currentTime);
  }
}

function updateDuration() {
  const totalTimeEl = document.getElementById('total-time');
  if (totalTimeEl && musicPlayer.audio.duration) {
    totalTimeEl.textContent = formatTime(musicPlayer.audio.duration);
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function renderPlaylist() {
  const container = document.getElementById('playlist-items');
  if (!container) return;
  
  container.innerHTML = '';
  
  if (musicPlayer.playlist.length === 0) {
    container.innerHTML = '<div class="playlist-empty">Няма песни в плейлиста</div>';
    return;
  }
  
  musicPlayer.playlist.forEach((track, index) => {
    const item = document.createElement('div');
    item.className = 'playlist-item';
    if (index === musicPlayer.currentTrackIndex) {
      item.classList.add('active');
    }
    
    item.innerHTML = `
      <span class="playlist-item-name">${track.name}</span>
      <button class="playlist-item-remove" data-index="${index}">✕</button>
    `;
    
    item.addEventListener('click', (e) => {
      if (!e.target.classList.contains('playlist-item-remove')) {
        musicPlayer.currentTrackIndex = index;
        loadAndPlayTrack();
      }
    });
    
    const removeBtn = item.querySelector('.playlist-item-remove');
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      musicPlayer.playlist.splice(index, 1);
      if (index === musicPlayer.currentTrackIndex && musicPlayer.isPlaying) {
        if (musicPlayer.playlist.length > 0) {
          musicPlayer.currentTrackIndex = index % musicPlayer.playlist.length;
          loadAndPlayTrack();
        } else {
          musicPlayer.audio.pause();
          musicPlayer.isPlaying = false;
          document.getElementById('music-play').textContent = '▶️';
        }
      } else if (index < musicPlayer.currentTrackIndex) {
        musicPlayer.currentTrackIndex--;
      }
      renderPlaylist();
    });
    
    container.appendChild(item);
  });
}

function highlightCurrentTrack() {
  const items = document.querySelectorAll('.playlist-item');
  items.forEach((item, index) => {
    if (index === musicPlayer.currentTrackIndex) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// ========================================
// INITIALIZATION - Removed orphaned code
// ========================================

// ========================================
// MESSAGE BOARD ENHANCED
// ========================================

let lastMessageLoad = 0;
const MESSAGE_REFRESH_INTERVAL = 10000;
let currentMessages = [];
let currentFilter = 'newest';
let currentSearchTerm = '';
let replyingTo = null;

function initMessageBoard() {
  const postBtn = document.getElementById('post-message-btn');
  const messageInput = document.getElementById('message-board-input');
  const charCount = document.getElementById('char-count');
  const searchInput = document.getElementById('message-search');
  const clearSearch = document.getElementById('clear-search');
  const sortSelect = document.getElementById('message-sort');
  
  if (!postBtn || !messageInput || !charCount) return;
  
  messageInput.addEventListener('input', () => {
    const length = messageInput.value.length;
    charCount.textContent = `${length}/500`;
    charCount.style.color = length > 450 ? '#ff006a' : '';
  });
  
  postBtn.addEventListener('click', async () => {
    const message = messageInput.value.trim();
    
    if (!message) {
      showMessageToast('Напиши нещо преди да публикуваш!', 'error');
      return;
    }
    
    if (message.length < 3) {
      showMessageToast('Съобщението е твърде кратко!', 'error');
      return;
    }
    
    try {
      postBtn.disabled = true;
      postBtn.textContent = 'Публикуване...';
      
      await postMessage(message, replyingTo);
      
      messageInput.value = '';
      charCount.textContent = '0/500';
      
      if (replyingTo) {
        cancelReply();
        showMessageToast('✅ Отговорът е публикуван!', 'success');
      } else {
        showMessageToast('✅ Съобщението е публикувано!', 'success');
      }
      
      await renderMessages();
      
    } catch (e) {
      console.error('Грешка при публикуване:', e);
      showMessageToast('❌ Грешка при публикуване. Опитай отново.', 'error');
    } finally {
      postBtn.disabled = false;
      postBtn.textContent = 'Публикувай анонимно 🌈';
    }
  });
  
  messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      postBtn.click();
    }
  });
  
  if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
      currentSearchTerm = e.target.value.toLowerCase().trim();
      if (clearSearch) {
        clearSearch.style.display = currentSearchTerm ? 'block' : 'none';
      }
      filterAndRenderMessages();
    }, 300));
  }
  
  if (clearSearch) {
    clearSearch.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        currentSearchTerm = '';
        clearSearch.style.display = 'none';
        filterAndRenderMessages();
      }
    });
  }
  
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentFilter = e.target.value;
      filterAndRenderMessages();
    });
  }
  
  renderMessages();
  
  setInterval(() => {
    if (document.getElementById('contact')?.classList.contains('active-tab')) {
      renderMessages(true);
    }
  }, MESSAGE_REFRESH_INTERVAL);
}

async function renderMessages(silent = false) {
  const container = document.getElementById('message-board-messages');
  if (!container || typeof loadMessages !== 'function') return;
  
  try {
    if (!silent) {
      container.innerHTML = '<div class="message-board-loading">Зареждане...</div>';
    }
    
    const messages = await loadMessages();
    currentMessages = messages;
    
    filterAndRenderMessages();
    lastMessageLoad = Date.now();
    
  } catch (e) {
    console.error('Грешка при зареждане:', e);
    if (!silent) {
      container.innerHTML = '<div class="message-board-error">Грешка при зареждане</div>';
    }
  }
}

function filterAndRenderMessages() {
  const container = document.getElementById('message-board-messages');
  if (!container) return;
  
  let filtered = [...currentMessages];
  
  if (currentSearchTerm) {
    filtered = filtered.filter(msg => 
      msg.message.toLowerCase().includes(currentSearchTerm)
    );
  }
  
  switch(currentFilter) {
    case 'oldest':
      filtered.sort((a, b) => a.timestamp - b.timestamp);
      break;
    case 'most-liked':
      filtered.sort((a, b) => {
        const aTotal = (a.reactions?.heart || 0) + (a.reactions?.rainbow || 0) + (a.reactions?.fire || 0);
        const bTotal = (b.reactions?.heart || 0) + (b.reactions?.rainbow || 0) + (b.reactions?.fire || 0);
        return bTotal - aTotal;
      });
      break;
    case 'most-replies':
      filtered.sort((a, b) => (b.replyCount || 0) - (a.replyCount || 0));
      break;
    default:
      filtered.sort((a, b) => b.timestamp - a.timestamp);
  }
  
  if (filtered.length === 0) {
    container.innerHTML = currentSearchTerm 
      ? '<div class="message-board-empty">Няма резултати от търсенето. 🔍</div>'
      : '<div class="message-board-empty">Няма съобщения още. Бъди първият! 🌈</div>';
    return;
  }
  
  container.innerHTML = '';
  
  const mainMessages = filtered.filter(msg => !msg.replyTo);
  const replies = filtered.filter(msg => msg.replyTo);
  
  mainMessages.forEach(msg => {
    const messageEl = createMessageElement(msg);
    container.appendChild(messageEl);
    
    const msgReplies = replies.filter(r => r.replyTo === msg.id);
    if (msgReplies.length > 0) {
      const repliesContainer = document.createElement('div');
      repliesContainer.className = 'message-replies-container';
      
      msgReplies.forEach(reply => {
        const replyEl = createMessageElement(reply, true);
        repliesContainer.appendChild(replyEl);
      });
      
      container.appendChild(repliesContainer);
    }
  });
}

function createMessageElement(msg, isReply = false) {
  const messageEl = document.createElement('div');
  messageEl.className = 'message-board-item' + (isReply ? ' message-reply' : '');
  messageEl.dataset.id = msg.id;
  
  const timeAgo = getTimeAgo(msg.timestamp);
  const reactions = msg.reactions || { heart: 0, rainbow: 0, fire: 0 };
  const replyCount = msg.replyCount || 0;
  
  messageEl.innerHTML = `
    <div class="message-board-item-header">
      <span class="message-board-item-author">${isReply ? '↳ Отговор' : 'Анонимен'} 🌈</span>
      <span class="message-board-item-time">${timeAgo}</span>
    </div>
    <div class="message-board-item-text">${escapeHtml(msg.message)}</div>
    <div class="message-board-item-actions">
      <button class="message-reaction-btn ${reactions.heart > 0 ? 'active' : ''}" data-reaction="heart" data-id="${msg.id}">
        ❤️ <span class="reaction-count">${reactions.heart || ''}</span>
      </button>
      <button class="message-reaction-btn ${reactions.rainbow > 0 ? 'active' : ''}" data-reaction="rainbow" data-id="${msg.id}">
        🌈 <span class="reaction-count">${reactions.rainbow || ''}</span>
      </button>
      <button class="message-reaction-btn ${reactions.fire > 0 ? 'active' : ''}" data-reaction="fire" data-id="${msg.id}">
        🔥 <span class="reaction-count">${reactions.fire || ''}</span>
      </button>
      ${!isReply ? `
        <button class="message-reply-btn" data-id="${msg.id}">
          💬 Отговори ${replyCount > 0 ? `(${replyCount})` : ''}
        </button>
      ` : ''}
    </div>
  `;
  
  messageEl.querySelectorAll('.message-reaction-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const reaction = btn.dataset.reaction;
      const msgId = btn.dataset.id;
      
      const success = await addReaction(msgId, reaction);
      if (success) {
        const countSpan = btn.querySelector('.reaction-count');
        const currentCount = parseInt(countSpan.textContent) || 0;
        countSpan.textContent = currentCount + 1;
        btn.classList.add('active');
        
        btn.classList.add('reaction-pulse');
        setTimeout(() => btn.classList.remove('reaction-pulse'), 300);
      }
    });
  });
  
  const replyBtn = messageEl.querySelector('.message-reply-btn');
  if (replyBtn) {
    replyBtn.addEventListener('click', () => {
      startReply(msg.id, msg.message);
    });
  }
  
  return messageEl;
}

function startReply(messageId, messageText) {
  replyingTo = messageId;
  
  const messageInput = document.getElementById('message-board-input');
  const postBtn = document.getElementById('post-message-btn');
  
  if (!messageInput || !postBtn) return;
  
  let replyIndicator = document.getElementById('reply-indicator');
  if (!replyIndicator) {
    replyIndicator = document.createElement('div');
    replyIndicator.id = 'reply-indicator';
    replyIndicator.className = 'reply-indicator';
    messageInput.parentElement.insertBefore(replyIndicator, messageInput);
  }
  
  const preview = messageText.length > 50 ? messageText.substring(0, 50) + '...' : messageText;
  replyIndicator.innerHTML = `
    <span class="reply-indicator-text">💬 Отговаряш на: "${preview}"</span>
    <button class="reply-indicator-cancel" onclick="cancelReply()">✕</button>
  `;
  replyIndicator.style.display = 'flex';
  
  messageInput.focus();
  postBtn.textContent = 'Публикувай отговор 🌈';
}

window.cancelReply = function() {
  replyingTo = null;
  const replyIndicator = document.getElementById('reply-indicator');
  if (replyIndicator) {
    replyIndicator.style.display = 'none';
  }
  const postBtn = document.getElementById('post-message-btn');
  if (postBtn) {
    postBtn.textContent = 'Публикувай анонимно 🌈';
  }
}

function getTimeAgo(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `преди ${days} ${days === 1 ? 'ден' : 'дни'}`;
  if (hours > 0) return `преди ${hours} ${hours === 1 ? 'час' : 'часа'}`;
  if (minutes > 0) return `преди ${minutes} ${minutes === 1 ? 'минута' : 'минути'}`;
  return 'сега';
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showMessageToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `message-toast message-toast-${type}`;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => toast.classList.add('show'), 10);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ========================================
// SECRET SNAKE GAME
// ========================================

let snakeGame = {
  canvas: null,
  ctx: null,
  snake: [],
  food: null,
  direction: 'right',
  nextDirection: 'right',
  score: 0,
  highScore: 0,
  gameLoop: null,
  gridSize: 20,
  tileCount: 20,
  speed: 100
};

function initSecretGame() {
  const logo = document.getElementById('logo-game-trigger');
  const overlay = document.getElementById('secret-game-overlay');
  const closeBtn = document.getElementById('secret-game-close');
  const startBtn = document.getElementById('snake-start');
  const restartBtn = document.getElementById('snake-restart');
  
  if (!logo) return;
  
  logo.addEventListener('click', () => {
    if (overlay) {
      overlay.classList.add('active');
      initSnakeCanvas();
      showMessageToast('🎮 Тайната игра е открита!', 'success');
    }
  });
  
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      overlay.classList.remove('active');
      stopSnakeGame();
    });
  }
  
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      startSnakeGame();
      startBtn.style.display = 'none';
      restartBtn.style.display = 'inline-block';
    });
  }
  
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      startSnakeGame();
    });
  }
  
  document.addEventListener('keydown', (e) => {
    if (!overlay || !overlay.classList.contains('active')) return;
    
    switch(e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (snakeGame.direction !== 'down') snakeGame.nextDirection = 'up';
        e.preventDefault();
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (snakeGame.direction !== 'up') snakeGame.nextDirection = 'down';
        e.preventDefault();
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (snakeGame.direction !== 'right') snakeGame.nextDirection = 'left';
        e.preventDefault();
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (snakeGame.direction !== 'left') snakeGame.nextDirection = 'right';
        e.preventDefault();
        break;
    }
  });
  
  try {
    const saved = localStorage.getItem('snake-high-score');
    if (saved) {
      snakeGame.highScore = parseInt(saved);
      const el = document.getElementById('snake-high-score');
      if (el) el.textContent = snakeGame.highScore;
    }
  } catch (e) {}
}

function initSnakeCanvas() {
  snakeGame.canvas = document.getElementById('snake-canvas');
  if (!snakeGame.canvas) return;
  
  snakeGame.ctx = snakeGame.canvas.getContext('2d');
  snakeGame.tileCount = snakeGame.canvas.width / snakeGame.gridSize;
}

function startSnakeGame() {
  snakeGame.snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ];
  snakeGame.direction = 'right';
  snakeGame.nextDirection = 'right';
  snakeGame.score = 0;
  
  const scoreEl = document.getElementById('snake-score');
  if (scoreEl) scoreEl.textContent = '0';
  
  spawnFood();
  
  if (snakeGame.gameLoop) clearInterval(snakeGame.gameLoop);
  snakeGame.gameLoop = setInterval(updateSnakeGame, snakeGame.speed);
}

function stopSnakeGame() {
  if (snakeGame.gameLoop) {
    clearInterval(snakeGame.gameLoop);
    snakeGame.gameLoop = null;
  }
}

function updateSnakeGame() {
  snakeGame.direction = snakeGame.nextDirection;
  
  const head = { ...snakeGame.snake[0] };
  
  switch(snakeGame.direction) {
    case 'up': head.y--; break;
    case 'down': head.y++; break;
    case 'left': head.x--; break;
    case 'right': head.x++; break;
  }
  
  if (head.x < 0 || head.x >= snakeGame.tileCount || 
      head.y < 0 || head.y >= snakeGame.tileCount) {
    gameOver();
    return;
  }
  
  for (let segment of snakeGame.snake) {
    if (head.x === segment.x && head.y === segment.y) {
      gameOver();
      return;
    }
  }
  
  snakeGame.snake.unshift(head);
  
  if (head.x === snakeGame.food.x && head.y === snakeGame.food.y) {
    snakeGame.score++;
    const scoreEl = document.getElementById('snake-score');
    if (scoreEl) scoreEl.textContent = snakeGame.score;
    
    if (popSound) {
      const sound = popSound.cloneNode();
      sound.volume = 0.3;
      sound.playbackRate = 1 + (snakeGame.score * 0.1);
      sound.play().catch(e => {});
    }
    
    spawnFood();
  } else {
    snakeGame.snake.pop();
  }
  
  drawSnakeGame();
}

function spawnFood() {
  do {
    snakeGame.food = {
      x: Math.floor(Math.random() * snakeGame.tileCount),
      y: Math.floor(Math.random() * snakeGame.tileCount)
    };
  } while (snakeGame.snake.some(s => s.x === snakeGame.food.x && s.y === snakeGame.food.y));
}

function drawSnakeGame() {
  if (!snakeGame.ctx) return;
  
  const ctx = snakeGame.ctx;
  const size = snakeGame.gridSize;
  
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, snakeGame.canvas.width, snakeGame.canvas.height);
  
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= snakeGame.tileCount; i++) {
    ctx.beginPath();
    ctx.moveTo(i * size, 0);
    ctx.lineTo(i * size, snakeGame.canvas.height);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, i * size);
    ctx.lineTo(snakeGame.canvas.width, i * size);
    ctx.stroke();
  }
  
  const colors = ['#ff006a', '#ff00ff', '#00f0ff', '#7cff00', '#ffed00', '#ff8c00'];
  snakeGame.snake.forEach((segment, i) => {
    const colorIndex = i % colors.length;
    ctx.fillStyle = colors[colorIndex];
    ctx.fillRect(
      segment.x * size + 2,
      segment.y * size + 2,
      size - 4,
      size - 4
    );
    
    if (i === 0) {
      ctx.shadowBlur = 15;
      ctx.shadowColor = colors[colorIndex];
      ctx.fillRect(
        segment.x * size + 2,
        segment.y * size + 2,
        size - 4,
        size - 4
      );
      ctx.shadowBlur = 0;
    }
  });
  
  if (snakeGame.food) {
    const foodColors = ['#ff0000', '#ff8c00', '#ffff00', '#008000', '#0000ff', '#8b00ff'];
    const colorIndex = Math.floor(Date.now() / 200) % foodColors.length;
    ctx.fillStyle = foodColors[colorIndex];
    ctx.shadowBlur = 20;
    ctx.shadowColor = foodColors[colorIndex];
    
    ctx.beginPath();
    ctx.arc(
      snakeGame.food.x * size + size / 2,
      snakeGame.food.y * size + size / 2,
      size / 2 - 4,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

function gameOver() {
  stopSnakeGame();
  
  if (snakeGame.score > snakeGame.highScore) {
    snakeGame.highScore = snakeGame.score;
    const el = document.getElementById('snake-high-score');
    if (el) el.textContent = snakeGame.highScore;
    
    try {
      localStorage.setItem('snake-high-score', snakeGame.highScore);
    } catch (e) {}
    
    showMessageToast(`🎉 НОВ РЕКОРД! ${snakeGame.highScore}`, 'success');
  } else {
    showMessageToast(`💀 Game Over! Резултат: ${snakeGame.score}`, 'error');
  }
  
  const restartBtn = document.getElementById('snake-restart');
  if (restartBtn) restartBtn.style.display = 'inline-block';
}

// ========================================
// AI CHATBOT
// ========================================

function initAIChatbot() {
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');
  const messagesContainer = document.getElementById('chat-messages');
  
  if (!chatInput || !sendBtn || !messagesContainer) return;
  
  addChatMessage('Здравей! Аз съм AI асистентът на Виктор. Как мога да ти помогна днес? Можеш да ми разкажеш за себе си, да зададеш въпроси или просто да си поговорим. 🌈', 'ai');
  
  async function sendChatMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    addChatMessage(message, 'user');
    chatInput.value = '';
    
    const typingEl = document.createElement('div');
    typingEl.className = 'chat-message ai typing-indicator';
    typingEl.innerHTML = '<span></span><span></span><span></span>';
    messagesContainer.appendChild(typingEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    try {
      const response = await getAIResponse(message);
      
      typingEl.remove();
      addChatMessage(response, 'ai');
      
    } catch (e) {
      typingEl.remove();
      addChatMessage('Съжалявам, имам технически проблем. Опитай отново след малко. 🛠️', 'ai');
    }
  }
  
  sendBtn.addEventListener('click', sendChatMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendChatMessage();
  });
}

function addChatMessage(text, sender) {
  const messagesContainer = document.getElementById('chat-messages');
  if (!messagesContainer) return;
  
  const msgEl = document.createElement('div');
  msgEl.className = `chat-message ${sender}`;
  msgEl.textContent = text;
  
  messagesContainer.appendChild(msgEl);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Enhance AI responses with Viktor's personality and Bulgarian context
function enhanceResponse(response, userMessage) {
  const lower = userMessage.toLowerCase();
  
  // Add emojis based on context
  if (/гей|lgbt|транс|pride|гордост/i.test(lower) && !response.includes('🌈') && !response.includes('🏳️‍🌈')) {
    response += ' 🌈';
  }
  
  if (/обич|love|харес/i.test(lower) && !response.includes('💜') && !response.includes('💖')) {
    response += ' 💜';
  }
  
  if (/тъжен|sad|депрес/i.test(lower) && !response.includes('🤗')) {
    response += ' 🤗';
  }
  
  // Make response more supportive if needed
  if (response.length < 20) {
    const supportive = [
      "Разбирам те.",
      "Винаги можеш да споделиш с мен.",
      "Тук съм за теб.",
      "Благодаря, че ми се довери."
    ];
    response = supportive[Math.floor(Math.random() * supportive.length)] + ' ' + response;
  }
  
  return response;
}

// Conversation history for context
let conversationHistory = [];

async function getAIResponse(message) {
  try {
    // Add instruction to respond in Bulgarian
    const bulgarianPrompt = `Отговори на български език. ${message}`;
    
    // Use a better model with simpler API
    const response = await fetch('https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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'
      },
      body: JSON.stringify({
        inputs: bulgarianPrompt,
        parameters: {
          max_length: 150,
          temperature: 0.9,
          do_sample: true
        },
        options: {
          wait_for_model: true,
          use_cache: false
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log('API Error:', errorData);
      throw new Error('API request failed');
    }
    
    const data = await response.json();
    console.log('API Response:', data);
    
    let aiMessage = '';
    
    // Parse response - BlenderBot returns different format
    if (Array.isArray(data) && data.length > 0) {
      if (data[0].generated_text) {
        aiMessage = data[0].generated_text;
      } else if (typeof data[0] === 'string') {
        aiMessage = data[0];
      }
    } else if (data.generated_text) {
      aiMessage = data.generated_text;
    }
    
    // If response is empty or too short, enhance it
    if (!aiMessage || aiMessage.trim().length < 5) {
      throw new Error('Empty response');
    }
    
    // Clean up the response
    aiMessage = aiMessage.trim();
    
    // Add Viktor's personality
    aiMessage = enhanceResponse(aiMessage, message);
    
    // Update conversation history
    conversationHistory.push({ role: 'user', content: message });
    conversationHistory.push({ role: 'assistant', content: aiMessage });
    
    // Keep only last 6 messages
    if (conversationHistory.length > 6) {
      conversationHistory = conversationHistory.slice(-6);
    }
    
    return aiMessage;
    
  } catch (error) {
    console.error('AI API Error:', error);
    
    // SMART FALLBACK - САМО НА БЪЛГАРСКИ
    console.log('Използване на запазени отговори (AI API не е достъпен)');
    const lower = message.toLowerCase();
    
    const responses = {
      greetings: [
        "Здравей! Радвам се да говоря с теб. Как се чувстваш днес? 🌈",
        "Хей! Как си? Винаги съм тук да те изслушам. 💜",
        "Здрасти! Добре дошъл. Искаш ли да споделиш нещо? ✨",
        "Привет! Как минава денят ти? Аз съм тук за теб. 💫",
        "Здравей приятелю! Как си днес? 🌟"
      ],
      identity: [
        "Да си различен е красиво. Твоята идентичност е твоя сила, не твоя слабост. 🌟",
        "Всеки има право да бъде себе си. Гордостта е в автентичността. 🏳️‍🌈",
        "Твоята истина е ценна. Благодаря ти, че си себе си. 💖",
        "Да бъдеш себе си е най-смелото нещо. Никога не се крий. ✨",
        "Твоята идентичност е валидна и красива. Заслужаваш да бъдеш празнуван! 🌈",
        "Различието ти е твоята суперсила. Блесни! 💫"
      ],
      sad: [
        "Разбирам те. Понякога е наистина трудно. Но ти не си сам. 💙",
        "Тези чувства са валидни. Важно е да ги споделяш. Как мога да помогна? 🤗",
        "Съжалявам, че преминаваш през това. Искаш ли да говорим за това? 💜",
        "Нормално е да не си добре. Аз съм тук за теб. Искаш ли да поговорим? 🤗",
        "Чувствата ти са важни. Тук съм да те изслушам. 💙",
        "Понякога животът е труден, но ти не си сам в това. 💜"
      ],
      happy: [
        "Толкова се радвам да те чуя щастлив/а! Разкажи ми повече! 🎉",
        "Това звучи прекрасно! Радостта ти е заразителна! ✨",
        "Обичам да виждам хората щастливи! Сподели още! 🌟",
        "Страхотно! Разкажи ми повече за това! 😊",
        "Радвам се да чуя добри новини! Кажи ми още! 🎊"
      ],
      support: [
        "Винаги можеш да разчиташ на моята подкрепа. Казвай! 💪",
        "Тук съм за теб. Слушам те внимателно. 👂",
        "Твоите чувства са важни. Сподели каквото искаш. 💜",
        "Винаги съм тук да те подкрепя. 🤝",
        "Не си сам в това. Нека поговорим за него. 💫",
        "Заедно сме по-силни. Разчитай на мен. 💪"
      ],
      defaults: [
        "Интересно. Разкажи ми повече за това. 🤔",
        "Разбирам. Как се чувстваш по този въпрос? 💭",
        "Благодаря, че споделяш това с мен. Какво мислиш? 🌈",
        "Това е интересно! Кажи ми повече как се чувстваш. 💭",
        "Чувам те. Какво е важно за теб в това? ✨",
        "Благодаря, че ми се довери. Как те кара да се чувстваш? 🌟",
        "Искам да чуя повече. Продължи. 💫",
        "Разбирам те. Сподели още, ако искаш. 💜"
      ]
    };
    
    // По-интелигентно съпоставяне
    if (/здрав|хей|здрасти|hi|hello|hey|sup|привет/i.test(lower)) {
      return responses.greetings[Math.floor(Math.random() * responses.greetings.length)];
    }
    
    if (/гей|lgbt|транс|квиър|идентич|различ|gay|trans|queer|pride|coming out/i.test(lower)) {
      return responses.identity[Math.floor(Math.random() * responses.identity.length)];
    }
    
    if (/тъжен|депрес|лош|трудно|сам|sad|depressed|lonely|anxious|scared/i.test(lower)) {
      return responses.sad[Math.floor(Math.random() * responses.sad.length)];
    }
    
    if (/щастлив|радост|добре|супер|страхот|happy|great|awesome|amazing/i.test(lower)) {
      return responses.happy[Math.floor(Math.random() * responses.happy.length)];
    }
    
    if (/помощ|подкреп|нужда|help|support|need/i.test(lower)) {
      return responses.support[Math.floor(Math.random() * responses.support.length)];
    }
    
    return responses.defaults[Math.floor(Math.random() * responses.defaults.length)];
  }
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Инициализиране на Viktor.RGB...");

  loadSavedTheme();

  initTabs();
  initThemeSystem();
  initScrollReveal();
  initInteractiveFacts();
  initMusicPlayer();
  
  initMiniClickGame();
  initAimTrainer();
  initFlagGame();
  initFlagGameCloseButton();
  initSecretGame();
  
  initAIChatbot();
  initMessageBoard();
  
  initParticleEffect();
  initSecretMode();

  renderLeaderboard();
  renderAimLeaderboard();

  console.log("✅ Viktor.RGB готов! 🌈");
  console.log("🎮 Тайна: Кликни върху лого-то VIKTOR за secret game!");
});
