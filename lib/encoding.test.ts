import { describe, it, expect } from "vitest";
import { encodeAnswers, decodeAnswers } from "./encoding";

describe("encoding round-trip", () => {
  it("encodes and decodes an answer map", () => {
    const answers = { df_1: 4, ti_2: 2, cr_5: 5 };
    const encoded = encodeAnswers(answers);
    expect(typeof encoded).toBe("string");
    expect(decodeAnswers(encoded)).toEqual(answers);
  });

  it("produces URL-safe output", () => {
    const answers: Record<string, number> = {};
    for (let i = 0; i < 30; i++) answers[`q_${i}`] = (i % 5) + 1;
    const encoded = encodeAnswers(answers);
    expect(encoded).not.toMatch(/[+/=]/);
  });

  it("returns empty object for invalid input", () => {
    expect(decodeAnswers("")).toEqual({});
    expect(decodeAnswers("!!!not-base64!!!")).toEqual({});
  });
});
