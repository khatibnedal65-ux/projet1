import { MapPin, Clock, Phone, Wrench } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1a2e4a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Wrench size={20} className="text-red-500" />
              <span className="text-xl font-extrabold tracking-tight">
                MÉCA<span className="text-red-500"> DRIVE</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Ton garage de confiance — Spécialiste Entretien &amp; Réparation
              Auto à Vauxbuin et Villers-Cotterêts.
            </p>
          </div>

          {/* Contact & Address */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
              Contact
            </h3>
            <div className="flex items-start gap-3 text-sm text-gray-400">
              <MapPin size={16} className="text-red-500 shrink-0 mt-0.5" />
              <span>
                340 route de Paris
                <br />
                02200 VAUXBUIN / SOISSONS
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <Phone size={16} className="text-red-500 shrink-0" />
              <span>03 65 67 07 31 / 07 82 06 23 38</span>
            </div>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
              Horaires
            </h3>
            <div className="flex items-start gap-3 text-sm text-gray-400">
              <Clock size={16} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white">Ouvert 7j/7</p>
                <p>08h00 – 19h00 NON-STOP</p>
                <p className="mt-1 text-xs text-yellow-400 font-medium">
                  Sans rendez-vous
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <span>
            © {new Date().getFullYear()} MÉCA DRIVE. Tous droits réservés.
          </span>
          <div className="flex gap-4">
            <Link href="/booking" className="hover:text-gray-300 transition-colors">
              Réservation
            </Link>
            <Link href="/devis" className="hover:text-gray-300 transition-colors">
              Devis gratuit
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
