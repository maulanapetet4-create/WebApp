# Laporan Harian Mesin CNC

Aplikasi dashboard laporan harian mesin CNC berbasis Next.js.

## Fitur

- Dashboard status laporan
- Form pelaporan harian
- Approval SPV dan GM
- Export data ke Excel/PDF

## Menjalankan aplikasi

```bash
npm install
npm run dev
```

Buka http://localhost:3000

## Build untuk produksi

```bash
npm run build
npm run start
```

## Struktur utama

- `src/app` - route dan halaman Next.js
- `src/features` - fitur aplikasi
- `src/components` - komponen reusable
- `src/lib` - model data dan database lokal
