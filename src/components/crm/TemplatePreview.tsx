"use client";

import * as React from "react";
import {
  ExternalLink,
  Phone,
  CornerDownLeft,
  Copy,
  Image as ImageIcon,
  Video as VideoIcon,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface TemplatePreviewHeader {
  type?: string;
  text?: string;
  mediaUrl?: string;
}

export interface TemplatePreviewBody {
  text: string;
  variables?: string[];
  examples?: string[];
}

export interface TemplatePreviewButton {
  type: string;
  text: string;
  url?: string;
  phoneNumber?: string;
}

export interface TemplatePreviewProps {
  header?: TemplatePreviewHeader;
  body: TemplatePreviewBody;
  footer?: {
    text?: string;
  };
  buttons?: TemplatePreviewButton[];
  className?: string;
}

/**
 * Parses *bold*, _italic_, ~strike~ in text segment
 */
function renderWhatsAppFormatting(text: string): React.ReactNode {
  const tokens = text.split(/(\*[^*]+\*|_[^_]+_|~[^~]+~)/g);

  return tokens.map((token, i) => {
    if (token.startsWith("*") && token.endsWith("*") && token.length > 2) {
      return (
        <strong key={i} className="font-bold">
          {token.slice(1, -1)}
        </strong>
      );
    }
    if (token.startsWith("_") && token.endsWith("_") && token.length > 2) {
      return (
        <em key={i} className="italic">
          {token.slice(1, -1)}
        </em>
      );
    }
    if (token.startsWith("~") && token.endsWith("~") && token.length > 2) {
      return (
        <s key={i} className="line-through opacity-80">
          {token.slice(1, -1)}
        </s>
      );
    }
    return token;
  });
}

/**
 * Replaces {{N}} with example value (or shows {{N}}) with a yellow/amber highlight badge
 */
function renderBodyWithVariables(text: string, examples: string[] = []): React.ReactNode[] {
  if (!text) return ["Type a message to preview..."];

  const parts = text.split(/(\{\{\d+\}\})/g);

  return parts.map((part, idx) => {
    const varMatch = part.match(/^\{\{(\d+)\}\}$/);
    if (varMatch) {
      const varIndex = parseInt(varMatch[1]!, 10) - 1;
      const exampleVal = examples[varIndex]?.trim();
      const displayText = exampleVal || part;

      return (
        <span
          key={`var-${idx}`}
          className="inline-block px-1.5 py-0.5 rounded text-xs font-semibold bg-amber-400/25 dark:bg-amber-400/30 text-amber-950 dark:text-amber-200 border border-amber-500/40 shadow-2xs tracking-wide transition-all"
          title={exampleVal ? `Example: ${exampleVal}` : `Variable ${part}`}
        >
          {displayText}
        </span>
      );
    }

    return <span key={`text-${idx}`}>{renderWhatsAppFormatting(part)}</span>;
  });
}

export function TemplatePreview({
  header,
  body,
  footer,
  buttons = [],
  className,
}: TemplatePreviewProps) {
  const hasHeader =
    header &&
    header.type !== "none" &&
    (header.text || header.mediaUrl || ["image", "video", "document"].includes(header.type || ""));

  const hasButtons = buttons && buttons.length > 0;

  return (
    <div
      className={cn(
        "relative w-full max-w-sm rounded-2xl bg-[#E7FFDB] dark:bg-[#005C4B] text-zinc-900 dark:text-zinc-100",
        "border border-emerald-500/20 dark:border-white/10 shadow-md overflow-hidden",
        "transition-colors duration-200",
        className,
      )}
    >
      <div className="p-3.5 space-y-2.5">
        {/* Header Section */}
        {hasHeader && (
          <div className="space-y-2">
            {header.type === "text" && header.text && (
              <div className="font-bold text-sm text-foreground leading-snug">{header.text}</div>
            )}

            {header.type === "image" && (
              <div className="relative rounded-lg overflow-hidden bg-muted/60 dark:bg-black/30 aspect-video flex items-center justify-center border border-border/40">
                {header.mediaUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={header.mediaUrl}
                    alt="Template Header"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-muted-foreground">
                    <ImageIcon className="size-8 stroke-[1.5]" />
                    <span className="text-[11px] font-medium">Header Image</span>
                  </div>
                )}
              </div>
            )}

            {header.type === "video" && (
              <div className="rounded-lg overflow-hidden bg-muted/60 dark:bg-black/30 aspect-video flex flex-col items-center justify-center text-muted-foreground border border-border/40">
                <VideoIcon className="size-8 stroke-[1.5]" />
                <span className="text-[11px] font-medium mt-1">Header Video</span>
              </div>
            )}

            {header.type === "document" && (
              <div className="rounded-lg p-2.5 bg-black/5 dark:bg-black/20 flex items-center gap-2.5 text-foreground border border-border/40">
                <FileText className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div className="text-xs font-medium truncate">
                  {header.mediaUrl ? "Document Attachment" : "Sample Document.pdf"}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Body Section */}
        <div className="text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap break-words">
          {renderBodyWithVariables(body?.text || "", body?.examples || [])}
        </div>

        {/* Footer Section */}
        {footer?.text && (
          <div className="text-[11px] text-muted-foreground dark:text-zinc-400 italic leading-snug pt-1">
            {footer.text}
          </div>
        )}

        {/* WhatsApp watermark text */}
        <div className="flex items-center justify-end gap-1 pt-1 text-[10px] text-muted-foreground/60 dark:text-zinc-400/50 select-none font-medium">
          <span>WhatsApp</span>
        </div>
      </div>

      {/* Buttons Section */}
      {hasButtons && (
        <div className="divide-y divide-emerald-600/15 dark:divide-white/10 border-t border-emerald-600/15 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]">
          {buttons.map((btn, index) => (
            <div
              key={index}
              className="flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer select-none"
            >
              {btn.type === "quick_reply" && <CornerDownLeft className="size-3.5 shrink-0" />}
              {btn.type === "url" && <ExternalLink className="size-3.5 shrink-0" />}
              {btn.type === "phone" && <Phone className="size-3.5 shrink-0" />}
              {btn.type === "copy_code" && <Copy className="size-3.5 shrink-0" />}
              <span className="truncate max-w-[220px]">
                {btn.text || `Action Button ${index + 1}`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
