"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import {
  LayoutGrid,
  List,
  BarChart3,
  Clock,
  MoreHorizontal,
  Trash2,
  Edit,
  Eye,
  Copy,
  Search,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

import { queryKeys, fetchTemplates, deleteTemplate } from "@/lib/api";
import {
  Template,
  TemplateFilters,
  TemplateStatus,
  TemplateCategory,
  TemplateQualityScore,
} from "@/lib/types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { TemplateCard } from "./TemplateCard";

// ─── Quality Dot Colors ────────────────────────────────────────
const qualityDotColor: Record<TemplateQualityScore, string> = {
  green: "bg-emerald-500",
  yellow: "bg-amber-500",
  red: "bg-red-500",
  unknown: "bg-zinc-400",
};

// ─── Category Badge Styling ────────────────────────────────────
const categoryColors: Record<string, string> = {
  marketing: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/25",
  utility: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/25",
  authentication: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/25",
};

export function TemplateListView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // ─── Read URL State ────────────────────────────────────────────
  const statusParam = searchParams.get("status") as TemplateStatus | null;
  const categoryParam = searchParams.get("category") as TemplateCategory | null;
  const search = searchParams.get("search") || "";
  const viewMode = (searchParams.get("view") as "grid" | "list") || "grid";

  // ─── Construct Filters ────────────────────────────────────────
  const filters: TemplateFilters = React.useMemo(
    () => ({
      status: statusParam && (statusParam as string) !== "all" ? statusParam : undefined,
      category: categoryParam && (categoryParam as string) !== "all" ? categoryParam : undefined,
      search: search || undefined,
    }),
    [statusParam, categoryParam, search],
  );

  // ─── URL Helpers ──────────────────────────────────────────────
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
      router.push(`/templates?${next.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const hasActiveFilters = Boolean(
    (search && search.trim().length > 0) ||
    (statusParam && (statusParam as string) !== "all") ||
    (categoryParam && (categoryParam as string) !== "all"),
  );

  const handleClearAllFilters = React.useCallback(() => {
    updateUrlParams({
      search: null,
      status: null,
      category: null,
    });
  }, [updateUrlParams]);

  // ─── Query ────────────────────────────────────────────────────
  const { data: templatesData, isLoading } = useQuery({
    queryKey: queryKeys.templates.list(filters),
    queryFn: () => fetchTemplates(filters),
  });

  const templates = React.useMemo(() => templatesData?.data || [], [templatesData]);

  // ─── Delete State + Mutation ──────────────────────────────────
  const [deleteTarget, setDeleteTarget] = React.useState<Template | null>(null);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.all });
      toast.success("Template deleted");
      setDeleteTarget(null);
    },
    onError: () => {
      toast.error("Failed to delete template");
    },
  });

  // ─── Navigate to template detail ──────────────────────────────
  const handleTemplateClick = React.useCallback(
    (template: Template) => {
      router.push(`/templates/${template.id}`);
    },
    [router],
  );

  // ─── Table Columns (List View) ───────────────────────────────
  const columns = React.useMemo<ColumnDef<Template>[]>(() => {
    return [
      // Name
      {
        accessorKey: "displayName",
        header: "Name",
        cell: ({ row }) => {
          const t = row.original;
          return (
            <button
              type="button"
              onClick={() => handleTemplateClick(t)}
              className="text-left group/name"
            >
              <div className="font-semibold text-sm text-foreground truncate max-w-[220px] group-hover/name:text-primary transition-colors">
                {t.displayName}
              </div>
              <div className="text-[11px] text-muted-foreground font-mono">{t.name}</div>
            </button>
          );
        },
      },

      // Category
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
          const cat = row.original.category;
          const label = cat.charAt(0).toUpperCase() + cat.slice(1);
          return (
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] px-2 py-0 font-medium rounded-full shadow-none",
                categoryColors[cat] ?? categoryColors.utility,
              )}
            >
              {label}
            </Badge>
          );
        },
      },

      // Language
      {
        accessorKey: "language",
        header: "Language",
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground font-medium uppercase">
            {row.original.language}
          </span>
        ),
      },

      // Status
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} variant="template" />,
      },

      // Quality
      {
        id: "quality",
        header: "Quality",
        cell: ({ row }) => {
          const qs = row.original.qualityScore || "unknown";
          return (
            <div className="flex items-center gap-1.5">
              <span className={cn("size-2 rounded-full", qualityDotColor[qs])} />
              <span className="text-xs text-muted-foreground capitalize">{qs}</span>
            </div>
          );
        },
      },

      // Usage Count
      {
        id: "usageCount",
        header: "Usage",
        cell: ({ row }) => (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <BarChart3 className="size-3 text-emerald-500/70" />
            <span className="font-medium">{row.original.usageCount.toLocaleString()}</span>
          </div>
        ),
      },

      // Last Used
      {
        id: "lastUsed",
        header: "Last Used",
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {row.original.lastUsedAt ? formatRelativeTime(row.original.lastUsedAt) : "—"}
          </span>
        ),
      },

      // Actions
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const t = row.original;
          return (
            <div className="flex justify-end pr-2" onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-foreground"
                    aria-label={`Actions for ${t.displayName}`}
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 shadow-lg border-border">
                  <DropdownMenuItem
                    onClick={() => handleTemplateClick(t)}
                    className="text-xs cursor-pointer gap-2"
                  >
                    <Eye className="size-3.5 text-primary" />
                    <span>View</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => toast.info("Template editor coming in v1.1")}
                    className="text-xs cursor-pointer gap-2"
                  >
                    <Edit className="size-3.5 text-blue-500" />
                    <span>Edit</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => {
                      navigator.clipboard.writeText(t.name);
                      toast.success("Template name copied");
                    }}
                    className="text-xs cursor-pointer gap-2"
                  >
                    <Copy className="size-3.5 text-amber-500" />
                    <span>Copy Name</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => setDeleteTarget(t)}
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
  }, [handleTemplateClick]);

  const table = useReactTable({
    data: templates,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // ─── Skeleton Renderers ───────────────────────────────────────
  const gridSkeletons = (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-4 space-y-3">
          <Skeleton className="h-4 w-3/5" />
          <div className="flex gap-1.5">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-10 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
          <div className="pt-3 border-t border-border/60 flex justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  );

  const listSkeletons = (
    <div className="rounded-lg border border-border bg-card overflow-hidden shadow-2xs">
      <div className="h-11 bg-muted/40 border-b border-border flex items-center px-4 gap-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="divide-y divide-border/60">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-14 px-4 flex items-center gap-6">
            <div className="space-y-1 w-44">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="size-8 rounded-md ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4 w-full">
      {/* ─── Filter Row ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="flex-1 max-w-sm">
          <SearchBar
            value={search}
            onChange={(val) => updateUrlParams({ search: val })}
            placeholder="Search templates..."
            className="w-full"
          />
        </div>

        {/* Status + Category + View Toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Tabs */}
          <Tabs
            value={statusParam || "all"}
            onValueChange={(val) => updateUrlParams({ status: val })}
            className="w-auto"
          >
            <TabsList className="h-9 bg-muted/60 p-0.5">
              <TabsTrigger value="all" className="text-xs font-medium py-1 px-3">
                All
              </TabsTrigger>
              <TabsTrigger value="approved" className="text-xs font-medium py-1 px-3">
                Approved
              </TabsTrigger>
              <TabsTrigger value="pending" className="text-xs font-medium py-1 px-3">
                Pending
              </TabsTrigger>
              <TabsTrigger value="rejected" className="text-xs font-medium py-1 px-3">
                Rejected
              </TabsTrigger>
              <TabsTrigger value="draft" className="text-xs font-medium py-1 px-3">
                Draft
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Category Dropdown */}
          <Select
            value={categoryParam || "all"}
            onValueChange={(val) => updateUrlParams({ category: val })}
          >
            <SelectTrigger className="h-9 w-[140px] text-xs border-border">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">
                All Categories
              </SelectItem>
              <SelectItem value="marketing" className="text-xs">
                Marketing
              </SelectItem>
              <SelectItem value="utility" className="text-xs">
                Utility
              </SelectItem>
              <SelectItem value="authentication" className="text-xs">
                Authentication
              </SelectItem>
            </SelectContent>
          </Select>

          {/* View Toggle */}
          <div className="flex items-center rounded-md border border-border bg-muted/40 p-0.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => updateUrlParams({ view: "grid" })}
              className={cn(
                "size-8 rounded-sm",
                viewMode === "grid" && "bg-background shadow-xs text-foreground",
              )}
              aria-label="Grid view"
            >
              <LayoutGrid className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => updateUrlParams({ view: "list" })}
              className={cn(
                "size-8 rounded-sm",
                viewMode === "list" && "bg-background shadow-xs text-foreground",
              )}
              aria-label="List view"
            >
              <List className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* ─── Content Area ───────────────────────────────────────── */}
      {isLoading ? (
        viewMode === "grid" ? (
          gridSkeletons
        ) : (
          listSkeletons
        )
      ) : templates.length === 0 ? (
        hasActiveFilters ? (
          <EmptyState
            icon={Search}
            title="No templates match"
            description="Try adjusting your search or filters"
            actionLabel="Clear Filters"
            onAction={handleClearAllFilters}
          />
        ) : (
          <EmptyState
            icon={FileText}
            title="Create your first template"
            description="Templates let you send pre-approved messages"
            actionLabel="Create Template"
            onAction={() => router.push("/templates/new")}
          />
        )
      ) : viewMode === "grid" ? (
        /* ─── Grid View ─────────────────────────────────────────── */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onClick={() => handleTemplateClick(template)}
            />
          ))}
        </div>
      ) : (
        /* ─── List View (DataTable) ─────────────────────────────── */
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
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => handleTemplateClick(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* ─── Delete Confirm Dialog ──────────────────────────────── */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Template"
        description={`Are you sure you want to delete "${deleteTarget?.displayName}"? This action cannot be undone.`}
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
