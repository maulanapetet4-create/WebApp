import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">404</p>
        <h1 className="mt-3 text-2xl font-bold text-gray-900">Halaman tidak ditemukan</h1>
        <p className="mt-2 text-sm text-gray-600">
          Link yang Anda buka mungkin sudah tidak valid atau belum tersedia.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Kembali ke beranda
        </Link>
      </div>
    </div>
  );
}
