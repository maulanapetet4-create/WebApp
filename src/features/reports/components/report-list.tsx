import Link from "next/link";
import { Plus } from "lucide-react";
import { listReports } from "@/lib/db";
import { EmptyState } from "@/components/ui/empty-state";
import { PageTitle } from "@/components/ui/page-title";
import { ReportStatusBadge } from "@/features/reports";

export async function ReportList() {
  const reports = await listReports();

  return (
    <div className="p-4 pb-28">
      <PageTitle
        title="Laporan Harian Mesin CNC"
        description="Dashboard status laporan"
      />

      <ul className="mt-4 space-y-3">
        {reports.length === 0 && <EmptyState message="Belum ada laporan." />}

        {reports.map((report) => (
          <li key={report.id} className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-base font-semibold">{report.project}</p>
                <p className="text-sm text-gray-600">
                  {report.tanggal} · {report.shift} · {report.operator}
                </p>
              </div>

              <ReportStatusBadge status={report.status} />
            </div>

            {report.kendala && (
              <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                ⚠ Ada kendala
              </p>
            )}
          </li>
        ))}
      </ul>

      <Link
        href="/operator"
        className="fixed inset-x-4 bottom-4 mx-auto flex max-w-xl items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 text-lg font-semibold text-white shadow-lg active:bg-blue-700"
      >
        <Plus size={22} /> Buat Laporan Baru
      </Link>
    </div>
  );
}
