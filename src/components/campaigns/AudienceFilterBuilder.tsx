"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Trash2, Loader2, Users, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SegmentFilter, SegmentConjunction, Tag } from "@/lib/types";
import { queryKeys, fetchTags, estimateAudienceCount } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// ───────────────────────────────────────────────────────
// Field Definitions
// ───────────────────────────────────────────────────────

interface FieldOption {
  value: string;
  label: string;
  type: "string" | "date" | "array" | "select";
  /** For select-type fields, the available choices */
  selectOptions?: { value: string; label: string }[];
}

const FIELD_OPTIONS: FieldOption[] = [
  {
    value: "status",
    label: "Status",
    type: "select",
    selectOptions: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
      { value: "blocked", label: "Blocked" },
    ],
  },
  { value: "tags", label: "Tag", type: "array" },
  { value: "lastMessageAt", label: "Last Message", type: "date" },
  { value: "createdAt", label: "Created Date", type: "date" },
  {
    value: "customAttributes.plan",
    label: "Custom Attribute (Plan)",
    type: "string",
  },
  {
    value: "customAttributes.company",
    label: "Custom Attribute (Company)",
    type: "string",
  },
];

const OPERATORS_BY_TYPE: Record<FieldOption["type"], { value: string; label: string }[]> = {
  string: [
    { value: "is", label: "is" },
    { value: "is_not", label: "is not" },
    { value: "contains", label: "contains" },
    { value: "not_contains", label: "does not contain" },
  ],
  select: [
    { value: "is", label: "is" },
    { value: "is_not", label: "is not" },
  ],
  date: [
    { value: "gt", label: "is after" },
    { value: "lt", label: "is before" },
    { value: "between", label: "is between" },
  ],
  array: [
    { value: "in", label: "includes any of" },
    { value: "not_in", label: "excludes all of" },
  ],
};

// ───────────────────────────────────────────────────────
// Internal row state (easier to manage than SegmentFilter)
// ───────────────────────────────────────────────────────

interface FilterRow {
  id: string;
  field: string;
  operator: string;
  value: string | string[];
}

function makeEmptyRow(): FilterRow {
  return {
    id: crypto.randomUUID(),
    field: "",
    operator: "",
    value: "",
  };
}

function toSegmentFilters(rows: FilterRow[]): SegmentFilter[] {
  return rows
    .filter((r) => r.field && r.operator)
    .map((r) => ({
      id: r.id,
      field: r.field,
      operator: r.operator as SegmentFilter["operator"],
      value: r.value,
    }));
}

// ───────────────────────────────────────────────────────
// Tag Multi-Select
// ───────────────────────────────────────────────────────

function TagMultiSelect({
  value,
  onChange,
  tags,
}: {
  value: string[];
  onChange: (val: string[]) => void;
  tags: Tag[];
}) {
  const selectedTags = tags.filter((t) => value.includes(t.id));

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5 min-h-[32px]">
        {selectedTags.map((tag) => (
          <Badge
            key={tag.id}
            variant="secondary"
            className="text-[10px] gap-1 pl-2 pr-1 py-0.5 cursor-pointer hover:opacity-70 transition-opacity"
            style={{
              backgroundColor: `${tag.color}20`,
              color: tag.color,
              borderColor: `${tag.color}40`,
            }}
            onClick={() => onChange(value.filter((v) => v !== tag.id))}
          >
            {tag.name}
            <span className="text-[10px] opacity-60">×</span>
          </Badge>
        ))}
        {selectedTags.length === 0 && (
          <span className="text-xs text-muted-foreground py-1">Select tags…</span>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5 border-t border-border/50 pt-2">
        {tags
          .filter((t) => !value.includes(t.id))
          .map((tag) => (
            <Badge
              key={tag.id}
              variant="outline"
              className="text-[10px] cursor-pointer hover:shadow-sm transition-all py-0.5"
              style={{ borderColor: `${tag.color}60`, color: tag.color }}
              onClick={() => onChange([...value, tag.id])}
            >
              + {tag.name}
            </Badge>
          ))}
        {tags.filter((t) => !value.includes(t.id)).length === 0 && (
          <span className="text-[10px] text-muted-foreground italic">All tags selected</span>
        )}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────
// Value Input (polymorphic)
// ───────────────────────────────────────────────────────

function FilterValueInput({
  fieldDef,
  value,
  onChange,
  tags,
}: {
  fieldDef: FieldOption | undefined;
  value: string | string[];
  onChange: (v: string | string[]) => void;
  tags: Tag[];
}) {
  if (!fieldDef) {
    return <Input disabled placeholder="Select a field first" className="h-8 text-xs flex-1" />;
  }

  switch (fieldDef.type) {
    case "select":
      return (
        <Select value={typeof value === "string" ? value : ""} onValueChange={(v) => onChange(v)}>
          <SelectTrigger className="h-8 text-xs flex-1 min-w-[130px]">
            <SelectValue placeholder="Select value" />
          </SelectTrigger>
          <SelectContent>
            {fieldDef.selectOptions?.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "array":
      return (
        <div className="flex-1 min-w-[180px]">
          <TagMultiSelect
            value={Array.isArray(value) ? value : []}
            onChange={onChange}
            tags={tags}
          />
        </div>
      );

    case "date":
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "h-8 text-xs flex-1 min-w-[140px] justify-start font-normal",
                !value && "text-muted-foreground",
              )}
            >
              {typeof value === "string" && value
                ? new Date(value).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={typeof value === "string" && value ? new Date(value) : undefined}
              onSelect={(d) => onChange(d?.toISOString() ?? "")}
            />
          </PopoverContent>
        </Popover>
      );

    case "string":
    default:
      return (
        <Input
          placeholder="Enter value"
          className="h-8 text-xs flex-1 min-w-[130px]"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
}

// ───────────────────────────────────────────────────────
// Main Component
// ───────────────────────────────────────────────────────

export interface AudienceFilterBuilderProps {
  onChange: (filters: SegmentFilter[]) => void;
  initialFilters?: SegmentFilter[];
  className?: string;
}

export function AudienceFilterBuilder({
  onChange,
  initialFilters,
  className,
}: AudienceFilterBuilderProps) {
  const [rows, setRows] = React.useState<FilterRow[]>(() => {
    if (initialFilters && initialFilters.length > 0) {
      return initialFilters.map((f) => ({
        id: f.id,
        field: f.field,
        operator: f.operator,
        value: f.value as string | string[],
      }));
    }
    return [makeEmptyRow()];
  });
  const [conjunction, setConjunction] = React.useState<SegmentConjunction>("and");

  // Tags for the tag multi-select
  const { data: tagsResult } = useQuery({
    queryKey: queryKeys.tags.list(),
    queryFn: fetchTags,
  });
  const tags = tagsResult?.data ?? [];

  // Debounced filters for audience estimation
  const [debouncedFilters, setDebouncedFilters] = React.useState<SegmentFilter[]>([]);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout>>(null);

  const validFilters = React.useMemo(() => toSegmentFilters(rows), [rows]);

  // Notify parent whenever rows change
  React.useEffect(() => {
    onChange(validFilters);

    // Debounce the estimate query
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedFilters(validFilters);
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  // Audience count estimation
  const { data: estimateResult, isLoading: isEstimating } = useQuery({
    queryKey: queryKeys.segments.estimate(debouncedFilters),
    queryFn: () => estimateAudienceCount(debouncedFilters),
    enabled: debouncedFilters.length > 0,
  });

  const estimatedCount = estimateResult?.data?.count;

  // ── Row CRUD ──

  const addRow = () => {
    setRows((prev) => [...prev, makeEmptyRow()]);
  };

  const removeRow = (id: string) => {
    setRows((prev) => {
      const next = prev.filter((r) => r.id !== id);
      return next.length === 0 ? [makeEmptyRow()] : next;
    });
  };

  const updateRow = (id: string, patch: Partial<FilterRow>) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;

        const updated = { ...r, ...patch };

        // If field changed, reset operator and value
        if (patch.field && patch.field !== r.field) {
          updated.operator = "";
          updated.value = "";
        }

        return updated;
      }),
    );
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Filter rows */}
      <div className="space-y-2">
        {rows.map((row, index) => {
          const fieldDef = FIELD_OPTIONS.find((f) => f.value === row.field);
          const availableOperators = fieldDef ? OPERATORS_BY_TYPE[fieldDef.type] : [];

          return (
            <React.Fragment key={row.id}>
              {/* Conjunction toggle between rows */}
              {index > 0 && (
                <div className="flex items-center justify-center py-0.5">
                  <button
                    type="button"
                    onClick={() => setConjunction((prev) => (prev === "and" ? "or" : "and"))}
                    className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border-2 transition-all duration-200 select-none",
                      conjunction === "and"
                        ? "border-blue-400/40 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/50"
                        : "border-amber-400/40 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/50",
                    )}
                  >
                    {conjunction}
                  </button>
                </div>
              )}

              {/* Filter row card */}
              <div className="group relative flex items-start gap-2 p-3 rounded-lg border border-border/60 bg-card hover:border-muted-foreground/20 transition-colors">
                {/* Row number indicator */}
                <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-[10px] font-bold text-muted-foreground mt-0.5">
                  {index + 1}
                </div>

                {/* Field selector */}
                <Select value={row.field} onValueChange={(v) => updateRow(row.id, { field: v })}>
                  <SelectTrigger className="h-8 text-xs w-[170px] shrink-0">
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {FIELD_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Operator selector */}
                <Select
                  value={row.operator}
                  onValueChange={(v) => updateRow(row.id, { operator: v })}
                  disabled={!row.field}
                >
                  <SelectTrigger className="h-8 text-xs w-[150px] shrink-0">
                    <SelectValue placeholder="Operator" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableOperators.map((op) => (
                      <SelectItem key={op.value} value={op.value} className="text-xs">
                        {op.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Value input */}
                <FilterValueInput
                  fieldDef={fieldDef}
                  value={row.value}
                  onChange={(v) => updateRow(row.id, { value: v })}
                  tags={tags}
                />

                {/* Remove row */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 opacity-0 group-hover:opacity-100 transition-all"
                  onClick={() => removeRow(row.id)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Footer: Add button + estimate */}
      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-xs gap-1.5 border-dashed"
          onClick={addRow}
        >
          <Plus className="size-3.5" />
          Add Filter
        </Button>

        {/* Live audience count estimate */}
        <div className="flex items-center gap-2">
          {validFilters.length > 0 && (
            <>
              {isEstimating ? (
                <Badge variant="secondary" className="text-[10px] gap-1.5 animate-pulse">
                  <Loader2 className="size-3 animate-spin" />
                  Estimating…
                </Badge>
              ) : estimatedCount !== undefined ? (
                <Badge
                  variant="secondary"
                  className="text-[10px] gap-1.5 font-bold tabular-nums bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40"
                >
                  <Users className="size-3" />~{estimatedCount.toLocaleString()} contacts match
                </Badge>
              ) : null}
            </>
          )}

          {validFilters.length === 0 && (
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Filter className="size-3 opacity-50" />
              Add filters to estimate audience
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
