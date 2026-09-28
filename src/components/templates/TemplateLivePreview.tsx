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
  CheckCheck,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TemplateCategory, TemplateHeaderType, TemplateButtonType } from "@/lib/types";

export interface PreviewButton {
  type: TemplateButtonType;
  text: string;
  url?: string;
  phoneNumber?: string;
}

export interface TemplateLivePreviewProps {
  displayName?: string;
  category?: TemplateCategory;
  language?: string;
  headerType?: TemplateHeaderType;
  headerText?: string;
  headerMediaUrl?: string;
  bodyText?: string;
  bodyExamples?: string[];
  footerText?: string;
  buttons?: PreviewButton[];
}

/**
 * Parses WhatsApp formatting (*bold*, _italic_, ~strike~) and replaces {{1}}, {{2}} with example values.
 */
function renderFormattedBody(text: string, examples: string[] = []): React.ReactNode[] {
  if (!text) return ["Type a body message to preview it here..."];

  // Replace variables with examples or highlighted tags
  const parts = text.split(/(\{\{\d+\}\})/g);

  return parts.map((part, idx) => {
    const varMatch = part.match(/^\{\{(\d+)\}\}$/);
    if (varMatch) {
      const varIndex = parseInt(varMatch[1]!, 10) - 1;
      const exampleVal = examples[varIndex]?.trim();

      return (
        <span
          key={`var-${idx}`}
          className={cn(
            "inline-block rounded px-1.5 py-0.5 text-xs font-semibold tracking-wide transition-colors",
            exampleVal
              ? "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30"
              : "bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 animate-pulse",
          )}
          title={exampleVal ? `Example: ${exampleVal}` : "No example provided"}
        >
          {exampleVal || part}
        </span>
      );
    }

    // Process *bold*, _italic_, ~strike~
    return <span key={`text-${idx}`}>{formatWhatsAppMarkdown(part)}</span>;
  });
}

function formatWhatsAppMarkdown(text: string): React.ReactNode {
  // Simple token regex matching *bold*, _italic_, ~strikethrough~
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

export function TemplateLivePreview({
  displayName,
  category = "marketing",
  language = "en_US",
  headerType = "none",
  headerText = "",
  headerMediaUrl = "",
  bodyText = "",
  bodyExamples = [],
  footerText = "",
  buttons = [],
}: TemplateLivePreviewProps) {
  const currentTime = React.useMemo(() => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Phone Mockup Frame */}
      <div className="w-full max-w-sm rounded-[2.2rem] border-[7px] border-zinc-800 dark:border-zinc-700 bg-background shadow-2xl overflow-hidden flex flex-col">
        {/* Notch / Speaker bar */}
        <div className="bg-zinc-800 dark:bg-zinc-700 h-5 w-full flex items-center justify-center">
          <div className="h-1 w-12 rounded-full bg-zinc-600 dark:bg-zinc-500" />
        </div>

        {/* WhatsApp Chat App Header */}
        <div className="bg-[#075E54] dark:bg-[#1F2C34] text-white px-3.5 py-2.5 flex items-center gap-2.5 select-none shadow-xs">
          <div className="relative size-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold shrink-0">
            <span>WA</span>
            <div className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-400 ring-2 ring-[#075E54] dark:ring-[#1F2C34]" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold truncate leading-tight">
                {displayName || "WhatsApp Business"}
              </span>
              <ShieldCheck className="size-3 text-emerald-400 shrink-0" />
            </div>
            <div className="text-[10px] text-emerald-100/80 truncate">
              Official Business Account
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-white/80">
            <Smartphone className="size-3.5" />
          </div>
        </div>

        {/* WhatsApp Chat Area / Wallpaper */}
        <div className="relative flex-1 bg-[#EFEAE2] dark:bg-[#0B141A] p-3 min-h-[380px] max-h-[520px] overflow-y-auto space-y-2 flex flex-col justify-end">
          {/* Subtle WhatsApp wallpaper overlay */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Date pill */}
          <div className="mx-auto bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xs text-[10px] font-medium text-zinc-500 dark:text-zinc-400 px-2.5 py-0.5 rounded-full shadow-2xs">
            Today
          </div>

          {/* Outbound Template Message Bubble */}
          <div className="relative self-end max-w-[92%] rounded-xl rounded-tr-xs bg-[#E7FFDB] dark:bg-[#005C4B] text-zinc-900 dark:text-zinc-100 p-2.5 shadow-sm border border-emerald-500/10 dark:border-none space-y-2">
            {/* Header Content */}
            {headerType === "text" && headerText && (
              <div className="font-bold text-xs text-foreground pb-1 border-b border-black/5 dark:border-white/10 leading-snug">
                {headerText}
              </div>
            )}

            {headerType === "image" && (
              <div className="rounded-lg overflow-hidden bg-black/10 dark:bg-black/30 aspect-video flex flex-col items-center justify-center text-zinc-500 dark:text-zinc-400">
                {headerMediaUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={headerMediaUrl}
                    alt="Template Header"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <ImageIcon className="size-6 text-zinc-400" />
                    <span className="text-[10px]">Image Header</span>
                  </div>
                )}
              </div>
            )}

            {headerType === "video" && (
              <div className="rounded-lg overflow-hidden bg-black/10 dark:bg-black/30 aspect-video flex flex-col items-center justify-center text-zinc-500 dark:text-zinc-400">
                <VideoIcon className="size-6 text-zinc-400" />
                <span className="text-[10px] mt-1">Video Header</span>
              </div>
            )}

            {headerType === "document" && (
              <div className="rounded-lg p-2.5 bg-black/5 dark:bg-black/20 flex items-center gap-2 text-zinc-700 dark:text-zinc-200">
                <FileText className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div className="text-[11px] font-medium truncate">
                  {headerMediaUrl ? "Document attachment" : "Sample Document.pdf"}
                </div>
              </div>
            )}

            {/* Body Content */}
            <div className="text-[13px] leading-relaxed whitespace-pre-wrap break-words">
              {renderFormattedBody(bodyText, bodyExamples)}
            </div>

            {/* Footer Text */}
            {footerText && (
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400/90 leading-tight pt-1">
                {footerText}
              </div>
            )}

            {/* Timestamp & double ticks */}
            <div className="flex items-center justify-end gap-1 text-[10px] text-zinc-500 dark:text-zinc-400 pt-0.5">
              <span>{currentTime}</span>
              <CheckCheck className="size-3 text-sky-500" />
            </div>

            {/* Buttons inside/below bubble */}
            {buttons && buttons.length > 0 && (
              <div className="-mx-2.5 -mb-2.5 mt-2 divide-y divide-emerald-600/10 dark:divide-white/10 border-t border-emerald-600/15 dark:border-white/15">
                {buttons.map((btn, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-[#00A884] dark:text-[#25D366] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer select-none"
                  >
                    {btn.type === "url" && <ExternalLink className="size-3.5" />}
                    {btn.type === "phone" && <Phone className="size-3.5" />}
                    {btn.type === "quick_reply" && <CornerDownLeft className="size-3.5" />}
                    {btn.type === "copy_code" && <Copy className="size-3.5" />}
                    <span className="truncate max-w-[200px]">
                      {btn.text || `Button ${index + 1}`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Fake message bar */}
        <div className="bg-[#F0F2F5] dark:bg-[#1F2C34] p-2 flex items-center gap-2 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex-1 bg-white dark:bg-[#2A3942] rounded-full h-8 px-3 text-xs text-muted-foreground flex items-center">
            Message
          </div>
          <div className="size-8 rounded-full bg-[#00A884] flex items-center justify-center text-white text-xs">
            ▶
          </div>
        </div>
      </div>

      {/* Meta indicators below preview */}
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground flex-wrap justify-center">
        <span className="capitalize font-medium text-foreground">{category}</span>
        <span>•</span>
        <span className="uppercase font-mono text-[11px]">{language}</span>
        <span>•</span>
        <span>WhatsApp Business Cloud API</span>
      </div>
    </div>
  );
}
