import { describe, it, expect } from "vitest";
import { queryKeys } from "../queryKeys";

describe("queryKeys Factory", () => {
  it("produces correct root and metrics query keys for dashboard", () => {
    expect(queryKeys.dashboard.all).toEqual(["dashboard"]);
    expect(queryKeys.dashboard.metrics()).toEqual(["dashboard", "metrics"]);
  });

  it("produces hierarchical keys for contacts and filters", () => {
    expect(queryKeys.contacts.all).toEqual(["contacts"]);
    expect(queryKeys.contacts.lists()).toEqual(["contacts", "list"]);

    const filterObj = { page: 1, pageSize: 25, search: "arjun" };
    expect(queryKeys.contacts.list(filterObj)).toEqual([
      "contacts",
      "list",
      { filters: filterObj },
    ]);

    expect(queryKeys.contacts.details()).toEqual(["contacts", "detail"]);
    expect(queryKeys.contacts.detail("cnt_123")).toEqual(["contacts", "detail", "cnt_123"]);
    expect(queryKeys.contacts.activities("cnt_123")).toEqual([
      "contacts",
      "detail",
      "cnt_123",
      "activities",
    ]);
  });

  it("produces hierarchical keys for conversations and messages pagination", () => {
    expect(queryKeys.conversations.all).toEqual(["conversations"]);
    expect(queryKeys.conversations.detail("conv_01")).toEqual([
      "conversations",
      "detail",
      "conv_01",
    ]);
    expect(queryKeys.conversations.messages("conv_01", 2)).toEqual([
      "conversations",
      "detail",
      "conv_01",
      "messages",
      { page: 2 },
    ]);
  });

  it("produces correct keys for templates, campaigns, segments, and agents", () => {
    expect(queryKeys.templates.all).toEqual(["templates"]);
    expect(queryKeys.campaigns.all).toEqual(["campaigns"]);
    expect(queryKeys.segments.all).toEqual(["segments"]);
    expect(queryKeys.agents.all).toEqual(["agents"]);
    expect(queryKeys.tags.all).toEqual(["tags"]);
  });
});
