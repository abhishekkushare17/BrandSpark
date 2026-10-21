import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getUserByEmail, setPasswordResetToken } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const user = getUserByEmail(email);
    if (!user) {
      // Don't reveal account existence for security, or return informative message
      return NextResponse.json({
        success: true,
        message: "If that email is registered, password reset instructions have been generated.",
      });
    }

    const resetToken = crypto.randomBytes(24).toString("hex");
    setPasswordResetToken(email, resetToken, 3600000); // 1 hour

    // Return the reset token in the response so the user can test/complete password reset directly
    return NextResponse.json({
      success: true,
      message: "Password reset link generated successfully.",
      resetToken,
      resetLink: `/reset-password?token=${resetToken}`,
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "Failed to process request." }, { status: 500 });
  }
}
