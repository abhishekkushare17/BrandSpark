import { NextRequest, NextResponse } from "next/server";
import { verifyAndResetPassword } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "Valid token and a password of at least 6 characters are required." },
        { status: 400 }
      );
    }

    const newHash = await hashPassword(newPassword);
    const success = verifyAndResetPassword(token, newHash);

    if (!success) {
      return NextResponse.json(
        { error: "Invalid or expired password reset token." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password has been successfully updated. You can now log in.",
    });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json({ error: "Failed to reset password." }, { status: 500 });
  }
}
