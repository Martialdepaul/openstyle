import { useState } from "react";

const faqs = [
  {
    q: "Comment passer une commande ?",
    a: "Vous pouvez commander directement sur notre site en ajoutant des articles à votre panier, puis en suivant le processus de commande. Vous pouvez également commander via WhatsApp en nous contactant au +216 656 356 687.",
  },
  {
    q: "Quels sont les moyens de paiement ?",
    a: "Nous acceptons Orange Money, MTN Mobile Money et le paiement à la livraison (uniquement à Yaoundé). Pour les grosses commandes, un acompte peut être demandé.",
  },
  {
    q: "Livrez-vous hors de Yaoundé ?",
    a: "Oui ! Nous livrons partout au Cameroun. Les frais de livraison varient selon la distance et la zone. Contactez-nous pour connaître les tarifs pour votre ville.",
  },
  {
    q: "Peut-on payer à la livraison ?",
    a: "Le paiement à la livraison est disponible uniquement pour les commandes à Yaoundé. Pour les expéditions hors de Yaoundé, un paiement mobile (Orange Money ou MTN) est requis avant l'envoi.",
  },
  {
    q: "Comment accéder aux tarifs de gros ?",
    a: "Créez un compte client, puis faites une demande d'accès professionnel depuis votre espace compte. Notre équipe examinera votre demande sous 24-48h. Les tarifs professionnels s'appliquent à partir de 10 pièces.",
  },
  {
    q: "Quels sont les délais de livraison ?",
    a: "À Yaoundé, la livraison est généralement effectuée le jour même ou le lendemain. Pour les autres villes du Cameroun, comptez 2 à 5 jours ouvrables selon votre localisation.",
  },
  {
    q: "Peut-on échanger un article ?",
    a: "Les échanges sont possibles sous conditions. L'article doit être dans son état d'origine (non porté, avec étiquettes). Contactez-nous dans les 48h suivant la réception pour initier un échange.",
  },
  {
    q: "Comment contacter OPENSTYLE ?",
    a: "Vous pouvez nous joindre par téléphone/WhatsApp au +216 656 356 687, par email à Openstyle911@gmail.com, ou en visitant notre boutique à Yaoundé, Mokolo, Elobi, Centre commercial Dubaï Market (08h00–18h30).",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-12 page-enter">
      <div className="mb-10 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-[#6B6B6B] mb-2">Questions fréquentes</p>
        <h1 className="font-serif text-4xl font-bold">FAQ</h1>
      </div>

      <div className="flex flex-col gap-2">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-[#EAEAEA]">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold hover:bg-[#F7F7F5] transition"
            >
              <span>{faq.q}</span>
              <span className={`text-lg transition-transform flex-shrink-0 ml-4 ${open === i ? "rotate-45" : ""}`}>+</span>
            </button>
            {open === i && (
              <div className="px-5 pb-4 text-sm text-[#6B6B6B] leading-relaxed border-t border-[#EAEAEA]">
                <p className="pt-3">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 bg-[#F7F7F5] p-8 text-center">
        <p className="font-serif text-xl font-semibold mb-2">Vous n'avez pas trouvé votre réponse ?</p>
        <p className="text-sm text-[#6B6B6B] mb-5">Notre équipe est disponible pour vous aider</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <a
            href="https://wa.me/216656356687"
            target="_blank"
            rel="noreferrer"
            className="bg-[#25D366] text-white px-6 py-2.5 text-sm font-semibold hover:bg-[#20c05a] transition"
          >
            WhatsApp
          </a>
          <a href="/contact" className="border border-[#111] px-6 py-2.5 text-sm font-semibold hover:bg-[#111] hover:text-white transition">
            Formulaire de contact
          </a>
        </div>
      </div>
    </div>
  );
}
