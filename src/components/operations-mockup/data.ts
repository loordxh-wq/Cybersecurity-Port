/**
 * Synthetic, language-independent values for the Cyber Operations proposal mockups.
 * Addresses are RFC 5737 documentation ranges, names use lab.local / example.com
 * (RFC 2606), and every protocol and Windows event value is checked against its
 * specification in docs/cyber-operations-proposal.md (§9). Nothing here describes a
 * real network, a real incident or work Eli has performed.
 */

/* Network forensics: DNS → TCP → TLS for one connection (Windows client, Linux server). */
export const net = {
  client: "192.0.2.24",
  resolver: "192.0.2.53",
  server: "198.51.100.40",
  name: "updates.example.com",
  clientPort: 49712,
  filter: "tcp.flags.syn == 1 && tcp.port == 443",
  rttMs: "24.1",
  dnsMs: "18.4",
  packets: [
    { no: 1, t: "0.000000", src: "192.0.2.24", dst: "192.0.2.53", proto: "DNS", len: 79, info: "Query 0x3f2a  A updates.example.com" },
    { no: 2, t: "0.018412", src: "192.0.2.53", dst: "192.0.2.24", proto: "DNS", len: 95, info: "Response 0x3f2a  A 198.51.100.40  TTL 300" },
    { no: 3, t: "0.019873", src: "192.0.2.24", dst: "198.51.100.40", proto: "TCP", len: 66, info: "49712 → 443  SYN  Seq=0  Win=64240  MSS=1460  WS=256  SACK_PERM" },
    { no: 4, t: "0.043961", src: "198.51.100.40", dst: "192.0.2.24", proto: "TCP", len: 66, info: "443 → 49712  SYN, ACK  Seq=0 Ack=1  Win=65160  MSS=1460  SACK_PERM  WS=128" },
    { no: 5, t: "0.044102", src: "192.0.2.24", dst: "198.51.100.40", proto: "TCP", len: 54, info: "49712 → 443  ACK  Seq=1 Ack=1  Win=262656" },
    { no: 6, t: "0.044655", src: "192.0.2.24", dst: "198.51.100.40", proto: "TLS", len: 571, info: "Client Hello  SNI=updates.example.com" },
    { no: 7, t: "0.069320", src: "198.51.100.40", dst: "192.0.2.24", proto: "TLS", len: 1434, info: "Server Hello, Change Cipher Spec, encrypted records" },
  ],
  ladder: [
    { dir: "out", label: "SYN", detail: "Seq=0  MSS=1460  WS=256", t: "0.019873" },
    { dir: "in", label: "SYN, ACK", detail: "Seq=0  Ack=1  MSS=1460  WS=128", t: "0.043961" },
    { dir: "out", label: "ACK", detail: "Seq=1  Ack=1", t: "0.044102" },
  ],
} as const;

/* SIEM & Windows security: failed logons (4625) per source in one 10-minute window. */
export const siem = {
  window: "2026-03-11 09:00–09:10 UTC",
  threshold: 10,
  perAccountMax: 3,
  /** label: [dx, dy, text-anchor] keeps the five address labels clear of each other. */
  sources: [
    { ip: "198.51.100.61", accounts: 14, failures: 14, kind: "spray", label: [8, -20, "end"] },
    { ip: "192.0.2.10", accounts: 11, failures: 13, kind: "review", label: [-12, 4, "end"] },
    { ip: "198.51.100.62", accounts: 1, failures: 38, kind: "brute", label: [12, 4, "start"] },
    { ip: "192.0.2.31", accounts: 2, failures: 3, kind: "normal", label: [10, 14, "start"] },
    { ip: "192.0.2.47", accounts: 1, failures: 2, kind: "normal", label: [10, -8, "start"] },
  ],
  spl: [
    "index=lab_wineventlog EventCode=4625 LogonType IN (3, 10)",
    "| bin _time span=10m",
    "| stats dc(TargetUserName) AS accounts, count AS failures BY _time, IpAddress",
    "| eval per_account = round(failures / accounts, 1)",
    "| where accounts >= 10 AND per_account <= 3",
  ],
  fields: [
    ["EventCode", "4625"],
    ["LogonType", "3"],
    ["TargetUserName", "a.cohen"],
    ["IpAddress", "198.51.100.61"],
    ["Status", "0xC000006D"],
    ["SubStatus", "0xC000006A"],
    ["AuthenticationPackageName", "NTLM"],
  ],
} as const;

/* Active Directory: OU design and Group Policy links in the lab.local domain. */
export const ad = {
  domain: "lab.local",
  tree: [
    { depth: 0, name: "lab.local", kind: "domain", gpos: ["Default Domain Policy"] },
    { depth: 1, name: "Domain Controllers", kind: "ou", gpos: ["Default Domain Controllers Policy"] },
    { depth: 1, name: "Corp", kind: "ou", gpos: [] },
    { depth: 2, name: "Users", kind: "ou", gpos: [] },
    { depth: 3, name: "Finance", kind: "ou", gpos: ["Finance-Drive-Map"] },
    { depth: 3, name: "Support", kind: "ou", gpos: [] },
    { depth: 2, name: "Computers", kind: "ou", gpos: [] },
    { depth: 3, name: "Workstations", kind: "ou", gpos: ["WS-Baseline"], focus: true },
    { depth: 3, name: "Servers", kind: "ou", gpos: [] },
    { depth: 2, name: "Admin", kind: "ou", gpos: [] },
  ],
  order: ["Local", "Site", "Domain", "OU: Corp", "OU: Computers", "OU: Workstations"],
  checks: [
    "gpresult /r /scope computer",
    'Get-GPInheritance -Target "OU=Workstations,OU=Computers,OU=Corp,DC=lab,DC=local"',
  ],
  setting: ["Interactive logon: Machine inactivity limit", "600 s"],
} as const;

/* SOC-01 (training simulation): the dataset already used by the Phase 3 motion study. */
export const soc = {
  alert: "ALR-0418",
  spray: "203.0.113.45",
  second: "203.0.113.77",
  account: "j.morgan",
  jump: "JMP01",
  file: "SRV-FILE01",
  success: "02:14:37",
  lateral: "02:21:13",
  client: "DESKTOP-7Q2M4",
} as const;
