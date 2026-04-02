import { describe, it, expect } from "vitest";
import { computeEngagementRate, getTimeBucket } from "./performance";

describe("computeEngagementRate", () => {
  it("computes rate correctly", () => {
    expect(computeEngagementRate(45, 12, 3, 890)).toBeCloseTo(0.0674, 3);
  });

  it("returns null when reach is null", () => {
    expect(computeEngagementRate(45, 12, 3, null)).toBeNull();
  });

  it("returns null when reach is 0", () => {
    expect(computeEngagementRate(45, 12, 3, 0)).toBeNull();
  });

  it("returns 0 when all metrics are 0 but reach exists", () => {
    expect(computeEngagementRate(0, 0, 0, 100)).toBe(0);
  });
});

describe("getTimeBucket", () => {
  it("returns Morning for 6-11", () => {
    expect(getTimeBucket(6)).toBe("Morning");
    expect(getTimeBucket(11)).toBe("Morning");
  });

  it("returns Afternoon for 12-17", () => {
    expect(getTimeBucket(12)).toBe("Afternoon");
    expect(getTimeBucket(17)).toBe("Afternoon");
  });

  it("returns Evening for 18-23", () => {
    expect(getTimeBucket(18)).toBe("Evening");
    expect(getTimeBucket(23)).toBe("Evening");
  });

  it("returns Night for 0-5", () => {
    expect(getTimeBucket(0)).toBe("Night");
    expect(getTimeBucket(5)).toBe("Night");
  });
});
