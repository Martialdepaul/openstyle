import { notFound } from "next/navigation";
import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { formatPriceFcfa } from "@/lib/currency";
import { getShopSettings } from "@/lib/shop-settings";
import PrintReceiptButton from "@/components/admin/PrintReceiptButton";

const DELIVERY_METHOD_LABELS = { PICKUP: "Retrait en boutique", RELAY: "Point relais", SHIPPING: "Expédition" };

/**
 * F18 : reçu imprimable — page volontairement hors de `(dashboard)` pour ne
 * pas hériter du menu/de la coque admin (rien d'autre à imprimer que le
 * reçu lui-même). Accès vérifié ici, comme toute autre page admin.
 */
export default async function OrderReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("OWNER");
  const { id } = await params;

  const [order, settings] = await Promise.all([
    prisma.order.findUnique({ where: { id }, include: { items: true, relayPoint: true } }),
    getShopSettings(),
  ]);
  if (!order) notFound();

  const paymentMention = order.paymentStatus === "COLLECTED" ? "Payé à la réception" : "À payer à la réception";

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <PrintReceiptButton />

      <div className="border border-os-gray bg-white p-8 text-sm">
        <div className="flex items-start justify-between border-b border-os-gray pb-6">
          <div>
            <p className="font-serif text-2xl font-bold">{settings.shopName}</p>
            <p className="mt-1 text-xs text-os-muted">{settings.address}</p>
            <p className="text-xs text-os-muted">{settings.phoneNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest text-os-muted">Reçu</p>
            <p className="font-semibold">{order.number}</p>
            <p className="text-xs text-os-muted">
              {order.createdAt.toLocaleDateString("fr-FR", { timeZone: "Africa/Douala", dateStyle: "long" })}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-os-muted">Client</p>
          <p className="mt-1">
            {order.firstName} {order.lastName}
          </p>
          <p className="text-xs text-os-muted">{order.phone}</p>
        </div>

        <table className="mt-6 w-full text-left">
          <thead>
            <tr className="border-b border-os-gray text-xs uppercase tracking-widest text-os-muted">
              <th className="py-2">Article</th>
              <th className="py-2 text-right">Qté</th>
              <th className="py-2 text-right">Prix</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-os-cream">
                <td className="py-2">
                  {item.name}
                  {[item.size, item.color, item.scent].filter(Boolean).length > 0 && (
                    <span className="text-xs text-os-muted"> ({[item.size, item.color, item.scent].filter(Boolean).join(" · ")})</span>
                  )}
                </td>
                <td className="py-2 text-right">{item.quantity}</td>
                <td className="py-2 text-right">{formatPriceFcfa(item.unitPrice)}</td>
                <td className="py-2 text-right">{formatPriceFcfa(item.lineTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex flex-col gap-1.5 border-t border-os-gray pt-3">
          <div className="flex justify-between">
            <span className="text-os-muted">Sous-total</span>
            <span>{formatPriceFcfa(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-os-muted">
              Livraison — {DELIVERY_METHOD_LABELS[order.deliveryMethod]}
              {order.relayPoint ? ` (${order.relayPoint.name})` : ""}
            </span>
            <span>{formatPriceFcfa(order.deliveryFee)}</span>
          </div>
          <div className="flex justify-between border-t border-os-gray pt-2 text-base font-semibold">
            <span>Total</span>
            <span>{formatPriceFcfa(order.total)}</span>
          </div>
        </div>

        <p className="mt-6 border-t border-os-gray pt-4 text-center text-sm font-semibold">{paymentMention}</p>
        <p className="mt-2 text-center text-xs text-os-muted">
          Échange possible, remboursement impossible. Les parfums ne sont ni repris ni échangés.
        </p>
      </div>
    </div>
  );
}
