import { describe, it, expect } from "vitest";
import {
  ANSWER_HASH,
  sha256,
  normalize,
  buildResult,
  checkAnswer,
} from "../script.js";

describe("normalize()", () => {
  it("trims, lowercases and strips non-letters", () => {
    expect(normalize("  Tamil Nadu! ")).toBe("tamilnadu");
    expect(normalize("West-Bengal 123")).toBe("westbengal");
    expect(normalize("UTTAR PRADESH")).toBe("uttarpradesh");
  });

  it("handles empty, whitespace-only and nullish input safely", () => {
    expect(normalize("")).toBe("");
    expect(normalize("   ")).toBe("");
    expect(normalize("!!! 999")).toBe("");
    expect(normalize(null)).toBe("");
    expect(normalize(undefined)).toBe("");
  });
});

describe("sha256()", () => {
  it("matches a known NIST test vector for 'abc'", async () => {
    await expect(sha256("abc")).resolves.toBe(
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
    );
  });

  it("produces a 64-character lowercase hex digest", async () => {
    const hash = await sha256("anything");
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("is deterministic", async () => {
    expect(await sha256("kerala")).toBe(await sha256("kerala"));
  });
});

describe("buildResult()", () => {
  it("returns an empty-input prompt", () => {
    const r = buildResult({ isEmpty: true });
    expect(r.status).toBe("empty");
    expect(r.className).toBe("result");
  });

  it("returns a correct result", () => {
    const r = buildResult({ isMatch: true });
    expect(r.status).toBe("correct");
    expect(r.className).toBe("result correct");
  });

  it("returns a wrong result by default", () => {
    const r = buildResult();
    expect(r.status).toBe("wrong");
    expect(r.className).toBe("result wrong");
  });
});

describe("checkAnswer()", () => {
  it("flags empty guesses", async () => {
    expect((await checkAnswer("   ")).status).toBe("empty");
  });

  it("rejects an obviously wrong guess", async () => {
    expect((await checkAnswer("atlantis")).status).toBe("wrong");
  });

  it("accepts a guess whose hash matches the stored answer", async () => {
    // Round-trip via a custom hash so we test the matching logic
    // WITHOUT revealing the real secret in the test source.
    const secret = "somestate";
    const hash = await sha256(secret);
    expect((await checkAnswer("Some State!", hash)).status).toBe("correct");
  });

  it("keeps the answer secret (hash is a valid 64-char digest)", () => {
    expect(ANSWER_HASH).toMatch(/^[0-9a-f]{64}$/);
  });
});
