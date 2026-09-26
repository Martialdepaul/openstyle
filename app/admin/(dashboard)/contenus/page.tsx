import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import PageHeader from "@/components/admin/PageHeader";
import PageContentForm from "@/components/admin/PageContentForm";
import FaqQuickActions from "@/components/admin/FaqQuickActions";
import TestimonialQuickActions from "@/components/admin/TestimonialQuickActions";
import BannerQuickActions from "@/components/admin/BannerQuickActions";
import { createFaqItem } from "@/lib/actions/faq";
import { createTestimonial } from "@/lib/actions/testimonial";
import { createBanner } from "@/lib/actions/banner";

const CONTENT_PAGES = [
  { slug: "a-propos", label: "À propos" },
  { slug: "contact", label: "Contact" },
  { slug: "livraison-retrait", label: "Livraison et retrait" },
  { slug: "conditions-vente", label: "Conditions de vente" },
  { slug: "confidentialite", label: "Politique de confidentialité" },
  { slug: "mentions-legales", label: "Mentions légales" },
];

const TABS = [
  { id: "pages", label: "Pages" },
  { id: "faq", label: "FAQ" },
  { id: "temoignages", label: "Témoignages" },
  { id: "bannieres", label: "Bannières" },
];

export default async function AdminContentPage({ searchParams }: { searchParams: Promise<{ onglet?: string }> }) {
  await requireRole("OWNER", "MANAGER");
  const { onglet } = await searchParams;
  const tab = TABS.some((t) => t.id === onglet) ? onglet! : "pages";

  return (
    <div>
      <PageHeader title="Contenus" breadcrumbs={[{ label: "Accueil", href: "/admin" }, { label: "Contenus" }]} />

      <div className="mb-6 flex gap-2 border-b border-os-gray text-sm">
        {TABS.map((t) => (
          <a
            key={t.id}
            href={t.id === "pages" ? "/admin/contenus" : `/admin/contenus?onglet=${t.id}`}
            className={`px-4 py-2 ${tab === t.id ? "border-b-2 border-os-black font-semibold" : "text-os-muted"}`}
          >
            {t.label}
          </a>
        ))}
      </div>

      {tab === "pages" && <PagesTab />}
      {tab === "faq" && <FaqTab />}
      {tab === "temoignages" && <TestimonialsTab />}
      {tab === "bannieres" && <BannersTab />}
    </div>
  );
}

async function PagesTab() {
  const pages = await prisma.page.findMany({ where: { slug: { in: CONTENT_PAGES.map((p) => p.slug) } } });
  const bySlug = new Map(pages.map((p) => [p.slug, p]));

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-os-muted">Ces pages sont affichées sur la boutique publique (lien « Voir sur le site » sur chacune).</p>
      {CONTENT_PAGES.map(({ slug, label }) => {
        const existing = bySlug.get(slug);
        return (
          <PageContentForm
            key={slug}
            slug={slug}
            label={label}
            initial={{
              titleFr: existing?.titleFr ?? label,
              titleEn: existing?.titleEn ?? "",
              bodyFr: existing?.bodyFr ?? "",
              bodyEn: existing?.bodyEn ?? "",
            }}
          />
        );
      })}
    </div>
  );
}

async function FaqTab() {
  const items = await prisma.faqItem.findMany({ orderBy: { position: "asc" } });

  return (
    <div className="flex flex-col gap-6">
      <a href="/fr/faq" target="_blank" rel="noreferrer" className="w-fit text-xs underline">
        Voir sur le site
      </a>
      <section className="max-w-2xl border border-os-gray bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest">Nouvelle question</h2>
        <form action={createFaqItem} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Question (FR)</label>
            <input name="questionFr" required className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Question (EN, facultatif)</label>
            <input name="questionEn" className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Réponse (FR)</label>
            <textarea name="answerFr" rows={3} required className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Réponse (EN, facultatif)</label>
            <textarea name="answerEn" rows={3} className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none" />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-press w-fit bg-os-black px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-os-black2">
              Ajouter
            </button>
          </div>
        </form>
      </section>

      <div className="flex flex-col gap-3">
        {items.map((item, index) => (
          <div key={item.id} className="border border-os-gray bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{item.questionFr}</p>
                <p className="mt-1 text-sm text-os-muted">{item.answerFr}</p>
              </div>
              <FaqQuickActions id={item.id} canMoveUp={index > 0} canMoveDown={index < items.length - 1} />
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="py-10 text-center text-sm text-os-muted">Aucune question.</p>}
      </div>
    </div>
  );
}

async function TestimonialsTab() {
  const items = await prisma.testimonial.findMany({ orderBy: { position: "asc" } });

  return (
    <div className="flex flex-col gap-6">
      <section className="max-w-2xl border border-os-gray bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest">Nouveau témoignage</h2>
        <form action={createTestimonial} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Auteur</label>
            <input name="author" required className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Ville (facultatif)</label>
            <input name="city" className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Texte (FR)</label>
            <textarea name="textFr" rows={3} required className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Texte (EN, facultatif)</label>
            <textarea name="textEn" rows={3} className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Photo (URL, facultatif)</label>
            <input name="photoUrl" className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none" />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-press w-fit bg-os-black px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-os-black2">
              Ajouter
            </button>
          </div>
        </form>
      </section>

      <div className="flex flex-col gap-3">
        {items.map((item, index) => (
          <div key={item.id} className="border border-os-gray bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">
                  {item.author} {item.city ? `— ${item.city}` : ""}
                  {!item.isActive && <span className="ml-2 rounded-full bg-os-gray px-2 py-0.5 text-[10px] uppercase">Désactivé</span>}
                </p>
                <p className="mt-1 text-sm text-os-muted">{item.textFr}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <a href="/fr" target="_blank" rel="noreferrer" className="text-xs underline">
                  Voir sur le site
                </a>
                <TestimonialQuickActions id={item.id} isActive={item.isActive} canMoveUp={index > 0} canMoveDown={index < items.length - 1} />
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="py-10 text-center text-sm text-os-muted">Aucun témoignage.</p>}
      </div>
    </div>
  );
}

async function BannersTab() {
  const items = await prisma.banner.findMany({ orderBy: { position: "asc" } });

  return (
    <div className="flex flex-col gap-6">
      <section className="max-w-2xl border border-os-gray bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest">Nouvelle bannière</h2>
        <form action={createBanner} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Image (URL)</label>
            <input name="imageUrl" required className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Titre (FR)</label>
            <input name="titleFr" required className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Titre (EN, facultatif)</label>
            <input name="titleEn" className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Sous-titre (FR, facultatif)</label>
            <input name="subtitleFr" className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Sous-titre (EN, facultatif)</label>
            <input name="subtitleEn" className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Lien (URL, facultatif)</label>
            <input name="linkUrl" className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none" />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-press w-fit bg-os-black px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-os-black2">
              Ajouter
            </button>
          </div>
        </form>
      </section>

      <div className="flex flex-col gap-3">
        {items.map((item, index) => (
          <div key={item.id} className="flex items-center justify-between gap-3 border border-os-gray bg-white p-4">
            <div>
              <p className="text-sm font-semibold">
                {item.titleFr}
                {!item.isActive && <span className="ml-2 rounded-full bg-os-gray px-2 py-0.5 text-[10px] uppercase">Désactivée</span>}
              </p>
              {item.subtitleFr && <p className="mt-1 text-xs text-os-muted">{item.subtitleFr}</p>}
            </div>
            <div className="flex flex-col items-end gap-2">
              <a href="/fr" target="_blank" rel="noreferrer" className="text-xs underline">
                Voir sur le site
              </a>
              <BannerQuickActions id={item.id} isActive={item.isActive} canMoveUp={index > 0} canMoveDown={index < items.length - 1} />
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="py-10 text-center text-sm text-os-muted">Aucune bannière.</p>}
      </div>
    </div>
  );
}
