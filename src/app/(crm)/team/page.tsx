"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Search, Users } from "lucide-react";
import { useUIStore } from "@/lib/stores/uiStore";
import { queryKeys, fetchAgents, deleteAgent } from "@/lib/api";
import type { Agent } from "@/lib/types";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { AgentCard } from "@/components/team/AgentCard";
import { AddAgentDialog } from "@/components/team/AddAgentDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeamPage() {
  const setActiveModule = useUIStore((s) => s.setActiveModule);
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [removeTarget, setRemoveTarget] = React.useState<Agent | null>(null);
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    setActiveModule("team");
  }, [setActiveModule]);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.agents.list(),
    queryFn: fetchAgents,
  });

  const agents = data?.data ?? [];

  // Client-side search filter
  const filteredAgents = React.useMemo(() => {
    if (!search.trim()) return agents;
    const q = search.toLowerCase().trim();
    return agents.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.departments.some((d) => d.toLowerCase().includes(q)),
    );
  }, [agents, search]);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAgent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.agents.all });
      toast.success("Agent removed successfully");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to remove agent");
    },
  });

  const handleRemoveConfirm = async () => {
    if (!removeTarget) return;
    await deleteMutation.mutateAsync(removeTarget.id);
    setRemoveTarget(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Team"
        description="Manage agents and assignments"
        actions={
          <Button
            size="sm"
            onClick={() => setAddDialogOpen(true)}
            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium gap-1.5 shadow-xs"
          >
            <Plus className="size-3.5" />
            <span>Add Agent</span>
          </Button>
        }
      />

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
        <Input
          placeholder="Search agents..."
          className="pl-9 h-9 text-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Agent Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-start gap-3.5">
                <Skeleton className="size-14 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <Skeleton className="size-8 rounded-md" />
              </div>
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-1.5 w-full rounded-full" />
              </div>
              <div className="flex gap-1.5">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
      ) : filteredAgents.length === 0 ? (
        <EmptyState
          icon={Users}
          title={search ? "No agents found" : "Add your first agent"}
          description={
            search
              ? "Try adjusting your search query"
              : "Add your first agent to start managing conversations"
          }
          actionLabel={search ? "Clear" : "Add Agent"}
          onAction={search ? () => setSearch("") : () => setAddDialogOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onEdit={() => toast.info(`Edit ${agent.name} — coming soon`)}
              onChangeRole={() => toast.info(`Change role for ${agent.name} — coming soon`)}
              onRemove={() => setRemoveTarget(agent)}
            />
          ))}
        </div>
      )}

      {/* Add Agent Dialog */}
      <AddAgentDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />

      {/* Remove Confirm Dialog */}
      <ConfirmDialog
        open={!!removeTarget}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
        title="Remove Agent"
        description={`Are you sure you want to remove ${removeTarget?.name}? This action cannot be undone. Their active conversations will need to be reassigned.`}
        onConfirm={handleRemoveConfirm}
        confirmLabel="Remove"
        destructive
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
