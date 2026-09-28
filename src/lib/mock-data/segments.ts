import { Segment } from "@/lib/types";

export const mockSegments: Segment[] = [
  {
    id: "segment_001",
    name: "All Active Users",
    description: "Contacts with verified active status and active opt-in consent",
    conjunction: "and",
    filters: [
      {
        id: "flt_001",
        field: "status",
        operator: "is",
        value: "active",
      },
      {
        id: "flt_002",
        field: "optInStatus",
        operator: "is",
        value: "true",
      },
    ],
    estimatedCount: 2450,
    createdAt: "2026-07-01T10:00:00Z",
    updatedAt: "2026-09-20T08:00:00Z",
  },
  {
    id: "segment_002",
    name: "VIP Customers",
    description: "High lifetime value accounts with VIP or Enterprise tags",
    conjunction: "or",
    filters: [
      {
        id: "flt_003",
        field: "tags",
        operator: "in",
        value: ["tag_001", "tag_006"],
      },
      {
        id: "flt_004",
        field: "customAttributes.plan",
        operator: "is",
        value: "enterprise",
      },
    ],
    estimatedCount: 680,
    createdAt: "2026-07-15T11:30:00Z",
    updatedAt: "2026-09-22T14:15:00Z",
  },
  {
    id: "segment_003",
    name: "Inactive 30 Days",
    description: "Contacts who have not sent or received a message in the past 30 days",
    conjunction: "and",
    filters: [
      {
        id: "flt_005",
        field: "lastMessageAt",
        operator: "lt",
        value: "2026-08-28T00:00:00Z",
      },
      {
        id: "flt_006",
        field: "status",
        operator: "is_not",
        value: "blocked",
      },
    ],
    estimatedCount: 420,
    createdAt: "2026-08-01T09:00:00Z",
    updatedAt: "2026-09-18T10:00:00Z",
  },
  {
    id: "segment_004",
    name: "Trial Users",
    description: "Prospects currently evaluating the platform on a 14-day free trial",
    conjunction: "and",
    filters: [
      {
        id: "flt_007",
        field: "customAttributes.plan",
        operator: "is",
        value: "trial",
      },
      {
        id: "flt_008",
        field: "status",
        operator: "is",
        value: "active",
      },
    ],
    estimatedCount: 310,
    createdAt: "2026-08-10T12:00:00Z",
    updatedAt: "2026-09-25T16:00:00Z",
  },
  {
    id: "segment_005",
    name: "New Leads This Week",
    description: "Newly acquired leads created in the last 7 calendar days",
    conjunction: "and",
    filters: [
      {
        id: "flt_009",
        field: "createdAt",
        operator: "gt",
        value: "2026-09-21T00:00:00Z",
      },
      {
        id: "flt_010",
        field: "tags",
        operator: "contains",
        value: "tag_002",
      },
    ],
    estimatedCount: 185,
    createdAt: "2026-09-21T08:00:00Z",
    updatedAt: "2026-09-28T06:00:00Z",
  },
];
