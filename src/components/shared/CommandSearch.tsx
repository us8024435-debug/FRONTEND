"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  FileText,
  Send,
  UserCog,
  GitBranch,
  Settings,
  Phone,
  User,
  ArrowRight,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useUIStore } from "@/lib/stores/uiStore";
import { mockContacts } from "@/lib/mock-data/contacts";
import { mockConversations } from "@/lib/mock-data/conversations";
import { formatPhone } from "@/lib/utils";

export function CommandSearch() {
  const router = useRouter();
  const { commandOpen, setCommandOpen } = useUIStore();

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen(!commandOpen);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [commandOpen, setCommandOpen]);

  const handleSelect = React.useCallback(
    (url: string) => {
      setCommandOpen(false);
      router.push(url);
    },
    [router, setCommandOpen],
  );

  const pages = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Inbox & Live Chats", href: "/inbox", icon: MessageSquare },
    { title: "Contacts Directory", href: "/contacts", icon: Users },
    { title: "WhatsApp Templates", href: "/templates", icon: FileText },
    { title: "Broadcast Campaigns", href: "/campaigns", icon: Send },
    { title: "Team & Agents", href: "/team", icon: UserCog },
    { title: "Automation & Workflows", href: "/automation", icon: GitBranch },
    { title: "Settings & Profile", href: "/settings", icon: Settings },
  ];

  // Slice a subset of conversations and contacts for search efficiency
  const searchConversations = React.useMemo(() => mockConversations.slice(0, 10), []);
  const searchContacts = React.useMemo(() => mockContacts.slice(0, 10), []);

  return (
    <CommandDialog
      open={commandOpen}
      onOpenChange={setCommandOpen}
      title="Quick Navigation"
      description="Search across pages, chats, and CRM contacts"
    >
      <CommandInput placeholder="Type a command, page, or search query..." />
      <CommandList>
        <CommandEmpty>No results found for your search.</CommandEmpty>

        {/* Navigation Pages */}
        <CommandGroup heading="Pages & Modules">
          {pages.map((p) => {
            const Icon = p.icon;
            return (
              <CommandItem
                key={p.href}
                value={`page ${p.title}`}
                onSelect={() => handleSelect(p.href)}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="size-4 text-emerald-500" />
                  <span>{p.title}</span>
                </div>
                <ArrowRight className="size-3 text-muted-foreground opacity-60" />
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        {/* Recent Conversations */}
        <CommandGroup heading="Recent Conversations">
          {searchConversations.map((conv) => (
            <CommandItem
              key={conv.id}
              value={`chat conversation ${conv.contact?.name || ""} ${conv.contact?.phone || ""} ${conv.lastMessage?.content?.text || ""}`}
              onSelect={() => handleSelect(`/inbox?conversationId=${conv.id}`)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <MessageSquare className="size-4 text-blue-500 shrink-0" />
                <div className="flex flex-col truncate">
                  <span className="text-sm font-medium truncate">
                    {conv.contact?.name ?? "Unknown Contact"}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {conv.lastMessage?.content?.text ??
                      conv.lastMessage?.content?.caption ??
                      formatPhone(conv.contact?.phone || "")}
                  </span>
                </div>
              </div>
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold shrink-0">
                {conv.status}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* Contacts */}
        <CommandGroup heading="Contacts">
          {searchContacts.map((contact) => (
            <CommandItem
              key={contact.id}
              value={`contact ${contact.name} ${contact.phone} ${contact.email || ""}`}
              onSelect={() => handleSelect(`/contacts?contactId=${contact.id}`)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <User className="size-4 text-purple-500 shrink-0" />
                <div className="flex flex-col truncate">
                  <span className="text-sm font-medium truncate">{contact.name}</span>
                  <span className="text-xs text-muted-foreground truncate">
                    {contact.email ?? formatPhone(contact.phone)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                <Phone className="size-3" />
                <span>{formatPhone(contact.phone)}</span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
