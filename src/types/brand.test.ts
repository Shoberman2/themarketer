import { describe, it, expect } from "vitest";
import { extractDomain } from "./brand";

describe("extractDomain", () => {
  it("extracts domain from full URL", () => {
    expect(extractDomain("https://www.example.com")).toBe("example.com");
  });

  it("strips www prefix", () => {
    expect(extractDomain("https://www.ratemydivorcelawyer.com")).toBe("ratemydivorcelawyer.com");
  });

  it("handles URLs without www", () => {
    expect(extractDomain("https://sparktechstudio.com")).toBe("sparktechstudio.com");
  });

  it("strips path and query", () => {
    expect(extractDomain("https://example.com/page?q=test")).toBe("example.com");
  });

  it("handles URLs without protocol", () => {
    expect(extractDomain("example.com")).toBe("example.com");
  });

  it("handles URLs with http", () => {
    expect(extractDomain("http://example.com")).toBe("example.com");
  });

  it("handles subdomains", () => {
    expect(extractDomain("https://app.example.com")).toBe("app.example.com");
  });

  it("lowercases the domain", () => {
    expect(extractDomain("https://EXAMPLE.COM")).toBe("example.com");
  });

  it("handles hash fragments", () => {
    expect(extractDomain("https://www.sparktechstudio.com/#approach")).toBe("sparktechstudio.com");
  });
});
