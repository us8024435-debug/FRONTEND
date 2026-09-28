"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft } from "lucide-react";

import { queryKeys, fetchTemplate } from "@/lib/api";
import { useUIStore } from "@/lib/stores/uiStore";
import { PageHeader } from "@/components/shared/PageHeader";
import { TemplateBuilder } from "@/components/templates/TemplateBuilder";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";

export default function EditTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.templateId as string;

  const setActiveModule = useUIStore((s) => s.setActiveModule);

  React.useEffect(() => {
    setActiveModule("templates");
  }, [setActiveModule]);

  const {
    data: templateResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.templates.detail(templateId),
    queryFn: () => fetchTemplate(templateId),
    enabled: Boolean(templateId),
  });

  const template = templateResponse?.data;

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="space-y-1.5 pb-5 border-b border-border">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-56 w-full rounded-xl" />
          </div>
          <div className="lg:col-span-5">
            <Skeleton className="h-[480px] w-full max-w-sm mx-auto rounded-[2.2rem]" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <PageHeader title="Edit Template" description="Template not found or failed to load." />
        <EmptyState
          icon={AlertCircle}
          title="Template Not Found"
          description={`Unable to locate WhatsApp template with ID "${templateId}". It may have been deleted.`}
          actionLabel="Back to Templates"
          onAction={() => router.push("/templates")}
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Edit Template"
        description={`Modify content for "${template.displayName}" (${template.name}).`}
      />

      <TemplateBuilder initialData={template} mode="edit" />
    </div>
  );
}
