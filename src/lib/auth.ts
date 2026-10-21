import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { User } from "@/types";
import { getUserById } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "brandspark_super_secure_jwt_secret_key_2026";
const TOKEN_EXPIRY = "7d";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(user: { id: string; email: string; name: string }): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

export function verifyToken(token: string): { id: string; email: string; name: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      name: string;
    };
    return decoded;
  } catch {
    return null;
  }
}

export function extractAuthUser(req: NextRequest): User | null {
  try {
    // Check Authorization Header
    let token = "";
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else {
      // Check Cookies
      const cookie = req.cookies.get("brandspark_token");
      if (cookie) {
        token = cookie.value;
      }
    }

    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload || !payload.id) return null;

    const dbUser = getUserById(payload.id);
    if (!dbUser) return null;

    const { passwordHash: _, resetToken: __, resetTokenExpires: ___, ...user } = dbUser;
    return user;
  } catch (err) {
    console.error("Auth extraction error:", err);
    return null;
  }
}
