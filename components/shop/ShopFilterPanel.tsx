"use client";

import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { localizedText } from "@/lib/i18n-helpers";
import type { ShopRouteTarget } from "@/lib/shop-route";

const MAX_PRICE = 50000;

export default function ShopFilterPanel({
  route,
  categories,
  currentCategorySlug,
  sizes,
  colors,
  showBadgeFilter = true,
}: {
  route: ShopRouteTarget;
  categories: { slug: string; nameFr: string; nameEn: string | null }[];
  currentCategorySlug?: string;
  sizes: string[];
  colors: string[];
  showBadgeFilter?: boolean;
}) {
  const t = useTranslations("Shop");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const taille = searchParams.get("taille") ?? undefined;
  const couleur = searchParams.get("couleur") ?? undefined;
  const badge = searchParams.get("badge") ?? undefined;
  const disponibilite = searchParams.get("disponibilite") ?? undefined;
  const prixMax = Number(searchParams.get("prix_max") ?? MAX_PRICE);

  function updateQuery(changes: Record<string, string | undefined>) {
    const query = Object.fromEntries(searchParams.entries());
    for (const [key, value] of Object.entries(changes)) {
      if (value === undefined) delete query[key];
      else query[key] = value;
    }
    delete query.nb;
    if ("params" in route) {
      router.replace({ pathname: route.pathname, params: route.params, query });
    } else {
      router.replace({ pathname: route.pathname, query });
    }
  }

  function toggle(key: string, value: string, current: string | undefined) {
    updateQuery({ [key]: current === value ? undefined : value });
  }

  return (
    <div>
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest">{t("categoriesLabel")}</h3>
      <ul className="mb-6 flex flex-col gap-2">
        <li>
          <Link href="/boutique" className={`text-sm ${!currentCategorySlug ? "font-semibold" : "text-os-muted hover:text-os-black"}`}>
            {t("all")}
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category.slug}>
            <Link
              href={{ pathname: "/boutique/[categorie]", params: { categorie: category.slug } }}
              className={`text-sm ${
                currentCategorySlug === category.slug ? "font-semibold" : "text-os-muted hover:text-os-black"
              }`}
            >
              {localizedText(locale, category.nameFr, category.nameEn)}
            </Link>
          </li>
        ))}
      </ul>

      <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest">{t("priceLabel")}</h3>
      <div className="mb-6">
        <input
          type="range"
          min={0}
          max={MAX_PRICE}
          step={1000}
          value={prixMax}
          onChange={(e) => updateQuery({ prix_max: e.target.value === String(MAX_PRICE) ? undefined : e.target.value })}
          className="w-full accent-os-black"
          aria-label={t("priceLabel")}
        />
        <div className="mt-1 flex justify-between text-xs text-os-muted">
          <span>0 FCFA</span>
          <span>{prixMax.toLocaleString("fr-FR")} FCFA</span>
        </div>
      </div>

      {sizes.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest">{t("sizeLabel")}</h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => toggle("taille", size, taille)}
                className={`border px-3 py-1.5 text-xs transition ${
                  taille === size ? "border-os-black bg-os-black text-white" : "border-os-gray hover:border-os-black"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {colors.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest">{t("colorLabel")}</h3>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => toggle("couleur", color, couleur)}
                className={`border px-3 py-1.5 text-xs transition ${
                  couleur === color ? "border-os-black bg-os-black text-white" : "border-os-gray hover:border-os-black"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {showBadgeFilter && (
        <div className="mb-6">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest">{t("badgesLabel")}</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => toggle("badge", "nouveau", badge)}
              className={`border px-3 py-1.5 text-xs transition ${
                badge === "nouveau" ? "border-os-black bg-os-black text-white" : "border-os-gray hover:border-os-black"
              }`}
            >
              {t("badgeNew")}
            </button>
            <button
              onClick={() => toggle("badge", "promo", badge)}
              className={`border px-3 py-1.5 text-xs transition ${
                badge === "promo" ? "border-os-black bg-os-black text-white" : "border-os-gray hover:border-os-black"
              }`}
            >
              {t("badgePromo")}
            </button>
          </div>
        </div>
      )}

      <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest">{t("availabilityLabel")}</h3>
      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={disponibilite === "oui"}
          onChange={(e) => updateQuery({ disponibilite: e.target.checked ? "oui" : undefined })}
          className="accent-os-black"
        />
        {t("inStockOnly")}
      </label>
    </div>
  );
}
