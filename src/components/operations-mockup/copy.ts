import type { Locale } from "@/i18n/routing";

/**
 * Wording for the Cyber Operations proposal mockups (proposal branch, protected
 * preview only). All text is draft for Eli's review. Demonstration copy is written
 * in a neutral voice: it explains a method and never claims work Eli performed.
 * Technical values (addresses, filters, event IDs) live in data.ts and are not translated.
 */
export type Frame = "hub" | "net" | "siem" | "ad" | "soc" | "text" | "home";
export type Tier = "verified" | "demonstration" | "simulation";
export type PointKind = "fact" | "reasoning" | "limit";
export type StoryId = "soc" | "net" | "siem" | "ad";

export interface Story {
  cat: string;
  title: string;
  summary: string;
  minutes: string;
  chapters: string[];
  /** Index of the chapter the mockup frame shows. */
  at: number;
  caption: string;
  /** Labels for the three kinds of statement, worded for the story type. */
  kinds: Record<PointKind, string>;
  points: { k: PointKind; t: string }[];
  labels: Record<string, string>;
}

export interface OpsCopy {
  banner: string;
  frameNames: Record<Frame, string>;
  eyebrow: string;
  tiers: Record<Tier, { label: string; desc: string }>;
  review: { tech: string; eli: string; pending: string };
  disclosure: string;
  synthetic: string;
  notSoftware: string;
  simNote: string;
  player: { chapter: string; of: string; play: string; text: string; captions: string; reasoning: string; replay: string; next: string };
  hub: {
    title: string;
    lead: string;
    readTitle: string;
    routeTitle: string;
    route: string[];
    verifiedSlot: string;
    verifiedNone: string;
    awaiting: string;
    open: string;
    chapters: string;
    previewOnly: string;
    cats: Record<StoryId, { name: string; scope: string; caseFile: string | null }>;
  };
  stories: Record<StoryId, Story>;
  text: { title: string; lead: string; values: string; refs: string; refList: string[]; back: string };
  home: { chapter: string; title: string; lead: string; cta: string; briefTitle: string; brief: [string, string][] };
}

const en: OpsCopy = {
  banner: "Proposal mockup · static frame · protected preview, not published",
  frameNames: { hub: "Operations hub", net: "Network forensics", siem: "SIEM & Windows", ad: "Active Directory", soc: "SOC story", text: "Text version", home: "Home & recruiter" },
  eyebrow: "Eli Saad — Cyber Operations",
  tiers: {
    verified: { label: "Verified lab work", desc: "Eli's own lab work, shown with his sanitized evidence and approved by him." },
    demonstration: { label: "Training demonstration", desc: "Explains a method with synthetic data. Created with AI assistance; not a record of work performed." },
    simulation: { label: "Training simulation", desc: "A fictional incident with synthetic data, walked through as an investigation." },
  },
  review: { tech: "Technical check", eli: "Eli's review", pending: "pending" },
  disclosure: "Story, synthetic data and draft text created with AI assistance. Eli Saad's review is in progress.",
  synthetic: "Synthetic data",
  notSoftware: "Custom illustration, not Wireshark, Splunk or Microsoft software.",
  simNote: "Fictional company and data. Not a real incident.",
  player: { chapter: "Chapter", of: "of", play: "Play", text: "Text version", captions: "Captions", reasoning: "Reasoning", replay: "Replay chapter", next: "Next chapter" },
  hub: {
    title: "Technical work, explained",
    lead: "Guided visual stories on how security data is read: what is examined, why, what it shows and where its limits are. Each story is labelled with where it comes from.",
    readTitle: "How to read this page",
    routeTitle: "Two-minute route for recruiters",
    route: ["Read the three labels above", "Open one story and watch a chapter", "Check Verified lab work and the certifications"],
    verifiedSlot: "Verified lab work",
    verifiedNone: "Not published yet. Appears only after Eli supplies and approves his own evidence.",
    awaiting: "Awaiting evidence",
    open: "Open story",
    chapters: "chapters",
    previewOnly: "shown in the protected preview only",
    cats: {
      soc: { name: "SOC Investigation Stories", scope: "Alert, log examination, correlation, evidence and findings with their limits.", caseFile: null },
      net: { name: "Network Forensics", scope: "Packet inspection: DNS, TCP and TLS, and what a capture can and cannot show.", caseFile: "CF-01" },
      siem: { name: "SIEM & Windows Security", scope: "Windows authentication events, attack patterns and detection logic.", caseFile: "CF-02" },
      ad: { name: "Active Directory & IT Infrastructure", scope: "Domain structure, OUs, accounts, Group Policy and how changes are verified.", caseFile: "CF-03" },
    },
  },
  stories: {
    soc: {
      cat: "SOC Investigation Stories",
      title: "SOC-01 · From a password spray to a file server",
      summary: "One alert followed through logs and correlation to findings that state their limits.",
      minutes: "2:40",
      chapters: ["Alert detection", "Log examination", "Event correlation", "Evidence selection", "Findings and limitations"],
      at: 4,
      caption: "The findings keep three things apart: what the events show, what stays unconfirmed, and what these logs cannot show at all.",
      kinds: { fact: "Supported by evidence", reasoning: "Unconfirmed", limit: "Not in these logs" },
      points: [
        { k: "fact", t: "A logon as j.morgan succeeded during the spray (02:14:37) and was followed by Remote Desktop and a logon to SRV-FILE01 (02:21:13)." },
        { k: "reasoning", t: "Whether 203.0.113.77 is the same actor: it shares the client name DESKTOP-7Q2M4, which the connecting device sets." },
        { k: "limit", t: "Which files, if any, were opened on SRV-FILE01. Logon events do not record file access." },
      ],
      labels: { next: "Next steps", n1: "Disable j.morgan and reset its credentials", n2: "Restrict Remote Desktop on JMP01", n3: "Collect file-access auditing from SRV-FILE01", kept: "Kept events", motion: "Chapters 2 and 3 exist as a motion study" },
    },
    net: {
      cat: "Network Forensics",
      title: "From a name to an encrypted session",
      summary: "One connection read packet by packet: DNS resolution, the TCP handshake and the start of TLS.",
      minutes: "2:10",
      chapters: ["Capture scope", "DNS resolution", "TCP handshake", "TLS Client Hello", "What the capture cannot show"],
      at: 2,
      caption: "Three packets open the connection: SYN, SYN-ACK, ACK. The handshake takes 24.1 ms, and both sides agree on segment size and window scaling.",
      kinds: { fact: "Observed in the capture", reasoning: "Interpretation", limit: "Limitation" },
      points: [
        { k: "fact", t: "Packets 3–5 complete the handshake with 198.51.100.40:443 in 24.1 ms, with no retransmission or reset." },
        { k: "reasoning", t: "The connection likely belongs to updates.example.com: it goes to the address in the DNS answer, 1.5 ms after it arrived." },
        { k: "limit", t: "A matching address does not prove which name the application meant. The TLS name in chapter 4 is stronger, but still set by the client." },
      ],
      labels: { list: "Packets in this capture", ladder: "Handshake", client: "Client", server: "Server", filter: "Display filter (Wireshark syntax)", no: "No.", time: "Time (s)", src: "Source", dst: "Destination", proto: "Protocol", len: "Length", info: "Summary", rtt: "Round trip" },
    },
    siem: {
      cat: "SIEM & Windows Security",
      title: "Telling a password spray from a brute-force attack",
      summary: "How failed-logon events (4625) separate two attack patterns, and how a detection rule is tuned against normal noise.",
      minutes: "2:20",
      chapters: ["What a failed logon records", "Two patterns", "Detection logic", "Testing against noise", "Limits of the rule"],
      at: 2,
      caption: "The rule counts distinct accounts per source in ten minutes. Many accounts with few attempts each is a spray; one account with many attempts is brute force.",
      kinds: { fact: "Observed in the events", reasoning: "Interpretation", limit: "Limitation" },
      points: [
        { k: "fact", t: "198.51.100.61 failed on 14 accounts, once each. 192.0.2.10 also crosses the threshold: 11 accounts, 13 failures." },
        { k: "reasoning", t: "192.0.2.10 is the lab's shared gateway. 9 of its 11 accounts sign in successfully within minutes, which looks like mistyped passwords, not a spray." },
        { k: "limit", t: "The threshold fits this dataset only. A slow spray spread over hours stays under a ten-minute window." },
      ],
      labels: { chart: "Failed logons per source, one 10-minute window", x: "Distinct accounts", y: "Failures per account", spray: "Spray", brute: "Brute force", review: "Needs review", normal: "Normal", rule: "Search logic (SPL syntax, synthetic index)", fields: "Fields the rule reads", threshold: "Threshold" },
    },
    ad: {
      cat: "Active Directory & IT Infrastructure",
      title: "Designing and verifying OUs and Group Policy",
      summary: "A lab domain structured into OUs, with policies linked where they take effect, and each result checked on a client.",
      minutes: "2:30",
      chapters: ["Domain and OU design", "Accounts and groups", "Group Policy links", "Verification", "Common pitfalls"],
      at: 2,
      caption: "WS-Baseline is linked to the Workstations OU, so it reaches the computers in it. Policies apply in order, and the closest link wins a conflict.",
      kinds: { fact: "In the design", reasoning: "Expected effect", limit: "Must be verified" },
      points: [
        { k: "fact", t: "WS-Baseline is linked only to OU=Workstations and sets a 600-second inactivity limit." },
        { k: "reasoning", t: "Computers in Workstations receive it; Finance users do not, because computer settings follow the computer object." },
        { k: "limit", t: "A link is the intent, not the result. Security filtering, inheritance blocks or replication can change what applies, so chapter 4 checks a client." },
      ],
      labels: { tree: "Structure of lab.local", order: "Processing order", orderNote: "Later wins a conflict. An enforced link wins over closer links.", pitfall: "A password policy linked to an OU does not change domain account passwords. Use the domain policy or a fine-grained password policy.", check: "Verification in chapter 4", gpo: "linked GPO", setting: "Setting" },
    },
  },
  text: {
    title: "Text version",
    lead: "Every story has a full text version with the same chapters, statements and values. It is generated from the same source as the visual story, so the two cannot drift apart.",
    values: "Values in this chapter",
    refs: "References",
    refList: ["RFC 1035: Domain names, implementation and specification", "RFC 9293: Transmission Control Protocol", "RFC 7323: TCP extensions for high performance (window scaling)", "RFC 8446: TLS 1.3"],
    back: "Back to the visual story",
  },
  home: {
    chapter: "Technical work",
    title: "How security data is read",
    lead: "Four guided stories, each labelled by origin. Verified lab work is added as Eli's evidence is approved.",
    cta: "Open Cyber Operations",
    briefTitle: "Recruiter brief · technical work",
    brief: [
      ["Verified lab work", "None published yet"],
      ["Training demonstrations", "Network, SIEM, Active Directory · AI-assisted · synthetic data"],
      ["Training simulation", "SOC-01 · fictional incident"],
    ],
  },
};

const he: OpsCopy = {
  banner: "הדמיית הצעה · פריים סטטי · תצוגה מקדימה מוגנת, לא פורסם",
  frameNames: { hub: "מרכז התפעול", net: "פורנזיקה ברשת", siem: "SIEM ו-Windows", ad: "Active Directory", soc: "סיפור SOC", text: "גרסת טקסט", home: "דף הבית ומגייסים" },
  eyebrow: "איליא סעד — Cyber Operations",
  tiers: {
    verified: { label: "עבודת מעבדה מאומתת", desc: "עבודת מעבדה של איליא עצמו, מוצגת עם הראיות המנוקות שלו ובאישורו." },
    demonstration: { label: "הדגמת הדרכה", desc: "מסבירה שיטה בעזרת נתונים סינתטיים. נוצרה בסיוע בינה מלאכותית; אינה תיעוד של עבודה שבוצעה." },
    simulation: { label: "סימולציית הדרכה", desc: "אירוע בדיוני עם נתונים סינתטיים, מוצג כחקירה מלאה." },
  },
  review: { tech: "בדיקה טכנית", eli: "בדיקת איליא", pending: "בתהליך" },
  disclosure: "הסיפור, הנתונים הסינתטיים וטיוטות הטקסט נוצרו בסיוע בינה מלאכותית. הבדיקה של איליא סעד בתהליך.",
  synthetic: "נתונים סינתטיים",
  notSoftware: "איור מותאם, לא תוכנת Wireshark,‏ Splunk או Microsoft.",
  simNote: "חברה ונתונים בדיוניים. לא אירוע אמיתי.",
  player: { chapter: "פרק", of: "מתוך", play: "הפעלה", text: "גרסת טקסט", captions: "כתוביות", reasoning: "נימוק", replay: "הפעלת הפרק מחדש", next: "הפרק הבא" },
  hub: {
    title: "עבודה טכנית, מוסברת",
    lead: "סיפורים חזותיים מודרכים על קריאת נתוני אבטחה: מה נבדק, למה, מה זה מראה ואיפה הגבולות. כל סיפור מסומן לפי מקורו.",
    readTitle: "איך לקרוא את הדף",
    routeTitle: "מסלול של שתי דקות למגייסים",
    route: ["לקרוא את שלוש התוויות למעלה", "לפתוח סיפור אחד ולצפות בפרק", "לבדוק עבודת מעבדה מאומתת ואת ההסמכות"],
    verifiedSlot: "עבודת מעבדה מאומתת",
    verifiedNone: "עדיין לא פורסם. יופיע רק אחרי שאיליא יספק ויאשר ראיות משלו.",
    awaiting: "ממתין לראיות",
    open: "לפתיחת הסיפור",
    chapters: "פרקים",
    previewOnly: "מוצג רק בתצוגה המקדימה המוגנת",
    cats: {
      soc: { name: "סיפורי חקירה ב-SOC", scope: "התראה, בחינת לוגים, קישור אירועים, ראיות וממצאים עם גבולותיהם.", caseFile: null },
      net: { name: "פורנזיקה ברשת", scope: "בחינת חבילות: DNS,‏ TCP ו-TLS, ומה הקלטה יכולה ולא יכולה להראות.", caseFile: "CF-01" },
      siem: { name: "SIEM ואבטחת Windows", scope: "אירועי אימות ב-Windows, דפוסי תקיפה ולוגיקת זיהוי.", caseFile: "CF-02" },
      ad: { name: "Active Directory ותשתיות IT", scope: "מבנה דומיין, OU, חשבונות, Group Policy ואיך מאמתים שינויים.", caseFile: "CF-03" },
    },
  },
  stories: {
    soc: {
      cat: "סיפורי חקירה ב-SOC",
      title: "SOC-01 · מריסוס סיסמאות עד שרת קבצים",
      summary: "התראה אחת נבחנת דרך לוגים וקישור אירועים עד ממצאים שמציינים את גבולותיהם.",
      minutes: "2:40",
      chapters: ["זיהוי ההתראה", "בחינת לוגים", "קישור אירועים", "בחירת ראיות", "ממצאים ומגבלות"],
      at: 4,
      caption: "הממצאים מפרידים בין שלושה דברים: מה האירועים מראים, מה נשאר לא מאושר, ומה הלוגים האלה לא יכולים להראות בכלל.",
      kinds: { fact: "נתמך בראיות", reasoning: "לא מאושר", limit: "לא בלוגים האלה" },
      points: [
        { k: "fact", t: "כניסה כ-j.morgan הצליחה במהלך הריסוס (02:14:37), ואחריה Remote Desktop וכניסה ל-SRV-FILE01 (02:21:13)." },
        { k: "reasoning", t: "האם 203.0.113.77 הוא אותו גורם: הוא חולק את שם הלקוח DESKTOP-7Q2M4, שהמכשיר המתחבר קובע בעצמו." },
        { k: "limit", t: "אילו קבצים, אם בכלל, נפתחו ב-SRV-FILE01. אירועי כניסה לא מתעדים גישה לקבצים." },
      ],
      labels: { next: "צעדים הבאים", n1: "להשבית את j.morgan ולאפס את פרטי הגישה", n2: "להגביל Remote Desktop ב-JMP01", n3: "לאסוף ביקורת גישה לקבצים מ-SRV-FILE01", kept: "אירועים שנשמרו", motion: "פרקים 2 ו-3 קיימים כמחקר תנועה" },
    },
    net: {
      cat: "פורנזיקה ברשת",
      title: "משם עד חיבור מוצפן",
      summary: "חיבור אחד נקרא חבילה אחר חבילה: פענוח DNS, לחיצת היד של TCP ותחילת TLS.",
      minutes: "2:10",
      chapters: ["היקף ההקלטה", "פענוח DNS", "לחיצת יד TCP", "TLS Client Hello", "מה ההקלטה לא מראה"],
      at: 2,
      caption: "שלוש חבילות פותחות את החיבור: SYN,‏ SYN-ACK,‏ ACK. לחיצת היד נמשכת 24.1 ms, ושני הצדדים מסכימים על גודל מקטע ועל הגדלת חלון.",
      kinds: { fact: "נצפה בהקלטה", reasoning: "פרשנות", limit: "מגבלה" },
      points: [
        { k: "fact", t: "חבילות 3–5 משלימות את לחיצת היד עם 198.51.100.40:443 תוך 24.1 ms, בלי שידור חוזר או איפוס." },
        { k: "reasoning", t: "סביר שהחיבור שייך ל-updates.example.com: הוא פונה לכתובת שבתשובת ה-DNS, 1.5 ms אחרי שהגיעה." },
        { k: "limit", t: "כתובת תואמת לא מוכיחה לאיזה שם התכוונה האפליקציה. השם ב-TLS בפרק 4 חזק יותר, אבל עדיין נקבע על ידי הלקוח." },
      ],
      labels: { list: "החבילות בהקלטה", ladder: "לחיצת יד", client: "לקוח", server: "שרת", filter: "מסנן תצוגה (תחביר Wireshark)", no: "מס׳", time: "זמן (ש׳)", src: "מקור", dst: "יעד", proto: "פרוטוקול", len: "אורך", info: "תקציר", rtt: "זמן הלוך-חזור" },
    },
    siem: {
      cat: "SIEM ואבטחת Windows",
      title: "להבדיל בין ריסוס סיסמאות לתקיפת כוח גס",
      summary: "איך אירועי כניסה כושלת (4625) מבחינים בין שני דפוסי תקיפה, ואיך מכיילים כלל זיהוי מול רעש רגיל.",
      minutes: "2:20",
      chapters: ["מה כניסה כושלת מתעדת", "שני דפוסים", "לוגיקת הזיהוי", "בדיקה מול רעש", "גבולות הכלל"],
      at: 2,
      caption: "הכלל סופר חשבונות שונים לכל מקור בעשר דקות. הרבה חשבונות עם מעט ניסיונות לכל אחד הם ריסוס; חשבון אחד עם הרבה ניסיונות הוא כוח גס.",
      kinds: { fact: "נצפה באירועים", reasoning: "פרשנות", limit: "מגבלה" },
      points: [
        { k: "fact", t: "198.51.100.61 נכשל ב-14 חשבונות, פעם אחת בכל אחד. גם 192.0.2.10 חוצה את הסף: 11 חשבונות, 13 כישלונות." },
        { k: "reasoning", t: "192.0.2.10 הוא השער המשותף של המעבדה. 9 מתוך 11 החשבונות שלו נכנסים בהצלחה תוך דקות, מה שנראה כמו טעויות הקלדה ולא ריסוס." },
        { k: "limit", t: "הסף מתאים רק לנתונים האלה. ריסוס איטי שמתפרס על שעות נשאר מתחת לחלון של עשר דקות." },
      ],
      labels: { chart: "כניסות כושלות לפי מקור, חלון של 10 דקות", x: "חשבונות שונים", y: "כישלונות לחשבון", spray: "ריסוס", brute: "כוח גס", review: "דורש בדיקה", normal: "רגיל", rule: "לוגיקת חיפוש (תחביר SPL, אינדקס סינתטי)", fields: "השדות שהכלל קורא", threshold: "סף" },
    },
    ad: {
      cat: "Active Directory ותשתיות IT",
      title: "תכנון ואימות של OU ו-Group Policy",
      summary: "דומיין מעבדה שמחולק ל-OU, עם מדיניות שמקושרת למקום שבו היא חלה, וכל תוצאה נבדקת על לקוח.",
      minutes: "2:30",
      chapters: ["תכנון הדומיין וה-OU", "חשבונות וקבוצות", "קישורי Group Policy", "אימות", "טעויות נפוצות"],
      at: 2,
      caption: "WS-Baseline מקושר ל-OU של Workstations, ולכן מגיע למחשבים שבו. המדיניות חלה לפי סדר, והקישור הקרוב ביותר מנצח בהתנגשות.",
      kinds: { fact: "בתכנון", reasoning: "השפעה צפויה", limit: "חייב אימות" },
      points: [
        { k: "fact", t: "WS-Baseline מקושר רק ל-OU=Workstations וקובע מגבלת חוסר פעילות של 600 שניות." },
        { k: "reasoning", t: "המחשבים ב-Workstations מקבלים אותו; משתמשי Finance לא, כי הגדרות מחשב הולכות לפי אובייקט המחשב." },
        { k: "limit", t: "קישור הוא הכוונה, לא התוצאה. סינון אבטחה, חסימת ירושה או שכפול יכולים לשנות מה חל בפועל, ולכן פרק 4 בודק לקוח." },
      ],
      labels: { tree: "המבנה של lab.local", order: "סדר העיבוד", orderNote: "המאוחר מנצח בהתנגשות. קישור אכוף מנצח קישורים קרובים יותר.", pitfall: "מדיניות סיסמאות שמקושרת ל-OU לא משנה סיסמאות של חשבונות דומיין. משתמשים במדיניות הדומיין או במדיניות סיסמאות מפורטת.", check: "אימות בפרק 4", gpo: "GPO מקושר", setting: "הגדרה" },
    },
  },
  text: {
    title: "גרסת טקסט",
    lead: "לכל סיפור יש גרסת טקסט מלאה עם אותם פרקים, אמירות וערכים. היא נוצרת מאותו מקור כמו הסיפור החזותי, כך שהשניים לא יכולים להתפצל.",
    values: "הערכים בפרק",
    refs: "מקורות",
    refList: ["RFC 1035: Domain names, implementation and specification", "RFC 9293: Transmission Control Protocol", "RFC 7323: TCP extensions for high performance (window scaling)", "RFC 8446: TLS 1.3"],
    back: "חזרה לסיפור החזותי",
  },
  home: {
    chapter: "עבודה טכנית",
    title: "איך קוראים נתוני אבטחה",
    lead: "ארבעה סיפורים מודרכים, כל אחד מסומן לפי מקורו. עבודת מעבדה מאומתת תתווסף ככל שהראיות של איליא יאושרו.",
    cta: "לפתיחת Cyber Operations",
    briefTitle: "תקציר למגייסים · עבודה טכנית",
    brief: [
      ["עבודת מעבדה מאומתת", "עדיין לא פורסמה"],
      ["הדגמות הדרכה", "רשת, SIEM,‏ Active Directory · בסיוע בינה מלאכותית · נתונים סינתטיים"],
      ["סימולציית הדרכה", "SOC-01 · אירוע בדיוני"],
    ],
  },
};

const ar: OpsCopy = {
  banner: "نموذج مقترح · إطار ثابت · معاينة محمية، غير منشور",
  frameNames: { hub: "مركز العمليات", net: "التحليل الجنائي للشبكات", siem: "SIEM وWindows", ad: "Active Directory", soc: "قصة SOC", text: "النسخة النصية", home: "الرئيسية والمجنِّدون" },
  eyebrow: "إيلي سعد — Cyber Operations",
  tiers: {
    verified: { label: "عمل مختبري موثَّق", desc: "عمل إيلي المختبري نفسه، يُعرض مع أدلته المنقّحة وبموافقته." },
    demonstration: { label: "عرض تدريبي", desc: "يشرح منهجية باستخدام بيانات اصطناعية. أُنشئ بمساعدة الذكاء الاصطناعي؛ وليس سجلًا لعمل منجَز." },
    simulation: { label: "محاكاة تدريبية", desc: "حادثة خيالية ببيانات اصطناعية، تُعرض كتحقيق كامل." },
  },
  review: { tech: "التدقيق التقني", eli: "مراجعة إيلي", pending: "قيد التنفيذ" },
  disclosure: "أُنشئت القصة والبيانات الاصطناعية ومسودات النص بمساعدة الذكاء الاصطناعي. مراجعة إيلي سعد قيد التنفيذ.",
  synthetic: "بيانات اصطناعية",
  notSoftware: "رسم مخصص، وليس برنامج Wireshark أو Splunk أو Microsoft.",
  simNote: "شركة وبيانات خيالية. ليست حادثة حقيقية.",
  player: { chapter: "الفصل", of: "من", play: "تشغيل", text: "النسخة النصية", captions: "الترجمة", reasoning: "الاستدلال", replay: "إعادة الفصل", next: "الفصل التالي" },
  hub: {
    title: "عمل تقني، مشروح",
    lead: "قصص مرئية موجَّهة عن قراءة بيانات الأمن: ما الذي يُفحص، ولماذا، وماذا يُظهر، وأين حدوده. كل قصة موسومة بمصدرها.",
    readTitle: "كيف تُقرأ هذه الصفحة",
    routeTitle: "مسار دقيقتين للمجنِّدين",
    route: ["اقرأ الوسوم الثلاثة أعلاه", "افتح قصة واحدة وشاهد فصلًا", "راجع العمل المختبري الموثَّق والشهادات"],
    verifiedSlot: "عمل مختبري موثَّق",
    verifiedNone: "لم يُنشر بعد. يظهر فقط بعد أن يقدّم إيلي أدلته الخاصة ويوافق عليها.",
    awaiting: "بانتظار الأدلة",
    open: "افتح القصة",
    chapters: "فصول",
    previewOnly: "يظهر في المعاينة المحمية فقط",
    cats: {
      soc: { name: "قصص تحقيق SOC", scope: "التنبيه، وفحص السجلات، وربط الأحداث، والأدلة، والنتائج مع حدودها.", caseFile: null },
      net: { name: "التحليل الجنائي للشبكات", scope: "فحص الحزم: DNS وTCP وTLS، وما يمكن للالتقاط إظهاره وما لا يمكنه.", caseFile: "CF-01" },
      siem: { name: "SIEM وأمن Windows", scope: "أحداث المصادقة في Windows، وأنماط الهجوم، ومنطق الكشف.", caseFile: "CF-02" },
      ad: { name: "Active Directory والبنية التحتية", scope: "بنية النطاق، وOU، والحسابات، وGroup Policy، وكيفية التحقق من التغييرات.", caseFile: "CF-03" },
    },
  },
  stories: {
    soc: {
      cat: "قصص تحقيق SOC",
      title: "SOC-01 · من رشّ كلمات المرور إلى خادم الملفات",
      summary: "تنبيه واحد يُتتبَّع عبر السجلات وربط الأحداث حتى نتائج تذكر حدودها.",
      minutes: "2:40",
      chapters: ["اكتشاف التنبيه", "فحص السجلات", "ربط الأحداث", "اختيار الأدلة", "النتائج والقيود"],
      at: 4,
      caption: "تفصل النتائج بين ثلاثة أمور: ما تُظهره الأحداث، وما يبقى غير مؤكَّد، وما لا تستطيع هذه السجلات إظهاره إطلاقًا.",
      kinds: { fact: "مدعوم بالأدلة", reasoning: "غير مؤكَّد", limit: "ليس في هذه السجلات" },
      points: [
        { k: "fact", t: "نجح تسجيل دخول باسم j.morgan أثناء الرشّ (02:14:37)، وتبعه Remote Desktop ثم تسجيل دخول إلى SRV-FILE01 (02:21:13)." },
        { k: "reasoning", t: "هل 203.0.113.77 هو الفاعل نفسه: يشترك في اسم العميل DESKTOP-7Q2M4، الذي يحدده الجهاز المتصل بنفسه." },
        { k: "limit", t: "أيّ الملفات فُتحت على SRV-FILE01، إن وُجدت. أحداث تسجيل الدخول لا تسجّل الوصول إلى الملفات." },
      ],
      labels: { next: "الخطوات التالية", n1: "تعطيل j.morgan وإعادة تعيين بيانات اعتماده", n2: "تقييد Remote Desktop على JMP01", n3: "جمع تدقيق الوصول إلى الملفات من SRV-FILE01", kept: "الأحداث المحفوظة", motion: "الفصلان 2 و3 موجودان كدراسة حركة" },
    },
    net: {
      cat: "التحليل الجنائي للشبكات",
      title: "من اسم إلى جلسة مشفّرة",
      summary: "اتصال واحد يُقرأ حزمة بحزمة: تحليل DNS، ومصافحة TCP، وبداية TLS.",
      minutes: "2:10",
      chapters: ["نطاق الالتقاط", "تحليل DNS", "مصافحة TCP", "TLS Client Hello", "ما لا يُظهره الالتقاط"],
      at: 2,
      caption: "ثلاث حزم تفتح الاتصال: SYN وSYN-ACK وACK. تستغرق المصافحة 24.1 ms، ويتفق الطرفان على حجم المقطع وتوسيع النافذة.",
      kinds: { fact: "ملاحَظ في الالتقاط", reasoning: "تفسير", limit: "قيد" },
      points: [
        { k: "fact", t: "تُكمل الحزم 3–5 المصافحة مع 198.51.100.40:443 خلال 24.1 ms، دون إعادة إرسال أو إعادة ضبط." },
        { k: "reasoning", t: "يُرجَّح أن الاتصال يخص updates.example.com: فهو يتجه إلى العنوان الوارد في رد DNS، بعد وصوله بـ 1.5 ms." },
        { k: "limit", t: "تطابق العنوان لا يثبت أيّ اسم قصده التطبيق. الاسم في TLS في الفصل 4 أقوى، لكنه يبقى من تحديد العميل." },
      ],
      labels: { list: "الحزم في هذا الالتقاط", ladder: "المصافحة", client: "العميل", server: "الخادم", filter: "مرشّح العرض (صيغة Wireshark)", no: "رقم", time: "الزمن (ث)", src: "المصدر", dst: "الوجهة", proto: "البروتوكول", len: "الطول", info: "الملخص", rtt: "زمن الذهاب والإياب" },
    },
    siem: {
      cat: "SIEM وأمن Windows",
      title: "التمييز بين رشّ كلمات المرور وهجوم القوة الغاشمة",
      summary: "كيف تميّز أحداث فشل تسجيل الدخول (4625) بين نمطين من الهجوم، وكيف تُضبط قاعدة كشف أمام الضجيج العادي.",
      minutes: "2:20",
      chapters: ["ما يسجّله فشل تسجيل الدخول", "نمطان", "منطق الكشف", "الاختبار أمام الضجيج", "حدود القاعدة"],
      at: 2,
      caption: "تعدّ القاعدة الحسابات المختلفة لكل مصدر خلال عشر دقائق. حسابات كثيرة بمحاولات قليلة لكل منها رشّ؛ وحساب واحد بمحاولات كثيرة قوة غاشمة.",
      kinds: { fact: "ملاحَظ في الأحداث", reasoning: "تفسير", limit: "قيد" },
      points: [
        { k: "fact", t: "فشل 198.51.100.61 على 14 حسابًا، مرة واحدة لكل حساب. ويتجاوز 192.0.2.10 العتبة أيضًا: 11 حسابًا و13 فشلًا." },
        { k: "reasoning", t: "‏192.0.2.10 هو البوابة المشتركة للمختبر. 9 من حساباته الـ 11 تسجّل دخولًا ناجحًا خلال دقائق، وهو ما يشبه أخطاء الكتابة لا الرشّ." },
        { k: "limit", t: "العتبة تناسب هذه البيانات فقط. الرشّ البطيء الموزَّع على ساعات يبقى تحت نافذة العشر دقائق." },
      ],
      labels: { chart: "فشل تسجيل الدخول لكل مصدر، نافذة 10 دقائق", x: "حسابات مختلفة", y: "مرات الفشل لكل حساب", spray: "رشّ", brute: "قوة غاشمة", review: "يحتاج مراجعة", normal: "عادي", rule: "منطق البحث (صيغة SPL، فهرس اصطناعي)", fields: "الحقول التي تقرؤها القاعدة", threshold: "العتبة" },
    },
    ad: {
      cat: "Active Directory والبنية التحتية",
      title: "تصميم OU وGroup Policy والتحقق منهما",
      summary: "نطاق مختبري مقسَّم إلى OU، مع سياسات مرتبطة حيث تسري، وكل نتيجة يُتحقَّق منها على جهاز عميل.",
      minutes: "2:30",
      chapters: ["تصميم النطاق وOU", "الحسابات والمجموعات", "روابط Group Policy", "التحقق", "أخطاء شائعة"],
      at: 2,
      caption: "‏WS-Baseline مرتبط بـ OU الخاص بـ Workstations، فيصل إلى الأجهزة فيه. تُطبَّق السياسات بالترتيب، والرابط الأقرب يغلب عند التعارض.",
      kinds: { fact: "في التصميم", reasoning: "الأثر المتوقع", limit: "يجب التحقق" },
      points: [
        { k: "fact", t: "‏WS-Baseline مرتبط فقط بـ OU=Workstations ويضبط حد خمول قدره 600 ثانية." },
        { k: "reasoning", t: "تتلقاه الأجهزة في Workstations؛ أما مستخدمو Finance فلا، لأن إعدادات الجهاز تتبع كائن الجهاز." },
        { k: "limit", t: "الرابط هو النية لا النتيجة. قد يغيّر تصفية الأمان أو حظر التوريث أو النسخ المتماثل ما يُطبَّق فعلًا، لذا يفحص الفصل 4 جهاز عميل." },
      ],
      labels: { tree: "بنية lab.local", order: "ترتيب المعالجة", orderNote: "اللاحق يغلب عند التعارض. والرابط المفروض يغلب الروابط الأقرب.", pitfall: "سياسة كلمات المرور المرتبطة بـ OU لا تغيّر كلمات مرور حسابات النطاق. استخدم سياسة النطاق أو سياسة كلمات مرور دقيقة.", check: "التحقق في الفصل 4", gpo: "GPO مرتبط", setting: "الإعداد" },
    },
  },
  text: {
    title: "النسخة النصية",
    lead: "لكل قصة نسخة نصية كاملة بالفصول والعبارات والقيم نفسها. تُولَّد من المصدر نفسه الذي تُبنى منه القصة المرئية، فلا يمكن أن تختلفا.",
    values: "القيم في هذا الفصل",
    refs: "المراجع",
    refList: ["RFC 1035: Domain names, implementation and specification", "RFC 9293: Transmission Control Protocol", "RFC 7323: TCP extensions for high performance (window scaling)", "RFC 8446: TLS 1.3"],
    back: "العودة إلى القصة المرئية",
  },
  home: {
    chapter: "العمل التقني",
    title: "كيف تُقرأ بيانات الأمن",
    lead: "أربع قصص موجَّهة، كل منها موسومة بمصدرها. يُضاف العمل المختبري الموثَّق كلما اعتُمدت أدلة إيلي.",
    cta: "افتح Cyber Operations",
    briefTitle: "ملخص المجنِّدين · العمل التقني",
    brief: [
      ["عمل مختبري موثَّق", "لم يُنشر بعد"],
      ["عروض تدريبية", "الشبكات، SIEM، Active Directory · بمساعدة الذكاء الاصطناعي · بيانات اصطناعية"],
      ["محاكاة تدريبية", "SOC-01 · حادثة خيالية"],
    ],
  },
};

export const opsCopy: Record<Locale, OpsCopy> = { en, he, ar };

/** Which tier each story belongs to. Verified work comes only from approved case files. */
export const storyTier: Record<StoryId, Tier> = { soc: "simulation", net: "demonstration", siem: "demonstration", ad: "demonstration" };
/** Mockup frames in reading order. */
export const frames: Frame[] = ["hub", "soc", "net", "siem", "ad", "text", "home"];
export const storyOrder: StoryId[] = ["soc", "net", "siem", "ad"];
