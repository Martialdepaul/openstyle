import { read, utils } from "xlsx";

/** F15 : lit la première feuille d'un classeur XLSX et la renvoie sous la même forme que parseCsv (tableau de lignes de cellules texte). */
export function parseXlsxBase64(base64: string): string[][] {
  const buffer = Buffer.from(base64, "base64");
  const workbook = read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) return [];

  const rows = utils.sheet_to_json<unknown[]>(sheet, { header: 1, raw: false, defval: "" });
  return rows
    .map((row) => row.map((cell) => String(cell ?? "").trim()))
    .filter((row) => row.some((cell) => cell !== ""));
}
