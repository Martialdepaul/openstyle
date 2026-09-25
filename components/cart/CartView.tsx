"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCartStore } from "@/lib/cart-store";
import { formatPriceFcfa } from "@/lib/currency";
import { localizedText } from "@/lib/i18n-helpers";
import { resolveCartLines, type ResolvedCartLine } from "@/lib/actions/cart";
import { whatsAppLink } from "@/lib/shop-info";

export default function CartView() {
  const t = useTranslations("Cart");
  const locale = useLocale();
  const { lines, updateQuantity, removeLine } = useCartStore();
  const [resolved, setResolved] = useState<ResolvedCartLine[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (lines.length === 0) {
      setResolved([]);
      return;
    }
    resolveCartLines(lines).then((result) => {
      if (!cancelled) setResolved(result);
    });
    return () => {
      cancelled = true;
    };
  }, [lines]);

  if (resolved === null) {
    return <div className="mx-auto max-w-5xl px-4 py-20 text-center text-sm text-os-muted">…</div>;
  }

  const availableLines = resolved.filter((r) => r.product && r.available);
  const unavailableLines = resolved.filter((r) => !r.product || !r.available);

  const subtotal = availableLines.reduce((sum, r) => sum + (r.price ?? 0) * r.line.quantity, 0);
  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="font-serif text-2xl font-bold">{t("emptyTitle")}</p>
        <p className="mt-2 text-sm text-os-muted">{t("emptySubtitle")}</p>
        <Link
          href="/boutique"
          className="btn-press mt-8 inline-block bg-os-black px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-os-black2"
        >
          {t("continueShopping")}
        </Link>
      </div>
    );
  }

  const whatsappMessage = availableLines
    .map((r) => `${r.line.quantity}x ${localizedText(locale, r.product!.nameFr, r.product!.nameEn)}`)
    .join(", ");

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold">{t("title")}</h1>
        <p className="mt-2 text-sm text-os-muted">{t("itemCount", { count: itemCount })}</p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-4">
          {resolved.map(({ line, product, price, available }, index) => {
            const name = product ? localizedText(locale, product.nameFr, product.nameEn) : line.productSlug;
            const unavailable = !product || !available;

            return (
              <div key={index} className={`flex gap-4 border-b border-os-gray pb-4 ${unavailable ? "opacity-60" : ""}`}>
                {product?.imageUrl ? (
                  <Link
                    href={{ pathname: "/produit/[slug]", params: { slug: product.slug } }}
                    className="relative h-24 w-20 flex-shrink-0 bg-os-cream"
                  >
                    <Image src={product.imageUrl} alt={name} fill sizes="80px" className="object-cover" />
                  </Link>
                ) : (
                  <div className="h-24 w-20 flex-shrink-0 bg-os-cream" />
                )}

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-tight">{name}</p>
                  <p className="mt-0.5 text-xs text-os-muted">
                    {[line.size, line.color, line.scent].filter(Boolean).join(" · ")}
                  </p>

                  {unavailable ? (
                    <p className="mt-2 text-xs font-medium text-red-700">{t("unavailableLine")}</p>
                  ) : (
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center border border-os-gray">
                        <button
                          onClick={() => updateQuantity(index, line.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center text-sm hover:bg-os-cream"
                          aria-label="-"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm">{line.quantity}</span>
                        <button
                          onClick={() => updateQuantity(index, line.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center text-sm hover:bg-os-cream"
                          aria-label="+"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-semibold">{formatPriceFcfa((price ?? 0) * line.quantity)}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => removeLine(index)}
                  aria-label={t("removeLabel")}
                  className="text-lg leading-none text-os-muted hover:text-os-black"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>

        <div className="h-fit border border-os-gray p-6">
          <div className="flex justify-between text-sm">
            <span className="text-os-muted">{t("subtotalLabel")}</span>
            <span className="font-semibold">{formatPriceFcfa(subtotal)}</span>
          </div>
          <p className="mt-2 text-xs text-os-muted">{t("deliveryNote")}</p>
          <div className="mt-4 flex justify-between border-t border-os-gray pt-4 font-semibold">
            <span>{t("totalLabel")}</span>
            <span>{formatPriceFcfa(subtotal)}</span>
          </div>

          {unavailableLines.length > 0 && (
            <p className="mt-4 text-xs font-medium text-red-700">{t("unavailableBlocksCheckout")}</p>
          )}

          <Link
            href="/commande"
            aria-disabled={unavailableLines.length > 0}
            className={`btn-press mt-5 block w-full py-4 text-center text-sm font-semibold uppercase tracking-widest text-white transition ${
              unavailableLines.length > 0 ? "pointer-events-none bg-os-gray" : "bg-os-black hover:bg-os-black2"
            }`}
          >
            {t("checkoutButton")}
          </Link>

          {unavailableLines.length === 0 && (
            <a
              href={whatsAppLink(whatsappMessage)}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex w-full items-center justify-center gap-2 border border-[#25D366] py-3 text-sm font-semibold text-[#25D366] transition hover:bg-[#25D366] hover:text-white"
            >
              {t("whatsappButton")}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
