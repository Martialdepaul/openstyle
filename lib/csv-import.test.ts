import { describe, expect, it } from "vitest";
import { parseCsv } from "@/lib/csv-import";

describe("parseCsv (F15)", () => {
  it("découpe des lignes simples séparées par des virgules", () => {
    expect(parseCsv("a,b,c\n1,2,3")).toEqual([
      ["a", "b", "c"],
      ["1", "2", "3"],
    ]);
  });

  it("retire le BOM UTF-8 en tête de fichier", () => {
    expect(parseCsv("﻿a,b\n1,2")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
  });

  it("gère les fins de ligne CRLF", () => {
    expect(parseCsv("a,b\r\n1,2\r\n")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
  });

  it("préserve une virgule à l'intérieur d'un champ entre guillemets", () => {
    expect(parseCsv('a,b\n"1, 2",3')).toEqual([
      ["a", "b"],
      ["1, 2", "3"],
    ]);
  });

  it("déséchappe les guillemets doublés à l'intérieur d'un champ", () => {
    expect(parseCsv('a\n"il a dit ""bonjour"""')).toEqual([["a"], ['il a dit "bonjour"']]);
  });

  it("ignore les lignes entièrement vides", () => {
    expect(parseCsv("a,b\n1,2\n\n3,4")).toEqual([
      ["a", "b"],
      ["1", "2"],
      ["3", "4"],
    ]);
  });
});
