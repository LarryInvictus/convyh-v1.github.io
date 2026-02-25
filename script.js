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
// EMBED SYSTEM (Entertainment / Apps)
// =====================
const embedScreen = document.getElementById("embedScreen");
const embedFrame = document.getElementById("embedFrame");
const closeEmbed = document.getElementById("closeEmbed");
const homeScreen = document.getElementById("homeScreen");

function openEmbed(url) {
  embedScreen.style.display = "flex";
  embedFrame.src = url;

  homeScreen.style.display = "none";
  quoteBox.style.display = "none";
  canvas.style.display = "none";
  entertainmentMenu.style.display = "none";
  appsMenu.style.display = "none";
  browserScreen.classList.remove("active");
}

closeEmbed.onclick = () => {
  embedScreen.style.display = "none";
  embedFrame.src = "";
  homeScreen.style.display = "flex";
  quoteBox.style.display = "block";
  canvas.style.display = "block";
};


// =====================
// BROWSER SYSTEM
// =====================
const browserBtn = document.getElementById("browserBtn");
const browserScreen = document.getElementById("browserScreen");

const tabsContainer = document.getElementById("tabs");
const addTabBtn = document.getElementById("addTab");
const searchInput = document.getElementById("searchInput");
const goBtn = document.getElementById("goBtn");
const closeBrowser = document.getElementById("closeBrowser");
const browserFrame = document.getElementById("browserFrame");
const tabContextMenu = document.getElementById("tabContextMenu");

let tabs = [];
let activeTab = null;
const HOMEPAGE = "conv-home://";

function createTab(url = HOMEPAGE, pinned = false) {
  const id = Date.now() + Math.random();
  const tab = { id, url, pinned };
  tabs.push(tab);
  activeTab = id;
  renderTabs();
  loadTab(tab);
}

function getActiveTab() {
  return tabs.find(t => t.id === activeTab) || null;
}

function labelForTab(tab) {
  if (tab.url === HOMEPAGE) return "Home";
  try {
    const u = new URL(tab.url);
    return u.hostname.replace("www.", "");
  } catch {
    return tab.url.slice(0, 12);
  }
}

function renderTabs() {
  tabsContainer.innerHTML = "";

  const sorted = [...tabs].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  sorted.forEach(tab => {
    const tabEl = document.createElement("div");
    tabEl.className = "tab" +
      (tab.id === activeTab ? " active" : "") +
      (tab.pinned ? " pinned" : "");
    tabEl.dataset.id = tab.id;
    tabEl.textContent = labelForTab(tab);

    const closeBtn = document.createElement("span");
    closeBtn.className = "close-tab";
    closeBtn.textContent = "×";
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      closeTab(tab.id);
    };

    tabEl.appendChild(closeBtn);

    tabEl.onclick = () => {
      activeTab = tab.id;
      loadTab(tab);
      renderTabs();
      searchInput.focus();
    };

    tabEl.addEventListener("auxclick", (e) => {
      if (e.button === 1) {
        e.preventDefault();
        closeTab(tab.id);
      }
    });

    tabEl.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      showTabContextMenu(e.clientX, e.clientY, tab.id);
    });

    enableTabDrag(tabEl, tab.id);

    tabsContainer.appendChild(tabEl);
  });
}

function closeTab(id) {
  const idx = tabs.findIndex(t => t.id === id);
  if (idx === -1) return;
  tabs.splice(idx, 1);

  if (tabs.length === 0) {
    createTab();
    return;
  }

  if (activeTab === id) {
    activeTab = tabs[Math.max(0, idx - 1)].id;
    loadTab(getActiveTab());
  }
  renderTabs();
}

function loadTab(tab) {
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
  loadTab(tab);
  renderTabs();
}


// =====================
// TAB CONTEXT MENU
// =====================
let contextTabId = null;

function showTabContextMenu(x, y, tabId) {
  contextTabId = tabId;
  tabContextMenu.style.display = "flex";
  tabContextMenu.style.left = x + "px";
  tabContextMenu.style.top = y + "px";
}

document.addEventListener("click", () => {
  tabContextMenu.style.display = "none";
});

tabContextMenu.addEventListener("click", (e) => {
  const action = e.target.dataset.action;
  const tab = tabs.find(t => t.id === contextTabId);
  if (!tab) return;

  if (action === "pin") {
    tab.pinned = !tab.pinned;
  } else if (action === "close") {
    closeTab(tab.id);
  } else if (action === "closeOthers") {
    tabs = tabs.filter(t => t.id === tab.id);
    activeTab = tab.id;
    loadTab(tab);
  } else if (action === "closeAll") {
    tabs = [];
    createTab();
  }

  renderTabs();
  tabContextMenu.style.display = "none";
});


// =====================
// TAB DRAG-TO-REORDER
// =====================
function enableTabDrag(tabEl, tabId) {
  let startX = 0;
  let dragging = false;

  tabEl.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    dragging = true;
    startX = e.clientX;
    tabEl.classList.add("dragging");
  });

  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    tabEl.style.transform = `translateX(${dx}px)`;
  });

  document.addEventListener("mouseup", (e) => {
    if (!dragging) return;
    dragging = false;
    tabEl.classList.remove("dragging");
    tabEl.style.transform = "";

    const rect = tabEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const siblings = Array.from(tabsContainer.children);

    let targetIndex = siblings.findIndex(el => {
      const r = el.getBoundingClientRect();
      return centerX < r.left + r.width / 2;
    });

    const currentIndex = tabs.findIndex(t => t.id === tabId);
    if (targetIndex === -1) targetIndex = tabs.length - 1;

    const [moved] = tabs.splice(currentIndex, 1);
    tabs.splice(targetIndex, 0, moved);
    renderTabs();
  });
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
    embedScreen.style.display = "none";

    if (tabs.length === 0) createTab();
    searchInput.focus();
  } else {
    browserScreen.classList.remove("active");

    homeScreen.style.display = "flex";
    quoteBox.style.display = "block";
    canvas.style.display = "block";
  }
};

addTabBtn.onclick = () => {
  createTab();
  searchInput.focus();
};
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
// KEYBOARD SHORTCUTS
// =====================
document.addEventListener("keydown", (e) => {
  if (!browserOpen) return;

  const ctrl = e.ctrlKey || e.metaKey;

  if (ctrl && e.key.toLowerCase() === "t") {
    e.preventDefault();
    createTab();
    searchInput.focus();
  }

  if (ctrl && e.key.toLowerCase() === "w") {
    e.preventDefault();
    const tab = getActiveTab();
    if (tab) closeTab(tab.id);
  }

  if (ctrl && e.key === "Tab" && !e.shiftKey) {
    e.preventDefault();
    if (tabs.length === 0) return;
    let idx = tabs.findIndex(t => t.id === activeTab);
    idx = (idx + 1) % tabs.length;
    activeTab = tabs[idx].id;
    loadTab(tabs[idx]);
    renderTabs();
    searchInput.focus();
  }

  if (ctrl && e.key === "Tab" && e.shiftKey) {
    e.preventDefault();
    if (tabs.length === 0) return;
    let idx = tabs.findIndex(t => t.id === activeTab);
    idx = (idx - 1 + tabs.length) % tabs.length;
    activeTab = tabs[idx].id;
    loadTab(tabs[idx]);
    renderTabs();
    searchInput.focus();
  }
});
