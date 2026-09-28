"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import {
  Send,
  Megaphone,
  Eye,
  Copy,
  Ban,
  Trash2,
  MoreHorizontal,
  ExternalLink,
  Users,
  Search,
  CheckCircle2,
  Clock,
  Radio,
} from "lucide-react";
import { toast } from "sonner";

import {
  queryKeys,
  fetchCampaigns,
  duplicateCampaign,
  cancelCampaign,
  deleteCampaign,
} from "@/lib/api";
import { Campaign, CampaignFilters, CampaignStatus } from "@/lib/types";
import { formatRelativeTime, cn } from "@/lib/utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/crm/StatusBadge";
import { SearchBar } from "@/components/shared/SearchBar";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function CampaignsTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // Read URL search params
  const statusParam = searchParams.get("status") as CampaignStatus | null;
  const search = searchParams.get("search") || "";

  // Filters for query
  const filters: CampaignFilters = React.useMemo(
    () => ({
      status: statusParam && (statusParam as string) !== "all" ? statusParam : undefined,
      search: search || undefined,
    }),
    [statusParam, search],
  );

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
      router.push(`/campaigns?${next.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const hasActiveFilters = Boolean(
    (search && search.trim().length > 0) || (statusParam && (statusParam as string) !== "all"),
  );

  const handleClearAllFilters = React.useCallback(() => {
    updateUrlParams({
      search: null,
      status: null,
    });
  }, [updateUrlParams]);

  // Query
  const { data: campaignsData, isLoading } = useQuery({
    queryKey: queryKeys.campaigns.list(filters),
    queryFn: () => fetchCampaigns(filters),
  });

  const campaigns = React.useMemo(() => campaignsData?.data || [], [campaignsData]);

  // Delete State & Mutation
  const [deleteTarget, setDeleteTarget] = React.useState<Campaign | null>(null);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.all });
      toast.success("Campaign deleted");
      setDeleteTarget(null);
    },
    onError: () => {
      toast.error("Failed to delete campaign");
    },
  });

  // Duplicate Mutation
  const duplicateMutation = useMutation({
    mutationFn: (id: string) => duplicateCampaign(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.all });
      toast.success(`Duplicated as "${res.data.name}"`);
    },
    onError: () => {
      toast.error("Failed to duplicate campaign");
    },
  });

  // Cancel Mutation
  const cancelMutation = useMutation({
    mutationFn: (id: string) => cancelCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.all });
      toast.success("Scheduled campaign cancelled");
    },
    onError: () => {
      toast.error("Failed to cancel campaign");
    },
  });

  // Columns definition
  const columns = React.useMemo<ColumnDef<Campaign>[]>(() => {
    return [
      // 1. Campaign Name
      {
        accessorKey: "name",
        header: "Campaign Name",
        cell: ({ row }) => {
          const c = row.original;
          return (
            <Link href={`/campaigns/${c.id}`} className="group/name block text-left">
              <div className="font-semibold text-sm text-foreground truncate max-w-[240px] group-hover/name:text-primary transition-colors">
                {c.name}
              </div>
              <div className="text-[11px] text-muted-foreground font-mono">{c.id}</div>
            </Link>
          );
        },
      },

      // 2. Template Name (linked)
      {
        accessorKey: "templateId",
        header: "Template",
        cell: ({ row }) => {
          const c = row.original;
          const templateName = c.template?.displayName || c.templateId || "—";

          return (
            <Link
              href={`/templates/${c.templateId}`}
              className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline max-w-[180px] truncate font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="truncate">{templateName}</span>
              <ExternalLink className="size-3 shrink-0 opacity-70" />
            </Link>
          );
        },
      },

      // 3. Status
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} variant="campaign" />,
      },

      // 4. Audience Count
      {
        accessorKey: "audienceCount",
        header: "Audience",
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-xs text-foreground">
            <Users className="size-3.5 text-muted-foreground" />
            <span className="font-medium font-mono">
              {row.original.audienceCount.toLocaleString()}
            </span>
          </div>
        ),
      },

      // 5. Sent / Delivered / Read (Compact Stats)
      {
        id: "stats",
        header: "Delivery Stats",
        cell: ({ row }) => {
          const stats = row.original.stats;
          if (!stats || row.original.status === "draft") {
            return <span className="text-xs text-muted-foreground italic">Draft</span>;
          }

          const sent = stats.sent || 0;
          const delivPct = sent > 0 ? ((stats.delivered / sent) * 100).toFixed(0) : "0";
          const readPct = sent > 0 ? ((stats.read / sent) * 100).toFixed(0) : "0";

          return (
            <div className="text-[11px] space-y-0.5 whitespace-nowrap">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Sent:</span>
                <span className="font-semibold text-foreground">{sent.toLocaleString()}</span>
                <span className="text-muted-foreground/60">•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  {delivPct}% deliv.
                </span>
                <span className="text-muted-foreground/60">•</span>
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  {readPct}% read
                </span>
              </div>
            </div>
          );
        },
      },

      // 6. Scheduled/Sent Date
      {
        id: "date",
        header: "Date",
        cell: ({ row }) => {
          const c = row.original;
          const dateStr = c.sentAt || c.scheduledAt || c.createdAt;
          const isScheduled = c.status === "scheduled" && c.scheduledAt;

          return (
            <div className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
              {isScheduled ? (
                <>
                  <Clock className="size-3 text-blue-500 shrink-0" />
                  <span>Sch: {formatRelativeTime(c.scheduledAt!)}</span>
                </>
              ) : (
                <span>{dateStr ? formatRelativeTime(dateStr) : "—"}</span>
              )}
            </div>
          );
        },
      },

      // 7. Actions Dropdown
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const c = row.original;
          const isScheduled = c.status === "scheduled";
          const isDraft = c.status === "draft";

          return (
            <div className="flex justify-end pr-2" onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-foreground"
                    aria-label={`Actions for ${c.name}`}
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 shadow-lg border-border">
                  <DropdownMenuItem
                    onClick={() => router.push(`/campaigns/${c.id}`)}
                    className="text-xs cursor-pointer gap-2"
                  >
                    <Eye className="size-3.5 text-primary" />
                    <span>View Detail</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => duplicateMutation.mutate(c.id)}
                    className="text-xs cursor-pointer gap-2"
                  >
                    <Copy className="size-3.5 text-amber-500" />
                    <span>Duplicate</span>
                  </DropdownMenuItem>

                  {isScheduled && (
                    <DropdownMenuItem
                      onClick={() => cancelMutation.mutate(c.id)}
                      className="text-xs cursor-pointer gap-2 text-amber-600 dark:text-amber-400"
                    >
                      <Ban className="size-3.5" />
                      <span>Cancel</span>
                    </DropdownMenuItem>
                  )}

                  {isDraft && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setDeleteTarget(c)}
                        className="text-xs cursor-pointer gap-2 text-destructive focus:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
        enableSorting: false,
      },
    ];
  }, [router, duplicateMutation, cancelMutation]);

  const table = useReactTable({
    data: campaigns,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4 w-full">
      {/* Filters row: Search + Status Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="flex-1 max-w-sm">
          <SearchBar
            value={search}
            onChange={(val) => updateUrlParams({ search: val })}
            placeholder="Search campaigns..."
            className="w-full"
          />
        </div>

        {/* Filter Tabs */}
        <Tabs
          value={statusParam || "all"}
          onValueChange={(val) => updateUrlParams({ status: val })}
          className="w-auto"
        >
          <TabsList className="h-9 bg-muted/60 p-0.5">
            <TabsTrigger value="all" className="text-xs font-medium py-1 px-3">
              All
            </TabsTrigger>
            <TabsTrigger value="sent" className="text-xs font-medium py-1 px-3">
              Sent
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="text-xs font-medium py-1 px-3">
              Scheduled
            </TabsTrigger>
            <TabsTrigger value="draft" className="text-xs font-medium py-1 px-3">
              Draft
            </TabsTrigger>
            <TabsTrigger value="failed" className="text-xs font-medium py-1 px-3">
              Failed
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main DataTable */}
      <div className="rounded-lg border border-border bg-card overflow-hidden shadow-2xs">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/40 hover:bg-muted/40">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-xs font-semibold py-3">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="space-y-1">
                      <Skeleton className="h-3.5 w-36" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-3.5 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-3.5 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-44" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-3 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="size-8 rounded-md float-right mr-2" />
                  </TableCell>
                </TableRow>
              ))
            ) : campaigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="py-12 text-center">
                  {hasActiveFilters ? (
                    <EmptyState
                      icon={Search}
                      title="No campaigns match"
                      description="Try adjusting your search or filters"
                      actionLabel="Clear Filters"
                      onAction={handleClearAllFilters}
                      className="border-none bg-transparent min-h-[220px]"
                    />
                  ) : (
                    <EmptyState
                      icon={Megaphone}
                      title="No campaigns yet"
                      description="Send your first bulk message to engage your WhatsApp audience"
                      actionLabel="Create Campaign"
                      onAction={() => router.push("/campaigns/new")}
                      className="border-none bg-transparent min-h-[220px]"
                    />
                  )}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => router.push(`/campaigns/${row.original.id}`)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Campaign"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => {
          if (deleteTarget) {
            deleteMutation.mutate(deleteTarget.id);
          }
        }}
        destructive
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
