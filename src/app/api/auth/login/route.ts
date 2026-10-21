import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/db";
import { generateToken, verifyPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const dbUser = getUserByEmail(email);
    if (!dbUser) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const isValid = await verifyPassword(password, dbUser.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const { passwordHash: _, resetToken: __, resetTokenExpires: ___, ...user } = dbUser;
    const token = generateToken(user);

    const response = NextResponse.json({
      success: true,
      user,
      token,
    });

    response.cookies.set({
      name: "brandspark_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
