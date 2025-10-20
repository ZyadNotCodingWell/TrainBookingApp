import { NextRequest, NextResponse } from "next/server";
import { verifyUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const user = await verifyUser(email, password);

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  return NextResponse.json({ message: "Login successful", user: { email: user.email, accountNumber: user.accountNumber } });
}
