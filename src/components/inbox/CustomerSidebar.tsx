"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  X,
  Phone,
  Mail,
  ExternalLink,
  UserCheck,
  Tag as TagIcon,
  StickyNote,
  Activity as ActivityIcon,
  Pin,
  Send,
  Loader2,
} from "lucide-react";

import {
  queryKeys,
  fetchContact,
  fetchAgents,
  fetchTags,
  fetchContactNotes,
  fetchContactActivities,
  createNote,
  toggleNotePin,
  addContactTag,
  removeContactTag,
  updateContact,
  assignConversation,
} from "@/lib/api";
import { useConversationStore } from "@/lib/stores/conversationStore";
import { motionConfig } from "@/lib/motion";
import { formatPhone, formatRelativeTime, cn } from "@/lib/utils";
import { Contact, ApiResponse } from "@/lib/types";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/crm/StatusBadge";
import { TagInput } from "@/components/crm/TagInput";
import { ContactActivityTimeline } from "@/components/crm/ContactActivityTimeline";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export interface CustomerSidebarProps {
  contactId: string;
  conversationId?: string;
  className?: string;
}

interface NoteFormValues {
  content: string;
}

export function CustomerSidebar({ contactId, conversationId, className }: CustomerSidebarProps) {
  const queryClient = useQueryClient();
  const { customerSidebarOpen, toggleCustomerSidebar } = useConversationStore();

  // 1. Fetch Contact Details
  const { data: contactData, isLoading: contactLoading } = useQuery({
    queryKey: queryKeys.contacts.detail(contactId),
    queryFn: () => fetchContact(contactId),
    enabled: Boolean(contactId),
  });

  const contact = contactData?.data;

  // 2. Fetch Agents for Reassignment
  const { data: agentsData } = useQuery({
    queryKey: queryKeys.agents.list(),
    queryFn: () => fetchAgents(),
  });
  const agents = React.useMemo(() => agentsData?.data || [], [agentsData]);

  // 3. Fetch Available CRM Tags
  const { data: tagsData } = useQuery({
    queryKey: queryKeys.tags.list(),
    queryFn: () => fetchTags(),
  });
  const availableTags = React.useMemo(() => tagsData?.data || [], [tagsData]);

  // 4. Fetch Notes
  const { data: notesData, isLoading: notesLoading } = useQuery({
    queryKey: queryKeys.contacts.notes(contactId),
    queryFn: () => fetchContactNotes(contactId),
    enabled: Boolean(contactId),
  });
  const notes = React.useMemo(() => notesData?.data || [], [notesData]);

  // 5. Fetch Activities
  const { data: activitiesData, isLoading: activitiesLoading } = useQuery({
    queryKey: queryKeys.contacts.activities(contactId),
    queryFn: () => fetchContactActivities(contactId),
    enabled: Boolean(contactId),
  });
  const activities = React.useMemo(() => activitiesData?.data || [], [activitiesData]);

  // Notes sorting: pinned notes first, then chronological descending
  const sortedNotes = React.useMemo(() => {
    return [...notes].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [notes]);

  // Assignment Mutation
  const assignMutation = useMutation({
    mutationFn: async (agentId: string) => {
      if (conversationId) {
        await assignConversation(conversationId, agentId);
      }
      return updateContact(contactId, { assignedAgentId: agentId });
    },
    onSuccess: (_, agentId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.contacts.detail(contactId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.contacts.activities(contactId),
      });
      const agent = agents.find((a) => a.id === agentId);
      toast.success(`Assigned to ${agent?.name || "Agent"}`);
    },
    onError: () => {
      toast.error("Failed to reassign contact");
    },
  });

  // Add Tag Mutation with Optimistic Updates
  const addTagMutation = useMutation({
    mutationFn: (tagId: string) => addContactTag(contactId, tagId),
    onMutate: async (tagId) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.contacts.detail(contactId),
      });
      const previous = queryClient.getQueryData<ApiResponse<Contact>>(
        queryKeys.contacts.detail(contactId),
      );
      const tagToAdd = availableTags.find((t) => t.id === tagId);

      if (tagToAdd && previous?.data) {
        queryClient.setQueryData<ApiResponse<Contact>>(queryKeys.contacts.detail(contactId), {
          ...previous,
          data: {
            ...previous.data,
            tags: [...previous.data.tags, tagToAdd],
          },
        });
      }
      return { previous };
    },
    onError: (_err, _tagId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.contacts.detail(contactId), context.previous);
      }
      toast.error("Failed to add tag");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.contacts.detail(contactId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.contacts.activities(contactId),
      });
    },
  });

  // Remove Tag Mutation with Optimistic Updates
  const removeTagMutation = useMutation({
    mutationFn: (tagId: string) => removeContactTag(contactId, tagId),
    onMutate: async (tagId) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.contacts.detail(contactId),
      });
      const previous = queryClient.getQueryData<ApiResponse<Contact>>(
        queryKeys.contacts.detail(contactId),
      );

      if (previous?.data) {
        queryClient.setQueryData<ApiResponse<Contact>>(queryKeys.contacts.detail(contactId), {
          ...previous,
          data: {
            ...previous.data,
            tags: previous.data.tags.filter((t) => t.id !== tagId),
          },
        });
      }
      return { previous };
    },
    onError: (_err, _tagId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.contacts.detail(contactId), context.previous);
      }
      toast.error("Failed to remove tag");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.contacts.detail(contactId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.contacts.activities(contactId),
      });
    },
  });

  // React Hook Form for Note Creation
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<NoteFormValues>({
    defaultValues: { content: "" },
  });

  const createNoteMutation = useMutation({
    mutationFn: (content: string) => createNote(contactId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.contacts.notes(contactId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.contacts.activities(contactId),
      });
      reset();
      toast.success("Note added successfully");
    },
    onError: () => {
      toast.error("Failed to add note");
    },
  });

  const onAddNote = (data: NoteFormValues) => {
    if (!data.content.trim()) return;
    createNoteMutation.mutate(data.content.trim());
  };

  // Toggle Note Pin Mutation
  const togglePinMutation = useMutation({
    mutationFn: (noteId: string) => toggleNotePin(contactId, noteId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.contacts.notes(contactId),
      });
      toast.success(res.data.isPinned ? "Note pinned" : "Note unpinned");
    },
    onError: () => {
      toast.error("Failed to toggle note pin");
    },
  });

  const getInitials = (name?: string) => {
    if (!name) return "WA";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0]?.[0] || ""}${parts[1]?.[0] || ""}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <AnimatePresence>
      {customerSidebarOpen && (
        <motion.aside
          key="customer-sidebar"
          initial={motionConfig.sheetSlide.initial}
          animate={motionConfig.sheetSlide.animate}
          exit={motionConfig.sheetSlide.exit}
          transition={motionConfig.sheetSlide.transition}
          className={cn(
            "w-[320px] h-full border-l border-border bg-card flex flex-col shrink-0 overflow-hidden relative z-10 shadow-lg",
            className,
          )}
        >
          {/* Top Title Bar with Close Button */}
          <div className="h-14 px-4 border-b border-border flex items-center justify-between shrink-0 bg-muted/20">
            <h2 className="text-sm font-bold text-foreground">Customer Details</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCustomerSidebar}
              className="size-8 text-muted-foreground hover:text-foreground"
              aria-label="Close customer details"
            >
              <X className="size-4" />
            </Button>
          </div>

          {/* Scrollable Content Container */}
          <div className="flex-1 overflow-y-auto chat-scrollbar p-4 space-y-6">
            {contactLoading || !contact ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center space-y-2">
                  <Skeleton className="size-16 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : (
              <>
                {/* SECTION 1 — Contact Header */}
                <section className="flex flex-col items-center text-center space-y-2.5 pb-2">
                  <Avatar className="size-16 ring-2 ring-border shadow-xs">
                    <AvatarImage src={contact.avatarUrl} alt={contact.name} />
                    <AvatarFallback className="text-base font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      {getInitials(contact.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-foreground leading-tight">
                      {contact.name}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                      <Phone className="size-3 shrink-0" />
                      <span>{formatPhone(contact.phone)}</span>
                    </p>
                    {contact.email && (
                      <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5 truncate max-w-[240px]">
                        <Mail className="size-3 shrink-0" />
                        <span className="truncate">{contact.email}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <StatusBadge status={contact.status} variant="contact" />
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs gap-1.5 border-border"
                      asChild
                    >
                      <Link href={`/contacts/${contact.id}`}>
                        <ExternalLink className="size-3" />
                        <span>Edit Contact</span>
                      </Link>
                    </Button>
                  </div>
                </section>

                <div className="h-px bg-border" />

                {/* SECTION 2 — Assignment */}
                <section className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <UserCheck className="size-3.5" />
                    <span>Assigned To</span>
                  </div>

                  <Select
                    value={contact.assignedAgentId || "unassigned"}
                    onValueChange={(val) => {
                      if (val !== "unassigned") {
                        assignMutation.mutate(val);
                      }
                    }}
                    disabled={assignMutation.isPending}
                  >
                    <SelectTrigger className="w-full h-9 text-xs">
                      <SelectValue placeholder="Select an agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.map((ag) => (
                        <SelectItem key={ag.id} value={ag.id} className="text-xs cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Avatar className="size-4 shrink-0">
                              <AvatarImage src={ag.avatarUrl} alt={ag.name} />
                              <AvatarFallback className="text-[9px]">
                                {ag.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="truncate">{ag.name}</span>
                            <span className="text-[10px] text-muted-foreground capitalize">
                              ({ag.role})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </section>

                <div className="h-px bg-border" />

                {/* SECTION 3 — Tags */}
                <section className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <TagIcon className="size-3.5" />
                    <span>Tags</span>
                  </div>

                  <TagInput
                    tags={contact.tags || []}
                    availableTags={availableTags}
                    onAdd={(tagId) => addTagMutation.mutate(tagId)}
                    onRemove={(tagId) => removeTagMutation.mutate(tagId)}
                  />
                </section>

                <div className="h-px bg-border" />

                {/* SECTION 4 — Notes */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      <StickyNote className="size-3.5" />
                      <span>Internal Notes</span>
                    </div>
                    <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                      {notes.length}
                    </span>
                  </div>

                  {/* Notes List */}
                  <div className="space-y-2 max-h-56 overflow-y-auto chat-scrollbar pr-0.5">
                    {notesLoading ? (
                      <div className="space-y-2">
                        <Skeleton className="h-14 w-full" />
                        <Skeleton className="h-14 w-full" />
                      </div>
                    ) : sortedNotes.length === 0 ? (
                      <EmptyState
                        icon={Pin}
                        title="No notes"
                        description="Add notes about this contact"
                        actionLabel="Add Note"
                        onAction={() => setFocus("content")}
                        className="border-none bg-transparent min-h-[140px] p-2"
                      />
                    ) : (
                      sortedNotes.map((note) => (
                        <div
                          key={note.id}
                          className={cn(
                            "p-2.5 rounded-lg border text-xs space-y-1.5 transition-colors relative group",
                            note.isPinned
                              ? "bg-amber-500/5 dark:bg-amber-950/20 border-amber-500/30"
                              : "bg-muted/30 border-border hover:bg-muted/50",
                          )}
                        >
                          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                            <span className="font-semibold text-foreground truncate max-w-[170px]">
                              {note.createdBy?.name || "Agent"}
                            </span>
                            <div className="flex items-center gap-1">
                              <span className="text-[10px]">
                                {formatRelativeTime(note.createdAt)}
                              </span>
                              <button
                                type="button"
                                onClick={() => togglePinMutation.mutate(note.id)}
                                className={cn(
                                  "p-1 rounded-sm transition-colors",
                                  note.isPinned
                                    ? "text-amber-600 dark:text-amber-400"
                                    : "text-muted-foreground opacity-60 hover:opacity-100",
                                )}
                                title={note.isPinned ? "Unpin note" : "Pin note"}
                                aria-label={note.isPinned ? "Unpin note" : "Pin note"}
                              >
                                <Pin className={cn("size-3", note.isPinned && "fill-current")} />
                              </button>
                            </div>
                          </div>
                          <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed text-[12px]">
                            {note.content}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Note Form */}
                  <form onSubmit={handleSubmit(onAddNote)} className="space-y-2 pt-1">
                    <div className="space-y-1">
                      <textarea
                        {...register("content", { required: true })}
                        placeholder="Write a note (visible only to team)..."
                        rows={2}
                        className="w-full text-xs rounded-md border border-input bg-background p-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                      />
                      {errors.content && (
                        <p className="text-[10px] text-red-500">Note content cannot be empty.</p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={createNoteMutation.isPending}
                      className="w-full h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium gap-1.5"
                    >
                      {createNoteMutation.isPending ? (
                        <>
                          <Loader2 className="size-3 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Send className="size-3" />
                          <span>Add Note</span>
                        </>
                      )}
                    </Button>
                  </form>
                </section>

                <div className="h-px bg-border" />

                {/* SECTION 5 — Activity Timeline */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      <ActivityIcon className="size-3.5" />
                      <span>Activity Timeline</span>
                    </div>
                    <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                      {activities.length}
                    </span>
                  </div>

                  {activitiesLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ) : (
                    <ContactActivityTimeline activities={activities} initialLimit={10} />
                  )}
                </section>
              </>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
