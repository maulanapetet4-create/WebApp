import { NextResponse } from "next/server";
import { createReport, getByToken, listReports, toPublic } from "@/lib/db";
import type { ReportInput } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  if (!token) return NextResponse.json({ reports: listReports() });
  const found = getByToken(token);
  if (!found) return NextResponse.json({ error: "Link tidak valid." }, { status: 404 });
  return NextResponse.json({ report: toPublic(found.report), role: found.role });
}

export async function POST(req: Request) {
  let body: ReportInput;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Data tidak valid." }, { status: 400 }); }
  if (!body.operator?.trim() || !body.shift || !body.tanggal || !body.project?.trim())
    return NextResponse.json({ error: "Operator, Shift, Tanggal, dan Project wajib diisi." }, { status: 400 });
  const r = createReport(body);
  return NextResponse.json({ id: r.id, spvPath: `/review/${r.tokenSpv}` }, { status: 201 });
}
