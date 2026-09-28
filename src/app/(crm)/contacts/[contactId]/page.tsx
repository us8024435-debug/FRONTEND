"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Edit3,
  History,
  Info,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Pin,
  Plus,
  Send,
  ShieldAlert,
  ShieldCheck,
  StickyNote,
  Tag as TagIcon,
  Trash2,
  User,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";

import {
  queryKeys,
  fetchContact,
  fetchContactNotes,
  fetchContactActivities,
  fetchContactConversations,
  fetchTags,
  fetchAgents,
  addContactTag,
  removeContactTag,
  createNote,
  toggleNotePin,
  updateContact,
} from "@/lib/api";
import { useDeleteContact } from "@/lib/hooks";
import { Contact, Agent, Note, Conversation } from "@/lib/types";
import { cn, formatPhone, formatRelativeTime } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/crm/StatusBadge";
import { TagInput } from "@/components/crm/TagInput";
import { ContactActivityTimeline } from "@/components/crm/ContactActivityTimeline";
import { ContactFormSheet } from "@/components/contacts/ContactFormSheet";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import ContactDetailLoading from "./loading";

export default function ContactDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const contactId = params?.contactId as string;

  // Local state for modals and copy feedback
  const [editSheetOpen, setEditSheetOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [noteContent, setNoteContent] = React.useState("");
  const [copiedField, setCopiedField] = React.useState<string | null>(null);
  const noteInputRef = React.useRef<HTMLTextAreaElement>(null);

  // 1. Fetch Contact Details
  const {
    data: contactData,
    isLoading: contactLoading,
    isError: contactError,
    error,
  } = useQuery({
    queryKey: queryKeys.contacts.detail(contactId),
    queryFn: () => fetchContact(contactId),
    enabled: Boolean(contactId),
  });
  const contact: Contact | undefined = contactData?.data;

  // 2. Fetch Notes
  const { data: notesData, isLoading: notesLoading } = useQuery({
    queryKey: queryKeys.contacts.notes(contactId),
    queryFn: () => fetchContactNotes(contactId),
    enabled: Boolean(contactId),
  });
  const notes: Note[] = React.useMemo(() => notesData?.data || [], [notesData]);

  // 3. Fetch Activities
  const { data: activitiesData, isLoading: activitiesLoading } = useQuery({
    queryKey: queryKeys.contacts.activities(contactId),
    queryFn: () => fetchContactActivities(contactId),
    enabled: Boolean(contactId),
  });
  const activities = React.useMemo(() => activitiesData?.data || [], [activitiesData]);

  // 4. Fetch Conversations
  const { data: convData, isLoading: convLoading } = useQuery({
    queryKey: queryKeys.contacts.conversations(contactId),
    queryFn: () => fetchContactConversations(contactId),
    enabled: Boolean(contactId),
  });
  const conversations: Conversation[] = React.useMemo(() => convData?.data || [], [convData]);

  // 5. Fetch Available Tags
  const { data: tagsData } = useQuery({
    queryKey: queryKeys.tags.list(),
    queryFn: () => fetchTags(),
  });
  const availableTags = tagsData?.data || [];

  // 6. Fetch Agents
  const { data: agentsData } = useQuery({
    queryKey: queryKeys.agents.list(),
    queryFn: () => fetchAgents(),
  });
  const agents: Agent[] = agentsData?.data || [];

  // Mutations
  const deleteContactMutation = useDeleteContact();

  const reassignMutation = useMutation({
    mutationFn: (agentId: string) =>
      updateContact(contactId, { assignedAgentId: agentId || undefined }),
    onSuccess: (_, agentId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.contacts.detail(contactId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.lists() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.contacts.activities(contactId),
      });
      const agent = agents.find((a) => a.id === agentId);
      toast.success(agent ? `Contact assigned to ${agent.name}` : "Contact unassigned");
    },
    onError: () => toast.error("Failed to reassign contact"),
  });

  const addTagMutation = useMutation({
    mutationFn: (tagId: string) => addContactTag(contactId, tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.contacts.detail(contactId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.contacts.activities(contactId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.lists() });
      toast.success("Tag added");
    },
    onError: () => toast.error("Failed to add tag"),
  });

  const removeTagMutation = useMutation({
    mutationFn: (tagId: string) => removeContactTag(contactId, tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.contacts.detail(contactId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.contacts.activities(contactId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.lists() });
      toast.success("Tag removed");
    },
    onError: () => toast.error("Failed to remove tag"),
  });

  const createNoteMutation = useMutation({
    mutationFn: (content: string) => createNote(contactId, content),
    onSuccess: () => {
      setNoteContent("");
      queryClient.invalidateQueries({
        queryKey: queryKeys.contacts.notes(contactId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.contacts.activities(contactId),
      });
      toast.success("Note added");
    },
    onError: () => toast.error("Failed to add note"),
  });

  const togglePinMutation = useMutation({
    mutationFn: (noteId: string) => toggleNotePin(contactId, noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.contacts.notes(contactId),
      });
    },
    onError: () => toast.error("Failed to update note pin"),
  });

  // Sorted Notes (Pinned notes at top)
  const sortedNotes = React.useMemo(() => {
    return [...notes].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [notes]);

  // Copy helper
  const handleCopy = (text: string, fieldName: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`Copied ${fieldName} to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Initials generator
  const getInitials = (name?: string) => {
    if (!name) return "CT";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  if (contactLoading) {
    return <ContactDetailLoading />;
  }

  if (contactError || !contact) {
    return (
      <div className="container max-w-xl mx-auto p-8 text-center space-y-4">
        <div className="size-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
          <ShieldAlert className="size-7" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Contact Not Found</h2>
        <p className="text-sm text-muted-foreground">
          {error?.message || "The requested contact does not exist or may have been removed."}
        </p>
        <Button asChild variant="outline" className="gap-2">
          <Link href="/contacts">
            <ArrowLeft className="size-4" />
            Back to Contacts List
          </Link>
        </Button>
      </div>
    );
  }

  const assignedAgent = agents.find((a) => a.id === contact.assignedAgentId);
  const primaryConversation = conversations[0];

  return (
    <div className="container max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/contacts"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Contacts
        </Link>
        <span className="text-xs text-muted-foreground font-mono">ID: {contact.id}</span>
      </div>

      {/* Top Section — Full-Width Profile Card */}
      <Card className="border-border/60 shadow-sm overflow-hidden bg-card/60 backdrop-blur-xs">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Left: Avatar + Identity + Agent Assignment */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* 80px Large Avatar */}
              <div className="relative">
                <Avatar className="size-20 rounded-full border-2 border-border shadow-sm ring-2 ring-primary/10">
                  <AvatarImage src={contact.avatarUrl} alt={contact.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
                    {getInitials(contact.name)}
                  </AvatarFallback>
                </Avatar>
                <span
                  className={cn(
                    "absolute bottom-0 right-0 size-5 rounded-full border-2 border-background flex items-center justify-center",
                    contact.status === "active"
                      ? "bg-emerald-500"
                      : contact.status === "inactive"
                        ? "bg-amber-500"
                        : "bg-red-500",
                  )}
                  title={`Status: ${contact.status}`}
                />
              </div>

              {/* Contact Info & Meta */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    {contact.name}
                  </h1>
                  <StatusBadge status={contact.status} variant="contact" />
                  {contact.optInStatus ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <ShieldCheck className="size-3" />
                      Opted In
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground border border-border">
                      <ShieldAlert className="size-3" />
                      Not Opted In
                    </span>
                  )}
                </div>

                {/* Contact Quick Details */}
                <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-muted-foreground">
                  {/* Phone */}
                  <div className="flex items-center gap-1.5">
                    <Phone className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-mono text-foreground font-medium">
                      {formatPhone(contact.phone)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(contact.phone, "Phone")}
                      className="p-1 hover:text-foreground transition-colors rounded"
                      title="Copy phone"
                    >
                      {copiedField === "Phone" ? (
                        <Check className="size-3 text-emerald-600" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                    </button>
                  </div>

                  {/* Email */}
                  {contact.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="size-3.5 text-blue-500" />
                      <a
                        href={`mailto:${contact.email}`}
                        className="hover:underline text-foreground"
                      >
                        {contact.email}
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopy(contact.email!, "Email")}
                        className="p-1 hover:text-foreground transition-colors rounded"
                        title="Copy email"
                      >
                        {copiedField === "Email" ? (
                          <Check className="size-3 text-emerald-600" />
                        ) : (
                          <Copy className="size-3" />
                        )}
                      </button>
                    </div>
                  )}

                  {/* Reassign Agent Dropdown */}
                  <div className="flex items-center gap-2 pt-1 sm:pt-0">
                    <UserCheck className="size-3.5 text-purple-500" />
                    <span className="text-[11px]">Assigned to:</span>
                    <Select
                      value={contact.assignedAgentId || "unassigned"}
                      onValueChange={(val) => {
                        reassignMutation.mutate(val === "unassigned" ? "" : val);
                      }}
                      disabled={reassignMutation.isPending}
                    >
                      <SelectTrigger className="h-7 text-xs w-[160px] bg-background">
                        <SelectValue placeholder="Assign agent..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned" className="text-xs">
                          <span className="text-muted-foreground italic">Unassigned</span>
                        </SelectItem>
                        {agents.map((agent) => (
                          <SelectItem key={agent.id} value={agent.id} className="text-xs">
                            <div className="flex items-center gap-1.5">
                              <span className="size-2 rounded-full bg-emerald-500" />
                              <span className="truncate">{agent.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-start lg:justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-border/50">
              {/* Open in Chat Button */}
              {primaryConversation ? (
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-xs text-xs h-9"
                  asChild
                >
                  <Link href={`/inbox?id=${primaryConversation.id}`}>
                    <MessageSquare className="size-3.5" />
                    Open Chat
                  </Link>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="gap-2 text-xs h-9 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                  asChild
                >
                  <Link href="/inbox">
                    <Send className="size-3.5" />
                    Message on WhatsApp
                  </Link>
                </Button>
              )}

              {/* Edit Button */}
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs h-9"
                onClick={() => setEditSheetOpen(true)}
              >
                <Edit3 className="size-3.5 text-muted-foreground" />
                Edit
              </Button>

              {/* Delete Button */}
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs h-9 text-destructive hover:bg-destructive/10 border-destructive/30"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="size-3.5" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two-Column Layout (Left 60% / Right 40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: 60% (col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Contact Details Card */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <User className="size-4 text-primary" />
                Contact Details
              </CardTitle>
              <CardDescription className="text-xs">
                Comprehensive CRM demographic properties and WhatsApp status
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                {/* Phone */}
                <div className="space-y-1">
                  <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    Phone Number
                  </span>
                  <p className="text-xs font-mono font-medium text-foreground flex items-center gap-1.5">
                    {contact.phone}
                    <button
                      type="button"
                      onClick={() => handleCopy(contact.phone, "Phone")}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Copy className="size-3" />
                    </button>
                  </p>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    Email Address
                  </span>
                  <p className="text-xs text-foreground truncate">
                    {contact.email || (
                      <span className="text-muted-foreground italic">Not provided</span>
                    )}
                  </p>
                </div>

                {/* WhatsApp Opt-in */}
                <div className="space-y-1">
                  <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    WhatsApp Opt-in
                  </span>
                  <div className="flex items-center gap-2">
                    {contact.optInStatus ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle2 className="size-3.5" />
                        Opted in
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <ShieldAlert className="size-3.5" />
                        Opt-out
                      </span>
                    )}
                    {contact.optInTimestamp && (
                      <span className="text-[10px] text-muted-foreground">
                        ({dayjs(contact.optInTimestamp).format("MMM D, YYYY")})
                      </span>
                    )}
                  </div>
                </div>

                {/* Assigned Agent */}
                <div className="space-y-1">
                  <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    Assigned Agent
                  </span>
                  <p className="text-xs text-foreground font-medium">
                    {assignedAgent?.name || "Unassigned"}
                  </p>
                </div>

                {/* Created Date */}
                <div className="space-y-1">
                  <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    Created At
                  </span>
                  <p className="text-xs text-foreground flex items-center gap-1.5">
                    <Calendar className="size-3 text-muted-foreground" />
                    {dayjs(contact.createdAt).format("MMM D, YYYY · h:mm A")}
                  </p>
                </div>

                {/* Last Updated */}
                <div className="space-y-1">
                  <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    Last Modified
                  </span>
                  <p className="text-xs text-foreground flex items-center gap-1.5">
                    <Clock className="size-3 text-muted-foreground" />
                    {formatRelativeTime(contact.updatedAt)}
                  </p>
                </div>
              </div>

              {/* Custom Attributes Section */}
              <div className="pt-4 border-t border-border/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Info className="size-3.5 text-muted-foreground" />
                    Custom Attributes
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-[11px] text-primary hover:text-primary/90 px-2"
                    onClick={() => setEditSheetOpen(true)}
                  >
                    Edit Attributes
                  </Button>
                </div>

                {Object.keys(contact.customAttributes || {}).length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border p-3 text-center text-xs text-muted-foreground italic bg-muted/10">
                    No custom attributes configured for this contact.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(contact.customAttributes).map(([key, val]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-2 rounded-md border border-border/60 bg-muted/20 text-xs"
                      >
                        <span className="font-mono text-[11px] text-muted-foreground truncate max-w-[120px]">
                          {key}:
                        </span>
                        <span className="font-medium text-foreground truncate max-w-[150px]">
                          {typeof val === "boolean" ? (val ? "True" : "False") : String(val)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 2. Conversations Card */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3 border-b border-border/40 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <MessageSquare className="size-4 text-emerald-500" />
                  Conversations ({conversations.length})
                </CardTitle>
                <CardDescription className="text-xs">
                  Active and historical WhatsApp conversation threads
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild className="text-xs h-7 gap-1">
                <Link href="/inbox">
                  View Inbox
                  <ArrowUpRight className="size-3" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-5">
              {convLoading ? (
                <div className="space-y-3">
                  <div className="h-16 rounded-lg bg-muted/40 animate-pulse" />
                  <div className="h-16 rounded-lg bg-muted/40 animate-pulse" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-6 space-y-3">
                  <div className="size-10 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center">
                    <MessageSquare className="size-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-foreground">No conversations yet</p>
                    <p className="text-[11px] text-muted-foreground">
                      Start a new WhatsApp conversation with this customer.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 gap-1.5"
                    asChild
                  >
                    <Link href="/inbox">
                      <Send className="size-3" />
                      Start Chat in Inbox
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {conversations.map((conv) => (
                    <Link
                      key={conv.id}
                      href={`/inbox?id=${conv.id}`}
                      className="block p-3.5 rounded-lg border border-border/70 hover:border-emerald-500/50 hover:bg-muted/40 transition-all group"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={conv.status} variant="conversation" />
                          {conv.priority === "high" && (
                            <span
                              className="size-2 rounded-full bg-red-500"
                              title="High Priority"
                            />
                          )}
                          <span className="text-xs font-semibold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            WhatsApp Thread
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-muted-foreground">
                            {formatRelativeTime(conv.updatedAt)}
                          </span>
                          <ArrowUpRight className="size-3.5 text-muted-foreground group-hover:text-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground truncate mt-1.5">
                        {conv.lastMessage?.content?.text ||
                          (conv.lastMessage?.content?.templateName
                            ? `Template: ${conv.lastMessage.content.templateName}`
                            : "No recent messages")}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: 40% (col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* 1. Tags Section */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <TagIcon className="size-4 text-blue-500" />
                Tags ({contact.tags?.length || 0})
              </CardTitle>
              <CardDescription className="text-xs">
                Segment and categorize contact for automated campaigns
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <TagInput
                tags={contact.tags || []}
                availableTags={availableTags}
                onAdd={(tagId) => addTagMutation.mutate(tagId)}
                onRemove={(tagId) => removeTagMutation.mutate(tagId)}
              />
            </CardContent>
          </Card>

          {/* 2. Internal Notes Section */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3 border-b border-border/40 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <StickyNote className="size-4 text-amber-500" />
                  Internal Notes ({notes.length})
                </CardTitle>
                <CardDescription className="text-xs">
                  Private team notes and collaboration log
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3.5">
              {/* Add Note Form */}
              <div className="space-y-2">
                <textarea
                  ref={noteInputRef}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Write an internal note for your team..."
                  rows={2}
                  className="w-full text-xs rounded-md border border-input bg-background p-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none shadow-xs"
                />
                <Button
                  size="sm"
                  disabled={createNoteMutation.isPending || !noteContent.trim()}
                  onClick={() => createNoteMutation.mutate(noteContent.trim())}
                  className="w-full h-8 text-xs bg-amber-600 hover:bg-amber-700 text-white font-medium gap-1.5"
                >
                  {createNoteMutation.isPending ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>Saving note...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="size-3.5" />
                      <span>Add Note</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Notes List */}
              <div className="space-y-2 pt-2 border-t border-border/40 max-h-[300px] overflow-y-auto pr-1">
                {notesLoading ? (
                  <div className="space-y-2">
                    <div className="h-14 rounded-md bg-muted/40 animate-pulse" />
                    <div className="h-14 rounded-md bg-muted/40 animate-pulse" />
                  </div>
                ) : sortedNotes.length === 0 ? (
                  <EmptyState
                    icon={Pin}
                    title="No notes"
                    description="Add notes about this contact"
                    actionLabel="Add Note"
                    onAction={() => noteInputRef.current?.focus()}
                    className="border-none bg-transparent min-h-[140px] p-2"
                  />
                ) : (
                  sortedNotes.map((note) => (
                    <div
                      key={note.id}
                      className={cn(
                        "p-2.5 rounded-lg border text-xs space-y-1.5 transition-colors relative group",
                        note.isPinned
                          ? "bg-amber-500/10 dark:bg-amber-950/20 border-amber-500/30"
                          : "bg-muted/30 border-border/60 hover:bg-muted/50",
                      )}
                    >
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span className="font-semibold text-foreground truncate max-w-[180px]">
                          {note.createdBy?.name || "Agent"}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px]">{formatRelativeTime(note.createdAt)}</span>
                          <button
                            type="button"
                            onClick={() => togglePinMutation.mutate(note.id)}
                            className={cn(
                              "p-1 rounded transition-colors",
                              note.isPinned
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-muted-foreground opacity-60 hover:opacity-100",
                            )}
                            title={note.isPinned ? "Unpin note" : "Pin note"}
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
            </CardContent>
          </Card>

          {/* 3. Activity Timeline Section */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <History className="size-4 text-purple-500" />
                Activity Timeline ({activities.length})
              </CardTitle>
              <CardDescription className="text-xs">
                Chronological log of messages, status changes, and tag updates
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              {activitiesLoading ? (
                <div className="space-y-3">
                  <div className="h-10 rounded bg-muted/40 animate-pulse" />
                  <div className="h-10 rounded bg-muted/40 animate-pulse" />
                  <div className="h-10 rounded bg-muted/40 animate-pulse" />
                </div>
              ) : (
                <ContactActivityTimeline activities={activities} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Contact Slide-Over Sheet */}
      <ContactFormSheet
        open={editSheetOpen}
        onOpenChange={setEditSheetOpen}
        contact={contact}
        onSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: queryKeys.contacts.detail(contactId),
          });
        }}
      />

      {/* Delete Contact Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Contact"
        description={`Are you sure you want to delete ${contact.name}? All message threads, internal notes, and activity records associated with this contact will be permanently deleted.`}
        confirmLabel="Delete Contact"
        destructive
        loading={deleteContactMutation.isPending}
        onConfirm={async () => {
          await deleteContactMutation.mutateAsync(contactId);
          router.push("/contacts");
        }}
      />
    </div>
  );
}
