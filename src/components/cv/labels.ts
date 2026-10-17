import { getTranslations } from "next-intl/server";
import { linkedin } from "@/content/facts";
import type { CvDialogLabels } from "./CvRequestDialog";

/** Localized labels for every "Request My CV" trigger (hero, brief, CV chapter). */
export async function getCvDialogLabels(): Promise<CvDialogLabels> {
  const cv = await getTranslations("cv");
  const hero = await getTranslations("hero");
  const social = await getTranslations("social");
  return {
    cta: cv("cta"),
    kicker: cv("title"),
    title: cv("dialogTitle"),
    lead: cv("dialogLead"),
    name: hero("name"),
    role: hero("role"),
    phone: cv("phone"),
    international: cv("international"),
    call: cv("call"),
    callAria: cv("callAria"),
    sms: cv("sms"),
    smsAria: cv("smsAria"),
    smsBody: cv("smsBody"),
    copy: cv("copy"),
    copied: cv("copied"),
    copyFailed: cv("copyFailed"),
    close: cv("close"),
    privacy: cv("privacy"),
    linkedin: cv("linkedin"),
    linkedinHref: linkedin.href,
    newTab: social("newTab"),
  };
}
