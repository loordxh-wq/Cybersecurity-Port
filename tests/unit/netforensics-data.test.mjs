// Network Forensics prototype: the synthetic capture is internally consistent. Frame lengths
// are recomputed from protocol structure, TCP sequence and acknowledgement numbers follow
// from payload lengths, scaled windows match the negotiated shift, times only move forward,
// every address is a documentation address, and every number the copy quotes matches the
// data. Run: npm run test:guard
import { test } from "node:test";
import assert from "node:assert/strict";
import { register } from "node:module";

const src = new URL("../../src/", import.meta.url).href;
register(
  "data:text/javascript," +
    encodeURIComponent(`
      export async function resolve(spec, ctx, next) {
        if (spec.startsWith("@/")) return next(${JSON.stringify(src)} + spec.slice(2) + ".ts", ctx);
        if ((spec.startsWith("./") || spec.startsWith("../")) && !/\\.[cm]?[jt]sx?$/.test(spec)) return next(spec + ".ts", ctx);
        return next(spec, ctx);
      }`),
);

const d = await import("../../src/components/netforensics-proto/data.ts");
const { nfCopy } = await import("../../src/components/netforensics-proto/copy.ts");

const ETH = 14;
const IP = 20;
const UDP = 8;
const TCP = 20;
const DNS_HEADER = 12;

/** Wire length of a DNS name in uncompressed label form, e.g. updates.example.com → 21. */
const nameLen = (n) => n.split(".").reduce((s, l) => s + 1 + l.length, 0) + 1;
/** A name written as new labels in front of a compression pointer to "example.com" in the question. */
const prefixedLen = (n) => nameLen(n.replace(/\.example\.com$/, "")) - 1 + 2;

function dnsLength(p) {
  const q = nameLen(d.hosts.name) + 4; // QNAME + QTYPE + QCLASS
  let len = DNS_HEADER + q;
  if (p.dns.answer) len += 2 + 2 + 2 + 4 + 2 + 4; // pointer, TYPE, CLASS, TTL, RDLENGTH, IPv4
  if (p.dns.soa) {
    const rdata = prefixedLen(p.dns.soa.mname) + prefixedLen(p.dns.soa.rname) + 5 * 4; // MNAME, RNAME, five 32-bit fields
    len += 2 + 2 + 2 + 4 + 2 + rdata; // owner name is a pointer to example.com
  }
  return len;
}

test("DNS frame lengths follow from the message structure (RFC 1035, RFC 2308)", () => {
  assert.equal(nameLen("updates.example.com"), 21);
  for (const p of d.packets.filter((x) => x.dns)) assert.equal(p.frame, ETH + IP + UDP + dnsLength(p), `packet ${p.no}`);
  // Queries and their responses pair by transaction ID and port.
  for (const q of d.packets.filter((x) => x.dns?.kind === "query")) {
    const r = d.packets.find((x) => x.dns?.kind === "response" && x.dns.id === q.dns.id);
    assert.ok(r, `response for ${q.dns.id}`);
    assert.equal(r.dport, q.sport);
    assert.equal(r.dns.qtype, q.dns.qtype);
    assert.ok(r.t > q.t);
  }
});

test("TCP frame lengths, sequence and acknowledgement numbers are consistent (RFC 9293)", () => {
  const next = { [d.hosts.client]: null, [d.hosts.server]: null };
  for (const p of d.packets.filter((x) => x.tcp)) {
    const t = p.tcp;
    assert.equal(p.frame, ETH + IP + TCP + (t.optBytes ?? 0) + t.len, `packet ${p.no} length`);
    if (next[p.src] !== null) assert.equal(t.seq, next[p.src], `packet ${p.no} seq`);
    next[p.src] = t.seq + t.len + (t.flags.includes("SYN") ? 1 : 0);
    if (t.ack !== undefined) assert.ok(t.ack <= (next[p.dst] ?? 0), `packet ${p.no} acks only what was sent`);
  }
  // Every byte sent was acknowledged by the last packet in each direction that carries an ACK.
  assert.equal(d.byNo(11).tcp.ack, next[d.hosts.server]);
  assert.equal(d.byNo(9).tcp.ack, d.byNo(8).tcp.seq + d.byNo(8).tcp.len);
});

test("window scaling matches the shifts negotiated in the SYNs (RFC 7323)", () => {
  const shift = { [d.hosts.client]: 256, [d.hosts.server]: 128 };
  assert.ok(d.byNo(5).tcp.opts.includes("WS=256"));
  assert.ok(d.byNo(6).tcp.opts.includes("WS=128"));
  for (const p of d.packets.filter((x) => x.tcp && !x.tcp.flags.includes("SYN"))) assert.equal(p.tcp.winScaled, p.tcp.win * shift[p.src], `packet ${p.no}`);
  // SYN options: MSS 4 + NOP 1 + WS 3 + NOP 1 + NOP 1 + SACK_PERM 2 = 12 bytes.
  assert.equal(d.byNo(5).tcp.optBytes, 12);
});

test("TLS record sizes are plausible and encryption starts after the Server Hello (RFC 8446)", () => {
  // Client CCS (5 + 1) and Finished (5-byte header + 32-byte verify_data + 4-byte handshake header + 1 content type + 16-byte tag).
  assert.equal(d.byNo(11).tcp.len, 5 + 1 + (5 + 32 + 4 + 1 + 16));
  assert.equal(d.byNo(9).tcp.len, 1460, "a full segment at MSS 1460");
  assert.ok(d.byNo(9).tls[0] === "Server Hello");
  for (const p of d.packets.filter((x) => x.no > 9)) assert.ok(p.encrypted, `packet ${p.no} is encrypted`);
  assert.equal(d.serverHello.legacyVersion, "0x0303");
  assert.ok(d.clientHello.supportedVersions.includes(d.serverHello.selectedVersion));
});

test("times move forward and the quoted round trips match the packets", () => {
  for (let i = 1; i < d.packets.length; i++) assert.ok(d.packets[i].t > d.packets[i - 1].t, `packet ${i + 1}`);
  assert.equal(d.ms(d.timing.dns), "18.4");
  assert.equal(d.ms(d.timing.handshake), "24.1");
  assert.equal(d.ms(d.timing.dnsToSyn), "0.9");
  assert.equal(d.ms(d.timing.total), "71.5");
});

test("only documentation addresses and reserved names appear", () => {
  const doc = /^(192\.0\.2|198\.51\.100|203\.0\.113)\.\d{1,3}$/;
  for (const p of d.packets) for (const a of [p.src, p.dst]) assert.match(a, doc);
  assert.match(d.hosts.name, /\.example\.com$/);
});

test("every number the copy quotes matches the data, in every language", () => {
  const counts = { DNS: 0, TCP: 0, TLS: 0 };
  for (const p of d.packets) counts[p.proto]++;
  for (const [l, c] of Object.entries(nfCopy)) {
    const all = JSON.stringify(c);
    for (const v of ["18.4", "24.1", "0.9", "71.5", "198.51.100.40", "TTL 300"]) assert.ok(all.includes(v), `${l} mentions ${v}`);
    // Values from the earlier seven-packet mockup must not survive (71.5 ms is fine; a bare 1.5 ms is not).
    for (const bad of [/(?<![\d.])1\.5 ms/, /\b69 ms/, /\b7 packets/]) assert.ok(!bad.test(all), `${l} has stale value ${bad}`);
    assert.ok(all.includes(String(d.packets.length)), `${l} packet count`);
    assert.ok(all.includes(`${counts.DNS}`) && all.includes(`${counts.TLS}`), `${l} protocol counts`);
  }
});

test("captions are readable: at most 16.5 characters per second", () => {
  for (const [l, c] of Object.entries(nfCopy)) {
    for (const b of c.preview.beats) assert.ok(b.text.length / b.dur <= 16.5, `${l} preview: ${b.text.length / b.dur} cps`);
    for (const ch of c.chapters) for (const cap of ch.captions) assert.ok(cap.text.length / cap.dur <= 16.5, `${l} ${ch.id}: ${(cap.text.length / cap.dur).toFixed(1)} cps`);
  }
});
