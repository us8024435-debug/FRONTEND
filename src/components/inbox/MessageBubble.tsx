"use client";

import * as React from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { FileText, Download, ExternalLink, Phone, MessageSquare } from "lucide-react";
import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { motionConfig, useReducedMotion } from "@/lib/motion";
import { DeliveryTicks } from "./DeliveryTicks";

export interface MessageBubbleProps {
  message: Message;
  isLast?: boolean;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const animatedPreset = useReducedMotion(motionConfig.bubbleEnter);
  const isOutbound = message.direction === "outbound";
  const isSystem = message.senderType === "system" || message.type === "interactive";

  // System status / event notification banner
  if (isSystem && message.type !== "template") {
    return (
      <div className="flex justify-center my-2 select-none">
        <span className="text-xs italic text-muted-foreground bg-muted/60 backdrop-blur-xs px-3 py-1 rounded-full border border-border/40 shadow-2xs text-center max-w-md">
          {message.content.text || "System notification"}
        </span>
      </div>
    );
  }

  const formattedTime = dayjs(message.timestamp).format("h:mm A");

  // Render bubble body content by message type
  const renderContent = () => {
    switch (message.type) {
      case "image":
        return (
          <div className="space-y-1.5">
            {message.content.mediaUrl && (
              <div className="overflow-hidden rounded-lg max-h-[300px] max-w-[320px] bg-black/5 dark:bg-black/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={message.content.mediaUrl}
                  alt={message.content.caption || "Attached image"}
                  className="w-full h-full object-cover rounded-lg"
                  loading="lazy"
                />
              </div>
            )}
            {message.content.caption && (
              <p className="text-sm whitespace-pre-wrap break-words leading-relaxed pt-1">
                {message.content.caption}
              </p>
            )}
          </div>
        );

      case "document":
        return (
          <div className="flex items-center gap-3 p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-border/40 min-w-[220px]">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <FileText className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">
                {message.content.fileName || "WhatsApp_Document.pdf"}
              </p>
              <span className="text-[11px] text-muted-foreground">PDF Document</span>
            </div>
            <a
              href={message.content.mediaUrl || "#"}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-8 shrink-0 items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="Download file"
              aria-label="Download file"
            >
              <Download className="size-4" />
            </a>
          </div>
        );

      case "template": {
        const text = message.content.text || "";
        // Highlight template variables like {{1}}, {{2}}, or {{name}}
        const parts = text.split(/(\{\{[^}]+\}\})/g);

        return (
          <div className="space-y-2">
            {/* Template Header tag */}
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              <MessageSquare className="size-3" />
              <span>{message.content.templateName || "Template Message"}</span>
            </div>

            {/* Template Body with highlighted variables */}
            <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
              {parts.map((part, i) =>
                part.startsWith("{{") && part.endsWith("}}") ? (
                  <span
                    key={i}
                    className="font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 dark:bg-emerald-500/20 px-1 py-0.5 rounded text-[13px]"
                  >
                    {part}
                  </span>
                ) : (
                  part
                ),
              )}
            </p>

            {/* Template Action Buttons */}
            {message.content.buttons && message.content.buttons.length > 0 && (
              <div className="pt-2 border-t border-border/50 space-y-1.5">
                {message.content.buttons.map((btn) => (
                  <button
                    key={btn.id}
                    type="button"
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-xs font-semibold text-emerald-700 dark:text-emerald-300 transition-colors"
                  >
                    {btn.title.toLowerCase().includes("call") ? (
                      <Phone className="size-3" />
                    ) : (
                      <ExternalLink className="size-3" />
                    )}
                    <span>{btn.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      }

      case "text":
      default:
        return (
          <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
            {message.content.text || ""}
          </p>
        );
    }
  };

  return (
    <motion.div
      {...animatedPreset}
      className={cn(
        "flex flex-col my-1 max-w-[85%] sm:max-w-[70%] md:max-w-[65%]",
        isOutbound ? "self-end ml-auto items-end" : "self-start mr-auto items-start",
      )}
    >
      <div
        className={cn(
          "relative px-3.5 py-2 shadow-xs transition-colors",
          isOutbound
            ? "bubble-outbound text-slate-900 dark:text-slate-100 rounded-2xl rounded-tr-xs border border-emerald-600/10 dark:border-emerald-500/10"
            : "bubble-inbound text-foreground rounded-2xl rounded-tl-xs border border-border/40",
        )}
      >
        {/* Main Content */}
        <div className="pr-12">{renderContent()}</div>

        {/* Timestamp & Delivery status bottom right */}
        <div className="absolute right-2.5 bottom-1.5 flex items-center gap-1 text-[10px] text-muted-foreground/85 select-none leading-none">
          <span>{formattedTime}</span>
          {isOutbound && <DeliveryTicks status={message.status} />}
        </div>
      </div>
    </motion.div>
  );
}
