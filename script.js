// The answer is stored as a SHA-256 hash — the state name appears NOWHERE in the code.
// This keeps the challenge fair (no one can read the answer) and keeps you in the game.
const ANSWER_HASH = "aa75789eca948db5a51fb85cd45c693c79e5c1199504977100be30f957d78d0b";

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

function normalize(str) {
  return str.trim().toLowerCase().replace(/[^a-z]/g, "");
}

const input = document.getElementById("guessInput");
const btn = document.getElementById("guessBtn");
const result = document.getElementById("result");

async function checkGuess() {
  const guess = normalize(input.value);
  if (!guess) {
    result.textContent = "Type a state name first 🙂";
    result.className = "result";
    return;
  }
  const hash = await sha256(guess);
  if (hash === ANSWER_HASH) {
    result.textContent = "🎉 Correct! You guessed my home state!";
    result.className = "result correct";
  } else {
    result.textContent = "❌ Not quite — look at the clues again and try once more!";
    result.className = "result wrong";
  }
}

btn.addEventListener("click", checkGuess);
input.addEventListener("keydown", e => { if (e.key === "Enter") checkGuess(); });
