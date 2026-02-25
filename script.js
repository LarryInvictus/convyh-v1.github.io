// =====================
// PARTICLE BACKGROUND
// =====================
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

let particles = [];
const particleCount = 120;
const maxVelocity = 0.4;
const connectionDistance = 130;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function createParticles() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * maxVelocity,
      vy: (Math.random() - 0.5) * maxVelocity,
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.6 + 0.2
    });
  }
}

function updateParticles() {
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const p of particles) {
    ctx.beginPath();
    const gradient = ctx.createRadialGradient(
      p.x, p.y, 0,
      p.x, p.y, p.radius * 4
    );
    gradient.addColorStop(0, `rgba(216, 180, 254, ${p.alpha})`);
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const p1 = particles[i];
      const p2 = particles[j];
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < connectionDistance) {
        const alpha = 1 - dist / connectionDistance;
        ctx.strokeStyle = `rgba(168, 85, 247, ${alpha * 0.4})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  updateParticles();
  drawParticles();
  requestAnimationFrame(animate);
}

createParticles();
animate();


// =====================
// QUOTE SYSTEM
// =====================
const quoteBox = document.getElementById("quoteBox");

const quotes = [
  "Man I dont know why I made this",
  "Can someone like...tell Roblox to chill",
  "Originally made with GitHub",
  "Yes Kevin we all know the entertainment is broken"
];

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteBox.textContent = `"${quotes[randomIndex]}"`;
}

quoteBox.addEventListener("click", showRandomQuote);


// =====================
// MENU SYSTEM
// =====================
const entertainmentBtn = document.getElementById("gamesBtn");
const appsBtn = document.getElementById("appsBtn");
const entertainmentMenu = document.getElementById("gamesMenu");
const appsMenu = document.getElementById("appsMenu");

function toggleMenu(menu) {
  entertainmentMenu.style.display = "none";
  appsMenu.style.display = "none";
  menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}

entertainmentBtn.addEventListener("click", () => toggleMenu(entertainmentMenu));
appsBtn.addEventListener("click", () => toggleMenu(appsMenu));

document.addEventListener("click", (e) => {
  if (!e.target.closest(".dock") && !e.target.closest(".menu-panel")) {
    entertainmentMenu.style.display = "none";
    appsMenu.style.display = "none";
  }
});


// =====================
// BROWSER SYSTEM
// =====================
const browserBtn = document.getElementById("browserBtn");
const browserScreen = document.getElementById("browserScreen");
const homeScreen = document.getElementById("homeScreen");

const tabsContainer = document.getElementById("tabs");
const addTabBtn = document.getElementById("addTab");
const searchInput = document.getElementById("searchInput");
const goBtn = document.getElementById("goBtn");
const closeBrowser = document.getElementById("closeBrowser");
const browserFrame = document.getElementById("browserFrame");

let tabs = [];
let activeTab = null;

const HOMEPAGE = "conv-home://";

function createTab(url = HOMEPAGE) {
  const id = Date.now() + Math.random();
  const tab = { id, url };
  tabs.push(tab);
  activeTab = id;
  renderTabs();
  loadTab(tab);
}

function renderTabs() {
  tabsContainer.innerHTML = "";
  tabs.forEach(tab => {
    const tabEl = document.createElement("div");
    tabEl.className = "tab" + (tab.id === activeTab ? " active" : "");
    tabEl.textContent = tab.url === HOMEPAGE
      ? "Home"
      : tab.url.replace("https://", "").replace("http://", "").slice(0, 12);

    tabEl.onclick = () => {
      activeTab = tab.id;
      loadTab(tab);
      renderTabs();
    };

    const closeBtn = document.createElement("span");
    closeBtn.className = "close-tab";
    closeBtn.textContent = "×";
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      closeTab(tab.id);
    };

    tabEl.appendChild(closeBtn);
    tabsContainer.appendChild(tabEl);
  });
}

function closeTab(id) {
  tabs = tabs.filter(t => t.id !== id);
  if (tabs.length === 0) return createTab();
  activeTab = tabs[tabs.length - 1].id;
  loadTab(tabs[tabs.length - 1]);
  renderTabs();
}

function loadTab(tab) {
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

function goToURL() {
  let input = searchInput.value.trim();
  if (!input) return;

  // If it's a search (contains spaces), use DuckDuckGo
  if (input.includes(" ")) {
    input = "https://duckduckgo.com/?q=" + encodeURIComponent(input);
  } else if (!input.startsWith("http")) {
    input = "https://" + input;
  }

  const tab = tabs.find(t => t.id === activeTab);
  if (!tab) return;

  tab.url = input;
  loadTab(tab);
  renderTabs();
}


// =====================
// FULLSCREEN BROWSER TOGGLE
// =====================
let browserOpen = false;

browserBtn.onclick = () => {
  browserOpen = !browserOpen;

  if (browserOpen) {
    browserScreen.classList.add("active");

    homeScreen.style.display = "none";
    quoteBox.style.display = "none";
    canvas.style.display = "none";
    entertainmentMenu.style.display = "none";
    appsMenu.style.display = "none";

    if (tabs.length === 0) createTab();
  } else {
    browserScreen.classList.remove("active");

    homeScreen.style.display = "flex";
    quoteBox.style.display = "block";
    canvas.style.display = "block";
  }
};

addTabBtn.onclick = () => createTab();
goBtn.onclick = goToURL;

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") goToURL();
});

closeBrowser.onclick = () => {
  browserOpen = false;
  browserScreen.classList.remove("active");

  homeScreen.style.display = "flex";
  quoteBox.style.display = "block";
  canvas.style.display = "block";
};


// =====================
// OPEN LINKS INSIDE BROWSER
// =====================
function openInBrowser(url) {
  browserOpen = true;
  browserScreen.classList.add("active");

  homeScreen.style.display = "none";
  quoteBox.style.display = "none";
  canvas.style.display = "none";
  entertainmentMenu.style.display = "none";
  appsMenu.style.display = "none";

  createTab(url);
    }
