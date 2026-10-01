export type Sheet = {
  proses: string; delay: string; setup: string; inspeksi: string;
  produk: string; material: string; total: string;
  potong: "" | "Vcut" | "Cut"; kualitas: "" | "OK" | "Not OK";
  panjang: string; lebar: string; tebal: string;
};
export const MATERIALS = ["PP 6mm", "PP 8mm", "PP 10mm", "Lain-lain"] as const;
export const PISAU = ["Vcut", "End Mill 3mm", "End Mill 6mm"] as const;
export type Lembar = { lembar: string; sisa: string };

export type ReportInput = {
  operator: string; shift: string; tanggal: string; project: string; nomorSasa: string;
  jamMulai: string; jamSelesai: string;
  oliVolume: string; oliLevel: "" | "Rendah" | "Normal" | "Diatas Normal";
  pisau: Record<(typeof PISAU)[number], string>;
  quick: Sheet[]; tekma: Sheet[];
  material: Record<(typeof MATERIALS)[number], Lembar>;
  pekerjaanLain: string; pesan: string; kendala: string;
};
export type Status = "submitted" | "spv_approved" | "final";
export type Report = ReportInput & {
  id: string; createdAt: string; status: Status;
  spvName?: string; spvAt?: string; gmName?: string; gmAt?: string;
  tokenSpv: string; tokenGm?: string;
};
export type PublicReport = Omit<Report, "tokenSpv" | "tokenGm">;

export const STATUS_LABEL: Record<Status, string> = {
  submitted: "Menunggu SPV", spv_approved: "Menunggu GM", final: "Final / Terkunci",
};

export const emptySheet = (): Sheet => ({
  proses: "", delay: "", setup: "", inspeksi: "", produk: "", material: "", total: "",
  potong: "", kualitas: "", panjang: "", lebar: "", tebal: "",
});
export const sheetFilled = (s: Sheet) => Object.values(s).some((v) => v !== "");

export const emptyInput = (): ReportInput => ({
  operator: "", shift: "", tanggal: new Date().toISOString().slice(0, 10), project: "", nomorSasa: "",
  jamMulai: "", jamSelesai: "", oliVolume: "", oliLevel: "",
  pisau: { Vcut: "", "End Mill 3mm": "", "End Mill 6mm": "" },
  quick: Array.from({ length: 6 }, emptySheet), tekma: Array.from({ length: 6 }, emptySheet),
  material: {
    "PP 6mm": { lembar: "", sisa: "" }, "PP 8mm": { lembar: "", sisa: "" },
    "PP 10mm": { lembar: "", sisa: "" }, "Lain-lain": { lembar: "", sisa: "" },
  },
  pekerjaanLain: "", pesan: "", kendala: "",
});
