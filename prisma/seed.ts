import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import path from "path";

const dbPath = path.resolve(process.cwd(), "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Seed services
  const serviceNames = [
    { name: "Forfait Distribution (380€)", description: "Remplacement courroie de distribution. Pièces + main-d'œuvre incluses." },
    { name: "Vidange",              description: "Vidange huile moteur et remplacement des filtres." },
    { name: "Freinage",             description: "Remplacement plaquettes, disques et liquide de frein." },
    { name: "Amortisseurs",         description: "Diagnostic et remplacement amortisseurs." },
    { name: "Pneus & Équilibrage",  description: "Montage, équilibrage et contrôle pression." },
  ];

  const services: Record<string, number> = {};
  for (const s of serviceNames) {
    const existing = await prisma.service.findFirst({ where: { name: s.name } });
    if (!existing) {
      const created = await prisma.service.create({ data: s });
      services[s.name] = created.id;
    } else {
      services[s.name] = existing.id;
    }
  }

  // Sample appointments
  const rdvExists = await prisma.appointment.count();
  if (rdvExists === 0) {
    await prisma.appointment.createMany({
      data: [
        {
          firstName: "Martin",
          lastName: "Durand",
          phone: "06 12 34 56 78",
          vehicleModel: "Renault Clio 1.5 dCi",
          licensePlate: "AB-123-CD",
          serviceId: services["Vidange"],
          date: new Date("2026-05-15T09:00:00"),
          status: "confirmed",
        },
        {
          firstName: "Sophie",
          lastName: "Bernard",
          phone: "07 98 76 54 32",
          email: "sophie.bernard@example.fr",
          vehicleModel: "Peugeot 208 1.2L",
          licensePlate: "EF-456-GH",
          serviceId: services["Forfait Distribution (380€)"],
          date: new Date("2026-05-16T14:30:00"),
          status: "pending",
        },
        {
          firstName: "Luc",
          lastName: "Petit",
          phone: "06 55 44 33 22",
          vehicleModel: "Citroën C3 1.4L",
          licensePlate: "IJ-789-KL",
          serviceId: services["Freinage"],
          date: new Date("2026-05-17T10:00:00"),
          status: "pending",
          notes: "Bruit de grincement en freinant.",
        },
      ],
    });
    console.log("✓ 3 rendez-vous de démonstration créés.");
  }

  // Sample quote requests
  const devisExists = await prisma.quoteRequest.count();
  if (devisExists === 0) {
    await prisma.quoteRequest.createMany({
      data: [
        {
          firstName: "Amélie",
          lastName: "Leroy",
          phone: "06 22 33 44 55",
          carBrand: "Volkswagen",
          carModel: "Golf TDI",
          year: 2018,
          licensePlate: "MN-012-OP",
          description: "Voyant moteur allumé depuis 2 semaines, perte de puissance notable sur autoroute.",
          status: "new",
        },
        {
          firstName: "Pierre",
          lastName: "Moreau",
          phone: "07 66 77 88 99",
          email: "p.moreau@example.fr",
          carBrand: "Ford",
          carModel: "Focus 1.6L",
          year: 2015,
          licensePlate: "QR-345-ST",
          description: "Bruit sourd à l'arrière droite en virage. Amortisseur ou roulement ?",
          status: "in_review",
        },
      ],
    });
    console.log("✓ 2 demandes de devis de démonstration créées.");
  }

  console.log("✓ Seed terminé.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
