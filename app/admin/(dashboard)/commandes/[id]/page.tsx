import { notFound } from "next/navigation";
import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { formatPriceFcfa } from "@/lib/currency";
import { whatsAppLink } from "@/lib/shop-info";
import PageHeader from "@/components/admin/PageHeader";
import ProductLink from "@/components/admin/ProductLink";
import StatusBadge from "@/components/admin/StatusBadge";
import OrderStatusActions from "@/components/admin/OrderStatusActions";
import ContactAttemptButton from "@/components/admin/ContactAttemptButton";
import { updateInternalNote, updatePaymentStatus } from "@/lib/actions/order-status";
import { ORDER_STATUS_TRANSITIONS } from "@/lib/orders";
import type { OrderStatus } from "@/generated/prisma/client";

const STATUS_LABELS: Record<OrderStatus, string> = {
  NEW: "Nouvelle",
  CONFIRMED: "Confirmée",
  READY: "Prête",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

const DELIVERY_METHOD_LABELS = { PICKUP: "Retrait en boutique", RELAY: "Point relais", SHIPPING: "Expédition" };

const EVENT_LABELS: Record<string, string> = {
  STATUS_CHANGE: "Changement de statut",
  CONTACT_ATTEMPT: "Tentative de contact",
  NOTE: "Note",
  ITEMS_EDITED: "Lignes modifiées",
  EMAIL_SENT: "E-mail envoyé",
};

/** F18 : message WhatsApp pré-rempli selon le statut, en FR ou EN selon la langue de la commande. */
function whatsappMessageForOrder(order: { firstName: string; number: string; status: OrderStatus; locale: string }): string {
  const isEn = order.locale === "en";
  const templates: Record<OrderStatus, string> = isEn
    ? {
        NEW: `Hello ${order.firstName}, this is OpenStyle. We would like to confirm order ${order.number}.`,
        CONFIRMED: `Hello ${order.firstName}, your order ${order.number} is confirmed.`,
        READY: `Hello ${order.firstName}, your order ${order.number} is ready.`,
        SHIPPED: `Hello ${order.firstName}, your order ${order.number} has been shipped.`,
        DELIVERED: `Hello ${order.firstName}, thank you for your order ${order.number}.`,
        CANCELLED: `Hello ${order.firstName}, your order ${order.number} has been cancelled.`,
      }
    : {
        NEW: `Bonjour ${order.firstName}, ici OpenStyle. Nous souhaitons confirmer votre commande ${order.number}.`,
        CONFIRMED: `Bonjour ${order.firstName}, votre commande ${order.number} est confirmée.`,
        READY: `Bonjour ${order.firstName}, votre commande ${order.number} est prête.`,
        SHIPPED: `Bonjour ${order.firstName}, votre commande ${order.number} a été expédiée.`,
        DELIVERED: `Bonjour ${order.firstName}, merci pour votre commande ${order.number}.`,
        CANCELLED: `Bonjour ${order.firstName}, votre commande ${order.number} a été annulée.`,
      };
  return templates[order.status];
}

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("OWNER");
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: true } },
      zone: true,
      relayPoint: true,
      events: { orderBy: { createdAt: "desc" }, include: { user: true } },
    },
  });
  if (!order) notFound();

  const updatePaymentWithId = updatePaymentStatus.bind(null, order.id);
  const updateNoteWithId = updateInternalNote.bind(null, order.id);

  // Section 8.1 : sans compte, on propose la recherche des autres commandes du même téléphone.
  const samePhoneCount = order.userId ? 0 : await prisma.order.count({ where: { phone: order.phone, id: { not: order.id } } });

  return (
    <div>
      <PageHeader
        title={order.number}
        breadcrumbs={[
          { label: "Accueil", href: "/admin" },
          { label: "Commandes", href: "/admin/commandes" },
          { label: order.number },
        ]}
        actions={<StatusBadge status={order.status} />}
      />

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-8">
          <section className="border border-os-gray bg-white p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest">Lignes</h2>
            <div className="flex flex-col gap-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b border-os-cream pb-3 last:border-0">
                  <div className="text-sm">
                    <ProductLink id={item.product.id} name={item.name} />
                    <p className="text-xs text-os-muted">
                      {item.reference}
                      {[item.size, item.color, item.scent].filter(Boolean).length > 0
                        ? ` · ${[item.size, item.color, item.scent].filter(Boolean).join(" · ")}`
                        : ""}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p>
                      {item.quantity} × {formatPriceFcfa(item.unitPrice)}
                    </p>
                    <p className="font-semibold">{formatPriceFcfa(item.lineTotal)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-1.5 border-t border-os-gray pt-3 text-sm">
              <div className="flex justify-between">
                <span className="text-os-muted">Sous-total</span>
                <span>{formatPriceFcfa(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-os-muted">Frais de livraison</span>
                <span>{formatPriceFcfa(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between border-t border-os-gray pt-2 font-semibold">
                <span>Total</span>
                <span>{formatPriceFcfa(order.total)}</span>
              </div>
            </div>
          </section>

          <section className="border border-os-gray bg-white p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest">Livraison</h2>
            <p className="text-sm">{DELIVERY_METHOD_LABELS[order.deliveryMethod]}</p>
            <p className="mt-1 text-xs text-os-muted">
              {order.city}
              {order.zone ? ` — zone ${order.zone.nameFr}` : ""}
            </p>
            {order.relayPoint && (
              <p className="mt-1 text-xs text-os-muted">
                Point relais : {order.relayPoint.name} — {order.relayPoint.address}
              </p>
            )}
            {order.address && <p className="mt-1 text-xs text-os-muted">Adresse : {order.address}</p>}
            {order.agencyNote && <p className="mt-1 text-xs text-os-muted">Agence souhaitée : {order.agencyNote}</p>}
            {order.customerNote && (
              <p className="mt-3 border-t border-os-cream pt-3 text-xs">
                <span className="font-semibold">Note du client : </span>
                {order.customerNote}
              </p>
            )}
          </section>

          <section className="border border-os-gray bg-white p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest">Statut</h2>
            <OrderStatusActions orderId={order.id} nextStatuses={ORDER_STATUS_TRANSITIONS[order.status]} />
          </section>

          <section className="border border-os-gray bg-white p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest">Historique</h2>
            <div className="flex flex-col gap-3">
              {order.events.map((event) => (
                <div key={event.id} className="border-b border-os-cream pb-2 text-xs last:border-0">
                  <p>
                    <span className="font-semibold">{EVENT_LABELS[event.type] ?? event.type}</span>
                    {event.fromStatus && event.toStatus ? ` : ${STATUS_LABELS[event.fromStatus]} → ${STATUS_LABELS[event.toStatus]}` : ""}
                    {event.note ? ` — ${event.note}` : ""}
                  </p>
                  <p className="text-os-muted">
                    {event.createdAt.toLocaleString("fr-FR", { timeZone: "Africa/Douala" })}
                    {event.user ? ` · ${event.user.firstName} ${event.user.lastName}` : ""}
                  </p>
                </div>
              ))}
              {order.events.length === 0 && <p className="text-xs text-os-muted">Aucun événement.</p>}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-8">
          <section className="border border-os-gray bg-white p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest">Client</h2>
            <p className="text-sm font-semibold">
              {order.firstName} {order.lastName}
            </p>
            <p className="mt-1 text-xs text-os-muted">{order.phone}</p>
            {order.email && <p className="text-xs text-os-muted">{order.email}</p>}
            {samePhoneCount > 0 && (
              <a href={`/admin/commandes?q=${encodeURIComponent(order.phone)}`} className="mt-2 inline-block text-xs underline">
                {samePhoneCount} autre(s) commande(s) avec ce téléphone
              </a>
            )}
            <div className="mt-4 flex flex-col gap-2">
              <a href={`tel:${order.phone}`} className="border border-os-gray px-4 py-2 text-center text-xs uppercase tracking-wide hover:border-os-black">
                Appeler
              </a>
              <a
                href={whatsAppLink(whatsappMessageForOrder(order))}
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366] px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-white hover:opacity-90"
              >
                WhatsApp
              </a>
            </div>
          </section>

          <section className="border border-os-gray bg-white p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest">Relance</h2>
            <p className="text-xs text-os-muted">
              {order.contactAttempts} tentative(s)
              {order.lastContactAt ? ` — dernière le ${order.lastContactAt.toLocaleString("fr-FR", { timeZone: "Africa/Douala" })}` : ""}
            </p>
            <div className="mt-3">
              <ContactAttemptButton orderId={order.id} />
            </div>
          </section>

          <section className="border border-os-gray bg-white p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest">Paiement</h2>
            <form action={updatePaymentWithId} className="flex flex-col gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="collected" defaultChecked={order.paymentStatus === "COLLECTED"} className="accent-os-black" />
                Paiement encaissé
              </label>
              <textarea
                name="paymentNote"
                defaultValue={order.paymentNote ?? ""}
                rows={2}
                placeholder="Note de paiement (ex. modalités convenues par téléphone)"
                className="w-full border border-os-gray px-3 py-2 text-xs focus:border-os-black focus:outline-none"
              />
              <button type="submit" className="w-fit border border-os-black px-4 py-2 text-xs uppercase tracking-wide hover:bg-os-black hover:text-white">
                Enregistrer
              </button>
            </form>
          </section>

          <section className="border border-os-gray bg-white p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest">Note interne</h2>
            <form action={updateNoteWithId} className="flex flex-col gap-3">
              <textarea
                name="internalNote"
                defaultValue={order.internalNote ?? ""}
                rows={3}
                placeholder="Jamais visible du client"
                className="w-full border border-os-gray px-3 py-2 text-xs focus:border-os-black focus:outline-none"
              />
              <button type="submit" className="w-fit border border-os-black px-4 py-2 text-xs uppercase tracking-wide hover:bg-os-black hover:text-white">
                Enregistrer
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
