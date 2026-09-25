"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCartStore } from "@/lib/cart-store";
import { formatPriceFcfa } from "@/lib/currency";
import { localizedText } from "@/lib/i18n-helpers";
import { resolveCartLines, type ResolvedCartLine } from "@/lib/actions/cart";
import { estimateDelivery } from "@/lib/actions/delivery";
import { createOrder, type CheckoutState } from "@/lib/actions/order";
import type { DeliveryMethod } from "@/generated/prisma/client";

type RelayPointOption = { id: string; name: string; city: string; address: string };

// F06 : "liste des villes du Cameroun avec autre saisie possible" — liste indicative, pas de source officielle fournie.
const CAMEROON_CITIES = [
  "Yaoundé",
  "Douala",
  "Bafoussam",
  "Bamenda",
  "Garoua",
  "Maroua",
  "Ngaoundéré",
  "Bertoua",
  "Ebolowa",
  "Kribi",
  "Limbe",
  "Buea",
  "Dschang",
  "Edéa",
];

const OTHER_CITY = "__autre__";

const initialState: CheckoutState = { error: null };

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-press mt-2 w-full bg-os-black py-4 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-os-black2 disabled:opacity-50"
    >
      {pending ? "…" : label}
    </button>
  );
}

type CustomerInfo = { firstName: string; lastName: string; phone: string | null; email: string } | null;

export default function CheckoutForm({ relayPoints, customer }: { relayPoints: RelayPointOption[]; customer: CustomerInfo }) {
  const t = useTranslations("Checkout");
  const locale = useLocale();
  const { lines } = useCartStore();
  const [resolved, setResolved] = useState<ResolvedCartLine[] | null>(null);
  const [city, setCity] = useState(CAMEROON_CITIES[0]);
  const [cityOther, setCityOther] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("PICKUP");
  const [relayPointId, setRelayPointId] = useState(relayPoints[0]?.id ?? "");
  const [estimate, setEstimate] = useState<{ methods: DeliveryMethod[]; fee: number } | null>(null);
  const [state, formAction] = useActionState(createOrder, initialState);

  const effectiveCity = (city === OTHER_CITY ? cityOther : city).trim();

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

  const totalQuantity = lines.reduce((sum, l) => sum + l.quantity, 0);

  useEffect(() => {
    if (!effectiveCity) {
      setEstimate(null);
      return;
    }
    let cancelled = false;
    estimateDelivery(effectiveCity, deliveryMethod, totalQuantity).then((result) => {
      if (cancelled) return;
      setEstimate(result);
      // RG-18 : si le mode choisi n'est plus valable pour la ville (ex. relais hors Yaoundé), on revient au retrait.
      if (!result.methods.includes(deliveryMethod)) setDeliveryMethod("PICKUP");
    });
    return () => {
      cancelled = true;
    };
  }, [effectiveCity, deliveryMethod, totalQuantity]);

  if (resolved === null) {
    return <div className="mx-auto max-w-5xl px-4 py-20 text-center text-sm text-os-muted">…</div>;
  }

  const availableLines = resolved.filter((r) => r.product && r.available);

  if (lines.length === 0 || availableLines.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="font-serif text-2xl font-bold">{t("emptyCartTitle")}</p>
        <Link
          href="/boutique"
          className="btn-press mt-8 inline-block bg-os-black px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-os-black2"
        >
          {t("backToShop")}
        </Link>
      </div>
    );
  }

  const subtotal = availableLines.reduce((sum, r) => sum + (r.price ?? 0) * r.line.quantity, 0);
  const fee = estimate?.fee ?? 0;
  const total = subtotal + fee;
  const availableMethods = estimate?.methods ?? ["PICKUP"];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
      <h1 className="mb-8 font-serif text-4xl font-bold">{t("title")}</h1>

      <form action={formAction} className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <input type="hidden" name="cartLines" value={JSON.stringify(availableLines.map((r) => r.line))} />
        <input type="hidden" name="locale" value={locale} />
        {/* RG-15 : champ piège invisible pour les robots. */}
        <div aria-hidden="true" className="absolute left-[-9999px]">
          <label htmlFor="website">Site web</label>
          <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="flex flex-col gap-8">
          <section>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest">{t("customerSection")}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">{t("firstName")} *</label>
                <input
                  name="firstName"
                  required
                  defaultValue={customer?.firstName ?? ""}
                  className="w-full border border-os-gray px-4 py-3 text-sm focus:border-os-black focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">{t("lastName")} *</label>
                <input
                  name="lastName"
                  required
                  defaultValue={customer?.lastName ?? ""}
                  className="w-full border border-os-gray px-4 py-3 text-sm focus:border-os-black focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">{t("phone")} *</label>
                <input
                  name="phone"
                  required
                  placeholder="6XXXXXXXX"
                  defaultValue={customer?.phone ?? ""}
                  className="w-full border border-os-gray px-4 py-3 text-sm focus:border-os-black focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">{t("email")}</label>
                <input
                  name="email"
                  type="email"
                  defaultValue={customer?.email ?? ""}
                  className="w-full border border-os-gray px-4 py-3 text-sm focus:border-os-black focus:outline-none"
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest">{t("deliverySection")}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">{t("city")} *</label>
                <select
                  name="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border border-os-gray px-4 py-3 text-sm focus:border-os-black focus:outline-none"
                >
                  {CAMEROON_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value={OTHER_CITY}>{t("otherCity")}</option>
                </select>
              </div>
              {city === OTHER_CITY && (
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">{t("otherCityLabel")} *</label>
                  <input
                    value={cityOther}
                    onChange={(e) => setCityOther(e.target.value)}
                    required
                    className="w-full border border-os-gray px-4 py-3 text-sm focus:border-os-black focus:outline-none"
                  />
                </div>
              )}
              {/* Le nom réel de la ville (liste ou saisie libre) est ce qui est envoyé au serveur. */}
              {city !== OTHER_CITY && <input type="hidden" name="city" value={city} />}
              {city === OTHER_CITY && <input type="hidden" name="city" value={cityOther} />}
            </div>

            <div className="mt-4 flex flex-col gap-3">
              {(["PICKUP", "RELAY", "SHIPPING"] as DeliveryMethod[])
                .filter((m) => availableMethods.includes(m))
                .map((method) => (
                  <label
                    key={method}
                    className={`flex items-start gap-4 border p-4 transition cursor-pointer ${
                      deliveryMethod === method ? "border-os-black" : "border-os-gray hover:border-os-black"
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value={method}
                      checked={deliveryMethod === method}
                      onChange={() => setDeliveryMethod(method)}
                      className="mt-0.5 accent-os-black"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{t(`method${method}`)}</p>
                      <p className="mt-0.5 text-xs text-os-muted">{t(`method${method}Note`)}</p>
                    </div>
                    <span className="text-xs font-semibold">
                      {method === "PICKUP" ? t("free") : estimate ? formatPriceFcfa(estimate.methods.includes(method) ? fee : 0) : "…"}
                    </span>
                  </label>
                ))}
            </div>

            {deliveryMethod === "RELAY" && (
              <div className="mt-4">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">{t("relayPoint")} *</label>
                <select
                  name="relayPointId"
                  value={relayPointId}
                  onChange={(e) => setRelayPointId(e.target.value)}
                  required
                  className="w-full border border-os-gray px-4 py-3 text-sm focus:border-os-black focus:outline-none"
                >
                  {relayPoints.map((point) => (
                    <option key={point.id} value={point.id}>
                      {point.name} — {point.address}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {deliveryMethod === "SHIPPING" && (
              <div className="mt-4 grid gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">{t("address")} *</label>
                  <input name="address" required className="w-full border border-os-gray px-4 py-3 text-sm focus:border-os-black focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">{t("agencyNote")}</label>
                  <input name="agencyNote" placeholder={t("agencyNotePlaceholder")} className="w-full border border-os-gray px-4 py-3 text-sm focus:border-os-black focus:outline-none" />
                </div>
              </div>
            )}

            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">{t("customerNote")}</label>
              <textarea name="customerNote" rows={3} maxLength={500} className="w-full border border-os-gray px-4 py-3 text-sm focus:border-os-black focus:outline-none" />
            </div>
          </section>

          <div className="rounded-none bg-os-cream p-4 text-sm text-os-muted">{t("paymentNote")}</div>

          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" name="acceptTerms" required className="mt-0.5 accent-os-black" />
            <span>{t("acceptTerms")}</span>
          </label>

          {state.error && <p className="text-sm font-medium text-red-700">{state.error}</p>}

          <SubmitButton label={t("submit")} />
        </div>

        <div className="h-fit border border-os-gray p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest">{t("summaryTitle")}</h3>
          <div className="flex flex-col gap-3">
            {availableLines.map(({ line, product, price }, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="min-w-0 flex-1 truncate pr-2">
                  {line.quantity}× {product ? localizedText(locale, product.nameFr, product.nameEn) : line.productSlug}
                </span>
                <span className="font-semibold">{formatPriceFcfa((price ?? 0) * line.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-1.5 border-t border-os-gray pt-3">
            <div className="flex justify-between text-sm">
              <span className="text-os-muted">{t("subtotalLabel")}</span>
              <span>{formatPriceFcfa(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-os-muted">{t("deliveryFeeLabel")}</span>
              <span>{effectiveCity ? formatPriceFcfa(fee) : "…"}</span>
            </div>
            <div className="mt-1 flex justify-between border-t border-os-gray pt-2 font-semibold">
              <span>{t("totalLabel")}</span>
              <span>{formatPriceFcfa(total)}</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
