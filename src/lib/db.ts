import { randomUUID } from "crypto";
import { PrismaClient, type Status as PrismaStatus } from "@prisma/client";
import type { PublicReport, Report, ReportInput, Status } from "./types";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

function normalizeStatus(status: PrismaStatus | Status): Status {
  return status as Status;
}

function toReport(row: any): Report {
  const payload = (row.data ?? {}) as Report;

  return {
    ...payload,
    id: row.id,
    createdAt: row.createdAt.toISOString(),
    status: normalizeStatus(row.status),
    spvName: row.spvName ?? payload.spvName,
    spvAt: row.spvAt?.toISOString() ?? payload.spvAt,
    gmName: row.gmName ?? payload.gmName,
    gmAt: row.gmAt?.toISOString() ?? payload.gmAt,
    tokenSpv: row.tokenSpv,
    tokenGm: row.tokenGm ?? payload.tokenGm,
  };
}

export const toPublic = ({ tokenSpv, tokenGm, ...rest }: Report): PublicReport => rest;

export async function createReport(input: ReportInput): Promise<Report> {
  const tokenSpv = randomUUID();
  const createdAt = new Date();
  const report: Report = {
    ...input,
    id: randomUUID(),
    createdAt: createdAt.toISOString(),
    status: "submitted",
    tokenSpv,
  };

  const row = await prisma.report.create({
    data: {
      status: "submitted",
      tokenSpv,
      data: report,
    },
  });

  return toReport(row);
}

export async function listReports(): Promise<PublicReport[]> {
  const rows = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
  });

  return rows.map((row) => toPublic(toReport(row)));
}

export async function getByToken(token: string): Promise<{ report: Report; role: "spv" | "gm" } | null> {
  const row = await prisma.report.findFirst({
    where: {
      OR: [{ tokenSpv: token }, { tokenGm: token }],
    },
  });

  if (!row) return null;

  const report = toReport(row);
  return {
    report,
    role: row.tokenSpv === token ? "spv" : "gm",
  };
}

export async function approve(
  token: string,
  name: string,
): Promise<{ ok: true; report: Report; role: "spv" | "gm" } | { ok: false; error: string }> {
  const found = await getByToken(token);
  if (!found) return { ok: false, error: "Link tidak valid." };
  if (!name.trim()) return { ok: false, error: "Nama penandatangan wajib diisi." };

  const row = await prisma.report.findUnique({
    where: { id: found.report.id },
  });

  if (!row) return { ok: false, error: "Laporan tidak ditemukan." };
  const current = toReport(row);
  const now = new Date();

  if (found.role === "spv") {
    if (current.status !== "submitted") {
      return { ok: false, error: "Laporan sudah di-approve SPV." };
    }

    const tokenGm = randomUUID();
    const updated = await prisma.report.update({
      where: { id: row.id },
      data: {
        status: "spv_approved",
        tokenGm,
        spvName: name.trim(),
        spvAt: now,
        data: {
          ...current,
          status: "spv_approved",
          spvName: name.trim(),
          spvAt: now.toISOString(),
          tokenGm,
        },
      },
    });

    return { ok: true, report: toReport(updated), role: "spv" };
  }

  if (current.status !== "spv_approved") {
    return { ok: false, error: "Laporan sudah final." };
  }

  const updated = await prisma.report.update({
    where: { id: row.id },
    data: {
      status: "final",
      gmName: name.trim(),
      gmAt: now,
      data: {
        ...current,
        status: "final",
        gmName: name.trim(),
        gmAt: now.toISOString(),
      },
    },
  });

  return { ok: true, report: toReport(updated), role: "gm" };
}
