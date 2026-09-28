import {
  Contact,
  ContactFilters,
  CreateContactInput,
  UpdateContactInput,
  Activity,
  Note,
  Conversation,
  ApiResponse,
  PaginatedResponse,
} from "@/lib/types";
import { delay } from "@/lib/utils";
import { mockStore } from "./store";

/**
 * Fetches contacts with search, tag filtering, status filtering, sorting, and pagination
 */
export async function fetchContacts(filters: ContactFilters): Promise<PaginatedResponse<Contact>> {
  await delay(200, 600);

  let items = [...mockStore.contacts];

  // 1. Search filter (name, phone, email)
  if (filters.search && filters.search.trim().length > 0) {
    const query = filters.search.toLowerCase().trim();
    items = items.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.phone.includes(query) ||
        (c.email && c.email.toLowerCase().includes(query)),
    );
  }

  // 2. Status filter
  if (filters.status) {
    items = items.filter((c) => c.status === filters.status);
  }

  // 3. Tag filtering (matches any of the specified tag IDs or names)
  if (filters.tags && filters.tags.length > 0) {
    items = items.filter((c) =>
      c.tags.some((t) => filters.tags!.includes(t.id) || filters.tags!.includes(t.name)),
    );
  }

  // 4. Sorting
  if (filters.sortBy) {
    const key = filters.sortBy as keyof Contact;
    const direction = filters.sortOrder === "desc" ? -1 : 1;
    items.sort((a, b) => {
      const valA = a[key] ?? "";
      const valB = b[key] ?? "";
      if (valA > valB) return direction;
      if (valA < valB) return -direction;
      return 0;
    });
  } else {
    // Default: most recently updated/active first
    items.sort((a, b) => {
      const timeA = a.lastMessageAt || a.updatedAt;
      const timeB = b.lastMessageAt || b.updatedAt;
      return timeB > timeA ? 1 : -1;
    });
  }

  // 5. Pagination
  const page = Math.max(1, filters.page || 1);
  const pageSize = Math.max(1, filters.pageSize || 10);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIndex = (page - 1) * pageSize;
  const data = items.slice(startIndex, startIndex + pageSize);

  return {
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    },
  };
}

/**
 * Fetches a single contact by unique ID
 */
export async function fetchContact(id: string): Promise<ApiResponse<Contact>> {
  await delay(200, 600);
  const contact = mockStore.contacts.find((c) => c.id === id);

  if (!contact) {
    throw new Error(`Contact with ID ${id} not found`);
  }

  return {
    data: { ...contact },
    success: true,
  };
}

/**
 * Creates a new contact and appends to in-memory store
 */
export async function createContact(data: CreateContactInput): Promise<ApiResponse<Contact>> {
  await delay(200, 600);
  const now = new Date().toISOString();
  const nextNum = mockStore.contacts.length + 1;
  const newId = `contact_${String(nextNum).padStart(3, "0")}`;

  const mappedTags = (data.tags || []).map((tVal) => {
    const existing = mockStore.tags.find((t) => t.id === tVal || t.name === tVal);
    return existing || { id: `tag_custom_${Date.now()}`, name: tVal, color: "#3B82F6" };
  });

  const newContact: Contact = {
    id: newId,
    phone: data.phone,
    name: data.name,
    email: data.email,
    avatarUrl: data.avatarUrl,
    status: data.status || "active",
    tags: mappedTags,
    customAttributes: data.customAttributes || {},
    assignedAgentId: data.assignedAgentId,
    optInStatus: data.optInStatus ?? true,
    optInTimestamp: data.optInStatus ? now : undefined,
    createdAt: now,
    updatedAt: now,
  };

  mockStore.contacts.unshift(newContact);

  // Initialize activities & notes bucket
  mockStore.activities[newId] = [
    {
      id: `act_${newId}_01`,
      contactId: newId,
      type: "contact_created",
      description: "Contact created in WhatsApp CRM",
      timestamp: now,
    },
  ];
  mockStore.notes[newId] = [];

  return {
    data: newContact,
    success: true,
    message: "Contact created successfully",
  };
}

/**
 * Updates an existing contact
 */
export async function updateContact(
  id: string,
  data: UpdateContactInput,
): Promise<ApiResponse<Contact>> {
  await delay(200, 600);
  const index = mockStore.contacts.findIndex((c) => c.id === id);

  if (index === -1) {
    throw new Error(`Contact with ID ${id} not found`);
  }

  const existing = mockStore.contacts[index]!;
  const now = new Date().toISOString();

  let mappedTags = existing.tags;
  if (data.tags) {
    mappedTags = data.tags.map((tVal) => {
      const match = mockStore.tags.find((t) => t.id === tVal || t.name === tVal);
      return match || { id: tVal, name: tVal, color: "#6B7280" };
    });
  }

  const updated: Contact = {
    ...existing,
    name: data.name ?? existing.name,
    phone: data.phone ?? existing.phone,
    email: data.email ?? existing.email,
    avatarUrl: data.avatarUrl ?? existing.avatarUrl,
    status: data.status ?? existing.status,
    tags: mappedTags,
    customAttributes: {
      ...existing.customAttributes,
      ...(data.customAttributes || {}),
    },
    assignedAgentId:
      data.assignedAgentId !== undefined ? data.assignedAgentId : existing.assignedAgentId,
    optInStatus: data.optInStatus !== undefined ? data.optInStatus : existing.optInStatus,
    updatedAt: now,
  };

  mockStore.contacts[index] = updated;

  // Record contact update activity
  if (!mockStore.activities[id]) {
    mockStore.activities[id] = [];
  }
  mockStore.activities[id]!.unshift({
    id: `act_${id}_${Date.now()}`,
    contactId: id,
    type: "contact_updated",
    description: "Contact details updated",
    timestamp: now,
  });

  return {
    data: updated,
    success: true,
    message: "Contact updated successfully",
  };
}

/**
 * Deletes a contact from the in-memory store
 */
export async function deleteContact(id: string): Promise<ApiResponse<void>> {
  await delay(200, 600);
  const index = mockStore.contacts.findIndex((c) => c.id === id);

  if (index === -1) {
    throw new Error(`Contact with ID ${id} not found`);
  }

  mockStore.contacts.splice(index, 1);
  delete mockStore.activities[id];
  delete mockStore.notes[id];

  return {
    data: undefined as unknown as void,
    success: true,
    message: "Contact deleted successfully",
  };
}

/**
 * Adds a tag to a contact
 */
export async function addContactTag(
  contactId: string,
  tagId: string,
): Promise<ApiResponse<Contact>> {
  await delay(200, 600);
  const contact = mockStore.contacts.find((c) => c.id === contactId);
  if (!contact) {
    throw new Error(`Contact ${contactId} not found`);
  }

  const tag = mockStore.tags.find((t) => t.id === tagId || t.name === tagId);
  if (!tag) {
    throw new Error(`Tag ${tagId} not found`);
  }

  if (!contact.tags.some((t) => t.id === tag.id)) {
    contact.tags.push(tag);
    contact.updatedAt = new Date().toISOString();

    if (!mockStore.activities[contactId]) {
      mockStore.activities[contactId] = [];
    }
    mockStore.activities[contactId]!.unshift({
      id: `act_${contactId}_${Date.now()}`,
      contactId,
      type: "tag_added",
      description: `Added tag '${tag.name}'`,
      metadata: { tagId: tag.id, tagName: tag.name },
      timestamp: contact.updatedAt,
    });
  }

  return {
    data: { ...contact },
    success: true,
  };
}

/**
 * Removes a tag from a contact
 */
export async function removeContactTag(
  contactId: string,
  tagId: string,
): Promise<ApiResponse<Contact>> {
  await delay(200, 600);
  const contact = mockStore.contacts.find((c) => c.id === contactId);
  if (!contact) {
    throw new Error(`Contact ${contactId} not found`);
  }

  const tagToRemove = contact.tags.find((t) => t.id === tagId || t.name === tagId);
  contact.tags = contact.tags.filter((t) => t.id !== tagId && t.name !== tagId);
  contact.updatedAt = new Date().toISOString();

  if (tagToRemove) {
    if (!mockStore.activities[contactId]) {
      mockStore.activities[contactId] = [];
    }
    mockStore.activities[contactId]!.unshift({
      id: `act_${contactId}_${Date.now()}`,
      contactId,
      type: "tag_removed",
      description: `Removed tag '${tagToRemove.name}'`,
      timestamp: contact.updatedAt,
    });
  }

  return {
    data: { ...contact },
    success: true,
  };
}

/**
 * Fetches contact activity history
 */
export async function fetchContactActivities(contactId: string): Promise<ApiResponse<Activity[]>> {
  await delay(200, 600);
  const activities = mockStore.activities[contactId] || [];
  return {
    data: [...activities],
    success: true,
  };
}

/**
 * Fetches contact internal notes
 */
export async function fetchContactNotes(contactId: string): Promise<ApiResponse<Note[]>> {
  await delay(200, 600);
  const notes = mockStore.notes[contactId] || [];
  return {
    data: [...notes],
    success: true,
  };
}

/**
 * Creates a new internal note for a contact
 */
export async function createNote(contactId: string, content: string): Promise<ApiResponse<Note>> {
  await delay(200, 600);
  const now = new Date().toISOString();
  const noteId = `note_${contactId}_${Date.now()}`;
  const defaultAgent = mockStore.agents[0];

  const newNote: Note = {
    id: noteId,
    contactId,
    content,
    createdById: defaultAgent?.id || "agent_001",
    createdBy: defaultAgent,
    isPinned: false,
    createdAt: now,
    updatedAt: now,
  };

  if (!mockStore.notes[contactId]) {
    mockStore.notes[contactId] = [];
  }
  mockStore.notes[contactId]!.unshift(newNote);

  // Record activity
  if (!mockStore.activities[contactId]) {
    mockStore.activities[contactId] = [];
  }
  mockStore.activities[contactId]!.unshift({
    id: `act_${contactId}_${Date.now()}`,
    contactId,
    type: "note_added",
    description: `Added note: "${content.slice(0, 40)}${content.length > 40 ? "..." : ""}"`,
    performedById: defaultAgent?.id,
    performedBy: defaultAgent,
    timestamp: now,
  });

  return {
    data: newNote,
    success: true,
    message: "Note added successfully",
  };
}

/**
 * Toggles pinned status for an internal contact note
 */
export async function toggleNotePin(contactId: string, noteId: string): Promise<ApiResponse<Note>> {
  await delay(150, 400);
  const notes = mockStore.notes[contactId] || [];
  const note = notes.find((n) => n.id === noteId);

  if (!note) {
    throw new Error(`Note ${noteId} not found`);
  }

  note.isPinned = !note.isPinned;
  note.updatedAt = new Date().toISOString();

  return {
    data: { ...note },
    success: true,
    message: note.isPinned ? "Note pinned" : "Note unpinned",
  };
}

/**
 * Fetches all conversations associated with a contact
 */
export async function fetchContactConversations(
  contactId: string,
): Promise<ApiResponse<Conversation[]>> {
  await delay(150, 400);
  const items = mockStore.conversations.filter(
    (c) => c.contactId === contactId || c.contact?.id === contactId,
  );
  return {
    data: items,
    success: true,
  };
}
