import { NextRequest, NextResponse } from "next/server";
import { getBookingsByUser, createBooking } from "@/lib/booking";
import { getServerSession } from "next-auth";

export async function GET(request: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookings = await getBookingsByUser(session.user.email);
  return NextResponse.json(bookings);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { trainId, seats } = await request.json();

  try {
    const booking = await createBooking(session.user.email, trainId, seats);
    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 400 });
  }
}
