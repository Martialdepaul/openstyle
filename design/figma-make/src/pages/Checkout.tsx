import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store";
import { formatPrice } from "../data";

const STEPS = ["Informations", "Livraison", "Paiement", "Confirmation"];

type DeliveryMode = "retrait" | "relais" | "expedition";
type PayMode = "orange" | "mtn" | "livraison";

export default function Checkout() {
  const { items, total, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    nom: "", prenom: "", tel: "", whatsapp: "", email: "",
    ville: "", quartier: "", instructions: "",
  });
  const [delivery, setDelivery] = useState<DeliveryMode>("retrait");
  const [pay, setPay] = useState<PayMode>("orange");
  const [orderRef] = useState("OS-" + Math.random().toString(36).slice(2, 8).toUpperCase());

  if (items.length === 0 && step < 3) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-4xl mb-4">🛒</p>
        <p className="font-serif text-2xl mb-4">Votre panier est vide</p>
        <Link to="/boutique" className="inline-block bg-[#111] text-white px-8 py-3 text-sm font-semibold">
          Retour à la boutique
        </Link>
      </div>
    );
  }

  const updateForm = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (step < 3) {
      setStep(step + 1);
      if (step === 2) clearCart();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-10 page-enter">
      <Link to="/boutique" className="text-xs text-[#6B6B6B] hover:text-[#111] flex items-center gap-1 mb-6">
        ← Continuer mes achats
      </Link>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
              i <= step ? "bg-[#111] text-white" : "bg-[#EAEAEA] text-[#6B6B6B]"
            }`}>
              {i < step ? "✓" : i + 1}
            </div>
            <span className={`text-xs hidden sm:block ${i === step ? "font-semibold" : "text-[#6B6B6B]"}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`flex-1 h-px w-6 lg:w-12 ${i < step ? "bg-[#111]" : "bg-[#EAEAEA]"}`} />}
          </div>
        ))}
      </div>

      {step === 3 ? (
        /* Confirmation */
        <div className="max-w-lg mx-auto text-center py-12">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="font-serif text-3xl font-bold mb-3">Commande enregistrée !</h1>
          <p className="text-[#6B6B6B] mb-2">Numéro de commande : <strong>{orderRef}</strong></p>
          <p className="text-sm text-[#6B6B6B] leading-relaxed mb-8">
            Votre commande a bien été enregistrée. Notre équipe vous contactera pour confirmer les détails et le paiement.
          </p>
          <a
            href={`https://wa.me/216656356687?text=Bonjour, j'ai passé la commande ${orderRef} et j'attends la confirmation.`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-8 py-3 font-semibold text-sm mb-4"
          >
            Confirmer sur WhatsApp
          </a>
          <Link to="/" className="text-sm underline">Retour à l'accueil</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_380px] gap-10">
          {/* Form */}
          <div>
            {step === 0 && (
              <div>
                <h2 className="font-serif text-2xl font-bold mb-6">Informations client</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { k: "prenom", l: "Prénom *" },
                    { k: "nom", l: "Nom *" },
                    { k: "tel", l: "Téléphone *" },
                    { k: "whatsapp", l: "WhatsApp" },
                    { k: "email", l: "Email (facultatif)" },
                  ].map(({ k, l }) => (
                    <div key={k} className={k === "email" ? "sm:col-span-2" : ""}>
                      <label className="block text-xs uppercase tracking-widest font-semibold mb-1.5">{l}</label>
                      <input
                        value={form[k as keyof typeof form]}
                        onChange={(e) => updateForm(k, e.target.value)}
                        className="w-full border border-[#EAEAEA] px-4 py-3 text-sm focus:outline-none focus:border-[#111]"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#6B6B6B] mt-4">Vous pouvez commander sans créer de compte.</p>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="font-serif text-2xl font-bold mb-6">Livraison</h2>
                <div className="flex flex-col gap-3 mb-6">
                  {([
                    { v: "retrait", l: "Retrait en boutique", d: "Yaoundé, Mokolo, Elobi — Centre commercial Dubaï Market", p: "Gratuit" },
                    { v: "relais", l: "Point relais", d: "Point relais disponible à Yaoundé", p: "1 500 – 3 000 FCFA" },
                    { v: "expedition", l: "Expédition partout au Cameroun", d: "Délai estimé : 2 à 5 jours", p: "Selon la distance" },
                  ] as { v: DeliveryMode; l: string; d: string; p: string }[]).map(({ v, l, d, p }) => (
                    <label key={v} className={`flex items-start gap-4 border p-4 cursor-pointer transition ${delivery === v ? "border-[#111]" : "border-[#EAEAEA] hover:border-[#111]"}`}>
                      <input type="radio" value={v} checked={delivery === v} onChange={() => setDelivery(v)} className="mt-0.5 accent-[#111]" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{l}</p>
                        <p className="text-xs text-[#6B6B6B] mt-0.5">{d}</p>
                      </div>
                      <span className="text-xs font-semibold">{p}</span>
                    </label>
                  ))}
                </div>
                <div className="grid gap-4">
                  {[
                    { k: "ville", l: "Ville *" },
                    { k: "quartier", l: "Quartier / Adresse" },
                    { k: "instructions", l: "Instructions de livraison" },
                  ].map(({ k, l }) => (
                    <div key={k}>
                      <label className="block text-xs uppercase tracking-widest font-semibold mb-1.5">{l}</label>
                      <input
                        value={form[k as keyof typeof form]}
                        onChange={(e) => updateForm(k, e.target.value)}
                        className="w-full border border-[#EAEAEA] px-4 py-3 text-sm focus:outline-none focus:border-[#111]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="font-serif text-2xl font-bold mb-6">Paiement</h2>
                <div className="flex flex-col gap-3">
                  {([
                    { v: "orange", l: "Orange Money", d: "Paiement mobile Orange" },
                    { v: "mtn", l: "MTN Mobile Money", d: "Paiement mobile MTN" },
                    { v: "livraison", l: "Paiement à la livraison", d: "Disponible uniquement à Yaoundé" },
                  ] as { v: PayMode; l: string; d: string }[]).map(({ v, l, d }) => (
                    <label key={v} className={`flex items-center gap-4 border p-4 cursor-pointer transition ${pay === v ? "border-[#111]" : "border-[#EAEAEA] hover:border-[#111]"}`}>
                      <input type="radio" value={v} checked={pay === v} onChange={() => setPay(v)} className="accent-[#111]" />
                      <div>
                        <p className="text-sm font-semibold">{l}</p>
                        <p className="text-xs text-[#6B6B6B]">{d}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-[#F7F7F5] text-sm text-[#6B6B6B]">
                  Le paiement sera effectué après confirmation de votre commande par notre équipe.
                </div>

                {/* Recap */}
                <div className="mt-8">
                  <h3 className="font-semibold text-sm mb-3">Récapitulatif</h3>
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm py-2 border-b border-[#EAEAEA]">
                      <span>{item.product.name} × {item.quantity}</span>
                      <span>{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-semibold mt-3">
                    <span>Total</span>
                    <span>{formatPrice(total())}</span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              className="mt-8 w-full bg-[#111] text-white py-4 text-sm font-semibold tracking-widest uppercase hover:bg-[#1C1C1C] transition"
            >
              {step === 2 ? "Confirmer la commande" : "Continuer"}
            </button>
          </div>

          {/* Order summary */}
          <div>
            <div className="border border-[#EAEAEA] p-6">
              <h3 className="font-semibold text-sm mb-4 uppercase tracking-widest">Votre commande</h3>
              <div className="flex flex-col gap-3 mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="relative">
                      <img src={item.product.image} alt={item.product.name} className="w-14 h-18 object-cover bg-[#F7F7F5]" />
                      <span className="absolute -top-1.5 -right-1.5 bg-[#111] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium leading-tight">{item.product.name}</p>
                      {item.size && <p className="text-[10px] text-[#6B6B6B]">{item.size}</p>}
                      <p className="text-xs font-semibold mt-1">{formatPrice(item.product.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#EAEAEA] pt-3 flex flex-col gap-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B6B6B]">Sous-total</span>
                  <span>{formatPrice(total())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B6B6B]">Livraison</span>
                  <span className="text-xs text-[#6B6B6B]">À calculer</span>
                </div>
                <div className="flex justify-between font-semibold mt-1 pt-2 border-t border-[#EAEAEA]">
                  <span>Total estimé</span>
                  <span>{formatPrice(total())}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
