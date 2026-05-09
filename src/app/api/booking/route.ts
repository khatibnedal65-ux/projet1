import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, phone, email, vehicleModel, licensePlate, serviceName, date, time, notes } =
      body as Record<string, string>;

    if (!firstName || !lastName || !phone || !serviceName || !date || !time) {
      return NextResponse.json({ error: "Champs obligatoires manquants." }, { status: 400 });
    }

    // Validate time range server-side
    const [hours, mins] = time.split(":").map(Number);
    const totalMins = hours * 60 + mins;
    if (totalMins < 8 * 60 || totalMins > 19 * 60) {
      return NextResponse.json(
        { error: "Heure hors plage horaire (08h00 – 19h00)." },
        { status: 400 }
      );
    }

    // Validate date is not in the past
    const today = new Date().toISOString().split("T")[0];
    if (date < today) {
      return NextResponse.json({ error: "La date ne peut pas être dans le passé." }, { status: 400 });
    }

    // Find or create service
    let service = await prisma.service.findFirst({ where: { name: serviceName } });
    if (!service) {
      service = await prisma.service.create({ data: { name: serviceName } });
    }

    const appointmentDate = new Date(`${date}T${time}:00`);
    if (isNaN(appointmentDate.getTime())) {
      return NextResponse.json({ error: "Date ou heure invalide." }, { status: 400 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        firstName,
        lastName,
        phone,
        email: email || null,
        vehicleModel: vehicleModel || null,
        licensePlate: licensePlate || null,
        serviceId: service.id,
        date: appointmentDate,
        notes: notes || null,
        status: "pending",
      },
    });

    return NextResponse.json({ success: true, id: appointment.id }, { status: 201 });
  } catch (err) {
    console.error("[API/BOOKING]", err);
    return NextResponse.json({ error: "Erreur serveur. Veuillez réessayer." }, { status: 500 });
  }
}
