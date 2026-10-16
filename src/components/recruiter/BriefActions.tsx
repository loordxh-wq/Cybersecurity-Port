"use client";

import { useState } from "react";

/** Copy the brief's link (in the current language) and print it as a one-page summary. */
export function BriefActions({ labels }: { labels: { copy: string; copied: string; failed: string; print: string } }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href.split("#")[0] ?? window.location.href);
      setState("copied");
    } catch {
      setState("failed");
    }
  }

  return (
    <div className="rb-tools">
      <button type="button" onClick={copy} className="rb-tool">
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
        </svg>
        {labels.copy}
      </button>
      <button type="button" onClick={() => window.print()} className="rb-tool">
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
          <path d="M7 9V4h10v5M7 17H5a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2" />
          <path d="M7 14h10v6H7z" />
        </svg>
        {labels.print}
      </button>
      <p role="status" aria-live="polite" className="rb-tool-status">
        {state === "copied" ? labels.copied : state === "failed" ? labels.failed : ""}
      </p>
    </div>
  );
}
