import { DashboardMetrics } from "@/lib/types";

export const mockDashboardMetrics: DashboardMetrics = {
  totalContacts: 12480,
  activeConversations: 12,
  messagesToday: 1845,
  responseTime: {
    average: 48, // in seconds
    median: 32,
    p95: 120,
  },
  messageVolume: [
    { date: "2026-09-15", sent: 820, received: 640 },
    { date: "2026-09-16", sent: 940, received: 710 },
    { date: "2026-09-17", sent: 1050, received: 830 },
    { date: "2026-09-18", sent: 1120, received: 890 },
    { date: "2026-09-19", sent: 1280, received: 950 },
    { date: "2026-09-20", sent: 950, received: 720 },
    { date: "2026-09-21", sent: 1040, received: 810 },
    { date: "2026-09-22", sent: 1350, received: 1020 },
    { date: "2026-09-23", sent: 1480, received: 1140 },
    { date: "2026-09-24", sent: 3200, received: 1420 }, // Festival broadcast spike
    { date: "2026-09-25", sent: 2840, received: 1380 }, // Diwali mega sale spike
    { date: "2026-09-26", sent: 1620, received: 1190 },
    { date: "2026-09-27", sent: 1710, received: 1250 },
    { date: "2026-09-28", sent: 1845, received: 1320 },
  ],
  deliveryFunnel: {
    sent: 15420,
    delivered: 14890,
    read: 12340,
    replied: 3250,
    failed: 530,
  },
  campaignPerformance: [
    {
      campaignId: "campaign_001",
      name: "Diwali Mega Sale 2026",
      stats: {
        total: 2450,
        sent: 2450,
        delivered: 2380,
        read: 1960,
        replied: 480,
        clicked: 810,
        failed: 70,
      },
    },
    {
      campaignId: "campaign_002",
      name: "VIP Early Beta Invite",
      stats: {
        total: 680,
        sent: 680,
        delivered: 672,
        read: 615,
        replied: 195,
        clicked: 340,
        failed: 8,
      },
    },
    {
      campaignId: "campaign_003",
      name: "Hindi Festive Greetings Broadcast",
      stats: {
        total: 3200,
        sent: 3200,
        delivered: 3080,
        read: 2540,
        replied: 610,
        clicked: 790,
        failed: 120,
      },
    },
    {
      campaignId: "campaign_004",
      name: "Quarterly Renewal Notice Blast",
      stats: {
        total: 520,
        sent: 0,
        delivered: 0,
        read: 0,
        replied: 0,
        clicked: 0,
        failed: 0,
      },
    },
    {
      campaignId: "campaign_008",
      name: "Churned Accounts Re-engagement",
      stats: {
        total: 420,
        sent: 25,
        delivered: 2,
        read: 0,
        replied: 0,
        clicked: 0,
        failed: 23,
      },
    },
  ],
  agentPerformance: [
    {
      agentId: "agent_001",
      name: "Aarav Sharma",
      resolved: 48,
      avgResponseTime: 36, // in seconds
      satisfaction: 4.9, // out of 5.0
    },
    {
      agentId: "agent_002",
      name: "Pooja Patel",
      resolved: 62,
      avgResponseTime: 28,
      satisfaction: 4.95,
    },
    {
      agentId: "agent_003",
      name: "Rohan Iyer",
      resolved: 75,
      avgResponseTime: 24,
      satisfaction: 4.88,
    },
    {
      agentId: "agent_004",
      name: "Ananya Deshmukh",
      resolved: 42,
      avgResponseTime: 45,
      satisfaction: 4.82,
    },
    {
      agentId: "agent_005",
      name: "Vikram Malhotra",
      resolved: 54,
      avgResponseTime: 38,
      satisfaction: 4.85,
    },
    {
      agentId: "agent_006",
      name: "Sneha Nair",
      resolved: 18,
      avgResponseTime: 52,
      satisfaction: 4.75,
    },
  ],
  topTemplates: [
    {
      templateId: "template_011",
      name: "secure_login_otp_verification",
      sentCount: 4950,
      deliveryRate: 99.4,
      readRate: 97.2,
    },
    {
      templateId: "template_001",
      name: "diwali_flash_sale_announcement",
      sentCount: 4850,
      deliveryRate: 97.1,
      readRate: 82.4,
    },
    {
      templateId: "template_006",
      name: "order_confirmation_dispatch",
      sentCount: 4210,
      deliveryRate: 98.2,
      readRate: 91.5,
    },
    {
      templateId: "template_003",
      name: "festival_fest_hindi_offer",
      sentCount: 3200,
      deliveryRate: 96.3,
      readRate: 82.5,
    },
    {
      templateId: "template_007",
      name: "appointment_reminder_schedule",
      sentCount: 2940,
      deliveryRate: 98.8,
      readRate: 94.2,
    },
  ],
};
