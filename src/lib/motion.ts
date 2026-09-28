"use client";

import { useReducedMotion as useFramerReducedMotion } from "framer-motion";

/**
 * Centralized Framer Motion animation presets for WhatsApp CRM
 */
export const motionConfig = {
  bubbleEnter: {
    initial: { opacity: 0, y: 10, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2, ease: "easeOut" as const },
  },
  sheetSlide: {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
    transition: { type: "spring" as const, damping: 25, stiffness: 200 },
  },
  wizardStep: {
    enter: (direction: number) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: direction < 0 ? 200 : -200,
      opacity: 0,
    }),
    transition: { duration: 0.3, ease: "easeInOut" as const },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.2 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.15 },
  },
};

/**
 * Wrapper hook that checks prefers-reduced-motion.
 * When called with no arguments, returns boolean preference.
 * When called with a motion preset object, returns static non-animated values if true.
 */
export function useReducedMotion(): boolean;
export function useReducedMotion<T extends Record<string, unknown>>(preset: T): T;
export function useReducedMotion<T extends Record<string, unknown>>(preset?: T): boolean | T {
  const shouldReduce = Boolean(useFramerReducedMotion());

  if (preset === undefined) {
    return shouldReduce;
  }

  if (!shouldReduce) {
    return preset;
  }

  // Return static fallback with zero animation duration
  return {
    ...preset,
    initial: false,
    animate: preset.animate ?? preset.center ?? { opacity: 1 },
    exit: false,
    transition: { duration: 0 },
  };
}
