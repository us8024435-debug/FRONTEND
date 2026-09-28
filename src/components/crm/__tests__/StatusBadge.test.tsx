import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "../StatusBadge";

describe("StatusBadge Component", () => {
  it("renders capitalized status text properly", () => {
    render(<StatusBadge status="open" variant="conversation" />);
    expect(screen.getByText("Open")).toBeInTheDocument();
  });

  it("applies emerald color styling for active contacts", () => {
    const { container } = render(<StatusBadge status="active" variant="contact" />);
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(container.querySelector(".bg-emerald-500")).toBeInTheDocument();
  });

  it("applies amber color styling for pending templates", () => {
    const { container } = render(<StatusBadge status="pending" variant="template" />);
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(container.querySelector(".bg-amber-500")).toBeInTheDocument();
  });

  it("applies red color styling for failed campaigns", () => {
    const { container } = render(<StatusBadge status="failed" variant="campaign" />);
    expect(screen.getByText("Failed")).toBeInTheDocument();
    expect(container.querySelector(".bg-red-500")).toBeInTheDocument();
  });
});
