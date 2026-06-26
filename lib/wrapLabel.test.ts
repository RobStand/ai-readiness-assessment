import { describe, it, expect } from "vitest";
import { wrapDimensionLabel } from "./wrapLabel";
import { DIMENSION_LABELS } from "./scoring";

describe("wrapDimensionLabel", () => {
  it("keeps a single-word label on one line", () => {
    expect(wrapDimensionLabel("Governance")).toEqual(["Governance"]);
  });

  it("splits a two-word label onto separate lines", () => {
    expect(wrapDimensionLabel("Technology Infrastructure")).toEqual([
      "Technology",
      "Infrastructure",
    ]);
  });

  it("glues a lone ampersand to the following word", () => {
    expect(wrapDimensionLabel("Talent & Skills")).toEqual(["Talent", "& Skills"]);
    expect(wrapDimensionLabel("Governance & Risk")).toEqual([
      "Governance",
      "& Risk",
    ]);
  });

  it("never leaves a lone ampersand and always wraps multi-word real labels", () => {
    for (const label of Object.values(DIMENSION_LABELS)) {
      const lines = wrapDimensionLabel(label);
      // No element is a bare "&"...
      expect(lines).not.toContain("&");
      // ...and a label containing "&" produces a glued "& word" line.
      if (label.includes("&")) {
        expect(lines.some((line) => /^& \S/.test(line))).toBe(true);
      }
      // Multi-word labels actually wrap onto more than one line.
      if (label.trim().split(/\s+/).length > 1) {
        expect(lines.length).toBeGreaterThan(1);
      }
    }
  });

  it("emits a trailing lone ampersand on its own line (no following word to glue)", () => {
    expect(wrapDimensionLabel("Foo &")).toEqual(["Foo", "&"]);
  });

  it("handles three-word labels with all words present", () => {
    expect(wrapDimensionLabel("Use Case Pipeline")).toEqual([
      "Use",
      "Case",
      "Pipeline",
    ]);
  });

  it("returns an empty array for an empty string", () => {
    expect(wrapDimensionLabel("")).toEqual([]);
  });

  it("collapses extra whitespace rather than emitting empty lines", () => {
    expect(wrapDimensionLabel("Talent  &  Skills")).toEqual([
      "Talent",
      "& Skills",
    ]);
  });
});
