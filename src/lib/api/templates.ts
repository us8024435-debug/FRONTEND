import {
  Template,
  TemplateFilters,
  CreateTemplateInput,
  UpdateTemplateInput,
  ApiResponse,
  PaginatedResponse,
} from "@/lib/types";
import { delay } from "@/lib/utils";
import { mockStore } from "./store";

/**
 * Fetches WhatsApp message templates with category, status, and text search filters
 */
export async function fetchTemplates(
  filters?: TemplateFilters,
): Promise<PaginatedResponse<Template>> {
  await delay(200, 600);

  let items = [...mockStore.templates];

  if (filters?.status) {
    items = items.filter((t) => t.status === filters.status);
  }

  if (filters?.category) {
    items = items.filter((t) => t.category === filters.category);
  }

  if (filters?.search && filters.search.trim().length > 0) {
    const q = filters.search.toLowerCase().trim();
    items = items.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.displayName.toLowerCase().includes(q) ||
        t.body.text.toLowerCase().includes(q),
    );
  }

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
 * Fetches a single template by ID
 */
export async function fetchTemplate(id: string): Promise<ApiResponse<Template>> {
  await delay(200, 600);
  const template = mockStore.templates.find((t) => t.id === id);

  if (!template) {
    throw new Error(`Template with ID ${id} not found`);
  }

  return {
    data: { ...template },
    success: true,
  };
}

/**
 * Creates a new template draft
 */
export async function createTemplate(data: CreateTemplateInput): Promise<ApiResponse<Template>> {
  await delay(200, 600);
  const now = new Date().toISOString();
  const nextNum = mockStore.templates.length + 1;
  const newId = `template_${String(nextNum).padStart(3, "0")}`;

  const newTemplate: Template = {
    id: newId,
    name: data.name,
    displayName: data.displayName,
    category: data.category,
    language: data.language,
    status: data.status || "draft",
    header: data.header,
    body: data.body,
    footer: data.footer,
    buttons: data.buttons || [],
    qualityScore: "unknown",
    usageCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  mockStore.templates.unshift(newTemplate);

  return {
    data: newTemplate,
    success: true,
    message: "Template draft created successfully",
  };
}

/**
 * Updates an existing template
 */
export async function updateTemplate(
  id: string,
  data: UpdateTemplateInput,
): Promise<ApiResponse<Template>> {
  await delay(200, 600);
  const index = mockStore.templates.findIndex((t) => t.id === id);

  if (index === -1) {
    throw new Error(`Template with ID ${id} not found`);
  }

  const existing = mockStore.templates[index]!;
  const now = new Date().toISOString();

  const updated: Template = {
    ...existing,
    displayName: data.displayName ?? existing.displayName,
    category: data.category ?? existing.category,
    language: data.language ?? existing.language,
    status: data.status ?? existing.status,
    header: data.header !== undefined ? data.header : existing.header,
    body: data.body !== undefined ? data.body : existing.body,
    footer: data.footer !== undefined ? data.footer : existing.footer,
    buttons: data.buttons !== undefined ? data.buttons : existing.buttons,
    updatedAt: now,
  };

  mockStore.templates[index] = updated;

  return {
    data: updated,
    success: true,
    message: "Template updated successfully",
  };
}

/**
 * Deletes a template
 */
export async function deleteTemplate(id: string): Promise<ApiResponse<void>> {
  await delay(200, 600);
  const index = mockStore.templates.findIndex((t) => t.id === id);

  if (index === -1) {
    throw new Error(`Template with ID ${id} not found`);
  }

  mockStore.templates.splice(index, 1);

  return {
    data: undefined as unknown as void,
    success: true,
    message: "Template deleted successfully",
  };
}
