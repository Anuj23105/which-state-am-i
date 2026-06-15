/**
 * "Which State Am I?" — guess-checking logic.
 *
 * The answer is stored ONLY as a one-way SHA-256 hash, so the state name
 * appears nowhere in the code, the page, or the image. The logic below is
 * split into small, pure functions so it can be unit-tested in isolation,
 * with the DOM wiring kept separate at the bottom of the file.
 */

/** SHA-256 hash of the (normalized) secret answer. */
export const ANSWER_HASH =
  "aa75789eca948db5a51fb85cd45c693c79e5c1199504977100be30f957d78d0b";

/**
 * Compute the SHA-256 hex digest of a string using the Web Crypto API.
 * @param {string} text - The text to hash.
 * @returns {Promise<string>} Lowercase hex-encoded digest (64 chars).
 * @throws {Error} If the Web Crypto API is unavailable.
 */
export async function sha256(text) {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error("Web Crypto API is not available in this environment.");
  }
  const data = new TextEncoder().encode(text);
  const buf = await subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Normalize a user guess: trim, lowercase and strip everything except a–z.
 * This makes the check tolerant of spacing, casing and punctuation.
 * @param {string} str - Raw user input.
 * @returns {string} Normalized comparison key.
 */
export function normalize(str) {
  return String(str ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z]/g, "");
}

/**
 * @typedef {Object} GuessResult
 * @property {string} text      - Message to show the user.
 * @property {"result"|"result correct"|"result wrong"} className - CSS class.
 * @property {"empty"|"correct"|"wrong"} status - Machine-readable outcome.
 */

/**
 * Build the user-facing result object for a guess outcome (pure, no DOM/IO).
 * @param {{ isEmpty?: boolean, isMatch?: boolean }} outcome
 * @returns {GuessResult}
 */
export function buildResult({ isEmpty = false, isMatch = false } = {}) {
  if (isEmpty) {
    return {
      text: "Type a state name first 🙂",
      className: "result",
      status: "empty",
    };
  }
  if (isMatch) {
    return {
      text: "🎉 Correct! You guessed my home state!",
      className: "result correct",
      status: "correct",
    };
  }
  return {
    text: "❌ Not quite — look at the clues again and try once more!",
    className: "result wrong",
    status: "wrong",
  };
}

/**
 * Evaluate a raw guess end-to-end against the stored answer hash.
 * @param {string} rawGuess - The raw text the user typed.
 * @param {string} [answerHash=ANSWER_HASH] - Hash to compare against.
 * @returns {Promise<GuessResult>}
 */
export async function checkAnswer(rawGuess, answerHash = ANSWER_HASH) {
  const guess = normalize(rawGuess);
  if (!guess) {
    return buildResult({ isEmpty: true });
  }
  const hash = await sha256(guess);
  return buildResult({ isMatch: hash === answerHash });
}

/**
 * Wire up the DOM. Safe to call only in a browser; guarded at call site.
 */
export function initUI() {
  const form = document.getElementById("guessForm");
  const input = document.getElementById("guessInput");
  const btn = document.getElementById("guessBtn");
  const result = document.getElementById("result");
  if (!form || !input || !btn || !result) return;

  /** Run a guess and render the outcome into the result element. */
  async function handleGuess() {
    btn.disabled = true;
    try {
      const outcome = await checkAnswer(input.value);
      result.textContent = outcome.text;
      result.className = outcome.className;
    } catch (err) {
      result.textContent = "Something went wrong — please try again.";
      result.className = "result wrong";
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      btn.disabled = false;
    }
  }

  // A <form> handles both the click and the Enter key natively.
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    handleGuess();
  });
}

// Bootstrap only in a browser environment (skipped during unit tests).
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initUI);
  } else {
    initUI();
  }
}
