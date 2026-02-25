/* Elements */
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

/* Home helpers */
function showHome() {
  homeScreen.style.display = "block";
  quoteBox.style.display = "block";
  gamesMenu.style.display = "none";
  appsMenu.style.display = "none";
  browserScreen.style.display = "none";
  embedScreen.style.display = "none";
}

function hideHome() {
  homeScreen.style.display = "none";
  quoteBox.style.display = "none";
}

/* Quotes */
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

/* Menus */
function toggleMenu(menu) {
  const isOpen = menu.style.display === "block";
  gamesMenu.style.display = "none";
  appsMenu.style.display = "none";
  if (!isOpen) menu.style.display = "block";
}

gamesBtn.addEventListener("click", () => {
  toggleMenu(gamesMenu);
});

appsBtn.addEventListener("click", () => {
  toggleMenu(appsMenu);
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".dock") && !e.target.closest(".menu-panel")) {
    gamesMenu.style.display = "none";
    appsMenu.style.display = "none";
  }
});

/* Embed */
function openEmbed(url) {
  hideHome();
  gamesMenu.style.display = "none";
  appsMenu.style.display = "none";
  browserScreen.style.display = "none";

  embedScreen.style.display = "flex";
  embedFrame.src = url;
}

closeEmbedBtn.addEventListener("click", () => {
  embedScreen.style.display = "none";
  embedFrame.src = "";
  showHome();
});

/* Browser */
function openBrowser() {
  hideHome();
  gamesMenu.style.display = "none";
  appsMenu.style.display = "none";
  embedScreen.style.display = "none";

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

/* Dock buttons */
homeBtn.addEventListener("click", showHome);
browserBtn.addEventListener("click", openBrowser);

/* Init */
showHome();

/* Expose openEmbed globally */
window.openEmbed = openEmbed;
