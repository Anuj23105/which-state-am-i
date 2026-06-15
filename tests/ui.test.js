import { describe, it, expect, beforeEach } from "vitest";
import { initUI } from "../script.js";

/** Build the minimal DOM the UI wiring expects. */
function mountDom() {
  document.body.innerHTML = `
    <form id="guessForm">
      <input id="guessInput" />
      <button id="guessBtn" type="submit">Guess</button>
    </form>
    <p id="result" class="result"></p>
  `;
  return {
    form: document.getElementById("guessForm"),
    input: document.getElementById("guessInput"),
    btn: document.getElementById("guessBtn"),
    result: document.getElementById("result"),
  };
}

/** Submit the form and wait for the async handler to settle. */
async function submitAndSettle(form) {
  form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
  // Let the microtask queue (the async handler) drain.
  await new Promise((r) => setTimeout(r, 0));
}

describe("initUI()", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("does nothing when required elements are missing", () => {
    expect(() => initUI()).not.toThrow();
  });

  it("shows the empty-input prompt on a blank submit", async () => {
    const { form, result } = mountDom();
    initUI();
    await submitAndSettle(form);
    expect(result.className).toBe("result");
    expect(result.textContent).toMatch(/type a state name/i);
  });

  it("marks an incorrect guess as wrong", async () => {
    const { form, input, result } = mountDom();
    initUI();
    input.value = "atlantis";
    await submitAndSettle(form);
    expect(result.className).toBe("result wrong");
  });

  it("re-enables the button after handling a guess", async () => {
    const { form, input, btn } = mountDom();
    initUI();
    input.value = "kerala";
    await submitAndSettle(form);
    expect(btn.disabled).toBe(false);
  });
});
