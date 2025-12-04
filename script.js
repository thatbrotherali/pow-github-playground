// Load previous count from localStorage if exists
let count = Number(localStorage.getItem("powCounter")) || 0;

// Display it on screen
const display = document.getElementById("display");
display.textContent = count;

// Increment button
document.getElementById("increment").addEventListener("click", () => {
  count++;
  display.textContent = count;
  localStorage.setItem("powCounter", count);
});

// Reset button
document.getElementById("reset").addEventListener("click", () => {
  count = 0;
  display.textContent = count;
  localStorage.setItem("powCounter", count);
});
// ------------------------------
// Local Leaderboard Logic
// ------------------------------

// Load existing leaderboard from localStorage
function loadLeaderboard() {
  const stored = localStorage.getItem("powLeaderboard");
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

// Save leaderboard to localStorage
function saveLeaderboard(list) {
  localStorage.setItem("powLeaderboard", JSON.stringify(list));
}

// Sort leaderboard: highest score first
function sortLeaderboard(list) {
  return list.sort((a, b) => b.score - a.score);
}

// Render leaderboard into the table
function renderLeaderboard() {
  const tbody = document.getElementById("leaderboard-body");
  if (!tbody) return;

  const list = sortLeaderboard(loadLeaderboard());

  tbody.innerHTML = "";
  list.forEach((entry, index) => {
    const row = document.createElement("tr");

    const rankCell = document.createElement("td");
    rankCell.textContent = String(index + 1);

    const initialsCell = document.createElement("td");
    initialsCell.textContent = entry.initials;

    const scoreCell = document.createElement("td");
    scoreCell.textContent = String(entry.score);

    row.appendChild(rankCell);
    row.appendChild(initialsCell);
    row.appendChild(scoreCell);

    tbody.appendChild(row);
  });
}

// Add a new score to the leaderboard
function addScore(initials, score) {
  const list = loadLeaderboard();
  list.push({ initials, score });
  saveLeaderboard(list);
  renderLeaderboard();
}

// Hook up buttons if they exist on this page
const saveScoreBtn = document.getElementById("save-score-btn");
const initialsInput = document.getElementById("initials-input");
const clearLeaderboardBtn = document.getElementById("clear-leaderboard-btn");

if (saveScoreBtn && initialsInput) {
  saveScoreBtn.addEventListener("click", () => {
    const initials = initialsInput.value.trim().toUpperCase() || "???";
    // Use current count as the score
    addScore(initials, count);
  });
}

if (clearLeaderboardBtn) {
  clearLeaderboardBtn.addEventListener("click", () => {
    localStorage.removeItem("powLeaderboard");
    renderLeaderboard();
  });
}

// Render leaderboard on load (if the table exists)
renderLeaderboard();
