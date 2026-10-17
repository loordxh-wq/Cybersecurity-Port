/**
 * Phase 3 (revised) showcase mockup copy, EN/HE/AR. Kept with the mockup, not in
 * messages/*.json, so approved Phase 1/2 message files stay untouched. Technical labels
 * (log columns, field names, relationship notes, findings) are reused from the lab
 * mockup copy; only the walkthrough's own words live here. The narration is a draft for
 * Eli to rewrite in his own words before anything is approved.
 */
export type Frame = "hub" | "c1" | "c2" | "c3" | "c4" | "c5" | "end" | "text";
export type ChapterKey = "alert" | "logs" | "correlate" | "evidence" | "findings";

type Chapter = {
  key: ChapterKey;
  title: string;
  time: string;
  narration: string;
  callouts: string[];
  skills: string[];
  still: string;
};

export type ShowcaseCopy = {
  review: string;
  frame: string;
  frames: Record<Frame, string>;
  draft: string;
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
    notice: string;
    skills: string;
    chapters: string;
    playing: string;
  };
  chapters: [Chapter, Chapter, Chapter, Chapter, Chapter];
  scene: {
    h2why: string;
    query: string;
    window: string;
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
  end: {
    title: string;
    points: string[];
    cases: string;
    cv: string;
    again: string;
    data: string;
  };
  text: { title: string; intro: string; still: string; motion: string };
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
  draft: "Draft narration, to be rewritten in Eli's own words before approval.",
  sim: "Training simulation",
  notReal: "Fictional company and data. Not a real incident.",
  screenTag: "Simulated SIEM interface · fictional data",
  hub: {
    kicker: "Investigations",
    title: "See how I investigate",
    lead: "Guided walkthroughs of how I work an alert: from the first signal to findings I can defend, and the limits of what the data shows.",
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
      {
        code: "CF-01",
        title: "Network traffic investigation",
        tools: "Wireshark · Kali Linux",
      },
      {
        code: "CF-02",
        title: "SOC alert investigation",
        tools: "Splunk · Windows Event Logs",
      },
      {
        code: "CF-03",
        title: "Active Directory operations",
        tools: "Windows Server · PowerShell",
      },
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
    notice: "What to notice",
    skills: "Skills shown",
    chapters: "Chapters",
    playing: "Playing",
  },
  chapters: [
    {
      key: "alert",
      title: "Alert detection",
      time: "0:00",
      narration:
        "A high-severity alert fires at 02:15: three or more failed logons, then a success for the same account, within ten minutes. Before I open the logs, I note what the rule claims, and what it does not.",
      callouts: [
        "ALR-0418 matched j.morgan on JMP01, a jump server reachable over Remote Desktop.",
        "A minute later, ALR-0419 fires for the same source address.",
        "A rule detects a pattern, not an attack. The logs decide.",
      ],
      skills: ["Alert triage", "Detection logic"],
      still: "The alert queue with ALR-0418 and ALR-0419 highlighted, and the rule that fired.",
    },
    {
      key: "logs",
      title: "Log examination",
      time: "0:25",
      narration:
        "I pivot from the alert to every event from 203.0.113.45 in the window: seventeen failures and two successes, one attempt per account, about twenty seconds apart. Then I open the successful logon and read its fields.",
      callouts: [
        "The failures carry sub-status 0xC000006A (wrong password) or 0xC0000064 (no such account).",
        "e-0193: logon type 3 with NTLM. j.morgan's earlier logons used Kerberos from an internal address.",
        "Fifteen seconds later, e-0194: a type 10 Remote Desktop session from the same source.",
      ],
      skills: ["Windows Event Logs", "Query and filtering"],
      still: "Log search filtered to 203.0.113.45, with the two successful logons highlighted and the fields of e-0193.",
    },
    {
      key: "correlate",
      title: "Event correlation",
      time: "1:05",
      narration:
        "Next I connect sources, accounts and hosts over time. One external address tried eighteen accounts on JMP01. From JMP01, j.morgan then authenticated to the file server. A second address shares a client name, which I record as an indicator, not proof.",
      callouts: [
        "02:21: j.morgan logs on to SRV-FILE01 from JMP01's internal address, with Kerberos.",
        "203.0.113.77 reports the same client name, DESKTOP-7Q2M4: a possible link, not attribution.",
        "The svc-backup failures belong to a scheduled job after a password change, not to this activity.",
      ],
      skills: ["Correlation", "Timeline analysis"],
      still: "The relationship map from the external source to j.morgan, JMP01 and SRV-FILE01, with the timeline below.",
    },
    {
      key: "evidence",
      title: "Evidence selection",
      time: "1:40",
      narration:
        "I keep only the events that carry the story: a baseline, the start of the spray, the success, the Remote Desktop session, the move to the file server and the second source. Each one is kept for a stated reason.",
      callouts: [
        "The baseline comes first: without it, 'unusual' has nothing to compare against.",
        "Seven events in time order, each with a one-line reason.",
        "Nothing outside the logs is presented as evidence.",
      ],
      skills: ["Evidence handling", "Documentation"],
      still: "Seven selected events in time order, each with the reason it was kept.",
    },
    {
      key: "findings",
      title: "Findings and limitations",
      time: "2:10",
      narration: "Finally, I separate what the logs record from what I conclude, and say what this data cannot show. That boundary matters as much as the finding.",
      callouts: [
        "Observed facts are stated without interpretation.",
        "The shared client name stays unconfirmed.",
        "File access on SRV-FILE01 cannot be determined from logon events.",
      ],
      skills: ["Reporting", "Analytical judgement"],
      still: "Findings grouped as observed, supported, unconfirmed and not determinable, with next steps.",
    },
  ],
  scene: {
    h2why: "A shared client name and a neighbouring address do not prove a shared actor.",
    query: "ip:203.0.113.45",
    window: "11 Mar 2026 · UTC",
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
      "Reading Windows logon events field by field.",
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
    motion: "Motion",
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
  draft: "טיוטת קריינות, תיכתב מחדש במילים של איליא לפני אישור.",
  sim: "סימולציית הדרכה",
  notReal: "חברה ונתונים בדיוניים. לא אירוע אמיתי.",
  screenTag: "ממשק SIEM מדומה · נתונים בדיוניים",
  hub: {
    kicker: "חקירות",
    title: "ראו איך אני חוקר",
    lead: "הדגמות מודרכות של הדרך שבה אני מטפל בהתראה: מהסימן הראשון ועד ממצאים שאני יכול לבסס, כולל הגבולות של מה שהנתונים מראים.",
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
      {
        code: "CF-01",
        title: "חקירת תעבורת רשת",
        tools: "Wireshark · Kali Linux",
      },
      {
        code: "CF-02",
        title: "חקירת התראת SOC",
        tools: "Splunk · Windows Event Logs",
      },
      {
        code: "CF-03",
        title: "תפעול Active Directory",
        tools: "Windows Server · PowerShell",
      },
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
    notice: "למה לשים לב",
    skills: "מיומנויות שמוצגות",
    chapters: "פרקים",
    playing: "בניגון",
  },
  chapters: [
    {
      key: "alert",
      title: "זיהוי ההתראה",
      time: "0:00",
      narration:
        "בשעה 02:15 עולה התראה בחומרה גבוהה: שלושה ניסיונות התחברות כושלים או יותר, ואחריהם הצלחה לאותו חשבון, בתוך עשר דקות. לפני שאני פותח את היומנים, אני רושם מה הכלל טוען, ומה הוא לא טוען.",
      callouts: [
        "ALR-0418 זיהה את j.morgan בשרת JMP01, שרת קפיצה שנגיש דרך Remote Desktop.",
        "דקה אחר כך עולה ALR-0419 עבור אותה כתובת מקור.",
        "כלל מזהה דפוס, לא תקיפה. היומנים מכריעים.",
      ],
      skills: ["תעדוף התראות", "לוגיקת זיהוי"],
      still: "תור ההתראות עם ALR-0418 ו-ALR-0419 מודגשות, והכלל שהופעל.",
    },
    {
      key: "logs",
      title: "בדיקת היומנים",
      time: "0:25",
      narration:
        "מההתראה אני עובר לכל האירועים מ-203.0.113.45 בחלון הזמן: שבעה עשר כישלונות ושתי הצלחות, ניסיון אחד לכל חשבון, בהפרש של כעשרים שניות. אחר כך אני פותח את ההתחברות המוצלחת וקורא את השדות שלה.",
      callouts: [
        "לכישלונות יש תת-סטטוס 0xC000006A (סיסמה שגויה) או 0xC0000064 (חשבון לא קיים).",
        "e-0193: סוג התחברות 3 עם NTLM. ההתחברויות הקודמות של j.morgan השתמשו ב-Kerberos מכתובת פנימית.",
        "חמש עשרה שניות אחר כך, e-0194: סשן Remote Desktop מסוג 10 מאותו מקור.",
      ],
      skills: ["יומני אירועים של Windows", "שאילתות וסינון"],
      still: "חיפוש ביומנים מסונן ל-203.0.113.45, עם שתי ההתחברויות המוצלחות מודגשות והשדות של e-0193.",
    },
    {
      key: "correlate",
      title: "קורלציה בין אירועים",
      time: "1:05",
      narration:
        "אחר כך אני מחבר בין מקורות, חשבונות ושרתים לאורך זמן. כתובת חיצונית אחת ניסתה שמונה עשר חשבונות ב-JMP01. מ-JMP01, j.morgan התחבר לאחר מכן לשרת הקבצים. כתובת שנייה חולקת שם לקוח, ואני רושם את זה כאינדיקציה, לא כהוכחה.",
      callouts: [
        "02:21: j.morgan מתחבר ל-SRV-FILE01 מהכתובת הפנימית של JMP01, עם Kerberos.",
        "203.0.113.77 מדווחת על אותו שם לקוח, DESKTOP-7Q2M4: קשר אפשרי, לא ייחוס.",
        "הכישלונות של svc-backup שייכים למשימה מתוזמנת אחרי החלפת סיסמה, לא לפעילות הזו.",
      ],
      skills: ["קורלציה", "ניתוח ציר זמן"],
      still: "מפת הקשרים מהמקור החיצוני אל j.morgan, ‏JMP01 ו-SRV-FILE01, עם ציר הזמן מתחת.",
    },
    {
      key: "evidence",
      title: "בחירת ראיות",
      time: "1:40",
      narration: "אני שומר רק את האירועים שנושאים את הסיפור: נקודת בסיס, תחילת הניסיונות, ההצלחה, סשן ה-Remote Desktop, המעבר לשרת הקבצים והמקור השני. כל אחד נשמר מסיבה מוצהרת.",
      callouts: ["נקודת הבסיס באה ראשונה: בלעדיה, ל'חריג' אין למה להשוות.", "שבעה אירועים לפי סדר הזמן, לכל אחד סיבה בשורה אחת.", "שום דבר מחוץ ליומנים לא מוצג כראיה."],
      skills: ["טיפול בראיות", "תיעוד"],
      still: "שבעה אירועים שנבחרו לפי סדר הזמן, לכל אחד הסיבה שבגללה נשמר.",
    },
    {
      key: "findings",
      title: "ממצאים ומגבלות",
      time: "2:10",
      narration: "לבסוף, אני מפריד בין מה שהיומנים מתעדים לבין מה שאני מסיק, ואומר מה הנתונים האלה לא יכולים להראות. הגבול הזה חשוב כמו הממצא עצמו.",
      callouts: ["עובדות שנצפו מוצגות בלי פרשנות.", "שם הלקוח המשותף נשאר לא מאומת.", "גישה לקבצים ב-SRV-FILE01 אינה ניתנת לקביעה מאירועי התחברות."],
      skills: ["דיווח", "שיקול דעת אנליטי"],
      still: "ממצאים מקובצים לפי נצפה, נתמך, לא מאומת ולא ניתן לקביעה, עם הצעדים הבאים.",
    },
  ],
  scene: {
    h2why: "שם לקוח משותף וכתובת סמוכה אינם מוכיחים גורם משותף.",
    query: "ip:203.0.113.45",
    window: "11 במרץ 2026 · UTC",
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
      "קריאת אירועי התחברות של Windows שדה אחר שדה.",
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
    motion: "תנועה",
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
  draft: "مسودة التعليق، ستُعاد كتابتها بكلمات إيلي قبل الاعتماد.",
  sim: "محاكاة تدريبية",
  notReal: "شركة وبيانات خيالية. ليست حادثة حقيقية.",
  screenTag: "واجهة SIEM محاكاة · بيانات خيالية",
  hub: {
    kicker: "تحقيقات",
    title: "شاهد كيف أحقق",
    lead: "عروض موجّهة لطريقة عملي على تنبيه: من الإشارة الأولى حتى نتائج أستطيع الدفاع عنها، مع حدود ما تُظهره البيانات.",
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
      {
        code: "CF-01",
        title: "تحقيق في حركة الشبكة",
        tools: "Wireshark · Kali Linux",
      },
      {
        code: "CF-02",
        title: "تحقيق في تنبيه SOC",
        tools: "Splunk · Windows Event Logs",
      },
      {
        code: "CF-03",
        title: "عمليات Active Directory",
        tools: "Windows Server · PowerShell",
      },
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
    notice: "ما يجب ملاحظته",
    skills: "المهارات المعروضة",
    chapters: "الفصول",
    playing: "قيد التشغيل",
  },
  chapters: [
    {
      key: "alert",
      title: "اكتشاف التنبيه",
      time: "0:00",
      narration:
        "عند الساعة 02:15 يصدر تنبيه عالي الخطورة: ثلاث محاولات تسجيل دخول فاشلة أو أكثر، ثم نجاح للحساب نفسه، خلال عشر دقائق. قبل أن أفتح السجلات، أدوّن ما تدّعيه القاعدة وما لا تدّعيه.",
      callouts: [
        "طابق ALR-0418 الحساب j.morgan على JMP01، وهو خادم وسيط يمكن الوصول إليه عبر Remote Desktop.",
        "بعد دقيقة يصدر ALR-0419 لعنوان المصدر نفسه.",
        "القاعدة تكتشف نمطًا، لا هجومًا. السجلات هي التي تحسم.",
      ],
      skills: ["فرز التنبيهات", "منطق الاكتشاف"],
      still: "قائمة التنبيهات مع إبراز ALR-0418 وALR-0419، والقاعدة التي أطلقت التنبيه.",
    },
    {
      key: "logs",
      title: "فحص السجلات",
      time: "0:25",
      narration:
        "أنتقل من التنبيه إلى كل الأحداث الصادرة من 203.0.113.45 في النافذة الزمنية: سبع عشرة محاولة فاشلة ونجاحان، محاولة واحدة لكل حساب، بفارق نحو عشرين ثانية. ثم أفتح تسجيل الدخول الناجح وأقرأ حقوله.",
      callouts: [
        "تحمل المحاولات الفاشلة الحالة الفرعية 0xC000006A (كلمة مرور خاطئة) أو 0xC0000064 (حساب غير موجود).",
        "e-0193: نوع تسجيل الدخول 3 مع NTLM. استخدمت تسجيلات j.morgan السابقة Kerberos من عنوان داخلي.",
        "بعد خمس عشرة ثانية، e-0194: جلسة Remote Desktop من النوع 10 من المصدر نفسه.",
      ],
      skills: ["سجلات أحداث Windows", "الاستعلام والتصفية"],
      still: "بحث في السجلات مصفّى على 203.0.113.45، مع إبراز تسجيلَي الدخول الناجحين وحقول e-0193.",
    },
    {
      key: "correlate",
      title: "ربط الأحداث",
      time: "1:05",
      narration:
        "بعد ذلك أربط المصادر والحسابات والخوادم عبر الزمن. جرّب عنوان خارجي واحد ثمانية عشر حسابًا على JMP01. ومن JMP01 سجّل j.morgan الدخول بعد ذلك إلى خادم الملفات. يشترك عنوان ثانٍ في اسم العميل، وأسجّل ذلك كمؤشر لا كدليل.",
      callouts: [
        "02:21: يسجّل j.morgan الدخول إلى SRV-FILE01 من العنوان الداخلي لـ JMP01، باستخدام Kerberos.",
        "يُبلغ 203.0.113.77 عن اسم العميل نفسه، DESKTOP-7Q2M4: صلة محتملة، لا إسناد.",
        "إخفاقات svc-backup تعود إلى مهمة مجدولة بعد تغيير كلمة المرور، لا إلى هذا النشاط.",
      ],
      skills: ["الربط", "تحليل الخط الزمني"],
      still: "خريطة العلاقات من المصدر الخارجي إلى j.morgan وJMP01 وSRV-FILE01، مع الخط الزمني أسفلها.",
    },
    {
      key: "evidence",
      title: "اختيار الأدلة",
      time: "1:40",
      narration:
        "أحتفظ فقط بالأحداث التي تحمل القصة: خط الأساس، وبداية المحاولات، والنجاح، وجلسة Remote Desktop، والانتقال إلى خادم الملفات، والمصدر الثاني. كل حدث يُحفظ لسبب مُعلن.",
      callouts: ["خط الأساس أولًا: من دونه لا يوجد ما يُقارَن به 'غير المعتاد'.", "سبعة أحداث بترتيب زمني، لكل منها سبب في سطر واحد.", "لا يُعرض أي شيء من خارج السجلات كدليل."],
      skills: ["التعامل مع الأدلة", "التوثيق"],
      still: "سبعة أحداث مختارة بترتيب زمني، لكل منها سبب الاحتفاظ به.",
    },
    {
      key: "findings",
      title: "النتائج والقيود",
      time: "2:10",
      narration: "أخيرًا، أفصل بين ما تسجّله السجلات وما أستنتجه، وأقول ما لا تستطيع هذه البيانات إظهاره. هذا الحد لا يقل أهمية عن النتيجة نفسها.",
      callouts: ["تُعرض الحقائق المرصودة من دون تفسير.", "يبقى اسم العميل المشترك غير مؤكد.", "لا يمكن تحديد الوصول إلى الملفات على SRV-FILE01 من أحداث تسجيل الدخول."],
      skills: ["إعداد التقارير", "الحكم التحليلي"],
      still: "النتائج مجمّعة إلى مرصودة ومدعومة وغير مؤكدة وغير قابلة للتحديد، مع الخطوات التالية.",
    },
  ],
  scene: {
    h2why: "اسم العميل المشترك والعنوان المجاور لا يثبتان أنهما الطرف نفسه.",
    query: "ip:203.0.113.45",
    window: "11 مارس 2026 · UTC",
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
      "قراءة أحداث تسجيل الدخول في Windows حقلًا حقلًا.",
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
    motion: "الحركة",
  },
};

export const showcaseCopy = { en, he, ar } as const;
