import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, phone, email, carBrand, carModel, year, licensePlate, description } =
      body as Record<string, string>;

    if (!firstName || !lastName || !phone || !carBrand || !carModel || !licensePlate || !description) {
      return NextResponse.json({ error: "Champs obligatoires manquants." }, { status: 400 });
    }

    const parsedYear = year ? parseInt(year, 10) : null;
    if (year && (isNaN(parsedYear!) || parsedYear! < 1900 || parsedYear! > new Date().getFullYear() + 1)) {
      return NextResponse.json({ error: "Année de véhicule invalide." }, { status: 400 });
    }

    const quote = await prisma.quoteRequest.create({
      data: {
        firstName,
        lastName,
        phone,
        email: email || null,
        carBrand,
        carModel,
        year: parsedYear,
        licensePlate,
        description,
        status: "new",
      },
    });

    return NextResponse.json({ success: true, id: quote.id }, { status: 201 });
  } catch (err) {
    console.error("[API/DEVIS]", err);
    return NextResponse.json({ error: "Erreur serveur. Veuillez réessayer." }, { status: 500 });
  }
}
