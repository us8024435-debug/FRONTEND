"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Paperclip,
  Send,
  Loader2,
  FileText as TemplateIcon,
  Image as ImageIcon,
  FileText as DocumentIcon,
  Video as VideoIcon,
  AlertTriangle,
  Search,
  CheckCircle2,
  X,
  Sparkles,
} from "lucide-react";
import { queryKeys, fetchConversation, fetchTemplates } from "@/lib/api";
import { useSendMessage } from "@/lib/hooks";
import { Template } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

export interface MessageComposerProps {
  conversationId: string;
  onSendMessage?: () => void;
}

function subscribeToClock(callback: () => void) {
  const interval = setInterval(callback, 10000);
  return () => clearInterval(interval);
}

function getNowSnapshot(): number {
  return Date.now();
}

function getServerSnapshot(): number {
  return 0;
}

export function MessageComposer({ conversationId, onSendMessage }: MessageComposerProps) {
  const [text, setText] = React.useState("");
  const [selectedTemplate, setSelectedTemplate] = React.useState<Template | null>(null);
  const [templatePopoverOpen, setTemplatePopoverOpen] = React.useState(false);
  const [templateSearch, setTemplateSearch] = React.useState("");

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const docInputRef = React.useRef<HTMLInputElement>(null);
  const videoInputRef = React.useRef<HTMLInputElement>(null);

  // Subscribe to external clock for pure time evaluation
  const currentTime = React.useSyncExternalStore(
    subscribeToClock,
    getNowSnapshot,
    getServerSnapshot,
  );

  // 1. Fetch conversation details to check 24h window
  const { data: convData } = useQuery({
    queryKey: queryKeys.conversations.detail(conversationId),
    queryFn: () => fetchConversation(conversationId),
    enabled: Boolean(conversationId),
  });

  const conversation = convData?.data;

  // Determine if the WhatsApp 24-hour customer care window is expired
  const isWindowExpired = Boolean(
    conversation?.status === "expired" ||
    (conversation?.windowExpiresAt &&
      new Date(conversation.windowExpiresAt).getTime() <= currentTime),
  );

  // 2. Fetch approved WhatsApp templates for template selector
  const { data: templatesData, isLoading: templatesLoading } = useQuery({
    queryKey: queryKeys.templates.list({ status: "approved" }),
    queryFn: () => fetchTemplates({ status: "approved" }),
  });

  const approvedTemplates = React.useMemo(() => {
    return templatesData?.data ?? [];
  }, [templatesData]);

  // Filter templates by search query
  const filteredTemplates = React.useMemo(() => {
    if (!templateSearch.trim()) return approvedTemplates;
    const q = templateSearch.toLowerCase().trim();
    return approvedTemplates.filter(
      (t) =>
        t.displayName.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        t.body.text.toLowerCase().includes(q),
    );
  }, [approvedTemplates, templateSearch]);

  // 3. Send message mutation hook
  const { mutate: sendMessage, isPending } = useSendMessage(conversationId);

  // Dynamic textarea height management (min 1 row ~38px, max 5 rows ~120px)
  const adjustHeight = React.useCallback((el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    const newHeight = Math.min(Math.max(el.scrollHeight, 38), 120);
    el.style.height = `${newHeight}px`;
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isWindowExpired) return; // Prevent free typing when window expired
    setText(e.target.value);
    adjustHeight(e.target);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter without Shift triggers send
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || isPending) return;

    sendMessage(
      {
        type: selectedTemplate ? "template" : "text",
        content: {
          text: trimmed,
          ...(selectedTemplate
            ? {
                templateName: selectedTemplate.name,
              }
            : {}),
        },
      },
      {
        onSuccess: () => {
          onSendMessage?.();
        },
        onSettled: () => {
          // Return focus to textarea input after sending
          textareaRef.current?.focus();
        },
      },
    );

    // Clear input & focus immediately
    setText("");
    setSelectedTemplate(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "38px";
      textareaRef.current.focus();
    }
  };

  // Clicking an approved template fills composer with template body text
  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setText(template.body.text);
    setTemplatePopoverOpen(false);

    setTimeout(() => {
      if (textareaRef.current) {
        adjustHeight(textareaRef.current);
        textareaRef.current.focus();
      }
    }, 50);
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "document" | "video",
  ) => {
    const file = e.target.files?.[0];
    if (!file || isWindowExpired) return;

    const objectUrl = URL.createObjectURL(file);
    sendMessage(
      {
        type,
        content: {
          fileName: file.name,
          mediaUrl: objectUrl,
          mediaMimeType: file.type,
          caption: type === "image" || type === "video" ? file.name : undefined,
        },
      },
      {
        onSuccess: () => {
          onSendMessage?.();
        },
        onSettled: () => {
          textareaRef.current?.focus();
        },
      },
    );

    e.target.value = "";
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="w-full border-t border-border bg-card/90 dark:bg-card/95 backdrop-blur-md flex flex-col z-20 shrink-0">
        {/* Hidden file inputs for attachments */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileUpload(e, "image")}
        />
        <input
          ref={docInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          className="hidden"
          onChange={(e) => handleFileUpload(e, "document")}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => handleFileUpload(e, "video")}
        />

        {/* WhatsApp 24-hour window expiration warning banner */}
        {isWindowExpired && (
          <div className="flex items-center justify-between px-4 py-2 bg-amber-500/10 dark:bg-amber-950/40 border-b border-amber-500/25 text-amber-800 dark:text-amber-300 text-xs font-medium animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>24-hour window expired. You can only send templates.</span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setTemplatePopoverOpen(true)}
              className="h-6 px-2.5 text-[11px] font-semibold border-amber-500/40 text-amber-800 dark:text-amber-200 hover:bg-amber-500/20 rounded-md"
            >
              Select Template
            </Button>
          </div>
        )}

        {/* Selected template indicator banner */}
        {selectedTemplate && (
          <div className="flex items-center justify-between px-4 py-1.5 bg-emerald-500/10 dark:bg-emerald-950/30 border-b border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 animate-in fade-in duration-150">
            <div className="flex items-center gap-1.5 truncate">
              <Sparkles className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold">Active Template:</span>
              <span className="truncate font-medium">{selectedTemplate.displayName}</span>
              <Badge
                variant="outline"
                className="text-[10px] py-0 px-1.5 h-4 ml-1 border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
              >
                {selectedTemplate.category}
              </Badge>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedTemplate(null);
                setText("");
                if (textareaRef.current) {
                  textareaRef.current.style.height = "38px";
                  textareaRef.current.focus();
                }
              }}
              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors ml-2"
              title="Clear selected template"
              aria-label="Clear selected template"
            >
              <X className="size-3.5" />
            </button>
          </div>
        )}

        {/* Main Message Composer Bar */}
        <div className="p-3 flex items-end gap-2">
          {/* Left Actions: Attachment + Template Selector */}
          <div className="flex items-center gap-1 pb-1">
            {/* Attachment Dropdown */}
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={isWindowExpired || isPending}
                      className={cn(
                        "size-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors",
                        isWindowExpired && "opacity-40 cursor-not-allowed",
                      )}
                      aria-label="Add attachment"
                    >
                      <Paperclip className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {isWindowExpired ? "Attachments disabled outside 24h window" : "Attach media"}
                </TooltipContent>
              </Tooltip>

              <DropdownMenuContent align="start" side="top" className="w-48 mb-2">
                <DropdownMenuItem
                  onClick={() => imageInputRef.current?.click()}
                  className="cursor-pointer gap-2.5 py-2 text-xs"
                >
                  <div className="size-6 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <ImageIcon className="size-3.5" />
                  </div>
                  <span className="font-medium">Image</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => docInputRef.current?.click()}
                  className="cursor-pointer gap-2.5 py-2 text-xs"
                >
                  <div className="size-6 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <DocumentIcon className="size-3.5" />
                  </div>
                  <span className="font-medium">Document</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => videoInputRef.current?.click()}
                  className="cursor-pointer gap-2.5 py-2 text-xs"
                >
                  <div className="size-6 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <VideoIcon className="size-3.5" />
                  </div>
                  <span className="font-medium">Video</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Template Selector Popover */}
            <Popover open={templatePopoverOpen} onOpenChange={setTemplatePopoverOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={isPending}
                      className={cn(
                        "size-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors",
                        isWindowExpired &&
                          "text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20",
                      )}
                      aria-label="Select WhatsApp Template"
                    >
                      <TemplateIcon className="size-4" />
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent side="top">
                  WhatsApp Templates {isWindowExpired ? "(Required)" : ""}
                </TooltipContent>
              </Tooltip>

              <PopoverContent
                align="start"
                side="top"
                className="w-80 sm:w-96 p-0 mb-2 shadow-xl border-border bg-popover"
              >
                {/* Popover Header */}
                <div className="p-3 border-b border-border bg-muted/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <TemplateIcon className="size-4 text-emerald-600 dark:text-emerald-400" />
                      <h4 className="text-xs font-bold text-foreground">
                        Approved WhatsApp Templates
                      </h4>
                    </div>
                    <Badge variant="secondary" className="text-[10px] font-mono">
                      {approvedTemplates.length} available
                    </Badge>
                  </div>

                  {/* Template search bar */}
                  <div className="relative">
                    <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={templateSearch}
                      onChange={(e) => setTemplateSearch(e.target.value)}
                      placeholder="Search templates..."
                      className="w-full pl-8 pr-3 py-1 text-xs rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Templates Scrollable List */}
                <ScrollArea className="h-64 p-2">
                  {templatesLoading ? (
                    <div className="space-y-2 p-1">
                      <Skeleton className="h-14 w-full rounded-md" />
                      <Skeleton className="h-14 w-full rounded-md" />
                      <Skeleton className="h-14 w-full rounded-md" />
                    </div>
                  ) : filteredTemplates.length === 0 ? (
                    <div className="py-8 text-center text-xs text-muted-foreground">
                      No approved templates match &ldquo;{templateSearch}&rdquo;
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {filteredTemplates.map((template) => {
                        const isSelected = selectedTemplate?.id === template.id;
                        return (
                          <button
                            key={template.id}
                            type="button"
                            onClick={() => handleSelectTemplate(template)}
                            className={cn(
                              "w-full text-left p-2.5 rounded-md transition-colors border flex flex-col gap-1 select-none",
                              isSelected
                                ? "bg-emerald-500/10 border-emerald-500/40 text-foreground"
                                : "border-border/60 hover:border-emerald-500/30 hover:bg-muted/60 text-foreground",
                            )}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="text-xs font-semibold truncate flex items-center gap-1.5">
                                {template.displayName}
                                {isSelected && (
                                  <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                )}
                              </span>
                              <Badge
                                variant="outline"
                                className="text-[10px] capitalize px-1.5 py-0 h-4 shrink-0 text-muted-foreground border-border"
                              >
                                {template.category}
                              </Badge>
                            </div>
                            <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                              {template.body.text}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </div>

          {/* Center: Auto-growing Textarea Input */}
          <div className="relative flex-1 bg-muted/40 dark:bg-muted/20 rounded-2xl border border-input focus-within:border-emerald-500/60 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all flex items-center px-3 py-1">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={isPending}
              readOnly={isWindowExpired}
              rows={1}
              placeholder={
                isWindowExpired
                  ? "24-hour window expired. Select an approved template..."
                  : "Type a message..."
              }
              className={cn(
                "flex-1 max-h-[120px] min-h-[38px] bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none py-2 px-1 chat-scrollbar leading-snug",
                isWindowExpired && "cursor-not-allowed opacity-80 select-none",
              )}
            />
          </div>

          {/* Right: Send Button with loading spinner */}
          <div className="pb-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  onClick={handleSend}
                  disabled={!text.trim() || isPending}
                  className={cn(
                    "size-9 rounded-full shrink-0 transition-all shadow-xs",
                    text.trim() && !isPending
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                      : "bg-muted text-muted-foreground opacity-50 cursor-not-allowed hover:bg-muted",
                  )}
                  aria-label="Send message"
                >
                  {isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4 ml-0.5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                {isPending ? "Sending..." : "Send (Enter)"}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
