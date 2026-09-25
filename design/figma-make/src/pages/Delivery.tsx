export default function Delivery() {
  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-12">
      <div className="mb-10">
        <p className="text-xs tracking-[0.3em] uppercase text-[#6B6B6B] mb-2">Informations</p>
        <h1 className="font-serif text-4xl font-bold">Livraison</h1>
      </div>

      <div className="flex flex-col gap-8">
        {[
          {
            icon: "🏪",
            title: "Retrait en boutique",
            items: [
              "Yaoundé, Mokolo, Elobi, Centre commercial Dubaï Market",
              "Gratuit — disponible dès confirmation",
              "Horaires : 08h00 – 18h30",
            ],
          },
          {
            icon: "🚚",
            title: "Livraison à Yaoundé",
            items: [
              "Délai estimé : même jour ou lendemain",
              "Frais : 1 500 – 3 000 FCFA selon la zone",
              "Paiement à la livraison disponible",
            ],
          },
          {
            icon: "📦",
            title: "Expédition au Cameroun",
            items: [
              "Livraison partout au Cameroun",
              "Délai estimé : 2 à 5 jours ouvrables",
              "Frais calculés selon la distance et le poids",
              "Paiement avant expédition (Orange Money ou MTN)",
            ],
          },
          {
            icon: "🏢",
            title: "Livraison en gros",
            items: [
              "Tarifs négociés pour les commandes professionnelles",
              "Coordination par WhatsApp",
              "Acompte requis avant préparation",
            ],
          },
        ].map((s) => (
          <div key={s.title} className="border border-[#EAEAEA] p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{s.icon}</span>
              <h2 className="font-serif text-xl font-semibold">{s.title}</h2>
            </div>
            <ul className="flex flex-col gap-2">
              {s.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#6B6B6B]">
                  <span className="text-[#111] mt-0.5">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="bg-[#F7F7F5] p-6">
          <h3 className="font-semibold mb-2">En cas d'absence</h3>
          <p className="text-sm text-[#6B6B6B]">
            Si vous êtes absent lors de la livraison, notre livreur vous contactera par téléphone pour convenir d'une nouvelle tentative ou d'un point de retrait alternatif.
          </p>
        </div>
      </div>
    </div>
  );
}
