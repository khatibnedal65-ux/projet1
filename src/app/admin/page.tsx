import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  CalendarCheck,
  FileText,
  Clock,
  AlertCircle,
  Phone,
  Car,
  User,
  ArrowLeft,
  Inbox,
} from "lucide-react";
import type { Appointment, Service, QuoteRequest } from "@/generated/prisma/client";

/* ─── Types ─────────────────────────────────────────────────────────── */

type AppointmentWithService = Appointment & { service: Service };

/* ─── Status config ─────────────────────────────────────────────────── */

const RDV_STATUS: Record<string, { label: string; cls: string }> = {
  pending:   { label: "En attente", cls: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  confirmed: { label: "Confirmé",   cls: "bg-green-100  text-green-800  border-green-200"  },
  cancelled: { label: "Annulé",     cls: "bg-red-100    text-red-800    border-red-200"    },
  done:      { label: "Terminé",    cls: "bg-blue-100   text-blue-800   border-blue-200"   },
};

const DEVIS_STATUS: Record<string, { label: string; cls: string }> = {
  new:       { label: "Nouveau",       cls: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  in_review: { label: "En cours",      cls: "bg-blue-100   text-blue-800   border-blue-200"   },
  quoted:    { label: "Devis envoyé",  cls: "bg-green-100  text-green-800  border-green-200"  },
  closed:    { label: "Clôturé",       cls: "bg-gray-100   text-gray-600   border-gray-200"   },
};

/* ─── Helpers ────────────────────────────────────────────────────────── */

function fmtDate(d: Date) {
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}
function fmtTime(d: Date) {
  return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}
function fmtDateTime(d: Date) {
  return d.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Badge({ status, map }: { status: string; map: Record<string, { label: string; cls: string }> }) {
  const cfg = map[status] ?? { label: status, cls: "bg-gray-100 text-gray-600 border-gray-200" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-[#1a2e4a]">{value}</p>
        <p className="text-xs text-gray-500 leading-tight">{label}</p>
      </div>
    </div>
  );
}

function TabLink({
  href,
  active,
  children,
  count,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  count: number;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
        active
          ? "bg-white text-[#1a2e4a] shadow-sm"
          : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {children}
      <span
        className={`text-xs px-2 py-0.5 rounded-full font-bold ${
          active ? "bg-[#1a2e4a] text-white" : "bg-gray-300 text-gray-600"
        }`}
      >
        {count}
      </span>
    </Link>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
      <Inbox size={48} className="mb-4 opacity-40" />
      <p className="font-medium">{label}</p>
      <p className="text-sm mt-1">Les nouvelles entrées apparaîtront ici.</p>
    </div>
  );
}

/* ─── Appointments Table ─────────────────────────────────────────────── */

function AppointmentsTable({ appointments }: { appointments: AppointmentWithService[] }) {
  if (!appointments.length) return <EmptyState label="Aucun rendez-vous pour l'instant." />;

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
      <table className="min-w-full divide-y divide-gray-100 bg-white">
        <thead className="bg-gray-50">
          <tr>
            {["Client", "Téléphone", "Véhicule", "Service", "Date & Heure", "Statut"].map((h) => (
              <th
                key={h}
                className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {appointments.map((appt) => (
            <tr key={appt.id} className="hover:bg-gray-50 transition-colors">
              {/* Client */}
              <td className="px-4 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#1a2e4a] flex items-center justify-center shrink-0">
                    <User size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {appt.firstName} {appt.lastName}
                    </p>
                    {appt.email && (
                      <p className="text-xs text-gray-400 truncate max-w-[160px]">{appt.email}</p>
                    )}
                  </div>
                </div>
              </td>

              {/* Phone */}
              <td className="px-4 py-4">
                <a
                  href={`tel:${appt.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-red-600 transition-colors whitespace-nowrap"
                >
                  <Phone size={13} className="text-red-500" />
                  {appt.phone}
                </a>
              </td>

              {/* Vehicle */}
              <td className="px-4 py-4">
                <div className="flex items-center gap-1.5 text-sm text-gray-700">
                  <Car size={13} className="text-gray-400 shrink-0" />
                  <div>
                    <p>{appt.vehicleModel || <span className="text-gray-400 italic">—</span>}</p>
                    {appt.licensePlate && (
                      <p className="text-xs font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded mt-0.5 w-fit">
                        {appt.licensePlate}
                      </p>
                    )}
                  </div>
                </div>
              </td>

              {/* Service */}
              <td className="px-4 py-4">
                <span className="text-sm text-gray-800 font-medium">{appt.service.name}</span>
              </td>

              {/* Date & Time */}
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-start gap-1.5">
                  <CalendarCheck size={13} className="text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-800 font-medium">{fmtDateTime(appt.date)}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={10} />
                      {fmtTime(appt.date)}
                    </p>
                  </div>
                </div>
              </td>

              {/* Status */}
              <td className="px-4 py-4">
                <Badge status={appt.status} map={RDV_STATUS} />
                {appt.notes && (
                  <p className="text-xs text-gray-400 mt-1 max-w-[180px] truncate" title={appt.notes}>
                    {appt.notes}
                  </p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Quotes Table ───────────────────────────────────────────────────── */

function QuotesTable({ quotes }: { quotes: QuoteRequest[] }) {
  if (!quotes.length) return <EmptyState label="Aucune demande de devis pour l'instant." />;

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
      <table className="min-w-full divide-y divide-gray-100 bg-white">
        <thead className="bg-gray-50">
          <tr>
            {["Client", "Téléphone", "Véhicule", "Immatriculation", "Description", "Date", "Statut"].map(
              (h) => (
                <th
                  key={h}
                  className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {quotes.map((q) => (
            <tr key={q.id} className="hover:bg-gray-50 transition-colors">
              {/* Client */}
              <td className="px-4 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center shrink-0">
                    <User size={14} className="text-[#1a2e4a]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {q.firstName} {q.lastName}
                    </p>
                    {q.email && (
                      <p className="text-xs text-gray-400 truncate max-w-[160px]">{q.email}</p>
                    )}
                  </div>
                </div>
              </td>

              {/* Phone */}
              <td className="px-4 py-4">
                <a
                  href={`tel:${q.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-red-600 transition-colors whitespace-nowrap"
                >
                  <Phone size={13} className="text-red-500" />
                  {q.phone}
                </a>
              </td>

              {/* Vehicle */}
              <td className="px-4 py-4">
                <div className="flex items-center gap-1.5 text-sm text-gray-700">
                  <Car size={13} className="text-gray-400 shrink-0" />
                  <div>
                    <p className="font-medium">
                      {q.carBrand} {q.carModel}
                    </p>
                    {q.year && <p className="text-xs text-gray-400">{q.year}</p>}
                  </div>
                </div>
              </td>

              {/* License plate */}
              <td className="px-4 py-4">
                <span className="font-mono text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {q.licensePlate}
                </span>
              </td>

              {/* Description */}
              <td className="px-4 py-4 max-w-[260px]">
                <p className="text-sm text-gray-700 line-clamp-2" title={q.description}>
                  {q.description}
                </p>
              </td>

              {/* Date */}
              <td className="px-4 py-4 whitespace-nowrap">
                <p className="text-sm text-gray-700">{fmtDate(q.createdAt)}</p>
              </td>

              {/* Status */}
              <td className="px-4 py-4">
                <Badge status={q.status} map={DEVIS_STATUS} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────── */

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const params = await searchParams;
  const tab = params.tab === "devis" ? "devis" : "rdv";

  const [appointments, quotes] = await Promise.all([
    prisma.appointment.findMany({
      orderBy: { date: "asc" },
      include: { service: true },
    }),
    prisma.quoteRequest.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const pendingRdv  = appointments.filter((a) => a.status === "pending").length;
  const newQuotes   = quotes.filter((q) => q.status === "new").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin top bar */}
      <header className="bg-[#1a2e4a] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
              Espace administration
            </p>
            <h1 className="text-lg font-extrabold text-white tracking-tight">
              MÉCA DRIVE — Tableau de bord
            </h1>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={15} />
            Retour au site
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={CalendarCheck} label="Total rendez-vous" value={appointments.length} accent="bg-[#1a2e4a]" />
          <StatCard icon={Clock}         label="RDV en attente"    value={pendingRdv}          accent="bg-yellow-500" />
          <StatCard icon={FileText}      label="Total devis"        value={quotes.length}       accent="bg-[#1a2e4a]" />
          <StatCard icon={AlertCircle}   label="Nouveaux devis"     value={newQuotes}           accent="bg-red-600"   />
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex gap-1 bg-gray-200 rounded-xl p-1">
            <TabLink href="/admin?tab=rdv"   active={tab === "rdv"}   count={appointments.length}>
              Rendez-vous
            </TabLink>
            <TabLink href="/admin?tab=devis" active={tab === "devis"} count={quotes.length}>
              Demandes de devis
            </TabLink>
          </div>

          <p className="text-xs text-gray-400">
            Dernière mise à jour : {new Date().toLocaleString("fr-FR")}
          </p>
        </div>

        {/* Table */}
        {tab === "rdv" ? (
          <AppointmentsTable appointments={appointments} />
        ) : (
          <QuotesTable quotes={quotes} />
        )}
      </div>
    </div>
  );
}
