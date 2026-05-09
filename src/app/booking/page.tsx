"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import {
  Calendar,
  Car,
  User,
  CheckCircle,
  ChevronRight,
  Wrench,
  Clock,
  AlertCircle,
} from "lucide-react";

const SERVICES = [
  "Forfait Distribution (380€)",
  "Vidange",
  "Freinage",
  "Amortisseurs",
  "Pneus & Équilibrage",
];

type BookingForm = {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  vehicleModel?: string;
  licensePlate?: string;
  serviceName: string;
  date: string;
  time: string;
  notes?: string;
};

const base =
  "w-full px-4 py-2.5 rounded-xl border bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a2e4a] focus:border-transparent transition text-sm";
const errBorder = "border-red-400 focus:ring-red-400";
const okBorder = "border-gray-200";

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
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

export default function BookingPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [confirmedData, setConfirmedData] = useState<BookingForm | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingForm>();

  const today = new Date().toISOString().split("T")[0];

  const onSubmit = async (data: BookingForm) => {
    setServerError(null);
    try {
      const res = await fetch("/api/booking", {
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
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#1a2e4a]">
            Demande envoyée !
          </h2>
          <p className="mt-2 text-gray-500 text-sm">
            Nous vous contacterons rapidement au{" "}
            <span className="font-medium text-gray-700">{confirmedData.phone}</span>{" "}
            pour confirmer votre rendez-vous.
          </p>

          <div className="mt-6 text-left bg-gray-50 rounded-2xl p-5 space-y-2.5 text-sm">
            <Row label="Nom" value={`${confirmedData.firstName} ${confirmedData.lastName}`} />
            <Row label="Service" value={confirmedData.serviceName} />
            <Row
              label="Date & heure"
              value={`${new Date(confirmedData.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} à ${confirmedData.time}`}
            />
            {confirmedData.vehicleModel && <Row label="Véhicule" value={confirmedData.vehicleModel} />}
            {confirmedData.licensePlate && <Row label="Immatriculation" value={confirmedData.licensePlate} />}
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
      <section className="bg-[#1a2e4a] py-14 px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-white/80 mb-4">
          <Wrench size={13} className="text-yellow-400" />
          Sans rendez-vous obligatoire — Ouvert 7j/7
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Réserver un rendez-vous
        </h1>
        <p className="mt-2 text-gray-400 text-sm max-w-sm mx-auto">
          Remplissez le formulaire ci-dessous. Nous vous confirmons par téléphone.
        </p>
      </section>

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
              <Field label="Marque & Modèle" error={errors.vehicleModel?.message}>
                <input
                  {...register("vehicleModel")}
                  placeholder="Renault Clio 1.5 dCi"
                  className={`${base} ${errors.vehicleModel ? errBorder : okBorder}`}
                />
              </Field>
              <Field label="Immatriculation" error={errors.licensePlate?.message}>
                <input
                  {...register("licensePlate")}
                  placeholder="AB-123-CD"
                  className={`${base} ${errors.licensePlate ? errBorder : okBorder}`}
                  style={{ textTransform: "uppercase" }}
                />
              </Field>
            </div>
          </fieldset>

          {/* Rendez-vous */}
          <fieldset>
            <SectionTitle icon={Calendar} label="Votre rendez-vous" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Service — spans full width */}
              <div className="sm:col-span-2">
                <Field label="Service souhaité" required error={errors.serviceName?.message}>
                  <select
                    {...register("serviceName", { required: "Veuillez choisir un service." })}
                    className={`${base} ${errors.serviceName ? errBorder : okBorder}`}
                  >
                    <option value="">— Choisissez un service —</option>
                    {SERVICES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Date souhaitée" required error={errors.date?.message}>
                <input
                  {...register("date", {
                    required: "Date requise.",
                    validate: (v) =>
                      v >= today || "La date ne peut pas être dans le passé.",
                  })}
                  type="date"
                  min={today}
                  className={`${base} ${errors.date ? errBorder : okBorder}`}
                />
              </Field>

              <Field label="Heure souhaitée" required error={errors.time?.message}>
                <div className="relative">
                  <input
                    {...register("time", {
                      required: "Heure requise.",
                      validate: (v) => {
                        const [h, m] = v.split(":").map(Number);
                        const mins = h * 60 + m;
                        if (mins < 8 * 60) return "Heure minimum : 08h00.";
                        if (mins > 19 * 60) return "Heure maximum : 19h00.";
                        return true;
                      },
                    })}
                    type="time"
                    min="08:00"
                    max="19:00"
                    step={900}
                    className={`${base} ${errors.time ? errBorder : okBorder}`}
                  />
                  <Clock
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Horaires : 08h00 – 19h00</p>
              </Field>
            </div>

            <div className="mt-4">
              <Field label="Notes complémentaires (optionnel)" error={errors.notes?.message}>
                <textarea
                  {...register("notes")}
                  rows={3}
                  placeholder="Décrivez brièvement le problème ou toute information utile…"
                  className={`${base} resize-none ${errors.notes ? errBorder : okBorder}`}
                />
              </Field>
            </div>
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
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-base"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Envoi en cours…
              </>
            ) : (
              <>
                Envoyer ma demande de rendez-vous
                <ChevronRight size={18} />
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-400">
            Sans rendez-vous possible — Ouvert 7j/7 de 08h00 à 19h00 — 340 route de Paris,
            02200 Vauxbuin
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
