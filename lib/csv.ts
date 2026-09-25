/**
 * F23 : CSV encodé UTF-8 avec BOM (Excel), séparateur point-virgule.
 * Une valeur contenant le séparateur, un guillemet ou un retour à la ligne
 * est entourée de guillemets (les guillemets internes sont doublés).
 */
export function toCsv(headers: string[], rows: Array<Array<string | number>>): string {
  const escape = (value: string | number): string => {
    const str = String(value);
    return /[;"\r\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };

  const lines = [headers, ...rows].map((row) => row.map(escape).join(";"));
  return "﻿" + lines.join("\r\n") + "\r\n";
}

export function csvResponse(filename: string, csv: string): Response {
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
