"use client";

import { useEffect, useId, useRef, useState } from "react";
import "./cv.css";
import { getPhone } from "./contact-phone";
import { CheckIcon, CloseIcon, CopyIcon, LockIcon, MessageIcon, PhoneIcon } from "./icons";

export interface CvDialogLabels {
  cta: string;
  kicker: string;
  title: string;
  lead: string;
  name: string;
  role: string;
  phone: string;
  international: string;
  call: string;
  callAria: string;
  sms: string;
  smsAria: string;
  smsBody: string;
  copy: string;
  copied: string;
  copyFailed: string;
  close: string;
  privacy: string;
  linkedin: string;
  linkedinHref: string;
  newTab: string;
}

/**
 * "Request My CV": a native modal <dialog>. The browser traps focus inside it and
 * Escape closes it; a backdrop click closes it too, and focus returns to the trigger.
 * The phone number exists only while the dialog is open: it is not in the
 * server-rendered page. The CV itself is never on the site; Eli sends it personally.
 */
export function CvRequestDialog({
  labels,
  triggerClassName = "cc-btn cv-trigger",
  showArrow = true,
}: {
  labels: CvDialogLabels;
  /** Lets each placement style its trigger (hero CTA, brief, CV chapter). */
  triggerClassName?: string;
  showArrow?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstActionRef = useRef<HTMLAnchorElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const titleId = useId();
  const leadId = useId();
  const phone = open ? getPhone() : null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    if (!dialog.open) dialog.showModal();
    firstActionRef.current?.focus();
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  function close() {
    dialogRef.current?.close();
  }

  function onClosed() {
    setOpen(false);
    setCopyState("idle");
    triggerRef.current?.focus();
  }

  async function copy() {
    if (!phone) return;
    try {
      await navigator.clipboard.writeText(phone.local);
      setCopyState("copied");
    } catch {
      // Clipboard blocked: select the number so the visitor can copy it themselves.
      const el = numberRef.current;
      if (el) {
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
      setCopyState("failed");
    }
  }

  return (
    <>
      <button ref={triggerRef} type="button" aria-haspopup="dialog" onClick={() => setOpen(true)} className={triggerClassName}>
        <LockIcon />
        <span>{labels.cta}</span>
        {showArrow ? (
          <span aria-hidden="true" className="cc-arrow">
            →
          </span>
        ) : null}
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        aria-describedby={leadId}
        onClose={onClosed}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        className="cv-dialog"
      >
        {phone ? (
          <div className="cv-dlg">
            <div className="cv-dlg-head">
              <div>
                <p className="cv-dlg-kicker">
                  <LockIcon width={14} height={14} />
                  {labels.kicker}
                </p>
                <h2 id={titleId} className="cv-dlg-title cc-display">
                  {labels.title}
                </h2>
              </div>
              <button type="button" onClick={close} className="cv-dlg-close" aria-label={labels.close}>
                <CloseIcon width={20} height={20} />
              </button>
            </div>

            <div className="cv-dlg-body">
              <p id={leadId} className="cv-dlg-lead">
                {labels.lead}
              </p>

              <div className="cv-dlg-person">
                <p className="cv-dlg-name">{labels.name}</p>
                <p className="cv-dlg-role">{labels.role}</p>
              </div>

              <dl className="cv-dlg-numbers">
                <div>
                  <dt>{labels.phone}</dt>
                  <dd>
                    <span ref={numberRef} dir="ltr" className="cv-dlg-number">
                      {phone.local}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>{labels.international}</dt>
                  <dd>
                    <span dir="ltr" className="cv-dlg-intl">
                      {phone.international}
                    </span>
                  </dd>
                </div>
              </dl>

              <div className="cv-dlg-actions">
                <a ref={firstActionRef} href={`tel:${phone.e164}`} aria-label={labels.callAria} className="cc-btn cv-act">
                  <PhoneIcon />
                  <span>{labels.call}</span>
                </a>
                <a href={`sms:${phone.e164}?&body=${encodeURIComponent(labels.smsBody)}`} aria-label={labels.smsAria} className="cv-act cv-act--line">
                  <MessageIcon />
                  <span>{labels.sms}</span>
                </a>
                <button type="button" onClick={copy} className="cv-act cv-act--line">
                  {copyState === "copied" ? <CheckIcon /> : <CopyIcon />}
                  <span>{labels.copy}</span>
                </button>
              </div>
              <p role="status" aria-live="polite" className="cv-dlg-status">
                {copyState === "copied" ? labels.copied : copyState === "failed" ? labels.copyFailed : ""}
              </p>
            </div>

            <div className="cv-dlg-foot">
              <p className="cv-dlg-privacy">
                <LockIcon width={14} height={14} />
                {labels.privacy}
              </p>
              <a href={labels.linkedinHref} target="_blank" rel="noopener noreferrer" className="cc-textlink">
                {labels.linkedin}
                <span aria-hidden="true" className="cc-arrow">
                  →
                </span>
                <span className="sr-only">({labels.newTab})</span>
              </a>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
