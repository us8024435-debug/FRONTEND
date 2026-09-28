import { Agent, AgentRole, AgentStatus, ApiResponse } from "@/lib/types";
import { delay, generateId } from "@/lib/utils";
import { mockStore } from "./store";

/**
 * Fetches all CRM support and sales agents
 */
export async function fetchAgents(): Promise<ApiResponse<Agent[]>> {
  await delay(200, 600);
  return {
    data: [...mockStore.agents],
    success: true,
  };
}

/**
 * Updates an agent's real-time presence status (online / away / offline)
 */
export async function updateAgentStatus(
  id: string,
  status: AgentStatus,
): Promise<ApiResponse<Agent>> {
  await delay(200, 600);
  const agent = mockStore.agents.find((a) => a.id === id);

  if (!agent) {
    throw new Error(`Agent with ID ${id} not found`);
  }

  agent.status = status;
  agent.lastActiveAt = new Date().toISOString();

  return {
    data: { ...agent },
    success: true,
    message: `Status updated to ${status}`,
  };
}

/**
 * Creates a new agent
 */
export async function createAgent(data: {
  name: string;
  email: string;
  role: AgentRole;
  departments: string[];
  maxConversations: number;
}): Promise<ApiResponse<Agent>> {
  await delay(200, 600);
  const now = new Date().toISOString();
  const newId = generateId("agent");

  const newAgent: Agent = {
    id: newId,
    name: data.name,
    email: data.email,
    role: data.role,
    status: "offline",
    activeConversations: 0,
    maxConversations: data.maxConversations,
    departments: data.departments,
    lastActiveAt: undefined,
    createdAt: now,
  };

  mockStore.agents.push(newAgent);

  return {
    data: newAgent,
    success: true,
    message: `Agent "${data.name}" created successfully`,
  };
}

/**
 * Deletes an agent by ID
 */
export async function deleteAgent(id: string): Promise<ApiResponse<void>> {
  await delay(200, 600);
  const index = mockStore.agents.findIndex((a) => a.id === id);

  if (index === -1) {
    throw new Error(`Agent with ID ${id} not found`);
  }

  mockStore.agents.splice(index, 1);

  return {
    data: undefined as unknown as void,
    success: true,
    message: "Agent removed successfully",
  };
}
