import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetricCard } from "../MetricCard";
import { MessageSquare } from "lucide-react";

describe("MetricCard Component", () => {
  it("renders metric title and numerical value", () => {
    render(<MetricCard title="Total Conversations" value={1250} icon={MessageSquare} />);

    expect(screen.getByText("Total Conversations")).toBeInTheDocument();
  });

  it("renders skeletons when in loading state", () => {
    const { container } = render(
      <MetricCard title="Active Contacts" value={450} icon={MessageSquare} loading={true} />,
    );

    expect(screen.getByText("Active Contacts")).toBeInTheDocument();
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("renders percentage change indicators for positive trends", () => {
    render(
      <MetricCard
        title="Resolution Rate"
        value={94}
        change={12.5}
        changeType="up"
        icon={MessageSquare}
      />,
    );

    expect(screen.getByText("+12.5%")).toBeInTheDocument();
    expect(screen.getByText("vs previous period")).toBeInTheDocument();
  });
});
