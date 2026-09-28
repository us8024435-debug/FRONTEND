"use client";

import * as React from "react";
import { Plus, Upload } from "lucide-react";
import { toast } from "sonner";
import { useUIStore } from "@/lib/stores/uiStore";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { ContactsTable } from "@/components/contacts/ContactsTable";
import { ContactFormSheet } from "@/components/contacts/ContactFormSheet";
import ContactsLoading from "./loading";

function ContactsContent() {
  const [addSheetOpen, setAddSheetOpen] = React.useState(false);
  const setActiveModule = useUIStore((s) => s.setActiveModule);

  React.useEffect(() => {
    setActiveModule("contacts");
  }, [setActiveModule]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Contacts"
        description="Manage your WhatsApp contacts, team assignments, customer tags, and communication history."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("CSV Contact Import will be enabled in v1.1")}
              className="text-xs gap-1.5 border-border"
            >
              <Upload className="size-3.5" />
              <span>Import</span>
            </Button>

            <Button
              size="sm"
              onClick={() => setAddSheetOpen(true)}
              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium gap-1.5 shadow-xs"
            >
              <Plus className="size-3.5" />
              <span>Add Contact</span>
            </Button>
          </div>
        }
      />

      {/* Main Contacts Data Table */}
      <ContactsTable />

      {/* Add Contact Drawer */}
      <ContactFormSheet open={addSheetOpen} onOpenChange={setAddSheetOpen} />
    </div>
  );
}

export default function ContactsPage() {
  return (
    <React.Suspense fallback={<ContactsLoading />}>
      <ContactsContent />
    </React.Suspense>
  );
}
