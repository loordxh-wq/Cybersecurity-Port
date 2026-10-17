/**
 * Phase 3 showcase mockup copy, EN/HE/AR. Kept with the mockup, not in messages/*.json, so
 * approved Phase 1/2 message files stay untouched. Technical labels (log columns, field names,
 * findings) are reused from the lab mockup copy; only the walkthrough's own words live here.
 *
 * Every chapter answers five questions about Eli's workflow: what was examined, why, what was
 * observed, what the evidence supports, and what remains uncertain. All of it is DRAFT text,
 * prepared with AI assistance, for Eli to review and correct before anything is approved.
 */
export type Frame = "hub" | "c1" | "c2" | "c3" | "c4" | "c5" | "end" | "text";
export type ChapterKey = "alert" | "logs" | "correlate" | "evidence" | "findings";

type Chapter = {
  key: ChapterKey;
  title: string;
  time: string;
  /** Captions, in Eli's voice. */
  narration: string;
  examined: string;
  why: string;
  /** One line per numbered marker on the analyst screen. */
  observed: string[];
  supports: string;
  uncertain: string;
  skills: string[];
  still: string;
};

export type ShowcaseCopy = {
  review: string;
  frame: string;
  frames: Record<Frame, string>;
  draft: string;
  credit: string;
  sim: string;
  notReal: string;
  screenTag: string;
  hub: {
    kicker: string;
    title: string;
    lead: string;
    observer: string;
    featured: string;
    flagTitle: string;
    meta: [string, string][];
    watch: string;
    read: string;
    showsTitle: string;
    shows: string[];
    chaptersTitle: string;
    moreTitle: string;
    moreNote: string;
    more: { code: string; title: string; tools: string }[];
    planned: string;
  };
  player: {
    chapterOf: string;
    play: string;
    pause: string;
    replay: string;
    prev: string;
    next: string;
    text: string;
    captions: string;
    skip: string;
    progress: string;
    skills: string;
    chapters: string;
    q: Record<"examined" | "why" | "observed" | "supports" | "uncertain", string>;
  };
  chapters: [Chapter, Chapter, Chapter, Chapter, Chapter];
  scene: {
    h2why: string;
    query: string;
    alertFired: string;
    rule: string;
    spray: string;
    lateral: string;
    second: string;
    timeline: string;
    evidenceTitle: string;
    evidenceCount: string;
    next: string;
  };
  end: { title: string; points: string[]; cases: string; cv: string; again: string; data: string };
  text: { title: string; intro: string; still: string };
};

const en: ShowcaseCopy = {
  review: "Proposal mockup · static frames, nothing plays",
  frame: "Frame: {s}",
  frames: {
    hub: "showcase entry",
    c1: "chapter 1, playing",
    c2: "chapter 2, playing",
    c3: "chapter 3, playing",
    c4: "chapter 4, playing",
    c5: "chapter 5, playing",
    end: "end card",
    text: "text version (also the reduced-motion view)",
  },
  draft: "Draft text for Eli to review and correct before approval.",
  credit: "Scenario, synthetic data and draft text were created with AI assistance for this portfolio. Eli Saad's review and validation are in progress.",
  sim: "Training simulation",
  notReal: "Fictional company and data. Not a real incident.",
  screenTag: "Simulated SIEM interface · fictional data",
  hub: {
    kicker: "Investigations",
    title: "See how I investigate",
    lead: "A guided walkthrough of my workflow on one alert: what I examine, why, what I observe, what the evidence supports and what stays uncertain.",
    observer: "You watch; there is nothing to solve. Play, pause or jump to any chapter.",
    featured: "Featured walkthrough",
    flagTitle: "Suspicious Windows logins",
    meta: [
      ["Format", "Guided walkthrough · 5 chapters"],
      ["Length", "About 2 min 40 s"],
      ["Data", "Windows Security log · fictional"],
      ["Shown in", "A simulated SIEM interface"],
    ],
    watch: "Watch the walkthrough",
    read: "Read it as text",
    showsTitle: "What it shows",
    shows: ["Alert triage", "Windows Event Logs (4624, 4625)", "Correlation and timelines", "Evidence-based findings"],
    chaptersTitle: "Chapters",
    moreTitle: "From my own lab",
    moreNote: "Review only: these stay hidden from the public site until my recordings and evidence are approved.",
    more: [
      { code: "CF-01", title: "Network traffic investigation", tools: "Wireshark · Kali Linux" },
      { code: "CF-02", title: "SOC alert investigation", tools: "Splunk · Windows Event Logs" },
      { code: "CF-03", title: "Active Directory operations", tools: "Windows Server · PowerShell" },
    ],
    planned: "Recording planned",
  },
  player: {
    chapterOf: "Chapter {n} of 5",
    play: "Play",
    pause: "Pause",
    replay: "Replay chapter",
    prev: "Previous chapter",
    next: "Next chapter",
    text: "Text version",
    captions: "Captions",
    skip: "Skip to findings",
    progress: "Walkthrough progress",
    skills: "Skills shown",
    chapters: "Chapters",
    q: { examined: "What I examined", why: "Why", observed: "What I observed", supports: "What the evidence supports", uncertain: "What remains uncertain" },
  },
  chapters: [
    {
      key: "alert",
      title: "Alert detection",
      time: "0:00",
      narration: "02:15, a high-severity alert. Before I open any logs, I read the rule behind it: it tells me what the alert can claim, and what it cannot.",
      examined: "ALR-0418, the overnight queue around it, and the detection rule that fired.",
      why: "The rule's logic sets the limits of the alert and decides where I look first.",
      observed: [
        "ALR-0418 matched j.morgan on JMP01, a jump server reachable over Remote Desktop.",
        "A minute later, ALR-0419 fired for one source address: 203.0.113.45.",
        "The rule: 3 or more failed logons from one source address, then a successful logon from the same source, within 10 minutes.",
      ],
      supports: "Enough to open an investigation into this source and this account. On its own, an alert shows a pattern, not a compromise.",
      uncertain: "Whether the successful logon was the account owner, and whether both alerts describe the same activity.",
      skills: ["Alert triage", "Detection logic"],
      still: "The alert queue with ALR-0418 and ALR-0419 highlighted, and the rule that fired.",
    },
    {
      key: "logs",
      title: "Log examination",
      time: "0:25",
      narration: "I pivot to every event from 203.0.113.45 in the window, then open the one success and compare it with how j.morgan normally logs on.",
      examined: "All events from 203.0.113.45 in the alert window, then the successful logon e-0193, field by field.",
      why: "To test the alert against raw events, and to compare the success with the account's usual behaviour.",
      observed: [
        "17 failures, one per account, on average one attempt every 22 seconds: sub-status 0xC000006A (wrong password) or 0xC0000064 (no such account).",
        "e-0193: logon type 3 with NTLM. j.morgan's earlier logons used Kerberos from 198.51.100.142.",
        "Fifteen seconds later, e-0194: logon type 10, a Remote Desktop session from the same source.",
      ],
      supports: "A password spray from one source, during which a logon as j.morgan succeeded and was followed by a Remote Desktop session.",
      uncertain: "Who was at the keyboard: the logs identify the account, not the person using it.",
      skills: ["Windows Event Logs", "Query and filtering"],
      still: "Log search filtered to 203.0.113.45, with the two successful logons highlighted and the fields of e-0193.",
    },
    {
      key: "correlate",
      title: "Event correlation",
      time: "1:05",
      narration: "Next I connect sources, accounts and hosts over time, to see where the account went after the success, and whether anyone else was involved.",
      examined: "Relationships between sources, accounts and hosts across the window, and what j.morgan's account did next.",
      why: "To set the scope: which hosts were reached after the success, and which activity is unrelated noise.",
      observed: [
        "02:21: j.morgan authenticated to SRV-FILE01 from JMP01's internal address, with Kerberos.",
        "203.0.113.77 made 7 failed attempts from 02:31, reporting the same client name, DESKTOP-7Q2M4.",
        "The svc-backup failures come from its scheduled job after a password change, not from this activity.",
      ],
      supports: "Activity moved from JMP01 to SRV-FILE01 under j.morgan's account. The svc-backup lockout is unrelated.",
      uncertain: "Whether 203.0.113.77 is the same actor: a shared client name is an indicator, not attribution.",
      skills: ["Correlation", "Timeline analysis"],
      still: "The relationship map from the external source to j.morgan, JMP01 and SRV-FILE01, with the timeline below.",
    },
    {
      key: "evidence",
      title: "Evidence selection",
      time: "1:40",
      narration: "I keep only the events that carry the story, starting with a baseline, so anyone can retrace each step behind my findings.",
      examined: "Which events each finding needs, and which events are noise.",
      why: "A finding is only as strong as the events behind it; a reviewer must be able to retrace it.",
      observed: [
        "A baseline logon from 10 March comes first, so the contrast is visible.",
        "Seven events in time order, each kept for a one-line reason.",
        "Only events from the logs; no assumption is presented as evidence.",
      ],
      supports: "Every finding in the next chapter points to at least one kept event.",
      uncertain: "What happened inside the Remote Desktop session: authentication events do not record actions.",
      skills: ["Evidence handling", "Documentation"],
      still: "Seven selected events in time order, each with the reason it was kept.",
    },
    {
      key: "findings",
      title: "Findings and limitations",
      time: "2:10",
      narration: "Finally, I separate what the logs record from what I conclude, and I name what this data cannot show. That boundary matters as much as the finding.",
      examined: "The kept evidence against each claim I could make.",
      why: "To state only what the data supports, and to make the limits clear to whoever acts next.",
      observed: [
        "Observed facts are stated without interpretation.",
        "The shared client name stays unconfirmed.",
        "File access on SRV-FILE01 cannot be determined from logon events.",
      ],
      supports: "j.morgan's password was guessed during the spray and then used for Remote Desktop and a logon to SRV-FILE01. Contain the account and the RDP exposure first.",
      uncertain: "Which files, if any, were accessed on SRV-FILE01; whether the session is still open; whether 203.0.113.77 is linked.",
      skills: ["Reporting", "Analytical judgement"],
      still: "Findings grouped as observed, supported, unconfirmed and not determinable, with next steps.",
    },
  ],
  scene: {
    h2why: "A shared client name and a neighbouring address do not prove a shared actor.",
    query: "ip:203.0.113.45",
    alertFired: "Fired {t}",
    rule: "Rule",
    spray: "18 accounts · 6 min 35 s",
    lateral: "JMP01 → SRV-FILE01",
    second: "Second source · indicator only",
    timeline: "Timeline, 11 Mar (UTC)",
    evidenceTitle: "Selected evidence",
    evidenceCount: "7 events",
    next: "Next steps",
  },
  end: {
    title: "What this walkthrough demonstrates",
    points: [
      "Triage that starts from what the rule actually claims.",
      "Reading Windows logon events field by field, against a baseline.",
      "Correlating sources, accounts and hosts over time.",
      "Keeping observed facts, conclusions and unknowns apart.",
    ],
    cases: "See my case files",
    cv: "Request my CV",
    again: "Watch again",
    data: "Fictional organisation (northwind.example), documentation-range IP addresses and fictional accounts.",
  },
  text: {
    title: "The walkthrough as text",
    intro: "Every chapter with its narration and key screen, without motion. With reduced motion turned on, the walkthrough opens here.",
    still: "Screen",
  },
};

const he: ShowcaseCopy = {
  review: "מוקאפ להצעה · פריימים סטטיים, שום דבר לא מתנגן",
  frame: "פריים: {s}",
  frames: {
    hub: "כניסה לתצוגה",
    c1: "פרק 1, בניגון",
    c2: "פרק 2, בניגון",
    c3: "פרק 3, בניגון",
    c4: "פרק 4, בניגון",
    c5: "פרק 5, בניגון",
    end: "כרטיס סיום",
    text: "גרסת טקסט (גם התצוגה עם תנועה מופחתת)",
  },
  draft: "טיוטת טקסט שאיליא יבדוק ויתקן לפני אישור.",
  credit: "התרחיש, הנתונים הסינתטיים וטיוטות הטקסט נוצרו בסיוע בינה מלאכותית עבור תיק העבודות הזה. הבדיקה והאימות של איליא סעד עדיין בתהליך.",
  sim: "סימולציית הדרכה",
  notReal: "חברה ונתונים בדיוניים. לא אירוע אמיתי.",
  screenTag: "ממשק SIEM מדומה · נתונים בדיוניים",
  hub: {
    kicker: "חקירות",
    title: "ראו איך אני חוקר",
    lead: "הדגמה מודרכת של תהליך העבודה שלי על התראה אחת: מה אני בודק, למה, מה אני רואה, במה הראיות תומכות ומה נשאר לא ודאי.",
    observer: "אתם צופים, אין כאן משהו לפתור. אפשר לנגן, לעצור או לקפוץ לכל פרק.",
    featured: "הדגמה מובילה",
    flagTitle: "התחברויות Windows חשודות",
    meta: [
      ["פורמט", "הדגמה מודרכת · 5 פרקים"],
      ["אורך", "כ-2 דקות ו-40 שניות"],
      ["נתונים", "יומן האבטחה של Windows · בדיוני"],
      ["מוצג ב", "ממשק SIEM מדומה"],
    ],
    watch: "צפו בהדגמה",
    read: "קראו כטקסט",
    showsTitle: "מה רואים",
    shows: ["תעדוף התראות", "יומני אירועים של Windows (4624, 4625)", "קורלציה וצירי זמן", "ממצאים מבוססי ראיות"],
    chaptersTitle: "פרקים",
    moreTitle: "מהמעבדה שלי",
    moreNote: "לסקירה בלבד: אלה נשארים מוסתרים מהאתר הציבורי עד שההקלטות והראיות שלי יאושרו.",
    more: [
      { code: "CF-01", title: "חקירת תעבורת רשת", tools: "Wireshark · Kali Linux" },
      { code: "CF-02", title: "חקירת התראת SOC", tools: "Splunk · Windows Event Logs" },
      { code: "CF-03", title: "תפעול Active Directory", tools: "Windows Server · PowerShell" },
    ],
    planned: "הקלטה מתוכננת",
  },
  player: {
    chapterOf: "פרק {n} מתוך 5",
    play: "נגן",
    pause: "השהה",
    replay: "נגן את הפרק שוב",
    prev: "הפרק הקודם",
    next: "הפרק הבא",
    text: "גרסת טקסט",
    captions: "כתוביות",
    skip: "דלגו לממצאים",
    progress: "התקדמות ההדגמה",
    skills: "מיומנויות שמוצגות",
    chapters: "פרקים",
    q: { examined: "מה בדקתי", why: "למה", observed: "מה ראיתי", supports: "במה הראיות תומכות", uncertain: "מה נשאר לא ודאי" },
  },
  chapters: [
    {
      key: "alert",
      title: "זיהוי ההתראה",
      time: "0:00",
      narration: "02:15, התראה בחומרה גבוהה. לפני שאני פותח יומנים, אני קורא את הכלל שמאחוריה: הוא אומר לי מה ההתראה יכולה לטעון, ומה לא.",
      examined: "את ALR-0418, את תור ההתראות של הלילה סביבה ואת כלל הזיהוי שהופעל.",
      why: "הלוגיקה של הכלל קובעת את גבולות ההתראה ומכריעה איפה אני מסתכל קודם.",
      observed: [
        "ALR-0418 זיהה את j.morgan בשרת JMP01, שרת קפיצה שנגיש דרך Remote Desktop.",
        "דקה אחר כך עלתה ALR-0419 עבור כתובת מקור אחת: 203.0.113.45.",
        "הכלל: 3 התחברויות כושלות או יותר מכתובת מקור אחת, ואחריהן התחברות מוצלחת מאותו מקור, בתוך 10 דקות.",
      ],
      supports: "מספיק כדי לפתוח חקירה של המקור הזה ושל החשבון הזה. התראה לבדה מראה דפוס, לא פריצה.",
      uncertain: "האם ההתחברות המוצלחת הייתה של בעל החשבון, והאם שתי ההתראות מתארות את אותה פעילות.",
      skills: ["תעדוף התראות", "לוגיקת זיהוי"],
      still: "תור ההתראות עם ALR-0418 ו-ALR-0419 מודגשות, והכלל שהופעל.",
    },
    {
      key: "logs",
      title: "בדיקת היומנים",
      time: "0:25",
      narration: "אני עובר לכל האירועים מ-203.0.113.45 בחלון הזמן, ואז פותח את ההצלחה היחידה ומשווה אותה לדרך שבה j.morgan מתחבר בדרך כלל.",
      examined: "את כל האירועים מ-203.0.113.45 בחלון ההתראה, ואז את ההתחברות המוצלחת e-0193, שדה אחר שדה.",
      why: "כדי לבדוק את ההתראה מול האירועים הגולמיים, ולהשוות את ההצלחה להתנהגות הרגילה של החשבון.",
      observed: [
        "17 כישלונות, אחד לכל חשבון, בממוצע ניסיון כל 22 שניות: תת-סטטוס 0xC000006A (סיסמה שגויה) או 0xC0000064 (חשבון לא קיים).",
        "e-0193: סוג התחברות 3 עם NTLM. ההתחברויות הקודמות של j.morgan השתמשו ב-Kerberos מ-198.51.100.142.",
        "חמש עשרה שניות אחר כך, e-0194: סוג התחברות 10, סשן Remote Desktop מאותו מקור.",
      ],
      supports: "ריסוס סיסמאות ממקור אחד, שבמהלכו הצליחה התחברות בשם j.morgan ואחריה נפתח סשן Remote Desktop.",
      uncertain: "מי ישב מול המקלדת: היומנים מזהים את החשבון, לא את האדם שמשתמש בו.",
      skills: ["יומני אירועים של Windows", "שאילתות וסינון"],
      still: "חיפוש ביומנים מסונן ל-203.0.113.45, עם שתי ההתחברויות המוצלחות מודגשות והשדות של e-0193.",
    },
    {
      key: "correlate",
      title: "קורלציה בין אירועים",
      time: "1:05",
      narration: "אחר כך אני מחבר בין מקורות, חשבונות ושרתים לאורך זמן, כדי לראות לאן החשבון הגיע אחרי ההצלחה, והאם היו מעורבים גורמים נוספים.",
      examined: "את הקשרים בין מקורות, חשבונות ושרתים לאורך החלון, ואת מה שהחשבון של j.morgan עשה אחר כך.",
      why: "כדי לקבוע את ההיקף: לאילו שרתים הגיעו אחרי ההצלחה, ואיזו פעילות היא רעש שאינו קשור.",
      observed: [
        "02:21: j.morgan התאמת ל-SRV-FILE01 מהכתובת הפנימית של JMP01, עם Kerberos.",
        "203.0.113.77 ביצעה 7 ניסיונות כושלים מ-02:31, עם אותו שם לקוח, DESKTOP-7Q2M4.",
        "הכישלונות של svc-backup מגיעים מהמשימה המתוזמנת שלו אחרי החלפת סיסמה, לא מהפעילות הזו.",
      ],
      supports: "הפעילות עברה מ-JMP01 ל-SRV-FILE01 תחת החשבון של j.morgan. הנעילה של svc-backup אינה קשורה.",
      uncertain: "האם 203.0.113.77 הוא אותו גורם: שם לקוח משותף הוא אינדיקציה, לא ייחוס.",
      skills: ["קורלציה", "ניתוח ציר זמן"],
      still: "מפת הקשרים מהמקור החיצוני אל j.morgan, ‏JMP01 ו-SRV-FILE01, עם ציר הזמן מתחת.",
    },
    {
      key: "evidence",
      title: "בחירת ראיות",
      time: "1:40",
      narration: "אני שומר רק את האירועים שנושאים את הסיפור, החל מנקודת בסיס, כך שכל אחד יוכל לשחזר כל צעד שעומד מאחורי הממצאים שלי.",
      examined: "אילו אירועים כל ממצא צריך, ואילו אירועים הם רעש.",
      why: "ממצא חזק רק כמו האירועים שמאחוריו; בודק צריך להיות מסוגל לשחזר אותו.",
      observed: [
        "התחברות בסיס מ-10 במרץ באה ראשונה, כדי שהניגוד ייראה.",
        "שבעה אירועים לפי סדר הזמן, כל אחד נשמר מסיבה בשורה אחת.",
        "רק אירועים מהיומנים; שום הנחה לא מוצגת כראיה.",
      ],
      supports: "כל ממצא בפרק הבא מצביע על לפחות אירוע שמור אחד.",
      uncertain: "מה קרה בתוך סשן ה-Remote Desktop: אירועי אימות לא מתעדים פעולות.",
      skills: ["טיפול בראיות", "תיעוד"],
      still: "שבעה אירועים שנבחרו לפי סדר הזמן, לכל אחד הסיבה שבגללה נשמר.",
    },
    {
      key: "findings",
      title: "ממצאים ומגבלות",
      time: "2:10",
      narration: "לבסוף, אני מפריד בין מה שהיומנים מתעדים לבין מה שאני מסיק, ומציין מה הנתונים האלה לא יכולים להראות. הגבול הזה חשוב כמו הממצא עצמו.",
      examined: "את הראיות השמורות מול כל טענה שיכולתי לטעון.",
      why: "כדי לקבוע רק את מה שהנתונים תומכים בו, ולהבהיר את הגבולות למי שפועל אחריי.",
      observed: ["עובדות שנצפו מוצגות בלי פרשנות.", "שם הלקוח המשותף נשאר לא מאומת.", "גישה לקבצים ב-SRV-FILE01 אינה ניתנת לקביעה מאירועי התחברות."],
      supports: "הסיסמה של j.morgan נוחשה במהלך הריסוס ושימשה אחר כך ל-Remote Desktop ולהתחברות ל-SRV-FILE01. קודם כול יש לבלום את החשבון ואת החשיפה של RDP.",
      uncertain: "לאילו קבצים, אם בכלל, הייתה גישה ב-SRV-FILE01; האם הסשן עדיין פתוח; האם 203.0.113.77 קשורה.",
      skills: ["דיווח", "שיקול דעת אנליטי"],
      still: "ממצאים מקובצים לפי נצפה, נתמך, לא מאומת ולא ניתן לקביעה, עם הצעדים הבאים.",
    },
  ],
  scene: {
    h2why: "שם לקוח משותף וכתובת סמוכה אינם מוכיחים גורם משותף.",
    query: "ip:203.0.113.45",
    alertFired: "הופעלה {t}",
    rule: "כלל",
    spray: "18 חשבונות · 6 דק' 35 שנ'",
    lateral: "JMP01 → SRV-FILE01",
    second: "מקור שני · אינדיקציה בלבד",
    timeline: "ציר זמן, 11 במרץ (UTC)",
    evidenceTitle: "ראיות שנבחרו",
    evidenceCount: "7 אירועים",
    next: "הצעדים הבאים",
  },
  end: {
    title: "מה ההדגמה הזו מראה",
    points: [
      "תעדוף שמתחיל ממה שהכלל באמת טוען.",
      "קריאת אירועי התחברות של Windows שדה אחר שדה, מול נקודת בסיס.",
      "קורלציה בין מקורות, חשבונות ושרתים לאורך זמן.",
      "הפרדה בין עובדות שנצפו, מסקנות ונעלמים.",
    ],
    cases: "לתיקי החקירה שלי",
    cv: "בקשת קורות חיים",
    again: "צפו שוב",
    data: "ארגון בדיוני (northwind.example), כתובות IP מטווח התיעוד וחשבונות בדיוניים.",
  },
  text: {
    title: "ההדגמה כטקסט",
    intro: "כל פרק עם הקריינות והמסך המרכזי שלו, בלי תנועה. כשהגדרת תנועה מופחתת פעילה, ההדגמה נפתחת כאן.",
    still: "מסך",
  },
};

const ar: ShowcaseCopy = {
  review: "نموذج مقترح · إطارات ثابتة، لا شيء يُشغَّل",
  frame: "الإطار: {s}",
  frames: {
    hub: "مدخل العرض",
    c1: "الفصل 1، قيد التشغيل",
    c2: "الفصل 2، قيد التشغيل",
    c3: "الفصل 3، قيد التشغيل",
    c4: "الفصل 4، قيد التشغيل",
    c5: "الفصل 5، قيد التشغيل",
    end: "بطاقة الختام",
    text: "النسخة النصية (وهي أيضًا عرض الحركة المخففة)",
  },
  draft: "مسودة نص يراجعها إيلي ويصححها قبل الاعتماد.",
  credit: "أُنشئ السيناريو والبيانات الاصطناعية ومسودات النص بمساعدة الذكاء الاصطناعي لهذا الملف. مراجعة إيلي سعد والتحقق منها لا يزالان قيد التنفيذ.",
  sim: "محاكاة تدريبية",
  notReal: "شركة وبيانات خيالية. ليست حادثة حقيقية.",
  screenTag: "واجهة SIEM محاكاة · بيانات خيالية",
  hub: {
    kicker: "تحقيقات",
    title: "شاهد كيف أحقق",
    lead: "عرض موجّه لطريقة عملي على تنبيه واحد: ما أفحصه، ولماذا، وما ألاحظه، وما تدعمه الأدلة، وما يبقى غير مؤكد.",
    observer: "أنت تشاهد، ولا يوجد ما تحله. يمكنك التشغيل أو الإيقاف المؤقت أو الانتقال إلى أي فصل.",
    featured: "العرض المميز",
    flagTitle: "عمليات تسجيل دخول Windows مشبوهة",
    meta: [
      ["الصيغة", "عرض موجّه · 5 فصول"],
      ["المدة", "نحو دقيقتين و40 ثانية"],
      ["البيانات", "سجل أمان Windows · خيالي"],
      ["يُعرض في", "واجهة SIEM محاكاة"],
    ],
    watch: "شاهد العرض",
    read: "اقرأه كنص",
    showsTitle: "ما يعرضه",
    shows: ["فرز التنبيهات", "سجلات أحداث Windows ‏(4624، 4625)", "الربط والخطوط الزمنية", "نتائج مبنية على الأدلة"],
    chaptersTitle: "الفصول",
    moreTitle: "من مختبري الخاص",
    moreNote: "للمراجعة فقط: تبقى هذه مخفية عن الموقع العام حتى تُعتمد تسجيلاتي وأدلتي.",
    more: [
      { code: "CF-01", title: "تحقيق في حركة الشبكة", tools: "Wireshark · Kali Linux" },
      { code: "CF-02", title: "تحقيق في تنبيه SOC", tools: "Splunk · Windows Event Logs" },
      { code: "CF-03", title: "عمليات Active Directory", tools: "Windows Server · PowerShell" },
    ],
    planned: "التسجيل مخطط",
  },
  player: {
    chapterOf: "الفصل {n} من 5",
    play: "تشغيل",
    pause: "إيقاف مؤقت",
    replay: "إعادة الفصل",
    prev: "الفصل السابق",
    next: "الفصل التالي",
    text: "النسخة النصية",
    captions: "الترجمة",
    skip: "انتقل إلى النتائج",
    progress: "تقدّم العرض",
    skills: "المهارات المعروضة",
    chapters: "الفصول",
    q: { examined: "ما فحصته", why: "لماذا", observed: "ما لاحظته", supports: "ما تدعمه الأدلة", uncertain: "ما يبقى غير مؤكد" },
  },
  chapters: [
    {
      key: "alert",
      title: "اكتشاف التنبيه",
      time: "0:00",
      narration: "02:15، تنبيه عالي الخطورة. قبل أن أفتح أي سجل، أقرأ القاعدة التي تقف خلفه: فهي تخبرني بما يمكن أن يدّعيه التنبيه وما لا يمكنه.",
      examined: "التنبيه ALR-0418، وقائمة تنبيهات الليلة من حوله، وقاعدة الاكتشاف التي أطلقته.",
      why: "منطق القاعدة يحدد حدود التنبيه ويقرر أين أنظر أولًا.",
      observed: [
        "طابق ALR-0418 الحساب j.morgan على JMP01، وهو خادم وسيط يمكن الوصول إليه عبر Remote Desktop.",
        "بعد دقيقة صدر ALR-0419 لعنوان مصدر واحد: 203.0.113.45.",
        "القاعدة: 3 محاولات تسجيل دخول فاشلة أو أكثر من عنوان مصدر واحد، ثم تسجيل دخول ناجح من المصدر نفسه، خلال 10 دقائق.",
      ],
      supports: "ما يكفي لفتح تحقيق في هذا المصدر وهذا الحساب. التنبيه وحده يُظهر نمطًا، لا اختراقًا.",
      uncertain: "هل كان تسجيل الدخول الناجح لصاحب الحساب، وهل يصف التنبيهان النشاط نفسه.",
      skills: ["فرز التنبيهات", "منطق الاكتشاف"],
      still: "قائمة التنبيهات مع إبراز ALR-0418 وALR-0419، والقاعدة التي أطلقت التنبيه.",
    },
    {
      key: "logs",
      title: "فحص السجلات",
      time: "0:25",
      narration: "أنتقل إلى كل الأحداث الصادرة من 203.0.113.45 في النافذة الزمنية، ثم أفتح النجاح الوحيد وأقارنه بالطريقة التي يسجّل بها j.morgan الدخول عادةً.",
      examined: "كل الأحداث الصادرة من 203.0.113.45 في نافذة التنبيه، ثم تسجيل الدخول الناجح e-0193 حقلًا حقلًا.",
      why: "لاختبار التنبيه أمام الأحداث الخام، ومقارنة النجاح بالسلوك المعتاد للحساب.",
      observed: [
        "17 محاولة فاشلة، واحدة لكل حساب، بمعدل محاولة كل 22 ثانية: الحالة الفرعية 0xC000006A (كلمة مرور خاطئة) أو 0xC0000064 (حساب غير موجود).",
        "e-0193: نوع تسجيل الدخول 3 مع NTLM. استخدمت تسجيلات j.morgan السابقة Kerberos من 198.51.100.142.",
        "بعد خمس عشرة ثانية، e-0194: نوع تسجيل الدخول 10، جلسة Remote Desktop من المصدر نفسه.",
      ],
      supports: "رشّ كلمات مرور من مصدر واحد، نجح خلاله تسجيل دخول باسم j.morgan وتلته جلسة Remote Desktop.",
      uncertain: "من كان أمام لوحة المفاتيح: تحدد السجلات الحساب، لا الشخص الذي يستخدمه.",
      skills: ["سجلات أحداث Windows", "الاستعلام والتصفية"],
      still: "بحث في السجلات مصفّى على 203.0.113.45، مع إبراز تسجيلَي الدخول الناجحين وحقول e-0193.",
    },
    {
      key: "correlate",
      title: "ربط الأحداث",
      time: "1:05",
      narration: "بعد ذلك أربط المصادر والحسابات والخوادم عبر الزمن، لأرى أين ذهب الحساب بعد النجاح، وهل شارك أحد آخر.",
      examined: "العلاقات بين المصادر والحسابات والخوادم عبر النافذة الزمنية، وما فعله حساب j.morgan بعد ذلك.",
      why: "لتحديد النطاق: أي خوادم وُصل إليها بعد النجاح، وأي نشاط هو ضجيج غير مرتبط.",
      observed: [
        "02:21: سجّل j.morgan الدخول إلى SRV-FILE01 من العنوان الداخلي لـ JMP01، باستخدام Kerberos.",
        "أجرى 203.0.113.77 سبع محاولات فاشلة منذ 02:31، مع اسم العميل نفسه، DESKTOP-7Q2M4.",
        "إخفاقات svc-backup مصدرها مهمته المجدولة بعد تغيير كلمة المرور، لا هذا النشاط.",
      ],
      supports: "انتقل النشاط من JMP01 إلى SRV-FILE01 تحت حساب j.morgan. قفل svc-backup غير مرتبط.",
      uncertain: "هل 203.0.113.77 هو الفاعل نفسه: اسم العميل المشترك مؤشر، لا إسناد.",
      skills: ["الربط", "تحليل الخط الزمني"],
      still: "خريطة العلاقات من المصدر الخارجي إلى j.morgan وJMP01 وSRV-FILE01، مع الخط الزمني أسفلها.",
    },
    {
      key: "evidence",
      title: "اختيار الأدلة",
      time: "1:40",
      narration: "أحتفظ فقط بالأحداث التي تحمل القصة، بدءًا بخط الأساس، كي يستطيع أي شخص تتبّع كل خطوة خلف نتائجي.",
      examined: "الأحداث التي تحتاجها كل نتيجة، والأحداث التي هي ضجيج.",
      why: "قوة النتيجة من قوة الأحداث التي تستند إليها؛ يجب أن يتمكن المراجع من تتبّعها.",
      observed: [
        "يأتي تسجيل دخول خط الأساس من 10 مارس أولًا، كي يظهر الفرق.",
        "سبعة أحداث بترتيب زمني، احتُفظ بكل منها لسبب في سطر واحد.",
        "أحداث من السجلات فقط؛ لا يُعرض أي افتراض كدليل.",
      ],
      supports: "كل نتيجة في الفصل التالي تشير إلى حدث محفوظ واحد على الأقل.",
      uncertain: "ما الذي جرى داخل جلسة Remote Desktop: أحداث المصادقة لا تسجّل الأفعال.",
      skills: ["التعامل مع الأدلة", "التوثيق"],
      still: "سبعة أحداث مختارة بترتيب زمني، لكل منها سبب الاحتفاظ به.",
    },
    {
      key: "findings",
      title: "النتائج والقيود",
      time: "2:10",
      narration: "أخيرًا، أفصل بين ما تسجّله السجلات وما أستنتجه، وأسمّي ما لا تستطيع هذه البيانات إظهاره. هذا الحد لا يقل أهمية عن النتيجة نفسها.",
      examined: "الأدلة المحفوظة مقابل كل ادعاء كان يمكنني تقديمه.",
      why: "لأقرّر فقط ما تدعمه البيانات، ولأوضّح الحدود لمن يتصرف بعدي.",
      observed: ["تُعرض الحقائق المرصودة من دون تفسير.", "يبقى اسم العميل المشترك غير مؤكد.", "لا يمكن تحديد الوصول إلى الملفات على SRV-FILE01 من أحداث تسجيل الدخول."],
      supports: "خُمّنت كلمة مرور j.morgan أثناء الرشّ، ثم استُخدمت لجلسة Remote Desktop ولتسجيل دخول إلى SRV-FILE01. الأولوية لاحتواء الحساب وتعرّض RDP.",
      uncertain: "أي ملفات، إن وُجدت، جرى الوصول إليها على SRV-FILE01؛ وهل ما زالت الجلسة مفتوحة؛ وهل 203.0.113.77 مرتبط.",
      skills: ["إعداد التقارير", "الحكم التحليلي"],
      still: "النتائج مجمّعة إلى مرصودة ومدعومة وغير مؤكدة وغير قابلة للتحديد، مع الخطوات التالية.",
    },
  ],
  scene: {
    h2why: "اسم العميل المشترك والعنوان المجاور لا يثبتان أنهما الطرف نفسه.",
    query: "ip:203.0.113.45",
    alertFired: "صدر {t}",
    rule: "القاعدة",
    spray: "18 حسابًا · 6 د 35 ث",
    lateral: "JMP01 → SRV-FILE01",
    second: "مصدر ثانٍ · مؤشر فقط",
    timeline: "الخط الزمني، 11 مارس (UTC)",
    evidenceTitle: "الأدلة المختارة",
    evidenceCount: "7 أحداث",
    next: "الخطوات التالية",
  },
  end: {
    title: "ما يُظهره هذا العرض",
    points: [
      "فرز يبدأ مما تدّعيه القاعدة فعلًا.",
      "قراءة أحداث تسجيل الدخول في Windows حقلًا حقلًا، مقابل خط أساس.",
      "ربط المصادر والحسابات والخوادم عبر الزمن.",
      "الفصل بين الحقائق المرصودة والاستنتاجات والمجهول.",
    ],
    cases: "اطّلع على ملفات القضايا",
    cv: "اطلب سيرتي الذاتية",
    again: "شاهد مرة أخرى",
    data: "مؤسسة خيالية (northwind.example)، وعناوين IP من نطاق التوثيق، وحسابات خيالية.",
  },
  text: {
    title: "العرض كنص",
    intro: "كل فصل مع تعليقه وشاشته الرئيسية، من دون حركة. عند تفعيل الحركة المخففة، يُفتح العرض هنا.",
    still: "الشاشة",
  },
};

export const showcaseCopy = { en, he, ar } as const;
