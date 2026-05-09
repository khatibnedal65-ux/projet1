"use client";

import Link from "next/link";
import { Phone, Wrench, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Tarifs", href: "/#tarifs" },
  { label: "Réservation", href: "/booking" },
  { label: "Devis", href: "/devis" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Wrench
              size={24}
              className="text-red-600 group-hover:rotate-12 transition-transform duration-200"
            />
            <span className="text-2xl font-extrabold tracking-tight text-[#1a2e4a]">
              MÉCA<span className="text-red-600"> DRIVE</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-[#1a2e4a] hover:bg-gray-100 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Phone numbers */}
          <div className="hidden md:flex items-center gap-2 text-sm font-medium text-[#1a2e4a]">
            <Phone size={16} className="text-red-600 shrink-0" />
            <div className="flex flex-col leading-tight">
              <span>03 65 67 07 31</span>
              <span>07 82 06 23 38</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-[#1a2e4a]"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-2 px-3 pt-3 text-sm font-medium text-[#1a2e4a] border-t border-gray-100 mt-2">
            <Phone size={15} className="text-red-600 shrink-0" />
            <span>03 65 67 07 31 / 07 82 06 23 38</span>
          </div>
        </div>
      )}
    </header>
  );
}
