/* ============================================================
   ELEMENT REFERENCES
============================================================ */
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

const homeScreen = document.getElementById("homeScreen");
const quoteBox = document.getElementById("quoteBox");

const gamesMenu = document.getElementById("gamesMenu");
const appsMenu = document.getElementById("appsMenu");

const browserScreen = document.getElementById("browserScreen");
const tabsContainer = document.getElementById("tabs");
const addTabBtn = document.getElementById("addTab");
const searchInput = document.getElementById("searchInput");
const goBtn = document.getElementById("goBtn");
const closeBrowserBtn = document.getElementById("closeBrowser");
const browserFrame = document.getElementById("browserFrame");

const embedScreen = document.getElementById("embedScreen");
const embedFrame = document.getElementById("embedFrame");
const closeEmbedBtn = document.getElementById("closeEmbed");

const settingsScreen = document.getElementById("settingsScreen");
const closeSettingsBtn = document.getElementById("closeSettings");

/* WORD-BASED DOCK BUTTONS */
const homeBtn = document.getElementById("homeBtn");
const gamesBtn = document.getElementById("gamesBtn");
const appsBtn = document.getElementById("appsBtn");
const browserBtn = document.getElementById("browserBtn");
const settingsBtn = document.getElementById("settingsBtn");

/* SETTINGS */
const styleSelect = document.getElementById("styleSelect");
const themeSelect = document.getElementById("themeSelect");
const animationSelect = document.getElementById("animationSelect");
const particlesToggle = document.getElementById("particlesToggle");
const particleDensitySelect = document.getElementById("particleDensity");
const ambienceToggle = document.getElementById("ambienceToggle");
const ambienceVolume = document.getElementById("ambienceVolume");
const resetSettingsBtn = document.getElementById("resetSettings");

const ambienceAudio = document.getElementById("ambienceAudio");

/* ============================================================
   GLOBAL STATE
============================================================ */
let particles = [];
let particleDensity = 120;
let particlesEnabled = true;

let tabs = [];
let activeTabId = null;
const HOMEPAGE = "conv-home://";

let browserOpen = false;

/* ============================================================
   HOME
============================================================ */
function showHome() {
  homeScreen.style.display = "block";
  quoteBox.style.display = "block";
  canvas.style.display = "block";

  gamesMenu.style.display = "none";
  appsMenu.style.display = "none";
  browserScreen.style.display = "none";
  embedScreen.style.display = "none";
  settingsScreen.style.display = "none";
}

function hideHome() {
  homeScreen.style.display = "none";
  quoteBox.style.display = "none";
  canvas.style.display = "none";
}

/* ============================================================
   PARTICLES
============================================================ */
function resizeCanvas() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resizeCanvas();
addEventListener("resize", resizeCanvas);

function createParticles() {
  particles = [];
  for (let i = 0; i < particleDensity; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1
    });
  }
}
createParticles();

function drawParticles() {
  if (!particlesEnabled) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(drawParticles);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(168,85,247,0.7)";

  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();

    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
  });

  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ============================================================
   QUOTES
============================================================ */
const quotes = [
  "Man I dont know why I made this",
  "Can someone like...tell Roblox to chill",
  "Originally made with GitHub",
  "Yes Kevin we all know the entertainment is broken"
];

quoteBox.addEventListener("click", () => {
  quoteBox.textContent = `"${quotes[Math.floor(Math.random() * quotes.length)]}"`;
});

/* ============================================================
   MENUS
============================================================ */
function toggleMenu(menu) {
  const isOpen = menu.style.display === "block";
  gamesMenu.style.display = "none";
  appsMenu.style.display = "none";

  if (!isOpen) menu.style.display = "block";
}

gamesBtn.addEventListener("click", () => toggleMenu(gamesMenu));
appsBtn.addEventListener("click", () => toggleMenu(appsMenu));

document.addEventListener("click", (e) => {
  if (!e.target.closest(".dock") && !e.target.closest(".menu-panel")) {
    gamesMenu.style.display = "none";
    appsMenu.style.display = "none";
  }
});

/* ============================================================
   EMBED SYSTEM
============================================================ */
function openEmbed(url) {
  hideHome();

  gamesMenu.style.display = "none";
  appsMenu.style.display = "none";
  browserScreen.style.display = "none";
  settingsScreen.style.display = "none";

  embedScreen.style.display = "flex";
  embedFrame.src = url;
}

closeEmbedBtn.addEventListener("click", () => {
  embedScreen.style.display = "none";
  embedFrame.src = "";
  showHome();
});

/* ============================================================
   BROWSER SYSTEM
============================================================ */
function createTab(url = HOMEPAGE) {
  const id = Date.now() + Math.random();
  tabs.push({ id, url });
  activeTabId = id;
  renderTabs();
  loadActiveTab();
}

function renderTabs() {
  tabsContainer.innerHTML = "";

  tabs.forEach(tab => {
    const el = document.createElement("div");
    el.className = "tab" + (tab.id === activeTabId ? " active" : "");
    el.textContent = tab.url === HOMEPAGE ? "Home" : tab.url.replace(/^https?:\/\//, "").slice(0, 15);

    el.addEventListener("click", () => {
      activeTabId = tab.id;
      loadActiveTab();
      renderTabs();
    });

    const closeBtn = document.createElement("span");
    closeBtn.textContent = " ×";
    closeBtn.style.cursor = "pointer";
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeTab(tab.id);
    });

    el.appendChild(closeBtn);
    tabsContainer.appendChild(el);
  });
}

function getActiveTab() {
  return tabs.find(t => t.id === activeTabId) || null;
}

function loadActiveTab() {
  const tab = getActiveTab();
  if (!tab) return;

  if (tab.url === HOMEPAGE) {
    browserFrame.srcdoc = `
      <style>
        body {
          background: #000;
          color: #a855f7;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          font-size: 2rem;
          font-family: Arial, sans-serif;
        }
      </style>
      <div>Search something!</div>
    `;
    searchInput.value = "";
  } else {
    browserFrame.srcdoc = "";
    browserFrame.src = tab.url;
    searchInput.value = tab.url;
  }
}

function closeTab(id) {
  const idx = tabs.findIndex(t => t.id === id);
  if (idx === -1) return;

  tabs.splice(idx, 1);

  if (tabs.length === 0) {
    createTab();
  } else {
    activeTabId = tabs[Math.max(0, idx - 1)].id;
    loadActiveTab();
    renderTabs();
  }
}

function goToURL() {
  let input = searchInput.value.trim();
  if (!input) return;

  if (input.includes(" ")) {
    input = "https://duckduckgo.com/?q=" + encodeURIComponent(input);
  } else if (!input.startsWith("http")) {
    input = "https://" + input;
  }

  const tab = getActiveTab();
  if (!tab) return;

  tab.url = input;
  loadActiveTab();
  renderTabs();
}

addTabBtn.addEventListener("click", () => createTab());
goBtn.addEventListener("click", () => goToURL());
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") goToURL();
});

browserBtn.addEventListener("click", () => {
  hideHome();

  gamesMenu.style.display = "none";
  appsMenu.style.display = "none";
  embedScreen.style.display = "none";
  settingsScreen.style.display = "none";

  browserScreen.style.display = "flex";
  browserOpen = true;

  if (tabs.length === 0) createTab();
});

closeBrowserBtn.addEventListener("click", () => {
  browserScreen.style.display = "none";
  browserOpen = false;
  showHome();
});

/* ============================================================
   SETTINGS SYSTEM
============================================================ */
function applyTheme(theme) {
  document.body.className = document.body.className
    .replace(/theme-\w+/g, "")
    .trim();
  document.body.classList.add("theme-" + theme);
}

function applyStyle(style) {
  document.body.className = document.body.className
    .replace(/style-\w+/g, "")
    .trim();
  document.body.classList.add("style-" + style);
}

function applyAnimations(mode) {
  if (mode === "off") {
    document.body.style.setProperty("scroll-behavior", "auto");
  } else {
    document.body.style.setProperty("scroll-behavior", "smooth");
  }
}

function applyParticles(enabled, density) {
  particlesEnabled = enabled;

  if (density === "low") particleDensity = 60;
  else if (density === "medium") particleDensity = 120;
  else if (density === "high") particleDensity = 200;

  createParticles();
}

function applyAmbience(enabled, volume) {
  ambienceAudio.volume = volume;

  if (enabled) {
    ambienceAudio.play().catch(() => {});
  } else {
    ambienceAudio.pause();
  }
}

function loadSettings() {
  const saved = JSON.parse(localStorage.getItem("convYHSettings") || "{}");

  const theme = saved.theme || "purple";
  const style = saved.style || "grid";
  const animations = saved.animations || "full";
  const particlesOn = saved.particlesOn !== undefined ? saved.particlesOn : true;
  const density = saved.density || "medium";
  const ambienceOn = saved.ambienceOn || false;
  const ambienceVol = saved.ambienceVol !== undefined ? saved.ambienceVol : 0.4;

  themeSelect.value = theme;
  styleSelect.value = style;
  animationSelect.value = animations;
  particlesToggle.checked = particlesOn;
  particleDensitySelect.value = density;
  ambienceToggle.checked = ambienceOn;
  ambienceVolume.value = ambienceVol;

  applyTheme(theme);
  applyStyle(style);
  applyAnimations(animations);
  applyParticles(particlesOn, density);
  applyAmbience(ambienceOn, ambienceVol);
}

function saveSettings() {
  const data = {
    theme: themeSelect.value,
    style: styleSelect.value,
    animations: animationSelect.value,
    particlesOn: particlesToggle.checked,
    density: particleDensitySelect.value,
    ambienceOn: ambienceToggle.checked,
    ambienceVol: parseFloat(ambienceVolume.value)
  };

  localStorage.setItem("convYHSettings", JSON.stringify(data));
}

/* SETTINGS EVENTS */
themeSelect.addEventListener("change", () => {
  applyTheme(themeSelect.value);
  saveSettings();
});

styleSelect.addEventListener("change", () => {
  applyStyle(styleSelect.value);
  saveSettings();
});

animationSelect.addEventListener("change", () => {
  applyAnimations(animationSelect.value);
  saveSettings();
});

particlesToggle.addEventListener("change", () => {
  applyParticles(particlesToggle.checked, particleDensitySelect.value);
  saveSettings();
});

particleDensitySelect.addEventListener("change", () => {
  applyParticles(particlesToggle.checked, particleDensitySelect.value);
  saveSettings();
});

ambienceToggle.addEventListener("change", () => {
  applyAmbience(ambienceToggle.checked, parseFloat(ambienceVolume.value));
  saveSettings();
});

ambienceVolume.addEventListener("input", () => {
  applyAmbience(ambienceToggle.checked, parseFloat(ambienceVolume.value));
  saveSettings();
});

resetSettingsBtn.addEventListener("click", () => {
  localStorage.removeItem("convYHSettings");
  loadSettings();
});

/* OPEN/CLOSE SETTINGS */
settingsBtn.addEventListener("click", () => {
  hideHome();

  gamesMenu.style.display = "none";
  appsMenu.style.display = "none";
  browserScreen.style.display = "none";
  embedScreen.style.display = "none";

  settingsScreen.style.display = "flex";
});

closeSettingsBtn.addEventListener("click", () => {
  settingsScreen.style.display = "none";
  showHome();
});

/* HOME BUTTON */
homeBtn.addEventListener("click", () => showHome());

/* ============================================================
   INIT
============================================================ */
loadSettings();
showHome();
