// ------------------------------
// Counter logic (shared on any page)
// ------------------------------

let count = 0;

function initCounter() {
  const display = document.getElementById("display");
  const incrementBtn = document.getElementById("increment");
  const resetBtn = document.getElementById("reset");

  // If this page doesn't have a counter, do nothing
  if (!display) return;

  // Load previous count from localStorage if it exists
  const stored = localStorage.getItem("powCounter");
  count = stored ? Number(stored) : 0;
  if (Number.isNaN(count)) count = 0;

  // Show initial value
  display.textContent = count;

  // Increment button
  if (incrementBtn) {
    incrementBtn.addEventListener("click", () => {
      count++;
      display.textContent = count;
      localStorage.setItem("powCounter", String(count));
    });
  }

  // Reset button
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      count = 0;
      display.textContent = count;
      localStorage.setItem("powCounter", String(count));
    });
  }
}

// ------------------------------
// Local Leaderboard logic
// ------------------------------

const LEADERBOARD_KEY = "powLeaderboard";

function loadLeaderboard() {
  const raw = localStorage.getItem(LEADERBOARD_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to parse leaderboard:", e);
    return [];
  }
}

function saveLeaderboard(list) {
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(list));
}

// Sort: highest score first
function sortLeaderboard(list) {
  return list.sort((a, b) => b.score - a.score);
}

function renderLeaderboard() {
  const tbody = document.getElementById("leaderboard-body");
  if (!tbody) return; // page has no leaderboard

  const list = sortLeaderboard(loadLeaderboard());
  tbody.innerHTML = "";

  list.forEach((entry, index) => {
    const tr = document.createElement("tr");

    const rankTd = document.createElement("td");
    rankTd.textContent = String(index + 1);

    const initialsTd = document.createElement("td");
    initialsTd.textContent = entry.initials;

    const scoreTd = document.createElement("td");
    scoreTd.textContent = String(entry.score);

    tr.appendChild(rankTd);
    tr.appendChild(initialsTd);
    tr.appendChild(scoreTd);

    tbody.appendChild(tr);
  });
}

function addScore(initials, score) {
  const list = loadLeaderboard();
  list.push({ initials, score });
  saveLeaderboard(list);
  renderLeaderboard();
}

function initLeaderboard() {
  const initialsInput = document.getElementById("initials-input");
  const saveScoreBtn = document.getElementById("save-score-btn");
  const clearLeaderboardBtn = document.getElementById("clear-leaderboard-btn");

  // If this page has no leaderboard elements, do nothing
  if (!initialsInput && !saveScoreBtn && !clearLeaderboardBtn) return;

  if (saveScoreBtn && initialsInput) {
    saveScoreBtn.addEventListener("click", () => {
      let initials = initialsInput.value.trim().toUpperCase();
      if (!initials) initials = "???";

      // Use the global counter value as the score
      addScore(initials, count);
    });
  }

  if (clearLeaderboardBtn) {
    clearLeaderboardBtn.addEventListener("click", () => {
      localStorage.removeItem(LEADERBOARD_KEY);
      renderLeaderboard();
    });
  }

  // Draw existing entries on load
  renderLeaderboard();
}

// ------------------------------
// Initialize when DOM is ready
// ------------------------------

document.addEventListener("DOMContentLoaded", () => {
  initCounter();
  initLeaderboard();
});
