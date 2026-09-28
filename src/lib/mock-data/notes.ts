import { Note } from "@/lib/types";
import { mockAgents } from "./agents";

const getAgent = (id: string) => mockAgents.find((a) => a.id === id);

export const mockNotes: Record<string, Note[]> = {
  contact_001: [
    {
      id: "note_001_01",
      contactId: "contact_001",
      content:
        "Key Enterprise stakeholder. Primary decision maker for tech infrastructure. Negotiating annual 50 seat license.",
      createdById: "agent_001",
      createdBy: getAgent("agent_001"),
      isPinned: true,
      createdAt: "2026-07-01T10:15:00Z",
      updatedAt: "2026-09-28T07:00:00Z",
    },
    {
      id: "note_001_02",
      contactId: "contact_001",
      content: "VP Finance signed purchase order on Sep 28. Fast-track SLA onboarding.",
      createdById: "agent_001",
      createdBy: getAgent("agent_001"),
      isPinned: false,
      createdAt: "2026-09-28T07:25:00Z",
      updatedAt: "2026-09-28T07:25:00Z",
    },
  ],

  contact_002: [
    {
      id: "note_002_01",
      contactId: "contact_002",
      content:
        "Interested in Shopify order automation webhook. CTO joining product demo today at 4:30 PM.",
      createdById: "agent_002",
      createdBy: getAgent("agent_002"),
      isPinned: true,
      createdAt: "2026-09-28T06:30:00Z",
      updatedAt: "2026-09-28T06:30:00Z",
    },
  ],

  contact_003: [
    {
      id: "note_003_01",
      contactId: "contact_003",
      content: "Prefers domestic Indian UPI / NEFT payment links over international card charges.",
      createdById: "agent_003",
      createdBy: getAgent("agent_003"),
      isPinned: true,
      createdAt: "2026-09-28T06:30:00Z",
      updatedAt: "2026-09-28T06:30:00Z",
    },
    {
      id: "note_003_02",
      contactId: "contact_003",
      content: "Growth plan renewed successfully on Sep 28 via HDFC UPI transaction.",
      createdById: "agent_003",
      createdBy: getAgent("agent_003"),
      isPinned: false,
      createdAt: "2026-09-28T06:46:00Z",
      updatedAt: "2026-09-28T06:46:00Z",
    },
  ],

  contact_004: [
    {
      id: "note_004_01",
      contactId: "contact_004",
      content: "Malayalam + English multi-lingual bot flow deployed for harvest seasonal farmers.",
      createdById: "agent_003",
      createdBy: getAgent("agent_003"),
      isPinned: true,
      createdAt: "2026-09-28T06:25:00Z",
      updatedAt: "2026-09-28T06:25:00Z",
    },
  ],

  contact_005: [
    {
      id: "note_005_01",
      contactId: "contact_005",
      content:
        "Tier 2 WhatsApp messaging quota approved. Regularly sends 4,500+ delivery dispatches at 10 AM.",
      createdById: "agent_002",
      createdBy: getAgent("agent_002"),
      isPinned: true,
      createdAt: "2026-08-01T10:15:00Z",
      updatedAt: "2026-09-28T05:30:00Z",
    },
    {
      id: "note_005_02",
      contactId: "contact_005",
      content: "Current Meta Quality Rating: High Green (0.12% spam reports).",
      createdById: "agent_002",
      createdBy: getAgent("agent_002"),
      isPinned: false,
      createdAt: "2026-09-28T05:36:00Z",
      updatedAt: "2026-09-28T05:36:00Z",
    },
  ],

  contact_006: [
    {
      id: "note_006_01",
      contactId: "contact_006",
      content:
        "Diwali festival catalog PDF is 4.2 MB. Approved for WhatsApp document header broadcast.",
      createdById: "agent_004",
      createdBy: getAgent("agent_004"),
      isPinned: false,
      createdAt: "2026-09-28T05:08:00Z",
      updatedAt: "2026-09-28T05:08:00Z",
    },
  ],

  contact_007: [
    {
      id: "note_007_01",
      contactId: "contact_007",
      content:
        "14-day trial user. Uploading 1,200 leads via CSV. High likelihood of conversion to Pro Annual.",
      createdById: "agent_005",
      createdBy: getAgent("agent_005"),
      isPinned: true,
      createdAt: "2026-09-28T04:22:00Z",
      updatedAt: "2026-09-28T04:22:00Z",
    },
  ],

  contact_008: [
    {
      id: "note_008_01",
      contactId: "contact_008",
      content: "Q4 Partner revenue share agreement under CEO review. Targeting 15% referral tier.",
      createdById: "agent_005",
      createdBy: getAgent("agent_005"),
      isPinned: true,
      createdAt: "2026-09-28T03:52:00Z",
      updatedAt: "2026-09-28T03:52:00Z",
    },
  ],

  contact_009: [
    {
      id: "note_009_01",
      contactId: "contact_009",
      content:
        "Explained difference between Marketing & Utility pricing tiers to their finance manager.",
      createdById: "agent_003",
      createdBy: getAgent("agent_003"),
      isPinned: false,
      createdAt: "2026-09-27T17:55:00Z",
      updatedAt: "2026-09-27T17:55:00Z",
    },
  ],

  contact_010: [
    {
      id: "note_010_01",
      contactId: "contact_010",
      content:
        "Warehouse staff added with restricted Agent RBAC roles. No analytics or export access granted.",
      createdById: "agent_002",
      createdBy: getAgent("agent_002"),
      isPinned: false,
      createdAt: "2026-09-27T16:20:00Z",
      updatedAt: "2026-09-27T16:20:00Z",
    },
  ],

  contact_011: [
    {
      id: "note_011_01",
      contactId: "contact_011",
      content:
        "High priority SAP S/4HANA integration architecture meeting booked for tomorrow 11 AM.",
      createdById: "agent_001",
      createdBy: getAgent("agent_001"),
      isPinned: true,
      createdAt: "2026-09-27T14:35:00Z",
      updatedAt: "2026-09-27T14:35:00Z",
    },
  ],

  contact_012: [
    {
      id: "note_012_01",
      contactId: "contact_012",
      content:
        "Submitted 4 marketing templates for weekend campaign blast. Awaiting Meta auto-approval.",
      createdById: "agent_004",
      createdBy: getAgent("agent_004"),
      isPinned: false,
      createdAt: "2026-09-27T12:05:00Z",
      updatedAt: "2026-09-27T12:05:00Z",
    },
  ],

  contact_013: [
    {
      id: "note_013_01",
      contactId: "contact_013",
      content:
        "Provided security certification & SOC2 compliance overview for legal document transmissions.",
      createdById: "agent_003",
      createdBy: getAgent("agent_003"),
      isPinned: false,
      createdAt: "2026-09-27T10:20:00Z",
      updatedAt: "2026-09-27T10:20:00Z",
    },
  ],

  contact_014: [
    {
      id: "note_014_01",
      contactId: "contact_014",
      content: "August 2026 GST invoice delivered. Account in good standing.",
      createdById: "agent_005",
      createdBy: getAgent("agent_005"),
      isPinned: false,
      createdAt: "2026-09-26T17:42:00Z",
      updatedAt: "2026-09-26T17:42:00Z",
    },
  ],

  contact_015: [
    {
      id: "note_015_01",
      contactId: "contact_015",
      content: "Goa resort client configuring automated WhatsApp check-in location pins.",
      createdById: "agent_002",
      createdBy: getAgent("agent_002"),
      isPinned: false,
      createdAt: "2026-09-26T15:05:00Z",
      updatedAt: "2026-09-26T15:05:00Z",
    },
  ],

  contact_016: [
    {
      id: "note_016_01",
      contactId: "contact_016",
      content: "Moodle LMS integration webhooks active for student exam notifications.",
      createdById: "agent_004",
      createdBy: getAgent("agent_004"),
      isPinned: false,
      createdAt: "2026-09-26T11:25:00Z",
      updatedAt: "2026-09-26T11:25:00Z",
    },
  ],

  contact_017: [
    {
      id: "note_017_01",
      contactId: "contact_017",
      content: "Enterprise SLA ticket #4928 resolved. Webhook latency dropped to 180ms.",
      createdById: "agent_001",
      createdBy: getAgent("agent_001"),
      isPinned: false,
      createdAt: "2026-09-25T16:35:00Z",
      updatedAt: "2026-09-25T16:35:00Z",
    },
  ],

  contact_018: [
    {
      id: "note_018_01",
      contactId: "contact_018",
      content: "Configured password-protected diagnostic PDF dispatch for patient test results.",
      createdById: "agent_003",
      createdBy: getAgent("agent_003"),
      isPinned: true,
      createdAt: "2026-09-25T13:50:00Z",
      updatedAt: "2026-09-25T13:50:00Z",
    },
  ],

  contact_019: [
    {
      id: "note_019_01",
      contactId: "contact_019",
      content: "Movie trailer campaign hit 98.4% delivery rate across 15,000 fan club members.",
      createdById: "agent_005",
      createdBy: getAgent("agent_005"),
      isPinned: true,
      createdAt: "2026-09-25T09:15:00Z",
      updatedAt: "2026-09-25T09:15:00Z",
    },
  ],

  contact_020: [
    {
      id: "note_020_01",
      contactId: "contact_020",
      content: "Promotional conversation pricing shared for Akshaya Tritiya jewellery campaign.",
      createdById: "agent_002",
      createdBy: getAgent("agent_002"),
      isPinned: false,
      createdAt: "2026-09-24T18:25:00Z",
      updatedAt: "2026-09-24T18:25:00Z",
    },
  ],
};
