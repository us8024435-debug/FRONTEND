"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useUIStore } from "@/lib/stores/uiStore";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { CampaignsTable } from "@/components/campaigns/CampaignsTable";
import CampaignsLoading from "./loading";

function CampaignsContent() {
  const router = useRouter();
  const setActiveModule = useUIStore((s) => s.setActiveModule);

  React.useEffect(() => {
    setActiveModule("campaigns");
  }, [setActiveModule]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Campaigns"
        description="Create and manage broadcast campaigns"
        actions={
          <Button
            size="sm"
            onClick={() => router.push("/campaigns/new")}
            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium gap-1.5 shadow-xs"
          >
            <Plus className="size-3.5" />
            <span>Create Campaign</span>
          </Button>
        }
      />

      {/* Main Campaigns Data Table */}
      <CampaignsTable />
    </div>
  );
}

export default function CampaignsPage() {
  return (
    <React.Suspense fallback={<CampaignsLoading />}>
      <CampaignsContent />
    </React.Suspense>
  );
}
