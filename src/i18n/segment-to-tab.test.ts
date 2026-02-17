import { describe, it, expect } from "vitest";
import { segmentToTab } from "./segment-to-tab";

describe("segmentToTab", () => {
  it("maps the english 'blog' segment to the 'blog' tab", () => {
    expect(segmentToTab("blog", "en")).toBe("blog");
  });

  it("maps the english 'experience' segment to the 'experience' tab", () => {
    expect(segmentToTab("experience", "en")).toBe("experience");
  });

  it("maps the english 'about' segment to the 'about' tab", () => {
    expect(segmentToTab("about", "en")).toBe("about");
  });

  it("maps the swedish 'blogg' segment to the 'blog' tab", () => {
    expect(segmentToTab("blogg", "sv")).toBe("blog");
  });

  it("maps the swedish 'erfarenhet' segment to the 'experience' tab", () => {
    expect(segmentToTab("erfarenhet", "sv")).toBe("experience");
  });

  it("maps the swedish 'om' segment to the 'about' tab", () => {
    expect(segmentToTab("om", "sv")).toBe("about");
  });

  it("returns the segment itself when it has no matching translation", () => {
    expect(segmentToTab("unknown-segment", "en")).toBe("unknown-segment");
  });
});
