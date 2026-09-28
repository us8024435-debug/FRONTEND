"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import Link from "next/link";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  Trash2,
  Tag as TagIcon,
  Check,
  CheckSquare,
  MessageSquare,
  Edit,
  User,
  Users,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/EmptyState";

import {
  queryKeys,
  fetchContacts,
  fetchAgents,
  fetchTags,
  deleteContact,
  addContactTag,
  removeContactTag,
} from "@/lib/api";
import { Contact, ContactFilters, ContactStatus } from "@/lib/types";
import { formatPhone, formatRelativeTime, cn } from "@/lib/utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/crm/StatusBadge";
import { SearchBar } from "@/components/shared/SearchBar";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ContactFormSheet } from "./ContactFormSheet";

export function ContactsTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // Read state from URL searchParams
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 25;
  const search = searchParams.get("search") || "";
  const statusParam = searchParams.get("status") as ContactStatus | null;
  const tagsParam = searchParams.get("tags") || "";
  const sortBy = searchParams.get("sortBy") || "updatedAt";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

  const selectedTagIds = React.useMemo(() => {
    return tagsParam ? tagsParam.split(",").filter(Boolean) : [];
  }, [tagsParam]);

  // Construct filters for Query
  const filters: ContactFilters = React.useMemo(
    () => ({
      page,
      pageSize,
      search: search || undefined,
      status: statusParam && (statusParam as string) !== "all" ? statusParam : undefined,
      tags: selectedTagIds.length > 0 ? selectedTagIds : undefined,
      sortBy,
      sortOrder,
    }),
    [page, pageSize, search, statusParam, selectedTagIds, sortBy, sortOrder],
  );

  // Helper to push URL query updates
  const updateUrlParams = React.useCallback(
    (updates: Record<string, string | null | undefined>) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, val]) => {
        if (val === null || val === undefined || val === "" || val === "all") {
          next.delete(key);
        } else {
          next.set(key, val);
        }
      });
      if (!("page" in updates)) {
        next.set("page", "1");
      }
      router.push(`/contacts?${next.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  // Queries
  const { data: contactsData, isLoading } = useQuery({
    queryKey: queryKeys.contacts.list(filters),
    queryFn: () => fetchContacts(filters),
  });

  const { data: agentsData } = useQuery({
    queryKey: queryKeys.agents.list(),
    queryFn: () => fetchAgents(),
  });
  const agents = React.useMemo(() => agentsData?.data || [], [agentsData]);

  const { data: tagsData } = useQuery({
    queryKey: queryKeys.tags.list(),
    queryFn: () => fetchTags(),
  });
  const availableTags = React.useMemo(() => tagsData?.data || [], [tagsData]);

  const contacts = React.useMemo(() => contactsData?.data || [], [contactsData]);
  const pagination = contactsData?.pagination;
  const totalCount = pagination?.total ?? contacts.length;
  const totalPages = pagination?.totalPages ?? 1;

  // Single Delete state
  const [deleteTarget, setDeleteTarget] = React.useState<Contact | null>(null);

  // Edit Contact Sheet state
  const [editTarget, setEditTarget] = React.useState<Contact | null>(null);

  // Bulk Delete state
  const [bulkDeleteOpen, setBulkDeleteOpen] = React.useState(false);

  // Add Contact Sheet state
  const [addSheetOpen, setAddSheetOpen] = React.useState(false);

  const hasActiveFilters = Boolean(
    (search && search.trim().length > 0) ||
    (statusParam && (statusParam as string) !== "all") ||
    selectedTagIds.length > 0,
  );

  const handleClearAllFilters = React.useCallback(() => {
    updateUrlParams({
      search: null,
      status: null,
      tags: null,
      page: "1",
    });
  }, [updateUrlParams]);

  // Row Selection state
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});

  // Single Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.all });
      toast.success("Contact deleted");
      setDeleteTarget(null);
    },
    onError: () => {
      toast.error("Failed to delete contact");
    },
  });

  // Table Columns Definition
  const columns = React.useMemo<ColumnDef<Contact>[]>(() => {
    return [
      // 1. Checkbox Column
      {
        id: "select",
        header: ({ table }) => (
          <div className="flex items-center justify-center pl-2">
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Select all contacts"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div
            className="flex items-center justify-center pl-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select contact"
            />
          </div>
        ),
        enableSorting: false,
      },

      // 2. Name + Avatar
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
          const contact = row.original;
          const initials = contact.name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();

          return (
            <Link
              href={`/contacts/${contact.id}`}
              className="flex items-center gap-3 group/name hover:opacity-85 transition-opacity"
            >
              <Avatar className="size-9 ring-1 ring-border shadow-2xs group-hover/name:ring-primary/40 transition-colors">
                <AvatarImage src={contact.avatarUrl} alt={contact.name} />
                <AvatarFallback className="text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  {initials || "WA"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="font-semibold text-foreground text-xs sm:text-sm truncate group-hover/name:text-primary transition-colors">
                  {contact.name}
                </div>
                <div className="text-[11px] text-muted-foreground font-mono">
                  {formatPhone(contact.phone)}
                </div>
              </div>
            </Link>
          );
        },
      },

      // 3. Email
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground truncate max-w-[160px] block">
            {row.original.email || "—"}
          </span>
        ),
      },

      // 4. Status
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} variant="contact" />,
      },

      // 5. Tags
      {
        id: "tags",
        header: "Tags",
        cell: ({ row }) => {
          const tags = row.original.tags || [];
          if (tags.length === 0) {
            return <span className="text-xs text-muted-foreground/60">—</span>;
          }
          const visible = tags.slice(0, 3);
          const remainder = tags.length - 3;

          return (
            <div className="flex items-center gap-1 flex-wrap">
              {visible.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium border"
                  style={{
                    backgroundColor: `${tag.color || "#3B82F6"}15`,
                    color: tag.color || "#3B82F6",
                    borderColor: `${tag.color || "#3B82F6"}30`,
                  }}
                >
                  {tag.name}
                </span>
              ))}
              {remainder > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
                  +{remainder}
                </span>
              )}
            </div>
          );
        },
      },

      // 6. Assigned Agent
      {
        accessorKey: "assignedAgentId",
        header: "Assigned Agent",
        cell: ({ row }) => {
          const agentId = row.original.assignedAgentId;
          const agent = agents.find((a) => a.id === agentId);

          if (!agent) {
            return <span className="text-xs text-muted-foreground italic">Unassigned</span>;
          }

          return (
            <div className="flex items-center gap-2 text-xs text-foreground">
              <Avatar className="size-5 shrink-0 ring-1 ring-border">
                <AvatarImage src={agent.avatarUrl} alt={agent.name} />
                <AvatarFallback className="text-[9px]">
                  {agent.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="truncate max-w-[110px] font-medium">{agent.name}</span>
            </div>
          );
        },
      },

      // 7. Last Message Time
      {
        id: "lastMessage",
        header: "Last Active",
        cell: ({ row }) => {
          const time = row.original.lastMessageAt || row.original.updatedAt;
          return (
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {time ? formatRelativeTime(time) : "—"}
            </span>
          );
        },
      },

      // 8. Row Actions Dropdown
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const contact = row.original;

          return (
            <div className="flex justify-end pr-2" onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-foreground"
                    aria-label={`Actions for ${contact.name}`}
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 shadow-lg border-border">
                  <DropdownMenuItem
                    onClick={() => router.push(`/contacts/${contact.id}`)}
                    className="text-xs cursor-pointer gap-2"
                  >
                    <User className="size-3.5 text-primary" />
                    <span>View Profile</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => router.push(`/inbox?id=conv_${contact.id}`)}
                    className="text-xs cursor-pointer gap-2"
                  >
                    <MessageSquare className="size-3.5 text-emerald-500" />
                    <span>View Conversation</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => setEditTarget(contact)}
                    className="text-xs cursor-pointer gap-2"
                  >
                    <Edit className="size-3.5 text-blue-500" />
                    <span>Edit Contact</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => setDeleteTarget(contact)}
                    className="text-xs cursor-pointer gap-2 text-destructive focus:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
        enableSorting: false,
      },
    ];
  }, [agents, router]);

  // TanStack Table Instance
  const table = useReactTable({
    data: contacts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  const selectedRows = table.getSelectedRowModel().rows;
  const selectedContacts = selectedRows.map((r) => r.original);

  // Sorting Header Click Handler
  const handleSortClick = (columnId: string) => {
    if (sortBy === columnId) {
      updateUrlParams({
        sortBy: columnId,
        sortOrder: sortOrder === "asc" ? "desc" : "asc",
      });
    } else {
      updateUrlParams({
        sortBy: columnId,
        sortOrder: "asc",
      });
    }
  };

  // Bulk Actions
  const handleBulkAddTag = async (tagId: string) => {
    try {
      await Promise.all(selectedContacts.map((c) => addContactTag(c.id, tagId)));
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.all });
      toast.success(`Tag added to ${selectedContacts.length} contacts`);
      setRowSelection({});
    } catch {
      toast.error("Failed to add tag to selected contacts");
    }
  };

  const handleBulkRemoveTag = async (tagId: string) => {
    try {
      await Promise.all(selectedContacts.map((c) => removeContactTag(c.id, tagId)));
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.all });
      toast.success(`Tag removed from ${selectedContacts.length} contacts`);
      setRowSelection({});
    } catch {
      toast.error("Failed to remove tag from selected contacts");
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedContacts.map((c) => deleteContact(c.id)));
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.all });
      toast.success(`Deleted ${selectedContacts.length} contacts`);
      setRowSelection({});
      setBulkDeleteOpen(false);
    } catch {
      toast.error("Failed to delete selected contacts");
    }
  };

  // Toggle Tag in Multi-select Filter
  const handleTagFilterToggle = (tagId: string) => {
    const nextTags = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter((t) => t !== tagId)
      : [...selectedTagIds, tagId];
    updateUrlParams({ tags: nextTags.join(",") });
  };

  return (
    <div className="space-y-4 w-full">
      {/* 1. Filter Row: SearchBar + Status Tabs + Tag Multi-select Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="flex-1 max-w-sm">
          <SearchBar
            value={search}
            onChange={(val) => updateUrlParams({ search: val })}
            placeholder="Search by name, phone, or email..."
            className="w-full"
          />
        </div>

        {/* Status Tabs + Tag Filter Popover */}
        <div className="flex items-center gap-2 flex-wrap">
          <Tabs
            value={statusParam || "all"}
            onValueChange={(val) => updateUrlParams({ status: val })}
            className="w-auto"
          >
            <TabsList className="h-9 bg-muted/60 p-0.5">
              <TabsTrigger value="all" className="text-xs font-medium py-1 px-3">
                All
              </TabsTrigger>
              <TabsTrigger value="active" className="text-xs font-medium py-1 px-3">
                Active
              </TabsTrigger>
              <TabsTrigger value="inactive" className="text-xs font-medium py-1 px-3">
                Inactive
              </TabsTrigger>
              <TabsTrigger value="blocked" className="text-xs font-medium py-1 px-3">
                Blocked
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Tags Multi-select Filter Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-9 text-xs border-border gap-1.5",
                  selectedTagIds.length > 0 &&
                    "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
                )}
              >
                <TagIcon className="size-3.5" />
                <span>Tags</span>
                {selectedTagIds.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="size-4 p-0 text-[10px] rounded-full flex items-center justify-center ml-0.5"
                  >
                    {selectedTagIds.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 p-0 shadow-lg border-border">
              <Command>
                <CommandInput placeholder="Filter by tag..." className="h-8 text-xs" />
                <CommandList>
                  <CommandEmpty className="py-3 text-center text-xs text-muted-foreground">
                    No tags found.
                  </CommandEmpty>
                  <CommandGroup heading="Select Tags">
                    {availableTags.map((tag) => {
                      const isSelected = selectedTagIds.includes(tag.id);
                      return (
                        <CommandItem
                          key={tag.id}
                          value={tag.name}
                          onSelect={() => handleTagFilterToggle(tag.id)}
                          className="flex items-center gap-2 cursor-pointer text-xs py-1.5 px-2"
                        >
                          <div
                            className={cn(
                              "size-4 rounded-xs border flex items-center justify-center transition-colors",
                              isSelected
                                ? "bg-emerald-600 border-emerald-600 text-white"
                                : "border-muted-foreground/40",
                            )}
                          >
                            {isSelected && <Check className="size-3" />}
                          </div>
                          <span
                            className="size-2 rounded-full shrink-0"
                            style={{ backgroundColor: tag.color }}
                          />
                          <span className="flex-1 truncate">{tag.name}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* 2. Bulk Actions Bar (Appears when rows selected) */}
      {selectedContacts.length > 0 && (
        <div className="flex items-center justify-between p-2.5 px-4 rounded-lg bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <CheckSquare className="size-4 text-emerald-600 dark:text-emerald-400" />
            <span>{selectedContacts.length} contact(s) selected</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Bulk Add Tag */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs border-emerald-500/30 bg-background/80 hover:bg-background gap-1"
                >
                  <TagIcon className="size-3 text-emerald-600" />
                  <span>Add Tag</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-52 p-0 shadow-lg border-border">
                <Command>
                  <CommandInput placeholder="Choose tag..." className="h-8 text-xs" />
                  <CommandList>
                    <CommandEmpty className="py-2 text-center text-xs text-muted-foreground">
                      No tags.
                    </CommandEmpty>
                    <CommandGroup heading="Add Tag to Selected">
                      {availableTags.map((tag) => (
                        <CommandItem
                          key={tag.id}
                          value={tag.name}
                          onSelect={() => handleBulkAddTag(tag.id)}
                          className="flex items-center gap-2 cursor-pointer text-xs"
                        >
                          <span
                            className="size-2 rounded-full"
                            style={{ backgroundColor: tag.color }}
                          />
                          <span>{tag.name}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Bulk Remove Tag */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs border-emerald-500/30 bg-background/80 hover:bg-background gap-1"
                >
                  <TagIcon className="size-3 text-rose-500" />
                  <span>Remove Tag</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-52 p-0 shadow-lg border-border">
                <Command>
                  <CommandInput placeholder="Choose tag to remove..." className="h-8 text-xs" />
                  <CommandList>
                    <CommandEmpty className="py-2 text-center text-xs text-muted-foreground">
                      No tags.
                    </CommandEmpty>
                    <CommandGroup heading="Remove Tag from Selected">
                      {availableTags.map((tag) => (
                        <CommandItem
                          key={tag.id}
                          value={tag.name}
                          onSelect={() => handleBulkRemoveTag(tag.id)}
                          className="flex items-center gap-2 cursor-pointer text-xs"
                        >
                          <span
                            className="size-2 rounded-full"
                            style={{ backgroundColor: tag.color }}
                          />
                          <span>{tag.name}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Bulk Delete */}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setBulkDeleteOpen(true)}
              className="h-7 text-xs gap-1"
            >
              <Trash2 className="size-3" />
              <span>Delete</span>
            </Button>

            {/* Clear Selection */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRowSelection({})}
              className="h-7 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* 3. Main Data Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden shadow-2xs">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/40 hover:bg-muted/40">
                {headerGroup.headers.map((header) => {
                  const canSort =
                    header.column.getCanSort() && header.id !== "select" && header.id !== "actions";
                  const isSorted = sortBy === header.id;

                  return (
                    <TableHead key={header.id} className="text-xs font-semibold py-3">
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          onClick={() => handleSortClick(header.id)}
                          className="flex items-center gap-1.5 select-none hover:text-foreground font-semibold focus-visible:outline-none"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {isSorted && sortOrder === "asc" ? (
                            <ArrowUp className="size-3 text-emerald-500" />
                          ) : isSorted && sortOrder === "desc" ? (
                            <ArrowDown className="size-3 text-emerald-500" />
                          ) : (
                            <ArrowUpDown className="size-3 opacity-30" />
                          )}
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell className="pl-4">
                    <Skeleton className="size-4 rounded-xs" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="size-9 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-3.5 w-28" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-3 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-3 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="size-8 rounded-md float-right mr-2" />
                  </TableCell>
                </TableRow>
              ))
            ) : contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="py-12 text-center">
                  {hasActiveFilters ? (
                    <EmptyState
                      icon={Search}
                      title="No contacts found"
                      description="Try a different search or filter"
                      actionLabel="Clear"
                      onAction={handleClearAllFilters}
                      className="border-none bg-transparent min-h-[200px] p-2"
                    />
                  ) : (
                    <EmptyState
                      icon={Users}
                      title="Add your first contact"
                      description="Import contacts or add them manually"
                      actionLabel="Add Contact"
                      onAction={() => setAddSheetOpen(true)}
                      className="border-none bg-transparent min-h-[200px] p-2"
                    />
                  )}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => router.push(`/contacts/${row.original.id}`)}
                  className="cursor-pointer hover:bg-muted/50 transition-colors animate-in fade-in-50 duration-200"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-xs sm:text-sm py-2.5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 4. Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 text-xs text-muted-foreground">
        <div>
          Showing {Math.min((page - 1) * pageSize + 1, totalCount)}–
          {Math.min(page * pageSize, totalCount)} of {totalCount} contacts
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => updateUrlParams({ page: "1" })}
            disabled={page <= 1}
            aria-label="First page"
          >
            <ChevronsLeft className="size-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => updateUrlParams({ page: String(page - 1) })}
            disabled={page <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="size-3.5" />
          </Button>

          <span className="px-2 text-xs font-medium text-foreground">
            Page {page} of {Math.max(1, totalPages)}
          </span>

          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => updateUrlParams({ page: String(page + 1) })}
            disabled={page >= totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="size-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => updateUrlParams({ page: String(totalPages) })}
            disabled={page >= totalPages}
            aria-label="Last page"
          >
            <ChevronsRight className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Single Delete Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(val) => !val && setDeleteTarget(null)}
        title="Delete Contact"
        description={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone and will remove all message logs.`}
        destructive
        confirmLabel="Delete Contact"
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteMutation.mutateAsync(deleteTarget.id);
          }
        }}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title="Delete Selected Contacts"
        description={`Are you sure you want to delete ${selectedContacts.length} selected contact(s)? This will permanently remove their records and activity logs.`}
        destructive
        confirmLabel={`Delete ${selectedContacts.length} Contacts`}
        onConfirm={handleBulkDelete}
      />

      {/* Edit Contact Drawer */}
      <ContactFormSheet
        open={Boolean(editTarget)}
        onOpenChange={(val) => !val && setEditTarget(null)}
        contact={editTarget || undefined}
      />

      {/* Add Contact Drawer */}
      <ContactFormSheet open={addSheetOpen} onOpenChange={setAddSheetOpen} />
    </div>
  );
}
