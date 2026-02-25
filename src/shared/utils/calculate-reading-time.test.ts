import { describe, it, expect } from "vitest";
import { calculateReadingTime } from "./calculate-reading-time";

const makeWords = (count: number) =>
  Array.from({ length: count }, () => "word").join(" ");

describe("calculateReadingTime", () => {
  it("returns at least one minute for empty input", () => {
    expect(calculateReadingTime("")).toBe(1);
  });

  it("rounds to the nearest minute based on word count", () => {
    expect(calculateReadingTime(makeWords(200))).toBe(1);
    expect(calculateReadingTime(makeWords(300))).toBe(2);
  });
});
