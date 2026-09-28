"use client";

import * as React from "react";
import { useUIStore } from "@/lib/stores/uiStore";
import { PageHeader } from "@/components/shared/PageHeader";
import { TemplateBuilder } from "@/components/templates/TemplateBuilder";

export default function NewTemplatePage() {
  const setActiveModule = useUIStore((s) => s.setActiveModule);

  React.useEffect(() => {
    setActiveModule("templates");
  }, [setActiveModule]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Create Template"
        description="Design and configure your WhatsApp message template for Meta review and campaign broadcast."
      />

      <TemplateBuilder mode="create" />
    </div>
  );
}
