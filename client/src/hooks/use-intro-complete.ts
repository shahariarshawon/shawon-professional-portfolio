"use client";

import { useSyncExternalStore } from "react";

import { INTRO_DONE_EVENT } from "@/lib/motion";

/*
 * Tiny external store for the startup intro. "Done" means either the intro
 * finished in this page view, or <html data-intro-seen> was set before paint
 * (already played this session / landed on another route first).
 */
let finishedThisView = false;

export function markIntroComplete() {
  finishedThisView = true;
  window.dispatchEvent(new Event(INTRO_DONE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(INTRO_DONE_EVENT, onChange);
  return () => window.removeEventListener(INTRO_DONE_EVENT, onChange);
}

const getSnapshot = () =>
  finishedThisView || document.documentElement.hasAttribute("data-intro-seen");

// The server can't know; it renders the pre-intro state and the client corrects
// it right after hydration.
const getServerSnapshot = () => false;

/**
 * True once the startup intro has finished (or was skipped). Hero entrance
 * animations wait on this so they don't play hidden underneath the overlay.
 */
export function useIntroComplete() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
