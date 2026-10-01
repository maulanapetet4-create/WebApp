import { randomUUID } from "crypto";
import fs from "fs";
import os from "os";
import path from "path";
import type { PublicReport, Report, ReportInput } from "./types";

// MOCK DB: memori + file JSON di /tmp (Vercel hanya mengizinkan tulis di /tmp).
// Data BISA hilang saat serverless restart. Ganti dengan DB asli sebelum produksi.
const FILE = path.join(os.tmpdir(), "cnc-reports.json");
const g = globalThis as unknown as { __cnc?: Report[] };

function load(): Report[] {
  try { g.__cnc = JSON.parse(fs.readFileSync(FILE, "utf8")); } catch { g.__cnc ??= []; }
  return g.__cnc!;
}
function save(list: Report[]) {
  g.__cnc = list;
  try { fs.writeFileSync(FILE, JSON.stringify(list)); } catch { /* abaikan */ }
}
export const toPublic = ({ tokenSpv, tokenGm, ...rest }: Report): PublicReport => rest;

export function createReport(input: ReportInput): Report {
  const r: Report = {
    ...input, id: randomUUID(), createdAt: new Date().toISOString(),
    status: "submitted", tokenSpv: randomUUID(),
  };
  save([r, ...load()]);
  return r;
}
export const listReports = (): PublicReport[] => load().map(toPublic);

export function getByToken(token: string): { report: Report; role: "spv" | "gm" } | null {
  for (const r of load()) {
    if (r.tokenSpv === token) return { report: r, role: "spv" };
    if (r.tokenGm && r.tokenGm === token) return { report: r, role: "gm" };
  }
  return null;
}

export function approve(token: string, name: string):
  | { ok: true; report: Report; role: "spv" | "gm" }
  | { ok: false; error: string } {
  const list = load();
  const found = getByToken(token);
  if (!found) return { ok: false, error: "Link tidak valid." };
  if (!name.trim()) return { ok: false, error: "Nama penandatangan wajib diisi." };
  const r = list.find((x) => x.id === found.report.id)!;
  const now = new Date().toISOString();
  if (found.role === "spv") {
    if (r.status !== "submitted") return { ok: false, error: "Laporan sudah di-approve SPV." };
    Object.assign(r, { status: "spv_approved", spvName: name.trim(), spvAt: now, tokenGm: randomUUID() });
  } else {
    if (r.status !== "spv_approved") return { ok: false, error: "Laporan sudah final." };
    Object.assign(r, { status: "final", gmName: name.trim(), gmAt: now });
  }
  save(list);
  return { ok: true, report: r, role: found.role };
}
