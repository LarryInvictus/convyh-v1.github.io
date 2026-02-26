/* ============================================================
   ELEMENTS
============================================================ */
const homeScreen = document.getElementById("homeScreen");
const quoteBox = document.getElementById("quoteBox");

const gamesMenu = document.getElementById("gamesMenu");
const appsMenu = document.getElementById("appsMenu");

const browserScreen = document.getElementById("browserScreen");
const searchInput = document.getElementById("searchInput");
const goBtn = document.getElementById("goBtn");
const closeBrowserBtn = document.getElementById("closeBrowser");
const browserFrame = document.getElementById("browserFrame");

const embedScreen = document.getElementById("embedScreen");
const embedFrame = document.getElementById("embedFrame");
const closeEmbedBtn = document.getElementById("closeEmbed");

const homeBtn = document.getElementById("homeBtn");
const gamesBtn = document.getElementById("gamesBtn");
const appsBtn = document.getElementById("appsBtn");
const browserBtn = document.getElementById("browserBtn");
const settingsBtn = document.getElementById("settingsBtn");

/* Settings elements */
const settingsScreen = document.getElementById("settingsScreen");
const closeSettingsBtn = document.getElementById("closeSettings");
const themeSelect = document.getElementById("themeSelect");
const modeToggle = document.getElementById("modeToggle");
const resetBtn = document.getElementById("resetSettings");

/* ============================================================
   HOME HELPERS
============================================================ */
function showHome() {
  homeScreen.style.display = "block";
  quoteBox.style.display = "block";

  gamesMenu.style.display = "none";
  appsMenu.style.display = "none";
  browserScreen.style.display = "none";
  embedScreen.style.display = "none";
  settingsScreen.style.display = "none";
}

function hideHome() {
  homeScreen.style.display = "none";
  quoteBox.style.display = "none";
}

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
  const q = quotes[Math.floor(Math.random() * quotes.length)];
  quoteBox.textContent = `"${q}"`;
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
   BROWSER
============================================================ */
function openBrowser() {
  hideHome();
  gamesMenu.style.display = "none";
  appsMenu.style.display = "none";
  embedScreen.style.display = "none";
  settingsScreen.style.display = "none";

  browserScreen.style.display = "flex";
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
}

function goToURL() {
  let input = searchInput.value.trim();
  if (!input) return;

  if (input.includes(" ")) {
    input = "https://duckduckgo.com/?q=" + encodeURIComponent(input);
  } else if (!input.startsWith("http")) {
    input = "https://" + input;
  }

  browserFrame.srcdoc = "";
  browserFrame.src = input;
}

goBtn.addEventListener("click", goToURL);
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") goToURL();
});

closeBrowserBtn.addEventListener("click", () => {
  browserScreen.style.display = "none";
  showHome();
});

/* ============================================================
   SETTINGS SYSTEM (NEW)
============================================================ */
function applyTheme(theme) {
  document.body.setAttribute("data-theme", theme);
}

function applyMode(mode) {
  document.body.setAttribute("data-mode", mode);
}

function loadSettings() {
  const saved = JSON.parse(localStorage.getItem("convSettings") || "{}");

  const theme = saved.theme || "purple";
  const mode = saved.mode || "dark";

  themeSelect.value = theme;
  modeToggle.checked = mode === "light";

  applyTheme(theme);
  applyMode(mode);
}

function saveSettings() {
  const data = {
    theme: themeSelect.value,
    mode: modeToggle.checked ? "light" : "dark"
  };

  localStorage.setItem("convSettings", JSON.stringify(data));
}

themeSelect.addEventListener("change", () => {
  applyTheme(themeSelect.value);
  saveSettings();
});

modeToggle.addEventListener("change", () => {
  applyMode(modeToggle.checked ? "light" : "dark");
  saveSettings();
});

resetBtn.addEventListener("click", () => {
  localStorage.removeItem("convSettings");
  loadSettings();
});

/* Open/close settings */
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

/* ============================================================
   DOCK BUTTONS
============================================================ */
homeBtn.addEventListener("click", showHome);
browserBtn.addEventListener("click", openBrowser);

/* ============================================================
   INIT
============================================================ */
loadSettings();
showHome();

/* Expose embed globally */
window.openEmbed = openEmbed;
