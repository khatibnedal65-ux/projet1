import Link from "next/link";
import {
  Zap,
  Clock,
  TrendingDown,
  Gauge,
  Wrench,
  Disc3,
  Droplets,
  Shield,
  Settings,
  ChevronRight,
  Phone,
  Star,
} from "lucide-react";

const services = [
  {
    icon: Disc3,
    title: "Pneus & Équilibrage",
    description:
      "Montage, équilibrage et contrôle pression. Toutes marques disponibles.",
  },
  {
    icon: Droplets,
    title: "Vidange",
    description:
      "Vidange huile moteur et remplacement des filtres. Rapide et efficace.",
  },
  {
    icon: Shield,
    title: "Freinage",
    description:
      "Remplacement plaquettes, disques et liquide de frein. Votre sécurité avant tout.",
  },
  {
    icon: Gauge,
    title: "Amortisseurs",
    description:
      "Diagnostic et remplacement amortisseurs pour un confort et une tenue de route optimaux.",
  },
  {
    icon: Settings,
    title: "Distribution",
    description:
      "Remplacement courroie de distribution. Forfait complet à 380 € pour voitures françaises.",
  },
];

const features = [
  {
    icon: Zap,
    title: "Sans rendez-vous",
    description: "Venez directement, on s'occupe de vous sans attente.",
    color: "text-yellow-500",
    bg: "bg-yellow-50",
  },
  {
    icon: Clock,
    title: "Ouvert 7j/7",
    description: "De 08h00 à 19h00 NON-STOP, même le week-end.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: TrendingDown,
    title: "Prix imbattables",
    description: "Tarifs transparents, sans mauvaise surprise sur la facture.",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: Wrench,
    title: "Service Express",
    description: "Interventions rapides pour vous remettre sur la route au plus vite.",
    color: "text-red-600",
    bg: "bg-red-50",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── HERO ────────────────────────────────────────────────────── */}
      <section className="relative bg-[#1a2e4a] overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-red-600 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-yellow-400 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-white/80 mb-6">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            Vauxbuin &amp; Villers-Cotterêts — Ouvert 7j/7
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight">
            MÉCA<span className="text-red-500"> DRIVE</span>
          </h1>

          <p className="mt-4 text-lg sm:text-xl text-gray-300 max-w-xl mx-auto">
            Ton garage de confiance —{" "}
            <span className="text-white font-medium">
              Spécialiste Entretien &amp; Réparation Auto
            </span>
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-red-900/40"
            >
              Réserver un RDV
              <ChevronRight size={18} />
            </Link>
            <Link
              href="/devis"
              className="inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-[#1a2e4a] font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-yellow-900/20"
            >
              Demander un Devis
              <ChevronRight size={18} />
            </Link>
          </div>

          <div className="mt-10 flex justify-center gap-6 text-sm text-gray-400">
            <a
              href="tel:0365670731"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone size={14} />
              03 65 67 07 31
            </a>
            <a
              href="tel:0782062338"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone size={14} />
              07 82 06 23 38
            </a>
          </div>
        </div>
      </section>

      {/* ── SPECIAL OFFER BANNER ─────────────────────────────────────── */}
      <section id="tarifs" className="bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="inline-block bg-yellow-400 text-[#1a2e4a] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                Offre spéciale
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                FORFAIT DISTRIBUTION COMPLET
              </h2>
              <p className="mt-1 text-lg text-red-100">
                Pièces <span className="font-semibold text-white">+</span>{" "}
                Main-d&apos;œuvre incluses
              </p>
            </div>

            <div className="text-center shrink-0">
              <div className="text-7xl font-extrabold tracking-tight">
                380{" "}
                <span className="text-4xl align-top mt-2 inline-block">€</span>
              </div>
              <p className="text-red-200 text-sm mt-1">TTC, tout compris</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-red-500 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-red-100">
            <p>
              Pour toutes voitures françaises de{" "}
              <span className="text-white font-semibold">1.1L à 1.9L</span>
            </p>
            <p className="text-red-200 italic">(hors RS, GT, 16V)</p>
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 bg-white text-red-600 font-semibold px-6 py-2.5 rounded-xl hover:bg-red-50 transition-colors shrink-0"
            >
              J&apos;en profite
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SERVICES GRID ────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[#1a2e4a] tracking-tight">
              Nos Services
            </h2>
            <p className="mt-2 text-gray-500">
              Une gamme complète pour entretenir et réparer votre véhicule.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="group bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:border-red-200 hover:shadow-md transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#1a2e4a] flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors">
                    <Icon size={22} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1a2e4a]">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              );
            })}

            {/* CTA card */}
            <div className="bg-[#1a2e4a] rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center mb-4">
                  <Zap size={22} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Besoin d&apos;un autre service ?
                </h3>
                <p className="mt-2 text-sm text-gray-400">
                  Décrivez votre problème, on vous envoie un devis gratuit.
                </p>
              </div>
              <Link
                href="/devis"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                Demander un devis <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY US ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[#1a2e4a] tracking-tight">
              Pourquoi nous choisir ?
            </h2>
            <p className="mt-2 text-gray-500">
              Des engagements concrets pour votre tranquillité.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm hover:shadow-md transition-shadow"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center mx-auto mb-4`}
                  >
                    <Icon size={26} className={f.color} />
                  </div>
                  <h3 className="font-bold text-[#1a2e4a]">{f.title}</h3>
                  <p className="mt-2 text-sm text-gray-500">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA STRIP ─────────────────────────────────────────── */}
      <section className="bg-[#1a2e4a] py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Prêt à faire entretenir votre véhicule ?
          </h2>
          <p className="mt-3 text-gray-400">
            Prenez rendez-vous en ligne ou demandez un devis gratuit en moins
            d&apos;une minute.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
            >
              Réserver un RDV <ChevronRight size={18} />
            </Link>
            <Link
              href="/devis"
              className="inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-[#1a2e4a] font-semibold px-8 py-3.5 rounded-xl transition-colors"
            >
              Demander un Devis <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
