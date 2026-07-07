// Sample data: you can replace URLs with your real proxies
const items = [
    {
        name: "Universal Proxy Hub",
        type: "proxy",
        description: "Multi-purpose web proxy for general browsing.",
        links: [
            "https://proxy1.example.com",
            "https://proxy1-alt.example.com"
        ]
    },
    {
        name: "Game Unblocker Alpha",
        type: "game",
        description: "Proxy tuned for unblocking browser-based games.",
        links: [
            "https://gameproxy-alpha.example.com",
            "https://gameproxy-alpha2.example.com"
        ]
    },
    {
        name: "Tool Proxy Suite",
        type: "tool",
        description: "For dev tools, dashboards, and admin panels.",
        links: [
            "https://tools-proxy.example.com"
        ]
    },
    {
        name: "School Bypass Proxy",
        type: "proxy",
        description: "Designed for restricted networks and school Wi-Fi.",
        links: [
            "https://school-bypass.example.com",
            "https://school-bypass2.example.com"
        ]
    },
    {
        name: "Arcade Cloud",
        type: "game",
        description: "Game-focused proxy with low latency routes.",
        links: [
            "https://arcade-cloud.example.com"
        ]
    },
    {
        name: "DevTunnel",
        type: "tool",
        description: "Proxy for APIs, dashboards, and consoles.",
        links: [
            "https://devtunnel.example.com",
            "https://devtunnel-alt.example.com"
        ]
    }
];

const resultsEl = document.getElementById("results");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const tabs = document.querySelectorAll(".tab");
const gameMainBtn = document.querySelector(".game-main-btn");

let activeFilter = "all";

function renderResults() {
    resultsEl.innerHTML = "";

    const query = searchInput.value.trim().toLowerCase();

    const filtered = items.filter(item => {
        const matchesType = activeFilter === "all" || item.type === activeFilter;
        const matchesSearch =
            !query ||
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query);
        return matchesType && matchesSearch;
    });

    if (filtered.length === 0) {
        const msg = document.createElement("div");
        msg.className = "empty-msg";
        msg.textContent = "No results. Try a different search or tab.";
        resultsEl.appendChild(msg);
        return;
    }

    filtered.forEach(item => {
        const card = document.createElement("div");
        card.className = "result-card";

        const header = document.createElement("div");
        header.className = "result-header";

        const title = document.createElement("div");
        title.className = "result-title";
        title.textContent = item.name;

        const tag = document.createElement("div");
        tag.className = "result-tag";
        tag.textContent = item.type.toUpperCase();

        header.appendChild(title);
        header.appendChild(tag);

        const desc = document.createElement("div");
        desc.className = "result-desc";
        desc.textContent = item.description;

        const btnRow = document.createElement("div");
        btnRow.className = "proxy-buttons";

        item.links.forEach((url, index) => {
            const btn = document.createElement("button");
            btn.className = "proxy-btn";
            btn.textContent = `Proxy ${index + 1}`;
            btn.addEventListener("click", () => {
                window.open(url, "_blank");
            });
            btnRow.appendChild(btn);
        });

        card.appendChild(header);
        card.appendChild(desc);
        card.appendChild(btnRow);

        resultsEl.appendChild(card);
    });
}

// Tab switching
tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        activeFilter = tab.getAttribute("data-filter");
        renderResults();
    });
});

// Search button + live typing
searchBtn.addEventListener("click", renderResults);
searchInput.addEventListener("keyup", e => {
    if (e.key === "Enter") renderResults();
});

// Random game proxy button
gameMainBtn.addEventListener("click", () => {
    const gameItems = items.filter(i => i.type === "game");
    if (gameItems.length === 0) return;

    const randomItem = gameItems[Math.floor(Math.random() * gameItems.length)];
    const randomLink = randomItem.links[Math.floor(Math.random() * randomItem.links.length)];
    window.open(randomLink, "_blank");
});

// Initial render
renderResults();
