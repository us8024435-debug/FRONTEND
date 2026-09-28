import {
  Conversation,
  ConversationFilters,
  ConversationStatus,
  Message,
  SendMessageInput,
  ApiResponse,
  PaginatedResponse,
} from "@/lib/types";
import { delay } from "@/lib/utils";
import { mockStore } from "./store";

/**
 * Fetches conversations filtered by status, contact search, and agent assignment
 */
export async function fetchConversations(
  filters: ConversationFilters,
): Promise<PaginatedResponse<Conversation>> {
  await delay(200, 600);

  let items = [...mockStore.conversations];

  // 1. Status filter
  if (filters.status && filters.status !== "all") {
    items = items.filter((c) => c.status === filters.status);
  }

  // 2. Search filter (contact name or phone)
  if (filters.search && filters.search.trim().length > 0) {
    const q = filters.search.toLowerCase().trim();
    items = items.filter(
      (c) => c.contact.name.toLowerCase().includes(q) || c.contact.phone.includes(q),
    );
  }

  // 3. Agent assignment filter
  if (filters.assignedTo && filters.assignedTo !== "all") {
    items = items.filter((c) => c.assignedAgentId === filters.assignedTo);
  }

  // Sort: most recently updated first
  items.sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1));

  return {
    data: items,
    pagination: {
      page: 1,
      pageSize: items.length,
      total: items.length,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    },
  };
}

/**
 * Fetches a single conversation by ID with populated contact and agent objects
 */
export async function fetchConversation(id: string): Promise<ApiResponse<Conversation>> {
  await delay(200, 600);
  const conversation = mockStore.conversations.find((c) => c.id === id);

  if (!conversation) {
    throw new Error(`Conversation with ID ${id} not found`);
  }

  return {
    data: { ...conversation },
    success: true,
  };
}

/**
 * Fetches messages for a conversation in reverse chronological order, 20 per page
 */
export async function fetchMessages(
  conversationId: string,
  page: number = 1,
): Promise<PaginatedResponse<Message>> {
  await delay(200, 600);
  const allMessages = mockStore.messages[conversationId] || [];

  // Reverse chronological (newest first for chat timeline pagination)
  const sorted = [...allMessages].sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1));

  const pageSize = 20;
  const currentPage = Math.max(1, page);
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const data = sorted.slice(startIndex, startIndex + pageSize);

  return {
    data,
    pagination: {
      page: currentPage,
      pageSize,
      total,
      totalPages,
      hasNext: currentPage < totalPages,
      hasPrevious: currentPage > 1,
    },
  };
}

/**
 * Sends a message in a conversation, updating the timeline and conversation preview
 */
export async function sendMessage(
  conversationId: string,
  data: SendMessageInput,
): Promise<ApiResponse<Message>> {
  await delay(200, 600);
  const conversation = mockStore.conversations.find((c) => c.id === conversationId);

  if (!conversation) {
    throw new Error(`Conversation with ID ${conversationId} not found`);
  }

  const now = new Date().toISOString();
  const msgNum = (mockStore.messages[conversationId]?.length || 0) + 1;
  const newMsgId = `msg_${conversationId}_${String(msgNum).padStart(2, "0")}`;

  const newMessage: Message = {
    id: newMsgId,
    conversationId,
    direction: "outbound",
    type: data.type,
    content: data.content,
    status: "delivered",
    senderType: "agent",
    senderId: conversation.assignedAgentId || "agent_001",
    timestamp: now,
  };

  if (!mockStore.messages[conversationId]) {
    mockStore.messages[conversationId] = [];
  }
  mockStore.messages[conversationId]!.push(newMessage);

  // Update conversation lastMessage & timestamp
  conversation.lastMessage = newMessage;
  conversation.updatedAt = now;

  // Record activity in contact log
  const contactId = conversation.contactId;
  if (!mockStore.activities[contactId]) {
    mockStore.activities[contactId] = [];
  }
  mockStore.activities[contactId]!.unshift({
    id: `act_${contactId}_${Date.now()}`,
    contactId,
    type: "message_sent",
    description: `Sent ${data.type} message: "${data.content.text || data.content.caption || data.content.fileName || "Media"}"`,
    performedById: newMessage.senderId,
    performedBy: conversation.assignedAgent,
    timestamp: now,
  });

  return {
    data: newMessage,
    success: true,
    message: "Message sent successfully",
  };
}

/**
 * Assigns an agent to a conversation
 */
export async function assignConversation(
  conversationId: string,
  agentId: string,
): Promise<ApiResponse<Conversation>> {
  await delay(200, 600);
  const conversation = mockStore.conversations.find((c) => c.id === conversationId);
  if (!conversation) {
    throw new Error(`Conversation ${conversationId} not found`);
  }

  const agent = mockStore.agents.find((a) => a.id === agentId);
  if (!agent) {
    throw new Error(`Agent ${agentId} not found`);
  }

  conversation.assignedAgentId = agentId;
  conversation.assignedAgent = agent;
  conversation.updatedAt = new Date().toISOString();

  // Activity log
  const contactId = conversation.contactId;
  if (!mockStore.activities[contactId]) {
    mockStore.activities[contactId] = [];
  }
  mockStore.activities[contactId]!.unshift({
    id: `act_${contactId}_${Date.now()}`,
    contactId,
    type: "assigned",
    description: `Assigned conversation to ${agent.name}`,
    performedById: agentId,
    performedBy: agent,
    timestamp: conversation.updatedAt,
  });

  return {
    data: { ...conversation },
    success: true,
    message: `Assigned to ${agent.name}`,
  };
}

/**
 * Updates conversation lifecycle status (open / pending / resolved / expired)
 */
export async function updateConversationStatus(
  conversationId: string,
  status: ConversationStatus,
): Promise<ApiResponse<Conversation>> {
  await delay(200, 600);
  const conversation = mockStore.conversations.find((c) => c.id === conversationId);
  if (!conversation) {
    throw new Error(`Conversation ${conversationId} not found`);
  }

  const previousStatus = conversation.status;
  conversation.status = status;
  conversation.updatedAt = new Date().toISOString();

  // Activity log
  const contactId = conversation.contactId;
  if (!mockStore.activities[contactId]) {
    mockStore.activities[contactId] = [];
  }
  mockStore.activities[contactId]!.unshift({
    id: `act_${contactId}_${Date.now()}`,
    contactId,
    type: "status_changed",
    description: `Conversation status changed from ${previousStatus} to ${status}`,
    timestamp: conversation.updatedAt,
  });

  return {
    data: { ...conversation },
    success: true,
    message: `Status updated to ${status}`,
  };
}
