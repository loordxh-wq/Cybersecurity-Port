/**
 * Eli's phone number, published at his explicit request (2026-10-16) for CV requests.
 *
 * Imported only by the client-side CV dialog, so the number is never in the
 * server-rendered HTML or the page payload: it appears only after a visitor opens
 * the dialog. It is assembled from parts so it is not a single plain string in the
 * script. This is not protection: anyone who opens the dialog, or reads the
 * script, can see the number. It reduces casual scraping, nothing more.
 */
const parts = ["+972", "52", "344", "0833"] as const;

export function getPhone() {
  const [cc, a, b, c] = parts;
  return {
    /** As Eli writes it locally: 0523440833 */
    local: `0${a}${b}${c}`,
    /** Readable international form: +972 52-344-0833 */
    international: `${cc} ${a}-${b}-${c}`,
    /** For tel: and sms: links */
    e164: `${cc}${a}${b}${c}`,
  };
}
