// =========================
// Particle background
// =========================

const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

let particles = [];
let animationId = null;
let particlesEnabled = true;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function createParticles(count) {
    particles = [];
    const w = canvas.width;
    const h = canvas.height;

    for (let i = 0; i < count; i++) {
        const size = Math.random() * 120 + 60; // big, soft blobs
        particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            radius: size,
            alpha: Math.random() * 0.4 + 0.2
        });
    }
}

function drawParticles() {
    if (!particlesEnabled) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
        const gradient = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            p.radius
        );

        gradient.addColorStop(0, `rgba(200, 150, 255, ${p.alpha})`);
        gradient.addColorStop(0.3, `rgba(160, 90, 255, ${p.alpha * 0.9})`);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Soft motion
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x - p.radius > canvas.width) p.x = -p.radius;
        if (p.x + p.radius < 0) p.x = canvas.width + p.radius;
        if (p.y - p.radius > canvas.height) p.y = -p.radius;
        if (p.y + p.radius < 0) p.y = canvas.height + p.radius;
    }
}

function animateParticles() {
    drawParticles();
    animationId = requestAnimationFrame(animateParticles);
}

createParticles(18);
animateParticles();

// =========================
// UI elements
// =========================

const homeScreen = document.getElementById("home-screen");
const openZonesBtn = document.getElementById("openZonesBtn");
const openAppsBtn = document.getElementById("openAppsBtn");
const openSettingsBtn = document.getElementById("openSettingsBtn");

const zonesPanel = document.getElementById("zonesPanel");
const appsPanel = document.getElementById("appsPanel");
const settingsPanel = document.getElementById("settingsPanel");

const closeButtons = document.querySelectorAll(".close-panel");

// Apps
const calcA = document.getElementById("calcA");
const calcB = document.getElementById("calcB");
const calcButtons = document.querySelectorAll(".calc-buttons button");
const calcResultSpan = document.getElementById("calcResult");
const notesArea = document.getElementById("notesArea");

// Settings
const particlesToggle = document.getElementById("particlesToggle");
const downloadSaveBtn = document.getElementById("downloadSaveBtn");
const uploadSaveInput = document.getElementById("uploadSaveInput");

// =========================
// Panel logic
// =========================

function showPanel(panel) {
    panel.classList.remove("hidden");
}

function hidePanel(panel) {
    panel.classList.add("hidden");
}

openZonesBtn.addEventListener("click", () => {
    // Replace title + bar with zones panel
    homeScreen.classList.add("hidden");
    showPanel(zonesPanel);
});

openAppsBtn.addEventListener("click", () => {
    showPanel(appsPanel);
});

openSettingsBtn.addEventListener("click", () => {
    showPanel(settingsPanel);
});

closeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-close");
        const panel = document.getElementById(targetId);
        hidePanel(panel);

        // If zones panel closes, bring home back
        if (panel === zonesPanel) {
            homeScreen.classList.remove("hidden");
        }
    });
});

// =========================
// Calculator logic
// =========================

function calculate(op) {
    const a = parseFloat(calcA.value || "0");
    const b = parseFloat(calcB.value || "0");
    let result = 0;

    switch (op) {
        case "add":
            result = a + b;
            break;
        case "sub":
            result = a - b;
            break;
        case "mul":
            result = a * b;
            break;
        case "div":
            result = b !== 0 ? a / b : 0;
            break;
    }

    calcResultSpan.textContent = result;
    localStorage.setItem("conv_calc_result", String(result));
}

calcButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const op = btn.getAttribute("data-op");
        calculate(op);
    });
});

// =========================
// Notes logic
// =========================

function loadNotes() {
    const saved = localStorage.getItem("conv_notes");
    if (saved !== null) {
        notesArea.value = saved;
    }
}

notesArea.addEventListener("input", () => {
    localStorage.setItem("conv_notes", notesArea.value);
});

// =========================
// Settings: particles toggle
// =========================

function applyParticlesSetting(enabled) {
    particlesEnabled = enabled;
    if (!enabled) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    localStorage.setItem("conv_particles_enabled", enabled ? "1" : "0");
}

particlesToggle.addEventListener("change", () => {
    applyParticlesSetting(particlesToggle.checked);
});

// =========================
// Save data export/import
// =========================

function buildSaveData() {
    return {
        version: "1.0",
        timestamp: new Date().toISOString(),
        notes: localStorage.getItem("conv_notes") || "",
        calculatorResult: localStorage.getItem("conv_calc_result") || "0",
        settings: {
            particlesEnabled: localStorage.getItem("conv_particles_enabled") === "1"
        }
        // You can extend this with game progress, etc.
    };
}

function downloadSaveData() {
    const data = buildSaveData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "convYH-save.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

downloadSaveBtn.addEventListener("click", downloadSaveData);

uploadSaveInput.addEventListener("change", event => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
        try {
            const data = JSON.parse(e.target.result);

            if (typeof data.notes === "string") {
                localStorage.setItem("conv_notes", data.notes);
                notesArea.value = data.notes;
            }

            if (typeof data.calculatorResult === "string") {
                localStorage.setItem("conv_calc_result", data.calculatorResult);
                calcResultSpan.textContent = data.calculatorResult;
            }

            if (data.settings && typeof data.settings.particlesEnabled === "boolean") {
                const enabled = data.settings.particlesEnabled;
                particlesToggle.checked = enabled;
                applyParticlesSetting(enabled);
            }

            // Reset file input so same file can be reloaded if needed
            uploadSaveInput.value = "";
        } catch (err) {
            console.error("Invalid save data:", err);
        }
    };
    reader.readAsText(file);
});

// =========================
// Initial load
// =========================

function initFromStorage() {
    // Notes
    loadNotes();

    // Calculator result
    const savedResult = localStorage.getItem("conv_calc_result");
    if (savedResult !== null) {
        calcResultSpan.textContent = savedResult;
    }

    // Particles setting
    const savedParticles = localStorage.getItem("conv_particles_enabled");
    const enabled = savedParticles !== "0"; // default: on
    particlesToggle.checked = enabled;
    applyParticlesSetting(enabled);
}

initFromStorage();
