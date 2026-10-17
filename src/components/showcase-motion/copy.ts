/**
 * Motion study copy (EN/HE/AR): captions, focus labels and scene labels for chapters 2 and 3.
 * DRAFT text prepared with AI assistance; Eli reviews and corrects every line before approval.
 * Technical values (IPs, event IDs, times, account names) stay as data and are not translated.
 */

export type Ch2Caption = "pivot" | "results" | "time" | "ip" | "acct" | "evt" | "pick" | "fields" | "base" | "rdp" | "supports" | "uncertain";
export type Ch3Caption = "intro" | "spray" | "success" | "rdp" | "stop" | "lateral" | "inventory" | "second" | "indicator" | "gap" | "supports" | "uncertain";
export type Ch2Label = "query" | "time" | "ip" | "acct" | "evt" | "e0193" | "base" | "rdp" | "sum";
export type Ch3Label = "spray" | "success" | "rdp" | "lateral" | "second" | "indicator" | "gap" | "sum";

export type MotionCopy = {
  review: string;
  study: string;
  play: string;
  pause: string;
  restart: string;
  progress: string;
  chapters: string;
  start: string;
  reduced: string;
  captionsLabel: string;
  ch2: {
    captions: Record<Ch2Caption, string>;
    labels: Record<Ch2Label, string>;
    baseTitle: string;
    contrast: Record<"auth" | "source" | "time", string>;
    external: string;
    internal: string;
    supports: string;
    uncertain: string;
  };
  ch3: {
    captions: Record<Ch3Caption, string>;
    labels: Record<Ch3Label, string>;
    cols: Record<"sources" | "accounts" | "hosts", string>;
    accounts17: string;
    accounts7: string;
    failed: string;
    files: string;
    notInLogs: string;
    inventory: string;
    sameClient: string;
    legend: Record<"observed" | "inventory" | "indicator" | "absent", string>;
    axis: string;
    panel: {
      start: string;
      events: string;
      fails: string;
      oks: string;
      accountsEach: string;
      onHost: string;
      lastAttempt: string;
      after: string;
      includes: string;
      sharedName: string;
      setByDevice: string;
      noFiles: string;
    };
    supports: string;
    uncertain: string;
  };
};

const en: MotionCopy = {
  review: "Motion study · local prototype · draft narration, not yet reviewed by Eli",
  study: "Motion study",
  play: "Play",
  pause: "Pause",
  restart: "Restart",
  progress: "Motion study progress",
  chapters: "Chapters in this study",
  start: "Press Play to start. Nothing plays automatically.",
  reduced: "Reduced motion is on: each step appears without movement.",
  captionsLabel: "Captions",
  ch2: {
    captions: {
      pivot: "I pivot from the alert to every event from 203.0.113.45 in the alert window.",
      results: "19 of 482 events: 17 failures and 2 successes.",
      time: "From 02:10:05 to 02:16:40: 19 events in 6 min 35 s, on average one every 22 seconds.",
      ip: "Every event comes from the same external address.",
      acct: "18 different accounts, one attempt each.",
      evt: "17 failures (wrong password ×12, no such account ×5), 2 successes.",
      pick: "One success stands out: e-0193, j.morgan on JMP01.",
      fields: "Logon type 3, a network logon, authenticated with NTLM from 203.0.113.45.",
      base: "The day before, j.morgan's logons used Kerberos from 198.51.100.142, between 12:04 and 17:34.",
      rdp: "Fifteen seconds later, e-0194: logon type 10, a Remote Desktop session from the same address.",
      supports: "This supports a password spray from one source, during which a logon as j.morgan succeeded.",
      uncertain: "It does not show who was at the keyboard: the logs identify the account, not the person.",
    },
    labels: {
      query: "Query",
      time: "Timestamps",
      ip: "Source IP",
      acct: "Accounts",
      evt: "Event IDs and outcomes",
      e0193: "Event",
      base: "Baseline",
      rdp: "Event",
      sum: "Analyst summary · draft",
    },
    baseTitle: "Baseline · the day before",
    contrast: { auth: "Authentication", source: "Source", time: "Time" },
    external: "external",
    internal: "internal",
    supports: "A password spray from one source, during which a logon as j.morgan succeeded and was followed by a Remote Desktop session.",
    uncertain: "Who was at the keyboard: the logs identify the account, not the person using it.",
  },
  ch3: {
    captions: {
      intro: "Now I connect sources, accounts and hosts, in the order the events happened.",
      spray: "02:10 to 02:16: 203.0.113.45 tries 17 accounts on JMP01. Each attempt fails.",
      success: "02:14:37: one logon succeeds, j.morgan on JMP01. A network logon with NTLM.",
      rdp: "Fifteen seconds later, the same address opens a Remote Desktop session as j.morgan.",
      stop: "The attempts stop at 02:16:40.",
      lateral: "02:21:13: j.morgan logs on to SRV-FILE01 from 198.51.100.10 (Kerberos).",
      inventory: "The asset inventory lists 198.51.100.10 as JMP01: the logon to the file server came from the jump server.",
      second: "From 02:31, a second address, 203.0.113.77, fails on 7 accounts, including administrator.",
      indicator: "It reports the same client name, DESKTOP-7Q2M4. The connecting device sets that name, so it is an indicator, not attribution.",
      gap: "A logon to SRV-FILE01 is not file access. These events cannot show which files, if any, were opened or copied.",
      supports: "Supported: activity moved from JMP01 to SRV-FILE01 under j.morgan's account.",
      uncertain: "Unconfirmed: whether 203.0.113.77 is the same actor. Not in the data: any file activity.",
    },
    labels: {
      spray: "Observed · failed logons",
      success: "Observed · successful logon",
      rdp: "Observed · Remote Desktop",
      lateral: "Observed + asset inventory",
      second: "Observed · second source",
      indicator: "Indicator only",
      gap: "Not in these logs",
      sum: "Analyst summary · draft",
    },
    cols: { sources: "Sources", accounts: "Accounts", hosts: "Hosts" },
    accounts17: "17 accounts",
    accounts7: "7 accounts",
    failed: "failed",
    files: "File activity",
    notInLogs: "not in these logs",
    inventory: "asset inventory",
    sameClient: "same client name",
    legend: { observed: "Observed in events", inventory: "Asset inventory", indicator: "Indicator · unconfirmed", absent: "Not in the data" },
    axis: "11 Mar 2026 · UTC",
    panel: {
      start: "Starting point, from chapter 2",
      events: "events",
      fails: "failures",
      oks: "successes",
      accountsEach: "accounts, one attempt each",
      onHost: "on",
      lastAttempt: "Last attempt",
      after: "15 s after e-0193",
      includes: "includes administrator, also tried from 203.0.113.45",
      sharedName: "Client name reported by both sources",
      setByDevice: "Set by the connecting device: an indicator, not attribution.",
      noFiles: "Logon events record that an account signed in. They do not record which files were opened or copied.",
    },
    supports: "Activity moved from JMP01 to SRV-FILE01 under j.morgan's account.",
    uncertain: "Whether 203.0.113.77 is the same actor, and what, if anything, was accessed on SRV-FILE01.",
  },
};

const he: MotionCopy = {
  review: "מחקר תנועה · אב טיפוס מקומי · טיוטת קריינות, טרם נבדקה על ידי איליא",
  study: "מחקר תנועה",
  play: "נגן",
  pause: "השהה",
  restart: "מההתחלה",
  progress: "התקדמות מחקר התנועה",
  chapters: "הפרקים במחקר הזה",
  start: "לחצו על נגן כדי להתחיל. שום דבר לא מתנגן אוטומטית.",
  reduced: "תנועה מופחתת פעילה: כל שלב מופיע בלי תנועה.",
  captionsLabel: "כתוביות",
  ch2: {
    captions: {
      pivot: "מההתראה אני עובר לכל האירועים מ-203.0.113.45 בחלון ההתראה.",
      results: "19 מתוך 482 אירועים: 17 כישלונות ו-2 הצלחות.",
      time: "מ-02:10:05 עד 02:16:40: ‏19 אירועים ב-6 דקות ו-35 שניות, בממוצע אחד כל 22 שניות.",
      ip: "כל האירועים מגיעים מאותה כתובת חיצונית.",
      acct: "18 חשבונות שונים, ניסיון אחד לכל חשבון.",
      evt: "17 כישלונות: סיסמה שגויה ×12, חשבון לא קיים ×5. ועוד 2 הצלחות.",
      pick: "הצלחה אחת בולטת: e-0193, ‏j.morgan ב-JMP01.",
      fields: "סוג התחברות 3, התחברות רשת, באימות NTLM מ-203.0.113.45.",
      base: "יום קודם, ההתחברויות של j.morgan השתמשו ב-Kerberos מ-198.51.100.142, בין 12:04 ל-17:34.",
      rdp: "חמש עשרה שניות אחר כך, e-0194: סוג התחברות 10, סשן Remote Desktop מאותה כתובת.",
      supports: "זה תומך בריסוס סיסמאות ממקור אחד, שבמהלכו הצליחה התחברות בשם j.morgan.",
      uncertain: "זה לא מראה מי ישב מול המקלדת: היומנים מזהים את החשבון, לא את האדם.",
    },
    labels: {
      query: "שאילתה",
      time: "חותמות זמן",
      ip: "כתובת מקור",
      acct: "חשבונות",
      evt: "מזהי אירוע ותוצאות",
      e0193: "אירוע",
      base: "נקודת בסיס",
      rdp: "אירוע",
      sum: "סיכום האנליסט · טיוטה",
    },
    baseTitle: "נקודת בסיס · יום קודם",
    contrast: { auth: "אימות", source: "מקור", time: "שעה" },
    external: "חיצוני",
    internal: "פנימי",
    supports: "ריסוס סיסמאות ממקור אחד, שבמהלכו הצליחה התחברות בשם j.morgan ואחריה נפתח סשן Remote Desktop.",
    uncertain: "מי ישב מול המקלדת: היומנים מזהים את החשבון, לא את האדם שמשתמש בו.",
  },
  ch3: {
    captions: {
      intro: "עכשיו אני מחבר בין מקורות, חשבונות ושרתים, לפי הסדר שבו האירועים קרו.",
      spray: "02:10 עד 02:16: ‏203.0.113.45 מנסה 17 חשבונות ב-JMP01. כל ניסיון נכשל.",
      success: "02:14:37: התחברות אחת מצליחה, j.morgan ב-JMP01. התחברות רשת עם NTLM.",
      rdp: "חמש עשרה שניות אחר כך, אותה כתובת פותחת סשן Remote Desktop בשם j.morgan.",
      stop: "הניסיונות נפסקים ב-02:16:40.",
      lateral: "02:21:13: ‏j.morgan מתחבר ל-SRV-FILE01 מ-198.51.100.10, עם Kerberos.",
      inventory: "מלאי הנכסים רושם את 198.51.100.10 כ-JMP01: ההתחברות לשרת הקבצים הגיעה משרת הקפיצה.",
      second: "מ-02:31, כתובת שנייה, 203.0.113.77, נכשלת על 7 חשבונות, כולל administrator.",
      indicator: "היא מדווחת על אותו שם לקוח, DESKTOP-7Q2M4. את השם הזה קובע המכשיר המתחבר, ולכן זו אינדיקציה, לא ייחוס.",
      gap: "התחברות ל-SRV-FILE01 אינה גישה לקבצים. האירועים האלה לא יכולים להראות אילו קבצים, אם בכלל, נפתחו או הועתקו.",
      supports: "נתמך: הפעילות עברה מ-JMP01 ל-SRV-FILE01 תחת החשבון של j.morgan.",
      uncertain: "לא מאומת: האם 203.0.113.77 הוא אותו גורם. לא בנתונים: פעילות קבצים כלשהי.",
    },
    labels: {
      spray: "נצפה · התחברויות כושלות",
      success: "נצפה · התחברות מוצלחת",
      rdp: "נצפה · Remote Desktop",
      lateral: "נצפה + מלאי נכסים",
      second: "נצפה · מקור שני",
      indicator: "אינדיקציה בלבד",
      gap: "לא ביומנים האלה",
      sum: "סיכום האנליסט · טיוטה",
    },
    cols: { sources: "מקורות", accounts: "חשבונות", hosts: "שרתים" },
    accounts17: "17 חשבונות",
    accounts7: "7 חשבונות",
    failed: "נכשלו",
    files: "פעילות קבצים",
    notInLogs: "לא ביומנים האלה",
    inventory: "מלאי נכסים",
    sameClient: "אותו שם לקוח",
    legend: { observed: "נצפה באירועים", inventory: "מלאי נכסים", indicator: "אינדיקציה · לא מאומת", absent: "לא בנתונים" },
    axis: "11 במרץ 2026 · UTC",
    panel: {
      start: "נקודת המוצא, מפרק 2",
      events: "אירועים",
      fails: "כישלונות",
      oks: "הצלחות",
      accountsEach: "חשבונות, ניסיון אחד לכל חשבון",
      onHost: "ב-",
      lastAttempt: "ניסיון אחרון",
      after: "15 שניות אחרי e-0193",
      includes: "כולל administrator, שנוסה גם מ-203.0.113.45",
      sharedName: "שם לקוח שדווח משני המקורות",
      setByDevice: "נקבע על ידי המכשיר המתחבר: אינדיקציה, לא ייחוס.",
      noFiles: "אירועי התחברות מתעדים שחשבון התחבר. הם לא מתעדים אילו קבצים נפתחו או הועתקו.",
    },
    supports: "הפעילות עברה מ-JMP01 ל-SRV-FILE01 תחת החשבון של j.morgan.",
    uncertain: "האם 203.0.113.77 הוא אותו גורם, ומה, אם בכלל, נגיש ב-SRV-FILE01.",
  },
};

const ar: MotionCopy = {
  review: "دراسة حركة · نموذج أولي محلي · مسودة التعليق، لم يراجعها إيلي بعد",
  study: "دراسة حركة",
  play: "تشغيل",
  pause: "إيقاف مؤقت",
  restart: "من البداية",
  progress: "تقدّم دراسة الحركة",
  chapters: "الفصول في هذه الدراسة",
  start: "اضغط تشغيل للبدء. لا شيء يُشغَّل تلقائيًا.",
  reduced: "الحركة المخففة مفعّلة: تظهر كل خطوة من دون حركة.",
  captionsLabel: "الترجمة",
  ch2: {
    captions: {
      pivot: "أنتقل من التنبيه إلى كل الأحداث الصادرة من 203.0.113.45 في نافذة التنبيه.",
      results: "19 من 482 حدثًا: 17 محاولة فاشلة ونجاحان.",
      time: "من 02:10:05 إلى 02:16:40: ‏19 حدثًا في 6 دقائق و35 ثانية، بمعدل حدث كل 22 ثانية.",
      ip: "كل الأحداث تأتي من العنوان الخارجي نفسه.",
      acct: "18 حسابًا مختلفًا، محاولة واحدة لكل حساب.",
      evt: "17 محاولة فاشلة: كلمة مرور خاطئة ×12، حساب غير موجود ×5. ونجاحان.",
      pick: "نجاح واحد يلفت النظر: e-0193، ‏j.morgan على JMP01.",
      fields: "نوع تسجيل الدخول 3، تسجيل دخول شبكي، بمصادقة NTLM من 203.0.113.45.",
      base: "في اليوم السابق، استخدمت تسجيلات j.morgan ‏Kerberos من 198.51.100.142، بين 12:04 و17:34.",
      rdp: "بعد خمس عشرة ثانية، e-0194: نوع تسجيل الدخول 10، جلسة Remote Desktop من العنوان نفسه.",
      supports: "هذا يدعم رشّ كلمات مرور من مصدر واحد، نجح خلاله تسجيل دخول باسم j.morgan.",
      uncertain: "لكنه لا يُظهر من كان أمام لوحة المفاتيح: تحدد السجلات الحساب، لا الشخص.",
    },
    labels: {
      query: "الاستعلام",
      time: "الطوابع الزمنية",
      ip: "عنوان المصدر",
      acct: "الحسابات",
      evt: "معرّفات الأحداث والنتائج",
      e0193: "الحدث",
      base: "خط الأساس",
      rdp: "الحدث",
      sum: "ملخص المحلل · مسودة",
    },
    baseTitle: "خط الأساس · اليوم السابق",
    contrast: { auth: "المصادقة", source: "المصدر", time: "الوقت" },
    external: "خارجي",
    internal: "داخلي",
    supports: "رشّ كلمات مرور من مصدر واحد، نجح خلاله تسجيل دخول باسم j.morgan وتلته جلسة Remote Desktop.",
    uncertain: "من كان أمام لوحة المفاتيح: تحدد السجلات الحساب، لا الشخص الذي يستخدمه.",
  },
  ch3: {
    captions: {
      intro: "الآن أربط المصادر والحسابات والخوادم، بالترتيب الذي وقعت به الأحداث.",
      spray: "من 02:10 إلى 02:16: يجرّب 203.0.113.45 ‏17 حسابًا على JMP01. كل محاولة تفشل.",
      success: "02:14:37: ينجح تسجيل دخول واحد، j.morgan على JMP01. تسجيل دخول شبكي مع NTLM.",
      rdp: "بعد خمس عشرة ثانية، يفتح العنوان نفسه جلسة Remote Desktop باسم j.morgan.",
      stop: "تتوقف المحاولات عند 02:16:40.",
      lateral: "02:21:13: يسجّل j.morgan الدخول إلى SRV-FILE01 من 198.51.100.10 ‏(Kerberos).",
      inventory: "يسجّل جرد الأصول العنوان 198.51.100.10 على أنه JMP01: جاء تسجيل الدخول إلى خادم الملفات من الخادم الوسيط.",
      second: "منذ 02:31، يفشل عنوان ثانٍ، 203.0.113.77، على 7 حسابات، منها administrator.",
      indicator: "يُبلغ عن اسم العميل نفسه، DESKTOP-7Q2M4. الجهاز المتصل هو من يحدد هذا الاسم، لذلك هو مؤشر لا إسناد.",
      gap: "تسجيل الدخول إلى SRV-FILE01 ليس وصولًا إلى الملفات. لا تستطيع هذه الأحداث إظهار أي ملفات، إن وُجدت، فُتحت أو نُسخت.",
      supports: "مدعوم: انتقل النشاط من JMP01 إلى SRV-FILE01 تحت حساب j.morgan.",
      uncertain: "غير مؤكد: هل 203.0.113.77 هو الفاعل نفسه. ليس في البيانات: أي نشاط على الملفات.",
    },
    labels: {
      spray: "مرصود · محاولات فاشلة",
      success: "مرصود · تسجيل دخول ناجح",
      rdp: "مرصود · Remote Desktop",
      lateral: "مرصود + جرد الأصول",
      second: "مرصود · مصدر ثانٍ",
      indicator: "مؤشر فقط",
      gap: "ليس في هذه السجلات",
      sum: "ملخص المحلل · مسودة",
    },
    cols: { sources: "المصادر", accounts: "الحسابات", hosts: "الخوادم" },
    accounts17: "17 حسابًا",
    accounts7: "7 حسابات",
    failed: "فشل",
    files: "نشاط الملفات",
    notInLogs: "ليس في هذه السجلات",
    inventory: "جرد الأصول",
    sameClient: "اسم العميل نفسه",
    legend: { observed: "مرصود في الأحداث", inventory: "جرد الأصول", indicator: "مؤشر · غير مؤكد", absent: "ليس في البيانات" },
    axis: "11 مارس 2026 · UTC",
    panel: {
      start: "نقطة البداية، من الفصل 2",
      events: "أحداث",
      fails: "إخفاقات",
      oks: "نجاحات",
      accountsEach: "حسابات، محاولة واحدة لكل حساب",
      onHost: "على",
      lastAttempt: "آخر محاولة",
      after: "بعد 15 ثانية من e-0193",
      includes: "منها administrator، الذي جُرّب أيضًا من 203.0.113.45",
      sharedName: "اسم العميل الذي أبلغ عنه المصدران",
      setByDevice: "يحدده الجهاز المتصل: مؤشر لا إسناد.",
      noFiles: "تسجّل أحداث الدخول أن حسابًا سجّل دخوله، ولا تسجّل أي ملفات فُتحت أو نُسخت.",
    },
    supports: "انتقل النشاط من JMP01 إلى SRV-FILE01 تحت حساب j.morgan.",
    uncertain: "هل 203.0.113.77 هو الفاعل نفسه، وما الذي جرى الوصول إليه على SRV-FILE01، إن وُجد.",
  },
};

export const motionCopy = { en, he, ar } as const;
