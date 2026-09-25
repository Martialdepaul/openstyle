import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

export default function Login() {
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/compte");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:flex-1 bg-[#111] items-center justify-center relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=1000&fit=crop&auto=format"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative text-center text-white px-12">
          <div className="bg-white inline-block p-3 mb-8">
            <Logo className="h-14 w-auto" />
          </div>
          <p className="font-serif text-3xl font-bold mb-3">Un style qui s'accorde<br />à votre identité.</p>
          <p className="text-white/60 text-sm">OPENSTYLE — Yaoundé, Cameroun</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo className="h-12 w-auto" />
          </div>

          {mode === "login" && (
            <>
              <h1 className="font-serif text-3xl font-bold mb-1">Connexion</h1>
              <p className="text-[#6B6B6B] text-sm mb-8">Accédez à votre espace client</p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest font-semibold mb-1.5">Téléphone ou Email</label>
                  <input required className="w-full border border-[#EAEAEA] px-4 py-3 text-sm focus:outline-none focus:border-[#111]" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-semibold mb-1.5">Mot de passe</label>
                  <input type="password" required className="w-full border border-[#EAEAEA] px-4 py-3 text-sm focus:outline-none focus:border-[#111]" />
                </div>
                <button type="button" onClick={() => setMode("forgot")} className="text-xs text-[#6B6B6B] text-right hover:text-[#111]">
                  Mot de passe oublié ?
                </button>
                <button type="submit" className="bg-[#111] text-white py-4 text-sm font-semibold tracking-widest uppercase hover:bg-[#1C1C1C] transition">
                  Se connecter
                </button>
              </form>
              <p className="text-center text-sm text-[#6B6B6B] mt-6">
                Pas encore de compte ?{" "}
                <button onClick={() => setMode("register")} className="text-[#111] font-semibold underline">Créer un compte</button>
              </p>
            </>
          )}

          {mode === "register" && (
            <>
              <h1 className="font-serif text-3xl font-bold mb-1">Créer un compte</h1>
              <p className="text-[#6B6B6B] text-sm mb-8">Rejoignez la communauté OPENSTYLE</p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  {["Prénom", "Nom"].map((l) => (
                    <div key={l}>
                      <label className="block text-xs uppercase tracking-widest font-semibold mb-1.5">{l}</label>
                      <input required className="w-full border border-[#EAEAEA] px-4 py-3 text-sm focus:outline-none focus:border-[#111]" />
                    </div>
                  ))}
                </div>
                {[
                  { l: "Téléphone / WhatsApp", t: "tel" },
                  { l: "Email (facultatif)", t: "email" },
                  { l: "Mot de passe", t: "password" },
                ].map(({ l, t }) => (
                  <div key={l}>
                    <label className="block text-xs uppercase tracking-widest font-semibold mb-1.5">{l}</label>
                    <input type={t} className="w-full border border-[#EAEAEA] px-4 py-3 text-sm focus:outline-none focus:border-[#111]" />
                  </div>
                ))}
                <button type="submit" className="bg-[#111] text-white py-4 text-sm font-semibold tracking-widest uppercase hover:bg-[#1C1C1C] transition mt-1">
                  Créer le compte
                </button>
              </form>
              <p className="text-center text-sm text-[#6B6B6B] mt-6">
                Déjà un compte ?{" "}
                <button onClick={() => setMode("login")} className="text-[#111] font-semibold underline">Se connecter</button>
              </p>
            </>
          )}

          {mode === "forgot" && (
            <>
              <h1 className="font-serif text-3xl font-bold mb-1">Mot de passe oublié</h1>
              <p className="text-[#6B6B6B] text-sm mb-8">Entrez votre téléphone ou email pour réinitialiser votre mot de passe</p>
              <form onSubmit={(e) => { e.preventDefault(); setMode("login"); }} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest font-semibold mb-1.5">Téléphone ou Email</label>
                  <input required className="w-full border border-[#EAEAEA] px-4 py-3 text-sm focus:outline-none focus:border-[#111]" />
                </div>
                <button type="submit" className="bg-[#111] text-white py-4 text-sm font-semibold tracking-widest uppercase hover:bg-[#1C1C1C] transition">
                  Envoyer le lien
                </button>
              </form>
              <p className="text-center text-sm text-[#6B6B6B] mt-6">
                <button onClick={() => setMode("login")} className="underline">Retour à la connexion</button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
