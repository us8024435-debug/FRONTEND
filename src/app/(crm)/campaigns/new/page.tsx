"use client";

import * as React from "react";
import { useUIStore } from "@/lib/stores/uiStore";
import { CampaignWizard } from "@/components/campaigns/CampaignWizard";

export default function NewCampaignPage() {
  const setActiveModule = useUIStore((s) => s.setActiveModule);

  React.useEffect(() => {
    setActiveModule("campaigns");
  }, [setActiveModule]);

  return <CampaignWizard />;
}
