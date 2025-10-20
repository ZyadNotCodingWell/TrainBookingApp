import { NextRequest, NextResponse } from "next/server";
import { searchTrains } from "@/lib/train";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const departureCity = searchParams.get("departureCity");
  const arrivalCity = searchParams.get("arrivalCity");
  const date = searchParams.get("date");

  if (!departureCity || !arrivalCity) {
    return NextResponse.json({ error: "departureCity and arrivalCity are required" }, { status: 400 });
  }

  const trains = await searchTrains(departureCity, arrivalCity, date || undefined);
  return NextResponse.json(trains);
}
