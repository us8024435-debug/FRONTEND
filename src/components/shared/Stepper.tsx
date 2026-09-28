"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepItem {
  title: string;
  description?: string;
}

export interface StepperProps {
  steps: StepItem[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  className?: string;
}

export function Stepper({ steps, currentStep, onStepClick, className }: StepperProps) {
  return (
    <nav aria-label="Progress steps" className={cn("w-full py-2", className)}>
      <ol className="flex items-center justify-between w-full">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isClickable = onStepClick && (isCompleted || isCurrent);
          const isLast = index === steps.length - 1;

          return (
            <li
              key={step.title}
              className={cn("relative flex items-center", isLast ? "flex-none" : "flex-1")}
            >
              <div
                onClick={() => {
                  if (isClickable) {
                    onStepClick(index);
                  }
                }}
                className={cn(
                  "group flex items-center gap-3 text-left focus:outline-none",
                  isClickable ? "cursor-pointer" : "cursor-default",
                )}
                role={isClickable ? "button" : undefined}
                tabIndex={isClickable ? 0 : undefined}
                onKeyDown={(e) => {
                  if (isClickable && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    onStepClick(index);
                  }
                }}
              >
                {/* Step indicator circle */}
                <div
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-200",
                    isCompleted && "bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/20",
                    isCurrent &&
                      "bg-primary text-primary-foreground ring-4 ring-primary/20 animate-pulse",
                    !isCompleted &&
                      !isCurrent &&
                      "border-2 border-muted-foreground/30 bg-muted/40 text-muted-foreground",
                  )}
                >
                  {isCompleted ? (
                    <Check className="size-4 stroke-[2.5]" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                {/* Step text labels */}
                <div className="hidden sm:flex flex-col min-w-0 pr-4">
                  <span
                    className={cn(
                      "text-xs font-semibold tracking-tight transition-colors truncate",
                      isCurrent && "text-foreground",
                      isCompleted && "text-foreground/90",
                      !isCompleted && !isCurrent && "text-muted-foreground",
                    )}
                  >
                    {step.title}
                  </span>
                  {step.description && (
                    <span className="text-[11px] text-muted-foreground truncate">
                      {step.description}
                    </span>
                  )}
                </div>
              </div>

              {/* Connecting line */}
              {!isLast && (
                <div
                  aria-hidden="true"
                  className={cn(
                    "h-0.5 flex-1 mx-3 rounded-full transition-colors duration-300",
                    index < currentStep ? "bg-emerald-500" : "bg-muted-foreground/20",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
