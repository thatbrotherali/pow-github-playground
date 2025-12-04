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
