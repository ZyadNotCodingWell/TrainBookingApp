import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  try {
    const user = await createUser(email, password);
    return NextResponse.json({ message: "User created successfully", accountNumber: user.accountNumber });
  } catch (error) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }
}
