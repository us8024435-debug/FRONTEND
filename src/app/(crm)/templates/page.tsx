"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useUIStore } from "@/lib/stores/uiStore";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { TemplateListView } from "@/components/templates/TemplateListView";
import TemplatesLoading from "./loading";

function TemplatesContent() {
  const router = useRouter();
  const setActiveModule = useUIStore((s) => s.setActiveModule);

  React.useEffect(() => {
    setActiveModule("templates");
  }, [setActiveModule]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Templates"
        description="Manage your WhatsApp message templates"
        actions={
          <Button
            size="sm"
            onClick={() => router.push("/templates/new")}
            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium gap-1.5 shadow-xs"
          >
            <Plus className="size-3.5" />
            <span>Create Template</span>
          </Button>
        }
      />

      {/* Template List View (Grid/List) */}
      <TemplateListView />
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <React.Suspense fallback={<TemplatesLoading />}>
      <TemplatesContent />
    </React.Suspense>
  );
}
