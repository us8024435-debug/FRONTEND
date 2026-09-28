"use client";

import * as React from "react";
import { Plus, X, Tag as TagIcon, Check } from "lucide-react";
import { Tag } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export interface TagInputProps {
  tags: Tag[];
  onAdd: (tagId: string) => void;
  onRemove: (tagId: string) => void;
  availableTags: Tag[];
  maxTags?: number;
  className?: string;
}

/**
 * Interactive TagInput component styled like GitHub/Linear labels.
 * Supports colored pills, quick removal, and a searchable Popover combobox.
 */
export function TagInput({
  tags = [],
  onAdd,
  onRemove,
  availableTags = [],
  maxTags = 10,
  className,
}: TagInputProps) {
  const [open, setOpen] = React.useState(false);

  // Available tags that haven't been attached to this contact yet
  const unselectedTags = React.useMemo(() => {
    const currentTagIds = new Set(tags.map((t) => t.id));
    return availableTags.filter((t) => !currentTagIds.has(t.id));
  }, [tags, availableTags]);

  const canAddMore = tags.length < maxTags;

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {/* Existing Attached Tags */}
      {tags.map((tag) => {
        const color = tag.color || "#3B82F6";
        return (
          <span
            key={tag.id}
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors group select-none shadow-2xs"
            style={{
              backgroundColor: `${color}18`, // ~10% tint
              borderColor: `${color}40`,
              color: color,
            }}
          >
            <span className="size-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <span className="truncate max-w-[130px] font-medium">{tag.name}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(tag.id);
              }}
              className="opacity-60 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/20 rounded-full p-0.5 transition-all focus:outline-none"
              title={`Remove ${tag.name}`}
              aria-label={`Remove tag ${tag.name}`}
            >
              <X className="size-3 stroke-[2.5]" />
            </button>
          </span>
        );
      })}

      {/* Add Tag Popover Combobox */}
      {canAddMore && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-6 px-2 text-xs rounded-full border-dashed gap-1 text-muted-foreground hover:text-foreground hover:border-solid hover:bg-muted/80 transition-all"
            >
              <Plus className="size-3" />
              <span>Add Tag</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0 shadow-lg border-border" align="start">
            <Command>
              <CommandInput placeholder="Search tags..." className="h-8 text-xs" />
              <CommandList>
                <CommandEmpty className="py-3 text-center text-xs text-muted-foreground">
                  No tags available.
                </CommandEmpty>
                <CommandGroup heading="Available Tags">
                  {unselectedTags.map((t) => (
                    <CommandItem
                      key={t.id}
                      value={t.name}
                      onSelect={() => {
                        onAdd(t.id);
                        setOpen(false);
                      }}
                      className="flex items-center gap-2 cursor-pointer text-xs py-1.5 px-2 rounded-sm"
                    >
                      <span
                        className="size-2 rounded-full shrink-0"
                        style={{ backgroundColor: t.color || "#3B82F6" }}
                      />
                      <span className="flex-1 truncate font-medium">{t.name}</span>
                      <Check className="size-3 opacity-0 group-hover:opacity-100" />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}

      {tags.length === 0 && !canAddMore && (
        <div className="text-xs text-muted-foreground flex items-center gap-1 italic py-1">
          <TagIcon className="size-3" />
          <span>No tags added</span>
        </div>
      )}
    </div>
  );
}
