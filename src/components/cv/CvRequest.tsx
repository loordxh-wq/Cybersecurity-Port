import { getTranslations } from "next-intl/server";
import { ChapterRule } from "@/components/cc/ChapterRule";
import { linkedin } from "@/content/facts";
import "./cv.css";
import { CvRequestDialog } from "./CvRequestDialog";
import { DocumentLock } from "./DocumentLock";
import { LockIcon } from "./icons";

/**
 * Professional CV, available upon request. The page shows how to ask for the CV;
 * the CV itself is never published. Eli shares it personally after contact.
 */
export async function CvRequest({ index }: { index?: string }) {
  const cv = await getTranslations("cv");
  const hero = await getTranslations("hero");
  const social = await getTranslations("social");

  return (
    <section id="cv" data-section aria-labelledby="cv-title" className="cv-section">
      <div className="site-wrap">
        {index ? <ChapterRule index={index}>{cv("forRecruiters")}</ChapterRule> : null}
        <div className="cv-grid">
          <DocumentLock />
          <div className="cv-copy">
            <h2 id="cv-title" className="cv-title cc-display">
              {cv("title")}
            </h2>
            <p className="cv-subtitle">
              <LockIcon width={14} height={14} />
              {cv("subtitle")}
            </p>
            <p className="cc-lead mt-5">{cv("body")}</p>
            <div className="mt-8">
              <CvRequestDialog
                labels={{
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
                }}
              />
            </div>
            <p className="cv-privacy">{cv("privacy")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
