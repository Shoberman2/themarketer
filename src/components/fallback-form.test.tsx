import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FallbackForm } from "./fallback-form";

describe("FallbackForm", () => {
  it("renders all form fields", () => {
    render(<FallbackForm onSubmit={() => {}} isLoading={false} />);

    expect(screen.getByText("Tell us about your business")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Acme Fitness")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Fitness & Wellness")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/We help busy professionals/)).toBeInTheDocument();
    expect(screen.getByText("Generate My First Ad")).toBeInTheDocument();
  });

  it("shows validation error when required fields are empty", () => {
    const onSubmit = vi.fn();
    render(<FallbackForm onSubmit={onSubmit} isLoading={false} />);

    fireEvent.click(screen.getByText("Generate My First Ad"));

    expect(screen.getByText(/Please fill in at least/)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("constructs valid WebsiteAnalysis on submit", () => {
    const onSubmit = vi.fn();
    render(<FallbackForm onSubmit={onSubmit} isLoading={false} />);

    fireEvent.change(screen.getByPlaceholderText("Acme Fitness"), {
      target: { value: "Test Brand" },
    });
    fireEvent.change(screen.getByPlaceholderText("Fitness & Wellness"), {
      target: { value: "Technology" },
    });
    fireEvent.change(screen.getByPlaceholderText(/We help busy professionals/), {
      target: { value: "We build great software" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Busy professionals, Health-conscious millennials"),
      { target: { value: "Developers, Product managers" } }
    );

    fireEvent.click(screen.getByText("Generate My First Ad"));

    expect(onSubmit).toHaveBeenCalledOnce();
    const analysis = onSubmit.mock.calls[0][0];
    expect(analysis.brand.name).toBe("Test Brand");
    expect(analysis.brand.industry).toBe("Technology");
    expect(analysis.brand.tagline).toBe("We build great software");
    expect(analysis.targetAudience).toEqual(["Developers", "Product managers"]);
    expect(analysis.valuePropositions).toEqual(["We build great software"]);
  });

  it("defaults target audience when not provided", () => {
    const onSubmit = vi.fn();
    render(<FallbackForm onSubmit={onSubmit} isLoading={false} />);

    fireEvent.change(screen.getByPlaceholderText("Acme Fitness"), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByPlaceholderText("Fitness & Wellness"), {
      target: { value: "Tech" },
    });
    fireEvent.change(screen.getByPlaceholderText(/We help busy professionals/), {
      target: { value: "Software" },
    });

    fireEvent.click(screen.getByText("Generate My First Ad"));

    const analysis = onSubmit.mock.calls[0][0];
    expect(analysis.targetAudience).toEqual(["General audience"]);
  });
});
