import * as React from "react";
import { Check, CheckCheck, Clock, AlertCircle } from "lucide-react";
import { MessageStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface DeliveryTicksProps {
  status: MessageStatus;
  className?: string;
}

export function DeliveryTicks({ status, className }: DeliveryTicksProps) {
  switch (status) {
    case "sending":
      return (
        <span
          title="Sending message..."
          aria-label="Sending message"
          className={cn("inline-flex items-center text-muted-foreground/70", className)}
        >
          <Clock className="size-3 animate-spin opacity-80" />
        </span>
      );

    case "sent":
      return (
        <span
          title="Sent to WhatsApp server"
          aria-label="Sent"
          className={cn("inline-flex items-center text-muted-foreground/80", className)}
        >
          <Check className="size-3.5 stroke-[2.5]" />
        </span>
      );

    case "delivered":
      return (
        <span
          title="Delivered to recipient"
          aria-label="Delivered"
          className={cn("inline-flex items-center text-muted-foreground/80", className)}
        >
          <CheckCheck className="size-3.5 stroke-[2.5]" />
        </span>
      );

    case "read":
      return (
        <span
          title="Read by recipient"
          aria-label="Read"
          className={cn("inline-flex items-center text-[#53bdeb] dark:text-[#53bdeb]", className)}
        >
          <CheckCheck className="size-3.5 stroke-[2.5]" />
        </span>
      );

    case "failed":
      return (
        <span
          title="Failed to deliver"
          aria-label="Delivery failed"
          className={cn("inline-flex items-center text-destructive", className)}
        >
          <AlertCircle className="size-3.5 stroke-[2.5]" />
        </span>
      );

    default:
      return null;
  }
}
