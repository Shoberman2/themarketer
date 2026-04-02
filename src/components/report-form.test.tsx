import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ReportForm } from "./report-form";

describe("ReportForm", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders all input fields", () => {
    render(
      <ReportForm
        recommendationId="rec-123"
        platform="Instagram"
        template="hero-cta"
        messageAngle="social-proof"
        onSubmitted={() => {}}
      />
    );

    expect(screen.getByText("How did it do?")).toBeInTheDocument();
    expect(screen.getByText("Likes")).toBeInTheDocument();
    expect(screen.getByText("Comments")).toBeInTheDocument();
    expect(screen.getByText("Shares")).toBeInTheDocument();
    expect(screen.getByText("Save Report")).toBeInTheDocument();
    // 4 number inputs + 1 text input = 5 inputs total
    const inputs = screen.getAllByRole("spinbutton");
    expect(inputs.length).toBe(4);
  });

  it("submits report with correct data", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: "report-1" }),
    });
    global.fetch = mockFetch as unknown as typeof fetch;

    const onSubmitted = vi.fn();
    render(
      <ReportForm
        recommendationId="rec-123"
        platform="Instagram"
        template="hero-cta"
        messageAngle="social-proof"
        onSubmitted={onSubmitted}
      />
    );

    const [likesInput, commentsInput, sharesInput, reachInput] = screen.getAllByRole("spinbutton");
    fireEvent.change(likesInput, { target: { value: "45" } });
    fireEvent.change(commentsInput, { target: { value: "12" } });
    fireEvent.change(sharesInput, { target: { value: "3" } });
    fireEvent.change(reachInput, { target: { value: "890" } });

    fireEvent.click(screen.getByText("Save Report"));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/performance", expect.objectContaining({
        method: "POST",
      }));
    });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.recommendationId).toBe("rec-123");
    expect(body.platform).toBe("Instagram");
    expect(body.likes).toBe(45);
    expect(body.comments).toBe(12);
    expect(body.shares).toBe(3);
    expect(body.reach).toBe(890);
  });

  it("submits null reach when field is empty", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: "report-1" }),
    });
    global.fetch = mockFetch as unknown as typeof fetch;

    render(
      <ReportForm
        recommendationId="rec-123"
        platform="Instagram"
        template="hero-cta"
        messageAngle="social-proof"
        onSubmitted={() => {}}
      />
    );

    const [likesInput] = screen.getAllByRole("spinbutton");
    fireEvent.change(likesInput, { target: { value: "10" } });
    fireEvent.click(screen.getByText("Save Report"));

    await waitFor(() => {
      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.reach).toBeNull();
    });
  });

  it("shows success message after submission", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: "report-1" }),
    }) as unknown as typeof fetch;

    render(
      <ReportForm
        recommendationId="rec-123"
        platform="Instagram"
        template="hero-cta"
        messageAngle="social-proof"
        onSubmitted={() => {}}
      />
    );

    fireEvent.click(screen.getByText("Save Report"));

    await waitFor(() => {
      expect(screen.getByText("Report saved!")).toBeInTheDocument();
    });
  });

  it("shows error on API failure", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: "Server error" }),
    }) as unknown as typeof fetch;

    render(
      <ReportForm
        recommendationId="rec-123"
        platform="Instagram"
        template="hero-cta"
        messageAngle="social-proof"
        onSubmitted={() => {}}
      />
    );

    fireEvent.click(screen.getByText("Save Report"));

    await waitFor(() => {
      expect(screen.getByText("Failed to save report")).toBeInTheDocument();
    });
  });
});
