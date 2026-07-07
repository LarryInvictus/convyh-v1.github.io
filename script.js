const items = [
    { name: "Universal Proxy", type: "tools", url: "https://example.com" },
    { name: "Game Unblocker", type: "games", url: "https://bing.com" },
    { name: "School Bypass", type: "tools", url: "https://duckduckgo.com" },
    { name: "Arcade Cloud", type: "games", url: "https://yahoo.com" }
];

const results = document.getElementById("results");
const searchInput = document.getElementById("searchInput");
const tabs = document.querySelectorAll(".tab");

const modal = document.getElementById("frameModal");
const closeModal = document.getElementById("closeModal");
const proxyFrame = document.getElementById("proxyFrame");
const frameSearch = document.getElementById("frameSearch");

// Render cards
function render(filter = "all", search = "") {
    results.innerHTML = "";

    const filtered = items.filter(item => {
        const matchesFilter = filter === "all" || item.type === filter;
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    filtered.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h3>${item.name}</h3>
            <p>Type: ${item.type}</p>
            <button class="open-btn">Open</button>
        `;

        card.querySelector(".open-btn").addEventListener("click", () => {
            modal.style.display = "flex";
            proxyFrame.src = item.url;
        });

        results.appendChild(card);
    });
}

// Close modal
closeModal.addEventListener("click", () => {
    modal.style.display = "none";
    proxyFrame.src = "";
});

// Frame search
frameSearch.addEventListener("input", () => {
    proxyFrame.src = "https://www.google.com/search?q=" + encodeURIComponent(frameSearch.value);
});

// Tabs
tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        const filter = tab.getAttribute("data-filter");
        render(filter, searchInput.value);
    });
});

// Search
searchInput.addEventListener("input", () => {
    const activeTab = document.querySelector(".tab.active").getAttribute("data-filter");
    render(activeTab, searchInput.value);
});

// Initial render
render();
