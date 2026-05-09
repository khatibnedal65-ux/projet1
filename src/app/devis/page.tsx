"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import {
  Car,
  User,
  CheckCircle,
  ChevronRight,
  FileText,
  AlertCircle,
  Star,
} from "lucide-react";

type DevisForm = {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  carBrand: string;
  carModel: string;
  year?: string;
  licensePlate: string;
  description: string;
};

const base =
  "w-full px-4 py-2.5 rounded-xl border bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a2e4a] focus:border-transparent transition text-sm";
const errBorder = "border-red-400 focus:ring-red-400";
const okBorder = "border-gray-200";

function Field({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-600">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  );
}

function SectionTitle({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <h2 className="flex items-center gap-2 text-sm font-semibold text-[#1a2e4a] uppercase tracking-wide mb-4 pb-2 border-b border-gray-100">
      <Icon size={15} className="text-red-600" />
      {label}
    </h2>
  );
}

export default function DevisPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [confirmedData, setConfirmedData] = useState<DevisForm | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DevisForm>();

  const currentYear = new Date().getFullYear();

  const onSubmit = async (data: DevisForm) => {
    setServerError(null);
    try {
      const res = await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setServerError(json.error ?? "Une erreur est survenue.");
        return;
      }
      setConfirmedData(data);
      setSubmitted(true);
    } catch {
      setServerError("Impossible de contacter le serveur. Réessayez.");
    }
  };

  /* ── SUCCESS STATE ── */
  if (submitted && confirmedData) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-10 text-center">
          <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-yellow-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#1a2e4a]">
            Demande de devis envoyée !
          </h2>
          <p className="mt-2 text-gray-500 text-sm">
            Votre demande est bien reçue. Nous vous contacterons rapidement au{" "}
            <span className="font-medium text-gray-700">{confirmedData.phone}</span>{" "}
            avec un devis personnalisé et sans engagement.
          </p>

          <div className="mt-6 text-left bg-gray-50 rounded-2xl p-5 space-y-2.5 text-sm">
            <Row label="Nom" value={`${confirmedData.firstName} ${confirmedData.lastName}`} />
            <Row
              label="Véhicule"
              value={`${confirmedData.carBrand} ${confirmedData.carModel}${confirmedData.year ? ` (${confirmedData.year})` : ""}`}
            />
            <Row label="Immatriculation" value={confirmedData.licensePlate} />
            <div className="pt-1 border-t border-gray-200">
              <p className="text-gray-500 mb-1">Travaux demandés :</p>
              <p className="text-gray-800 font-medium">{confirmedData.description}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => { setSubmitted(false); setConfirmedData(null); }}
              className="flex-1 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition text-sm"
            >
              Nouvelle demande
            </button>
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#1a2e4a] text-white font-semibold py-3 rounded-xl hover:bg-[#162540] transition text-sm"
            >
              Retour à l'accueil <ChevronRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── FORM ── */
  return (
    <>
      {/* Banner */}
      <section className="bg-yellow-400 py-14 px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-[#1a2e4a]/10 border border-[#1a2e4a]/20 rounded-full px-4 py-1.5 text-sm text-[#1a2e4a]/80 mb-4">
          <Star size={13} className="text-[#1a2e4a] fill-[#1a2e4a]" />
          Devis gratuit et sans engagement
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1a2e4a] tracking-tight">
          Demander un devis gratuit
        </h1>
        <p className="mt-2 text-[#1a2e4a]/70 text-sm max-w-sm mx-auto">
          Décrivez votre problème, nous vous envoyons un devis personnalisé rapidement.
        </p>
      </section>

      {/* Free badge strip */}
      <div className="bg-[#1a2e4a] py-3 px-4">
        <p className="text-center text-sm text-gray-300">
          <span className="text-yellow-400 font-semibold">Devis 100% gratuit</span> —
          Sans engagement — Réponse sous 24h
        </p>
      </div>

      {/* Form card */}
      <section className="max-w-2xl mx-auto px-4 py-12">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8"
        >
          {/* Coordonnées */}
          <fieldset>
            <SectionTitle icon={User} label="Vos coordonnées" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Prénom" required error={errors.firstName?.message}>
                <input
                  {...register("firstName", { required: "Prénom requis." })}
                  placeholder="Jean"
                  className={`${base} ${errors.firstName ? errBorder : okBorder}`}
                />
              </Field>
              <Field label="Nom" required error={errors.lastName?.message}>
                <input
                  {...register("lastName", { required: "Nom requis." })}
                  placeholder="Dupont"
                  className={`${base} ${errors.lastName ? errBorder : okBorder}`}
                />
              </Field>
              <Field label="Téléphone" required error={errors.phone?.message}>
                <input
                  {...register("phone", {
                    required: "Téléphone requis.",
                    pattern: { value: /^[0-9\s().+\-]{9,}$/, message: "Numéro invalide." },
                  })}
                  type="tel"
                  placeholder="06 12 34 56 78"
                  className={`${base} ${errors.phone ? errBorder : okBorder}`}
                />
              </Field>
              <Field label="Email (optionnel)" error={errors.email?.message}>
                <input
                  {...register("email", {
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email invalide." },
                  })}
                  type="email"
                  placeholder="jean@exemple.fr"
                  className={`${base} ${errors.email ? errBorder : okBorder}`}
                />
              </Field>
            </div>
          </fieldset>

          {/* Véhicule */}
          <fieldset>
            <SectionTitle icon={Car} label="Votre véhicule" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Marque" required error={errors.carBrand?.message}>
                <input
                  {...register("carBrand", { required: "Marque requise." })}
                  placeholder="Renault"
                  className={`${base} ${errors.carBrand ? errBorder : okBorder}`}
                />
              </Field>
              <Field label="Modèle" required error={errors.carModel?.message}>
                <input
                  {...register("carModel", { required: "Modèle requis." })}
                  placeholder="Clio 1.5 dCi"
                  className={`${base} ${errors.carModel ? errBorder : okBorder}`}
                />
              </Field>
              <Field
                label="Année"
                error={errors.year?.message}
                hint="Optionnel"
              >
                <input
                  {...register("year", {
                    validate: (v) => {
                      if (!v) return true;
                      const n = parseInt(v, 10);
                      if (isNaN(n) || n < 1900 || n > currentYear + 1)
                        return `Année invalide (1900 – ${currentYear}).`;
                      return true;
                    },
                  })}
                  type="number"
                  placeholder={String(currentYear)}
                  min={1900}
                  max={currentYear + 1}
                  className={`${base} ${errors.year ? errBorder : okBorder}`}
                />
              </Field>
              <Field label="Immatriculation" required error={errors.licensePlate?.message}>
                <input
                  {...register("licensePlate", { required: "Immatriculation requise." })}
                  placeholder="AB-123-CD"
                  style={{ textTransform: "uppercase" }}
                  className={`${base} ${errors.licensePlate ? errBorder : okBorder}`}
                />
              </Field>
            </div>
          </fieldset>

          {/* Description */}
          <fieldset>
            <SectionTitle icon={FileText} label="Description des travaux" />
            <Field
              label="Décrivez le problème ou les travaux souhaités"
              required
              error={errors.description?.message}
              hint="Soyez le plus précis possible pour un devis adapté."
            >
              <textarea
                {...register("description", {
                  required: "Description requise.",
                  minLength: { value: 10, message: "Merci de détailler davantage (10 caractères minimum)." },
                })}
                rows={5}
                placeholder="Ex : Le voyant moteur est allumé depuis 3 jours, j'entends un bruit de frottement en freinant à basse vitesse…"
                className={`${base} resize-none ${errors.description ? errBorder : okBorder}`}
              />
            </Field>
          </fieldset>

          {/* Server error */}
          {serverError && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-60 disabled:cursor-not-allowed text-[#1a2e4a] font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-base"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-[#1a2e4a] border-t-transparent rounded-full" />
                Envoi en cours…
              </>
            ) : (
              <>
                Envoyer ma demande de devis gratuit
                <ChevronRight size={18} />
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-400">
            Devis 100% gratuit et sans engagement — Réponse sous 24h
          </p>
        </form>
      </section>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800 text-right">{value}</span>
    </div>
  );
}
