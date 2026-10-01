import Link from "next/link";
import { Plus } from "lucide-react";
import { listReports } from "@/lib/db";
import { STATUS_LABEL, type Status } from "@/lib/types";

export const dynamic = "force-dynamic";
const COLOR: Record<Status, string> = {
  submitted: "bg-amber-100 text-amber-800", spv_approved: "bg-blue-100 text-blue-800", final: "bg-green-100 text-green-800",
};

export default function Home() {
  const reports = listReports();
  return (
    <div className="p-4 pb-28">
      <h1 className="text-xl font-bold">Laporan Harian Mesin CNC</h1>
      <p className="text-sm text-gray-600">Dashboard status laporan</p>
      <ul className="mt-4 space-y-3">
        {reports.length === 0 && <li className="rounded-xl bg-white p-4 text-base text-gray-500 shadow-sm">Belum ada laporan.</li>}
        {reports.map((r) => (
          <li key={r.id} className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-base font-semibold">{r.project}</p>
                <p className="text-sm text-gray-600">{r.tanggal} · {r.shift} · {r.operator}</p>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-sm font-medium ${COLOR[r.status]}`}>{STATUS_LABEL[r.status]}</span>
            </div>
            {r.kendala && <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">⚠ Ada kendala</p>}
          </li>
        ))}
      </ul>
      <Link href="/operator" className="fixed inset-x-4 bottom-4 mx-auto flex max-w-xl items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 text-lg font-semibold text-white shadow-lg active:bg-blue-700">
        <Plus size={22} /> Buat Laporan Baru
      </Link>
    </div>
  );
}
