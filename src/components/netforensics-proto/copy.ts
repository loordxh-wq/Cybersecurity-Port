import type { Locale } from "@/i18n/routing";

/**
 * Wording for the Network Forensics prototype (proposal branch, protected preview only).
 * Draft for Eli's review. Neutral narration throughout (D2): the story explains a
 * method on synthetic data and never claims work Eli performed. Caption durations
 * (seconds) are the timeline: chapter lengths are their sums, and the unit test keeps
 * every caption at or below 16.5 characters per second.
 */
export type NfFrame = "preview" | "preview-end" | "ch1" | "ch2" | "ch3" | "ch4" | "ch5";
export const nfFrames: NfFrame[] = ["preview", "preview-end", "ch1", "ch2", "ch3", "ch4", "ch5"];

export type Kind = "fact" | "reasoning" | "limit";
export interface Caption {
  text: string;
  dur: number;
}
export interface Chapter {
  id: "ch1" | "ch2" | "ch3" | "ch4" | "ch5";
  title: string;
  captions: Caption[];
  points: { k: Kind; t: string }[];
}

export interface NfCopy {
  banner: string;
  frameNames: Record<NfFrame, string>;
  series: string;
  cat: string;
  title: string;
  modes: { preview: string; previewHint: string; walkthrough: string; walkthroughHint: string; text: string };
  preview: {
    beats: (Caption & { label: string })[];
    endEyebrow: string;
    endTitle: string;
    endLead: string;
    coversTitle: string;
    covers: string[];
    watch: string;
    replay: string;
  };
  chapters: Chapter[];
  kinds: Record<Kind, string>;
  board: { shows: string; suggests: string; cannot: string; further: string; furtherList: string[] };
  labels: {
    packets: string;
    filter: string;
    timeline: string;
    capturePoint: string;
    client: string;
    server: string;
    resolver: string;
    lookups: string;
    handshake: string;
    tlsHandshake: string;
    rtt: string;
    answer: string;
    noAddress: string;
    sni: string;
    offered: string;
    alpn: string;
    keyShare: string;
    legacy: string;
    selected: string;
    cipher: string;
    encryptedFrom: string;
    alpnHidden: string;
    clientHello: string;
    serverHello: string;
    cols: { no: string; time: string; src: string; dst: string; proto: string; len: string; info: string };
  };
}

const en: NfCopy = {
  banner: "Prototype design frame · static · protected preview, not published",
  frameNames: { preview: "Preview · beat 2", "preview-end": "Preview · end card", ch1: "Ch 1 · Capture", ch2: "Ch 2 · DNS", ch3: "Ch 3 · TCP", ch4: "Ch 4 · TLS", ch5: "Ch 5 · Limits" },
  series: "Cyber Operations",
  cat: "Network Forensics",
  title: "From a name to an encrypted session",
  modes: { preview: "Executive preview", previewHint: "The idea in 20 seconds", walkthrough: "Technical walkthrough", walkthroughHint: "Packet by packet", text: "Text version" },
  preview: {
    beats: [
      { label: "A name", text: "A name is looked up: updates.example.com resolves to 198.51.100.40.", dur: 5 },
      { label: "A connection", text: "A TCP handshake opens the connection in 24.1 milliseconds.", dur: 5 },
      { label: "An encrypted session", text: "TLS 1.3 encrypts the session. From here, the content is not visible.", dur: 5 },
      { label: "The limits", text: "Each statement is marked as observed, interpreted or not visible.", dur: 5 },
    ],
    endEyebrow: "Network Forensics · training demonstration",
    endTitle: "From a name to an encrypted session",
    endLead: "One connection, read packet by packet, with the limits of the evidence stated.",
    coversTitle: "What the walkthrough covers",
    covers: ["DNS lookups: A and AAAA", "The TCP handshake and its options", "TLS 1.3: where encryption starts", "What a capture can and cannot prove"],
    watch: "Watch the technical walkthrough",
    replay: "Replay preview",
  },
  chapters: [
    {
      id: "ch1",
      title: "Capture scope",
      captions: [
        { text: "Twelve packets in 71.5 milliseconds, captured on the client, 192.0.2.24.", dur: 6 },
        { text: "A capture taken here shows one machine's view: every packet starts or ends at the client.", dur: 7 },
        { text: "Four DNS packets, three for the TCP handshake, five for TLS.", dur: 5 },
        { text: "Each chapter filters down to one part of this exchange.", dur: 6 },
      ],
      points: [
        { k: "fact", t: "12 packets between 0 and 71.5 ms: 4 DNS, 3 TCP handshake, 5 TLS." },
        { k: "reasoning", t: "The capture point is the client, 192.0.2.24: every packet starts or ends there." },
        { k: "limit", t: "Traffic between other devices on the network is not in this capture." },
      ],
    },
    {
      id: "ch2",
      title: "DNS resolution",
      captions: [
        { text: "The client sends two lookups at once: A for an IPv4 address, AAAA for IPv6.", dur: 6 },
        { text: "18.4 ms later the A answer arrives: 198.51.100.40, cacheable for 300 seconds (TTL 300).", dur: 7 },
        { text: "The AAAA answer holds no address, only the zone's SOA record: the name has no IPv6 address.", dur: 7 },
        { text: "So the connection that follows will use IPv4.", dur: 4 },
        { text: "Whether the resolver answered from its cache cannot be seen from the client side.", dur: 6 },
      ],
      points: [
        { k: "fact", t: "The A answer gives 198.51.100.40 (TTL 300) after 18.4 ms. The AAAA answer contains no address, only an SOA record." },
        { k: "reasoning", t: "With no IPv6 address for the name, the client connects over IPv4." },
        { k: "limit", t: "Resolver caching is not visible here, and DNS over HTTPS would not appear as port 53 traffic." },
      ],
    },
    {
      id: "ch3",
      title: "TCP handshake",
      captions: [
        { text: "0.9 ms after the last DNS reply, the client sends a SYN to 198.51.100.40, port 443.", dur: 7 },
        { text: "The server answers SYN-ACK, and the client's ACK completes the handshake in 24.1 ms.", dur: 7 },
        { text: "Both sides offer a 1460-byte segment size, selective acknowledgement and window scaling.", dur: 6 },
        { text: "No retransmission, no reset: the port accepted the connection.", dur: 4 },
        { text: "The address matches the A answer, but that alone does not prove which name was meant.", dur: 6 },
      ],
      points: [
        { k: "fact", t: "Packets 5–7 complete the handshake with 198.51.100.40:443 in 24.1 ms, with no retransmission or reset." },
        { k: "reasoning", t: "The connection likely belongs to updates.example.com: it goes to the address in the A answer, 0.9 ms after the last DNS reply." },
        { k: "limit", t: "A matching address does not prove which name the application meant. Chapter 4 adds a stronger, but client-set, indicator." },
      ],
    },
    {
      id: "ch4",
      title: "TLS negotiation",
      captions: [
        { text: "The Client Hello is still readable: it names the server, updates.example.com, in the SNI field.", dur: 7 },
        { text: "It offers TLS 1.3 and 1.2 and the application protocols h2 and http/1.1.", dur: 6 },
        { text: "The Server Hello's version field says 0x0303, TLS 1.2, for compatibility.", dur: 6 },
        { text: "The real choice is in supported_versions: TLS 1.3, with TLS_AES_128_GCM_SHA256.", dur: 6 },
        { text: "From here on the handshake is encrypted, including the certificate and the chosen protocol.", dur: 7 },
      ],
      points: [
        { k: "fact", t: "SNI updates.example.com; offered TLS 1.3 and 1.2. The Server Hello selects TLS 1.3 with TLS_AES_128_GCM_SHA256." },
        { k: "reasoning", t: "The SNI matches the DNS name, which supports the link made in chapter 3." },
        { k: "limit", t: "SNI is set by the client and Encrypted Client Hello can hide it. In TLS 1.3 the certificate and the chosen ALPN are encrypted." },
      ],
    },
    {
      id: "ch5",
      title: "What the capture cannot show",
      captions: [
        { text: "What the capture shows: who connected to where, when, and with which protocols.", dur: 6 },
        { text: "What it suggests: the session is for updates.example.com, since the DNS answer and SNI agree.", dur: 7 },
        { text: "What it cannot show: URLs, the content, the server certificate or the user behind the client.", dur: 7 },
        { text: "Answering those needs other evidence, such as endpoint or proxy logs.", dur: 5 },
        { text: "Every claim in this story points back to numbered packets.", dur: 5 },
      ],
      points: [
        { k: "fact", t: "192.0.2.24 resolved updates.example.com and opened a TLS 1.3 session to 198.51.100.40:443 (packets 1–12)." },
        { k: "reasoning", t: "The session is very likely for updates.example.com: the DNS answer (packet 3) and the SNI (packet 8) agree." },
        { k: "limit", t: "URLs, content, the server certificate and the user are not visible in this capture." },
      ],
    },
  ],
  kinds: { fact: "Observed in the capture", reasoning: "Interpretation", limit: "Limitation" },
  board: {
    shows: "The capture shows",
    suggests: "It suggests",
    cannot: "It cannot show",
    further: "Evidence that could answer the rest",
    furtherList: ["Endpoint logs on 192.0.2.24 (process, user)", "Proxy or gateway logs, where authorised", "In a lab only: the client's own TLS key log"],
  },
  labels: {
    packets: "Packets",
    filter: "Display filter (Wireshark syntax)",
    timeline: "Capture timeline · milliseconds",
    capturePoint: "Capture point",
    client: "Client",
    server: "Server",
    resolver: "Resolver",
    lookups: "Lookups",
    handshake: "TCP handshake",
    tlsHandshake: "TLS handshake",
    rtt: "Round trip",
    answer: "Answer",
    noAddress: "No address · SOA only",
    sni: "Server name (SNI)",
    offered: "Offered versions",
    alpn: "Application protocols (ALPN)",
    keyShare: "Key share",
    legacy: "Version field",
    selected: "Selected version",
    cipher: "Cipher suite",
    encryptedFrom: "Encrypted from here",
    alpnHidden: "Certificate and chosen ALPN: encrypted",
    clientHello: "Client Hello · packet 8",
    serverHello: "Server Hello · packet 9",
    cols: { no: "No.", time: "Time (s)", src: "Source", dst: "Destination", proto: "Protocol", len: "Length", info: "Summary" },
  },
};

const he: NfCopy = {
  banner: "פריים עיצוב של אב-טיפוס · סטטי · תצוגה מקדימה מוגנת, לא פורסם",
  frameNames: { preview: "תקציר · שלב 2", "preview-end": "תקציר · כרטיס סיום", ch1: "פרק 1 · הקלטה", ch2: "פרק 2 · DNS", ch3: "פרק 3 · TCP", ch4: "פרק 4 · TLS", ch5: "פרק 5 · גבולות" },
  series: "Cyber Operations",
  cat: "פורנזיקה ברשת",
  title: "משם עד חיבור מוצפן",
  modes: { preview: "תקציר מנהלים", previewHint: "הרעיון ב-20 שניות", walkthrough: "סקירה טכנית", walkthroughHint: "חבילה אחר חבילה", text: "גרסת טקסט" },
  preview: {
    beats: [
      { label: "שם", text: "מתבצע חיפוש שם: updates.example.com מתורגם ל-198.51.100.40.", dur: 5 },
      { label: "חיבור", text: "לחיצת יד של TCP פותחת את החיבור תוך 24.1 מילישניות.", dur: 5 },
      { label: "חיבור מוצפן", text: "TLS 1.3 מצפין את החיבור. מכאן והלאה התוכן לא נראה.", dur: 5 },
      { label: "הגבולות", text: "כל אמירה מסומנת: נצפה, פרשנות או לא נראה.", dur: 5 },
    ],
    endEyebrow: "פורנזיקה ברשת · הדגמת הדרכה",
    endTitle: "משם עד חיבור מוצפן",
    endLead: "חיבור אחד, נקרא חבילה אחר חבילה, עם גבולות הראיות.",
    coversTitle: "מה הסקירה הטכנית מכסה",
    covers: ["חיפושי DNS: ‏A ו-AAAA", "לחיצת היד של TCP והאפשרויות שלה", "TLS 1.3: איפה מתחילה ההצפנה", "מה הקלטה יכולה ולא יכולה להוכיח"],
    watch: "לצפייה בסקירה הטכנית",
    replay: "הפעלת התקציר מחדש",
  },
  chapters: [
    {
      id: "ch1",
      title: "היקף ההקלטה",
      captions: [
        { text: "12 חבילות ב-71.5 מילישניות, שהוקלטו על הלקוח, 192.0.2.24.", dur: 6 },
        { text: "הקלטה מנקודה זו מראה מבט של מחשב אחד: כל חבילה יוצאת מהלקוח או מגיעה אליו.", dur: 7 },
        { text: "4 חבילות DNS, שלוש ללחיצת היד של TCP, ו-5 ל-TLS.", dur: 5 },
        { text: "כל פרק מסנן חלק אחד מתוך החילופים האלה.", dur: 6 },
      ],
      points: [
        { k: "fact", t: "12 חבילות בין 0 ל-71.5 ms: ‏4 DNS, ‏3 ללחיצת יד TCP, ‏5 TLS." },
        { k: "reasoning", t: "נקודת ההקלטה היא הלקוח, 192.0.2.24: כל חבילה יוצאת ממנו או מגיעה אליו." },
        { k: "limit", t: "תעבורה בין מכשירים אחרים ברשת לא נמצאת בהקלטה הזו." },
      ],
    },
    {
      id: "ch2",
      title: "פענוח DNS",
      captions: [
        { text: "הלקוח שולח שני חיפושים יחד: A לכתובת IPv4, ו-AAAA לכתובת IPv6.", dur: 6 },
        { text: "אחרי 18.4 ms מגיעה תשובת ה-A: ‏198.51.100.40, שמותר לשמור 300 שניות (TTL 300).", dur: 7 },
        { text: "תשובת ה-AAAA לא מכילה כתובת, רק את רשומת ה-SOA של האזור: לשם אין כתובת IPv6.", dur: 7 },
        { text: "לכן החיבור שאחריה ישתמש ב-IPv4.", dur: 4 },
        { text: "אם השרת ענה מהמטמון שלו, אי אפשר לראות מצד הלקוח.", dur: 6 },
      ],
      points: [
        { k: "fact", t: "תשובת ה-A נותנת 198.51.100.40 ‏(TTL 300) אחרי 18.4 ms. תשובת ה-AAAA לא מכילה כתובת, רק רשומת SOA." },
        { k: "reasoning", t: "אין לשם כתובת IPv6, ולכן הלקוח מתחבר ב-IPv4." },
        { k: "limit", t: "שימוש במטמון של השרת לא נראה כאן, ו-DNS over HTTPS לא היה מופיע כתעבורה בפורט 53." },
      ],
    },
    {
      id: "ch3",
      title: "לחיצת יד TCP",
      captions: [
        { text: "0.9 ms אחרי תשובת ה-DNS האחרונה, הלקוח שולח SYN אל 198.51.100.40 בפורט 443.", dur: 7 },
        { text: "השרת עונה SYN-ACK, וה-ACK של הלקוח משלים את לחיצת היד תוך 24.1 ms.", dur: 7 },
        { text: "שני הצדדים מציעים מקטע של 1460 בתים, אישור סלקטיבי והגדלת חלון.", dur: 6 },
        { text: "אין שידור חוזר ואין איפוס: הפורט קיבל את החיבור.", dur: 4 },
        { text: "הכתובת תואמת לתשובת ה-A, אבל זה לבד לא מוכיח לאיזה שם התכוונו.", dur: 6 },
      ],
      points: [
        { k: "fact", t: "חבילות 5–7 משלימות את לחיצת היד עם 198.51.100.40:443 תוך 24.1 ms, בלי שידור חוזר או איפוס." },
        { k: "reasoning", t: "סביר שהחיבור שייך ל-updates.example.com: הוא פונה לכתובת שבתשובת ה-A, ‏0.9 ms אחרי תשובת ה-DNS האחרונה." },
        { k: "limit", t: "כתובת תואמת לא מוכיחה לאיזה שם התכוונה האפליקציה. פרק 4 מוסיף סימן חזק יותר, אבל כזה שהלקוח קובע." },
      ],
    },
    {
      id: "ch4",
      title: "משא ומתן TLS",
      captions: [
        { text: "ה-Client Hello עדיין קריא: הוא מציין את השרת, updates.example.com, בשדה ה-SNI.", dur: 7 },
        { text: "הוא מציע TLS 1.3 ו-1.2 ואת הפרוטוקולים h2 ו-http/1.1.", dur: 6 },
        { text: "שדה הגרסה ב-Server Hello אומר 0x0303, כלומר TLS 1.2, לצורך תאימות.", dur: 6 },
        { text: "הבחירה האמיתית נמצאת ב-supported_versions: ‏TLS 1.3 עם TLS_AES_128_GCM_SHA256.", dur: 6 },
        { text: "מכאן והלאה לחיצת היד מוצפנת, כולל התעודה והפרוטוקול שנבחר.", dur: 7 },
      ],
      points: [
        { k: "fact", t: "SNI ‏updates.example.com; הוצעו TLS 1.3 ו-1.2. ה-Server Hello בוחר TLS 1.3 עם TLS_AES_128_GCM_SHA256." },
        { k: "reasoning", t: "ה-SNI תואם לשם ב-DNS, וזה מחזק את הקשר שנעשה בפרק 3." },
        { k: "limit", t: "את ה-SNI קובע הלקוח, ו-Encrypted Client Hello יכול להסתיר אותו. ב-TLS 1.3 התעודה וה-ALPN שנבחר מוצפנים." },
      ],
    },
    {
      id: "ch5",
      title: "מה ההקלטה לא מראה",
      captions: [
        { text: "מה ההקלטה מראה: מי התחבר לאן, מתי, ובאילו פרוטוקולים.", dur: 6 },
        { text: "מה היא מרמזת: החיבור הוא ל-updates.example.com, כי תשובת ה-DNS וה-SNI מסכימים.", dur: 7 },
        { text: "מה היא לא מראה: כתובות URL, התוכן, תעודת השרת או המשתמש שמאחורי הלקוח.", dur: 7 },
        { text: "כדי לענות על אלה צריך ראיות אחרות, כמו לוגים מהמחשב או מה-proxy.", dur: 5 },
        { text: "כל טענה בסיפור הזה מפנה לחבילות ממוספרות.", dur: 5 },
      ],
      points: [
        { k: "fact", t: "192.0.2.24 פענח את updates.example.com ופתח חיבור TLS 1.3 אל 198.51.100.40:443 (חבילות 1–12)." },
        { k: "reasoning", t: "סביר מאוד שהחיבור הוא ל-updates.example.com: תשובת ה-DNS (חבילה 3) וה-SNI (חבילה 8) מסכימים." },
        { k: "limit", t: "כתובות URL, התוכן, תעודת השרת והמשתמש לא נראים בהקלטה הזו." },
      ],
    },
  ],
  kinds: { fact: "נצפה בהקלטה", reasoning: "פרשנות", limit: "מגבלה" },
  board: {
    shows: "ההקלטה מראה",
    suggests: "היא מרמזת",
    cannot: "היא לא מראה",
    further: "ראיות שיכולות לענות על השאר",
    furtherList: ["לוגים מהמחשב 192.0.2.24 (תהליך, משתמש)", "לוגים של proxy או שער, כשיש הרשאה", "רק במעבדה: קובץ מפתחות ה-TLS של הלקוח עצמו"],
  },
  labels: {
    packets: "חבילות",
    filter: "מסנן תצוגה (תחביר Wireshark)",
    timeline: "ציר זמן ההקלטה · מילישניות",
    capturePoint: "נקודת הקלטה",
    client: "לקוח",
    server: "שרת",
    resolver: "שרת DNS",
    lookups: "חיפושים",
    handshake: "לחיצת יד TCP",
    tlsHandshake: "לחיצת יד TLS",
    rtt: "הלוך-חזור",
    answer: "תשובה",
    noAddress: "אין כתובת · רק SOA",
    sni: "שם השרת (SNI)",
    offered: "גרסאות מוצעות",
    alpn: "פרוטוקולי אפליקציה (ALPN)",
    keyShare: "שיתוף מפתח",
    legacy: "שדה הגרסה",
    selected: "הגרסה שנבחרה",
    cipher: "חבילת הצפנה",
    encryptedFrom: "מוצפן מכאן",
    alpnHidden: "התעודה וה-ALPN שנבחר: מוצפנים",
    clientHello: "Client Hello · חבילה 8",
    serverHello: "Server Hello · חבילה 9",
    cols: { no: "מס׳", time: "זמן (ש׳)", src: "מקור", dst: "יעד", proto: "פרוטוקול", len: "אורך", info: "תקציר" },
  },
};

const ar: NfCopy = {
  banner: "إطار تصميم لنموذج أولي · ثابت · معاينة محمية، غير منشور",
  frameNames: { preview: "المعاينة · المقطع 2", "preview-end": "المعاينة · بطاقة الختام", ch1: "ف1 · الالتقاط", ch2: "ف2 · DNS", ch3: "ف3 · TCP", ch4: "ف4 · TLS", ch5: "ف5 · الحدود" },
  series: "Cyber Operations",
  cat: "التحليل الجنائي للشبكات",
  title: "من اسم إلى جلسة مشفّرة",
  modes: { preview: "معاينة تنفيذية", previewHint: "الفكرة في 20 ثانية", walkthrough: "شرح تقني", walkthroughHint: "حزمة بحزمة", text: "النسخة النصية" },
  preview: {
    beats: [
      { label: "اسم", text: "يُبحث عن اسم: updates.example.com يُترجم إلى 198.51.100.40.", dur: 5 },
      { label: "اتصال", text: "مصافحة TCP تفتح الاتصال خلال 24.1 ملّي ثانية.", dur: 5 },
      { label: "جلسة مشفّرة", text: "يشفّر TLS 1.3 الجلسة. ومن هنا لا يظهر المحتوى.", dur: 5 },
      { label: "الحدود", text: "كل عبارة موسومة: ملاحَظ أو تفسير أو غير ظاهر.", dur: 5 },
    ],
    endEyebrow: "التحليل الجنائي للشبكات · عرض تدريبي",
    endTitle: "من اسم إلى جلسة مشفّرة",
    endLead: "اتصال واحد يُقرأ حزمة بحزمة، مع ذكر حدود الأدلة.",
    coversTitle: "ما يغطيه الشرح التقني",
    covers: ["استعلامات DNS: ‏A وAAAA", "مصافحة TCP وخياراتها", "TLS 1.3: أين يبدأ التشفير", "ما يمكن للالتقاط إثباته وما لا يمكنه"],
    watch: "شاهد الشرح التقني",
    replay: "إعادة المعاينة",
  },
  chapters: [
    {
      id: "ch1",
      title: "نطاق الالتقاط",
      captions: [
        { text: "12 حزمة خلال 71.5 ملّي ثانية، التُقطت على جهاز العميل 192.0.2.24.", dur: 6 },
        { text: "الالتقاط من هذه النقطة يُظهر منظور جهاز واحد: كل حزمة تخرج من العميل أو تصل إليه.", dur: 7 },
        { text: "4 حزم DNS، وثلاث لمصافحة TCP، و5 لـ TLS.", dur: 5 },
        { text: "كل فصل يرشّح جزءًا واحدًا من هذا التبادل.", dur: 6 },
      ],
      points: [
        { k: "fact", t: "12 حزمة بين 0 و71.5 ms: ‏4 DNS، و3 لمصافحة TCP، و5 TLS." },
        { k: "reasoning", t: "نقطة الالتقاط هي العميل 192.0.2.24: كل حزمة تخرج منه أو تصل إليه." },
        { k: "limit", t: "حركة المرور بين الأجهزة الأخرى في الشبكة ليست في هذا الالتقاط." },
      ],
    },
    {
      id: "ch2",
      title: "تحليل DNS",
      captions: [
        { text: "يرسل العميل استعلامين معًا: A لعنوان IPv4، وAAAA لعنوان IPv6.", dur: 6 },
        { text: "بعد 18.4 ms يصل رد A: ‏198.51.100.40، صالح للتخزين 300 ثانية (TTL 300).", dur: 7 },
        { text: "رد AAAA لا يحمل عنوانًا، بل سجل SOA للمنطقة فقط: لا عنوان IPv6 لهذا الاسم.", dur: 7 },
        { text: "لذلك سيستخدم الاتصال التالي IPv4.", dur: 4 },
        { text: "لا يمكن من جهة العميل معرفة ما إذا أجاب الخادم من ذاكرته المؤقتة.", dur: 6 },
      ],
      points: [
        { k: "fact", t: "يعطي رد A العنوان 198.51.100.40 ‏(TTL 300) بعد 18.4 ms. ورد AAAA لا يحمل عنوانًا، بل سجل SOA فقط." },
        { k: "reasoning", t: "لا عنوان IPv6 لهذا الاسم، لذلك يتصل العميل عبر IPv4." },
        { k: "limit", t: "التخزين المؤقت لدى الخادم لا يظهر هنا، وDNS over HTTPS لن يظهر كحركة على المنفذ 53." },
      ],
    },
    {
      id: "ch3",
      title: "مصافحة TCP",
      captions: [
        { text: "بعد 0.9 ms من آخر رد DNS، يرسل العميل SYN إلى 198.51.100.40 على المنفذ 443.", dur: 7 },
        { text: "يرد الخادم بـ SYN-ACK، ويُكمل ACK العميل المصافحة خلال 24.1 ms.", dur: 7 },
        { text: "يعرض الطرفان مقطعًا بحجم 1460 بايت وإقرارًا انتقائيًا وتوسيع النافذة.", dur: 6 },
        { text: "لا إعادة إرسال ولا إعادة ضبط: المنفذ قبل الاتصال.", dur: 4 },
        { text: "العنوان يطابق رد A، لكن هذا وحده لا يثبت أيّ اسم كان مقصودًا.", dur: 6 },
      ],
      points: [
        { k: "fact", t: "تُكمل الحزم 5–7 المصافحة مع 198.51.100.40:443 خلال 24.1 ms، دون إعادة إرسال أو إعادة ضبط." },
        { k: "reasoning", t: "يُرجَّح أن الاتصال يخص updates.example.com: فهو يتجه إلى عنوان رد A، بعد 0.9 ms من آخر رد DNS." },
        { k: "limit", t: "تطابق العنوان لا يثبت أيّ اسم قصده التطبيق. يضيف الفصل 4 مؤشرًا أقوى، لكنه من تحديد العميل." },
      ],
    },
    {
      id: "ch4",
      title: "تفاوض TLS",
      captions: [
        { text: "رسالة Client Hello ما زالت مقروءة: تسمّي الخادم updates.example.com في حقل SNI.", dur: 7 },
        { text: "وتعرض TLS 1.3 و1.2 وبروتوكولي التطبيق h2 وhttp/1.1.", dur: 6 },
        { text: "حقل الإصدار في Server Hello يقول 0x0303، أي TLS 1.2، للتوافق.", dur: 6 },
        { text: "الاختيار الفعلي في supported_versions: ‏TLS 1.3 مع TLS_AES_128_GCM_SHA256.", dur: 6 },
        { text: "من هنا تصبح المصافحة مشفّرة، بما في ذلك الشهادة والبروتوكول المختار.", dur: 7 },
      ],
      points: [
        { k: "fact", t: "‏SNI ‏updates.example.com؛ عُرض TLS 1.3 و1.2. ويختار Server Hello ‏TLS 1.3 مع TLS_AES_128_GCM_SHA256." },
        { k: "reasoning", t: "يطابق SNI اسم DNS، وهذا يدعم الربط الذي جرى في الفصل 3." },
        { k: "limit", t: "يحدد العميل SNI، ويمكن لـ Encrypted Client Hello إخفاؤه. وفي TLS 1.3 تكون الشهادة وALPN المختار مشفّرين." },
      ],
    },
    {
      id: "ch5",
      title: "ما لا يُظهره الالتقاط",
      captions: [
        { text: "ما يُظهره الالتقاط: من اتصل بأين، ومتى، وبأي بروتوكولات.", dur: 6 },
        { text: "ما يوحي به: الجلسة تخص updates.example.com، لأن رد DNS وSNI متفقان.", dur: 7 },
        { text: "ما لا يُظهره: عناوين URL والمحتوى وشهادة الخادم والمستخدم خلف العميل.", dur: 7 },
        { text: "الإجابة عن ذلك تحتاج أدلة أخرى، مثل سجلات الجهاز أو الـ proxy.", dur: 5 },
        { text: "كل ادعاء في هذه القصة يحيل إلى حزم مرقّمة.", dur: 5 },
      ],
      points: [
        { k: "fact", t: "حلّل 192.0.2.24 الاسم updates.example.com وفتح جلسة TLS 1.3 إلى 198.51.100.40:443 (الحزم 1–12)." },
        { k: "reasoning", t: "يُرجَّح بقوة أن الجلسة تخص updates.example.com: رد DNS (الحزمة 3) وSNI (الحزمة 8) متفقان." },
        { k: "limit", t: "عناوين URL والمحتوى وشهادة الخادم والمستخدم لا تظهر في هذا الالتقاط." },
      ],
    },
  ],
  kinds: { fact: "ملاحَظ في الالتقاط", reasoning: "تفسير", limit: "قيد" },
  board: {
    shows: "يُظهر الالتقاط",
    suggests: "يوحي بأن",
    cannot: "لا يُظهر",
    further: "أدلة يمكنها الإجابة عن الباقي",
    furtherList: ["سجلات الجهاز 192.0.2.24 (العملية، المستخدم)", "سجلات الـ proxy أو البوابة، عند وجود تفويض", "في المختبر فقط: ملف مفاتيح TLS الخاص بالعميل"],
  },
  labels: {
    packets: "الحزم",
    filter: "مرشّح العرض (صيغة Wireshark)",
    timeline: "الخط الزمني للالتقاط · ملّي ثانية",
    capturePoint: "نقطة الالتقاط",
    client: "العميل",
    server: "الخادم",
    resolver: "خادم DNS",
    lookups: "الاستعلامات",
    handshake: "مصافحة TCP",
    tlsHandshake: "مصافحة TLS",
    rtt: "الذهاب والإياب",
    answer: "الرد",
    noAddress: "لا عنوان · SOA فقط",
    sni: "اسم الخادم (SNI)",
    offered: "الإصدارات المعروضة",
    alpn: "بروتوكولات التطبيق (ALPN)",
    keyShare: "مشاركة المفتاح",
    legacy: "حقل الإصدار",
    selected: "الإصدار المختار",
    cipher: "مجموعة التشفير",
    encryptedFrom: "مشفّر من هنا",
    alpnHidden: "الشهادة وALPN المختار: مشفّران",
    clientHello: "Client Hello · الحزمة 8",
    serverHello: "Server Hello · الحزمة 9",
    cols: { no: "رقم", time: "الزمن (ث)", src: "المصدر", dst: "الوجهة", proto: "البروتوكول", len: "الطول", info: "الملخص" },
  },
};

export const nfCopy: Record<Locale, NfCopy> = { en, he, ar };

/** Chapter start times and total length, derived from caption durations. */
export function chapterTimes(c: NfCopy) {
  let t = 0;
  const starts = c.chapters.map((ch) => {
    const s = t;
    t += ch.captions.reduce((a, x) => a + x.dur, 0);
    return s;
  });
  return { starts, total: t, preview: c.preview.beats.reduce((a, b) => a + b.dur, 0) };
}
export const clock = (sec: number) => `${Math.floor(sec / 60)}:${String(Math.round(sec % 60)).padStart(2, "0")}`;
