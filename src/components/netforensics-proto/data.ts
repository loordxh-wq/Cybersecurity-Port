/**
 * Network Forensics prototype: one synthetic connection, DNS → TCP → TLS 1.3, as
 * a Windows client would produce it. Every frame length, sequence number, delta
 * and round trip is derived from these fields and recomputed by
 * tests/unit/netforensics-data.test.mjs (see docs/network-forensics-prototype.md §4).
 *
 * Addresses: RFC 5737 documentation ranges only. Names: example.com (RFC 2606).
 * Nothing here was captured from a real network or describes work Eli performed.
 */

export const hosts = {
  client: "192.0.2.24",
  resolver: "192.0.2.53",
  server: "198.51.100.40",
  name: "updates.example.com",
} as const;

export type Proto = "DNS" | "TCP" | "TLS";

export interface DnsPart {
  id: string;
  kind: "query" | "response";
  qtype: "A" | "AAAA";
  /** A record in the answer section. */
  answer?: { addr: string; ttl: number };
  /** Negative answer: no records, the zone's SOA in the authority section (RFC 2308). */
  soa?: { mname: string; rname: string };
}

export interface TcpPart {
  flags: ("SYN" | "ACK" | "PSH")[];
  /** Relative sequence and acknowledgement numbers, as an analyst reads them. */
  seq: number;
  ack?: number;
  /** TCP payload bytes. */
  len: number;
  /** Window field as sent; scaled windows show the effective value separately. */
  win: number;
  winScaled?: number;
  /** Option summary and its size in bytes (header = 20 + optBytes). */
  opts?: string[];
  optBytes?: number;
}

export interface Packet {
  no: number;
  /** Seconds since the first packet. */
  t: number;
  src: string;
  sport: number;
  dst: string;
  dport: number;
  proto: Proto;
  /** Captured frame length in bytes (Ethernet II, no FCS). */
  frame: number;
  dns?: DnsPart;
  tcp?: TcpPart;
  /** TLS records carried in the segment, in order. */
  tls?: string[];
  /** True once the payload is encrypted (TLS 1.3 after the Server Hello). */
  encrypted?: boolean;
}

const C = hosts.client;
const R = hosts.resolver;
const S = hosts.server;

export const packets: Packet[] = [
  { no: 1, t: 0.0, src: C, sport: 53122, dst: R, dport: 53, proto: "DNS", frame: 79, dns: { id: "0x3f2a", kind: "query", qtype: "A" } },
  { no: 2, t: 0.000143, src: C, sport: 61907, dst: R, dport: 53, proto: "DNS", frame: 79, dns: { id: "0x8c41", kind: "query", qtype: "AAAA" } },
  { no: 3, t: 0.018412, src: R, sport: 53, dst: C, dport: 53122, proto: "DNS", frame: 95, dns: { id: "0x3f2a", kind: "response", qtype: "A", answer: { addr: S, ttl: 300 } } },
  {
    no: 4,
    t: 0.018977,
    src: R,
    sport: 53,
    dst: C,
    dport: 61907,
    proto: "DNS",
    frame: 130,
    dns: { id: "0x8c41", kind: "response", qtype: "AAAA", soa: { mname: "ns1.example.com", rname: "hostmaster.example.com" } },
  },
  {
    no: 5,
    t: 0.019873,
    src: C,
    sport: 49712,
    dst: S,
    dport: 443,
    proto: "TCP",
    frame: 66,
    tcp: { flags: ["SYN"], seq: 0, len: 0, win: 64240, opts: ["MSS=1460", "WS=256", "SACK_PERM"], optBytes: 12 },
  },
  {
    no: 6,
    t: 0.043961,
    src: S,
    sport: 443,
    dst: C,
    dport: 49712,
    proto: "TCP",
    frame: 66,
    tcp: { flags: ["SYN", "ACK"], seq: 0, ack: 1, len: 0, win: 65160, opts: ["MSS=1460", "SACK_PERM", "WS=128"], optBytes: 12 },
  },
  { no: 7, t: 0.044102, src: C, sport: 49712, dst: S, dport: 443, proto: "TCP", frame: 54, tcp: { flags: ["ACK"], seq: 1, ack: 1, len: 0, win: 1026, winScaled: 262656 } },
  {
    no: 8,
    t: 0.044655,
    src: C,
    sport: 49712,
    dst: S,
    dport: 443,
    proto: "TLS",
    frame: 571,
    tcp: { flags: ["PSH", "ACK"], seq: 1, ack: 1, len: 517, win: 1026, winScaled: 262656 },
    tls: ["Client Hello"],
  },
  {
    no: 9,
    t: 0.06932,
    src: S,
    sport: 443,
    dst: C,
    dport: 49712,
    proto: "TLS",
    frame: 1514,
    tcp: { flags: ["ACK"], seq: 1, ack: 518, len: 1460, win: 501, winScaled: 64128 },
    tls: ["Server Hello", "Change Cipher Spec", "Application Data"],
  },
  {
    no: 10,
    t: 0.069655,
    src: S,
    sport: 443,
    dst: C,
    dport: 49712,
    proto: "TLS",
    frame: 912,
    tcp: { flags: ["PSH", "ACK"], seq: 1461, ack: 518, len: 858, win: 501, winScaled: 64128 },
    tls: ["Application Data"],
    encrypted: true,
  },
  {
    no: 11,
    t: 0.071203,
    src: C,
    sport: 49712,
    dst: S,
    dport: 443,
    proto: "TLS",
    frame: 118,
    tcp: { flags: ["PSH", "ACK"], seq: 518, ack: 2319, len: 64, win: 1026, winScaled: 262656 },
    tls: ["Change Cipher Spec", "Application Data"],
    encrypted: true,
  },
  {
    no: 12,
    t: 0.07153,
    src: C,
    sport: 49712,
    dst: S,
    dport: 443,
    proto: "TLS",
    frame: 300,
    tcp: { flags: ["PSH", "ACK"], seq: 582, ack: 2319, len: 246, win: 1026, winScaled: 262656 },
    tls: ["Application Data"],
    encrypted: true,
  },
];

/** TLS handshake fields shown in chapter 4 (visible in the clear before encryption starts). */
export const clientHello = {
  sni: hosts.name,
  legacyVersion: "0x0303",
  supportedVersions: ["TLS 1.3", "TLS 1.2"],
  alpn: ["h2", "http/1.1"],
  keyShare: "x25519",
} as const;

export const serverHello = {
  legacyVersion: "0x0303",
  selectedVersion: "TLS 1.3",
  cipher: "TLS_AES_128_GCM_SHA256",
  keyShare: "x25519",
} as const;

/** Display filters shown per chapter, in Wireshark display-filter syntax. */
export const filters = {
  ch1: "ip.addr == 192.0.2.24",
  ch2: 'dns.qry.name == "updates.example.com"',
  ch3: "tcp.port == 443 && tcp.len == 0",
  ch4: "tls.handshake.type in {1 2}",
  ch5: "tcp.stream == 0",
} as const;

/* ------------------------------------------------------------- derived */

export const ms = (s: number) => (s * 1000).toFixed(1);
export const byNo = (n: number) => packets.find((p) => p.no === n)!;
/** Round trips the story quotes, derived from packet times. */
export const timing = {
  dns: byNo(3).t - byNo(1).t,
  handshake: byNo(6).t - byNo(5).t,
  tlsFirstFlight: byNo(9).t - byNo(8).t,
  dnsToSyn: byNo(5).t - byNo(4).t,
  total: packets[packets.length - 1]!.t,
};

/** One-line summary per packet, built from the fields above so the text cannot drift. */
export function summary(p: Packet): string {
  if (p.dns) {
    const d = p.dns;
    if (d.kind === "query") return `Query ${d.id}  ${d.qtype} ${hosts.name}`;
    if (d.answer) return `Response ${d.id}  ${d.qtype} ${d.answer.addr}  TTL ${d.answer.ttl}`;
    return `Response ${d.id}  ${d.qtype}: no record  SOA ${d.soa!.mname}`;
  }
  const t = p.tcp!;
  const ports = `${p.sport} → ${p.dport}`;
  const head = `${ports}  ${t.flags.join(", ")}  Seq=${t.seq}${t.ack !== undefined ? ` Ack=${t.ack}` : ""}`;
  if (p.tls) return `${p.tls.join(", ")}  ·  ${head} Len=${t.len}`;
  const win = `Win=${t.winScaled ?? t.win}`;
  return `${head}  ${win}${t.opts ? "  " + t.opts.join("  ") : ""}`;
}
