"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Users, CheckCheck, Check, Clock, AlertCircle } from "lucide-react";

import { queryKeys, fetchContacts } from "@/lib/api";
import { Campaign, Contact } from "@/lib/types";
import { formatPhone, cn } from "@/lib/utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export interface CampaignRecipientPreviewProps {
  campaign: Campaign;
}

type RecipientDeliveryStatus = "read" | "delivered" | "sent" | "failed" | "scheduled" | "draft";

interface RecipientRow extends Contact {
  deliveryStatus: RecipientDeliveryStatus;
}

export function CampaignRecipientPreview({ campaign }: CampaignRecipientPreviewProps) {
  // Fetch first 20 contacts
  const { data: contactsData, isLoading } = useQuery({
    queryKey: queryKeys.contacts.list({ page: 1, pageSize: 20 }),
    queryFn: () => fetchContacts({ page: 1, pageSize: 20 }),
  });

  const contacts = React.useMemo(() => contactsData?.data || [], [contactsData]);

  // Derive delivery statuses for recipients based on campaign stats and index
  const rows: RecipientRow[] = React.useMemo(() => {
    return contacts.slice(0, 20).map((contact, idx) => {
      let status: RecipientDeliveryStatus = "delivered";

      if (campaign.status === "draft") {
        status = "draft";
      } else if (campaign.status === "scheduled") {
        status = "scheduled";
      } else if (campaign.status === "failed") {
        status = idx % 3 === 0 ? "failed" : "sent";
      } else {
        // Sent campaign
        if (idx % 8 === 0) {
          status = "failed";
        } else if (idx % 3 === 0) {
          status = "read";
        } else if (idx % 2 === 0) {
          status = "delivered";
        } else {
          status = "read";
        }
      }

      return {
        ...contact,
        deliveryStatus: status,
      };
    });
  }, [contacts, campaign.status]);

  const columns = React.useMemo<ColumnDef<RecipientRow>[]>(() => {
    return [
      // Name + Avatar
      {
        accessorKey: "name",
        header: "Recipient",
        cell: ({ row }) => {
          const c = row.original;
          const initials = c.name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();

          return (
            <Link href={`/contacts/${c.id}`} className="flex items-center gap-2.5 group/name">
              <Avatar className="size-7 ring-1 ring-border">
                <AvatarImage src={c.avatarUrl} alt={c.name} />
                <AvatarFallback className="text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  {initials || "WA"}
                </AvatarFallback>
              </Avatar>
              <div className="font-medium text-xs text-foreground group-hover/name:text-primary truncate max-w-[180px]">
                {c.name}
              </div>
            </Link>
          );
        },
      },

      // Phone
      {
        accessorKey: "phone",
        header: "Phone Number",
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground">
            {formatPhone(row.original.phone)}
          </span>
        ),
      },

      // Delivery Status
      {
        accessorKey: "deliveryStatus",
        header: "Delivery Status",
        cell: ({ row }) => {
          const status = row.original.deliveryStatus;

          const badgeConfig: Record<
            RecipientDeliveryStatus,
            { label: string; badge: string; icon: React.ComponentType<{ className?: string }> }
          > = {
            read: {
              label: "Read",
              badge: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/25",
              icon: CheckCheck,
            },
            delivered: {
              label: "Delivered",
              badge:
                "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
              icon: CheckCheck,
            },
            sent: {
              label: "Sent",
              badge: "bg-zinc-500/10 text-zinc-700 dark:text-zinc-400 border-zinc-500/25",
              icon: Check,
            },
            scheduled: {
              label: "Scheduled",
              badge: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/25",
              icon: Clock,
            },
            draft: {
              label: "Pending",
              badge: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25",
              icon: Clock,
            },
            failed: {
              label: "Failed",
              badge: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25",
              icon: AlertCircle,
            },
          };

          const config = badgeConfig[status];
          const Icon = config.icon;

          return (
            <Badge
              variant="outline"
              className={cn(
                "inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 font-medium rounded-full shadow-2xs",
                config.badge,
              )}
            >
              <Icon className="size-3" />
              <span>{config.label}</span>
            </Badge>
          );
        },
      },
    ];
  }, []);

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card className="border-border shadow-2xs">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold">Recipient Preview</CardTitle>
          <CardDescription className="text-xs">
            Showing first 20 recipient contacts in this campaign audience segment.
          </CardDescription>
        </div>
        <Badge variant="outline" className="text-xs gap-1 font-mono">
          <Users className="size-3 text-muted-foreground" />
          <span>{rows.length} previewed</span>
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto border-t border-border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-muted/40 hover:bg-muted/40">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-xs font-semibold py-2.5">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Skeleton className="size-7 rounded-full" />
                        <Skeleton className="h-3.5 w-24" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-3.5 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="py-8 text-center text-xs text-muted-foreground"
                  >
                    No recipients found in this segment.
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-muted/30">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-2.5">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
