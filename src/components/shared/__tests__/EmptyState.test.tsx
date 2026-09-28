import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EmptyState } from "../EmptyState";
import { Inbox } from "lucide-react";

describe("EmptyState Component", () => {
  it("renders title and description properly", () => {
    render(
      <EmptyState
        icon={Inbox}
        title="No Conversations Yet"
        description="Incoming messages from customers will show up here."
      />,
    );

    expect(screen.getByText("No Conversations Yet")).toBeInTheDocument();
    expect(
      screen.getByText("Incoming messages from customers will show up here."),
    ).toBeInTheDocument();
  });

  it("renders action button and triggers callback when clicked", () => {
    const onActionMock = vi.fn();

    render(
      <EmptyState
        icon={Inbox}
        title="No Contacts"
        description="Get started by importing your contact list."
        actionLabel="Create Contact"
        onAction={onActionMock}
      />,
    );

    const button = screen.getByRole("button", { name: "Create Contact" });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(onActionMock).toHaveBeenCalledTimes(1);
  });
});
