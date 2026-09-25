"use client";

import { useActionState, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { formatPriceFcfa } from "@/lib/currency";
import { trackOrder, requestReceipt, type TrackingState } from "@/lib/actions/order-tracking";

const STATUS_LABELS: Record<string, string> = {
  NEW: "Nouvelle",
  CONFIRMED: "Confirmée",
  READY: "Prête",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

const DELIVERY_METHOD_LABELS: Record<string, string> = {
  PICKUP: "Retrait en boutique",
  RELAY: "Point relais",
  SHIPPING: "Expédition",
};

const initialState: TrackingState = { error: null, order: null };

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

export default function OrderTrackingForm() {
  const t = useTranslations("Tracking");
  const [state, formAction] = useActionState(trackOrder, initialState);
  const [phone, setPhone] = useState("");
  const [isPending, startTransition] = useTransition();
  const [receiptRequested, setReceiptRequested] = useState(false);

  const order = state.order;

  function askForReceipt() {
    if (!order) return;
    startTransition(async () => {
      await requestReceipt(order.number, phone);
      setReceiptRequested(true);
    });
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16 lg:px-8">
      <h1 className="mb-2 font-serif text-3xl font-bold">{t("title")}</h1>
      <p className="mb-8 text-sm text-os-muted">{t("subtitle")}</p>

      <form action={formAction} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">{t("orderNumber")}</label>
          <input
            name="number"
            required
            placeholder="OS-000123"
            className="w-full border border-os-gray px-4 py-3 text-sm focus:border-os-black focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">{t("phone")}</label>
          <input
            name="phone"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="6XXXXXXXX"
            className="w-full border border-os-gray px-4 py-3 text-sm focus:border-os-black focus:outline-none"
          />
        </div>
        {state.error && <p className="text-sm font-medium text-red-700">{state.error}</p>}
        <SubmitButton label={t("submit")} />
      </form>

      {order && (
        <div className="mt-10 border border-os-gray p-6">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">{order.number}</p>
            <span className="inline-block rounded-full bg-os-gray px-2.5 py-0.5 text-xs font-medium text-os-black">
              {STATUS_LABELS[order.status] ?? order.status}
            </span>
          </div>
          <p className="mt-1 text-xs text-os-muted">
            {DELIVERY_METHOD_LABELS[order.deliveryMethod] ?? order.deliveryMethod} — {order.city}
          </p>

          <div className="mt-4 flex flex-col gap-2 border-t border-os-cream pt-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>
                  {item.quantity}× {item.name}
                  {[item.size, item.color, item.scent].filter(Boolean).length > 0
                    ? ` (${[item.size, item.color, item.scent].filter(Boolean).join(" · ")})`
                    : ""}
                </span>
                <span className="font-semibold">{formatPriceFcfa(item.lineTotal)}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-col gap-1.5 border-t border-os-gray pt-3 text-sm">
            <div className="flex justify-between">
              <span className="text-os-muted">{t("subtotalLabel")}</span>
              <span>{formatPriceFcfa(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-os-muted">{t("deliveryFeeLabel")}</span>
              <span>{formatPriceFcfa(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between border-t border-os-gray pt-2 font-semibold">
              <span>{t("totalLabel")}</span>
              <span>{formatPriceFcfa(order.total)}</span>
            </div>
          </div>

          <div className="mt-4 border-t border-os-cream pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-os-muted">{t("historyTitle")}</p>
            <div className="flex flex-col gap-1.5">
              {order.history.map((event, index) => (
                <p key={index} className="text-xs text-os-muted">
                  {STATUS_LABELS[event.toStatus ?? ""] ?? event.toStatus} —{" "}
                  {new Date(event.createdAt).toLocaleString("fr-FR", { timeZone: "Africa/Douala" })}
                </p>
              ))}
            </div>
          </div>

          {order.receiptRequested || receiptRequested ? (
            <p className="mt-4 text-xs text-os-muted">{t("receiptRequested")}</p>
          ) : (
            <button
              onClick={askForReceipt}
              disabled={isPending}
              className="mt-4 w-full border border-os-black px-4 py-3 text-xs font-semibold uppercase tracking-wide transition hover:bg-os-black hover:text-white disabled:opacity-50"
            >
              {t("requestReceipt")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
