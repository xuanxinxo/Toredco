// src/app/api/auth/login/route.ts
// -----------------------------------------------------------------------------
// Secure **login** endpoint for Next.js (App Router, v14+) using Prisma + JWT.
// -----------------------------------------------------------------------------
// 🔐  Protections
//  – JSON‑only (reject others)
//  – Zod schema validate
//  – Rate‑limit (same util as register)
//  – Bcrypt password check
//  – Issue signed JWT (HS256) – secret via env
// -----------------------------------------------------------------------------
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
// import { SignJWT } from 'jose';
import { SignJWT } from 'jose/jwt/sign';


import { prisma } from '@/lib/prisma';

// -----------------------------
// 1. Validation schema
// -----------------------------
const loginSchema = z
  .object({
    email: z.string().trim().toLowerCase().email({ message: 'Email không hợp lệ' }),
    password: z.string(),
  })
  .strict();

// -----------------------------
// 2. Simple in‑memory rate limiter (reuse)
// -----------------------------
const WINDOW = 15 * 60 * 1000; // 15 mins
const MAX = 20; // 20 attempts
const bucket = new Map<string, { c: number; t: number }>();
function limited(ip: string): boolean {
  const now = Date.now();
  const e = bucket.get(ip);
  if (!e || now - e.t > WINDOW) {
    bucket.set(ip, { c: 1, t: now });
    return false;
  }
  e.c += 1;
  if (e.c > MAX) return true;
  return false;
}

// -----------------------------
// 3. POST handler
// -----------------------------
export async function POST(req: NextRequest) {
  // 3.1 Only JSON
  if (req.headers.get('content-type') !== 'application/json') {
    return NextResponse.json({ error: 'Content‑Type phải là application/json' }, { status: 415 });
  }

  // 3.2 Rate‑limit per IP
  const ip = req.ip ?? 'unknown';
  if (limited(ip)) {
    return NextResponse.json({ error: 'Quá nhiều yêu cầu, thử lại sau' }, { status: 429 });
  }

  // 3.3 Parse body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON không hợp lệ' }, { status: 400 });
  }

  // 3.4 Validate
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  const { email, password } = parsed.data;

  // 3.5 Find user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: 'Email hoặc mật khẩu không đúng' }, { status: 401 });
  }

  // 3.6 Check password
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: 'Email hoặc mật khẩu không đúng' }, { status: 401 });
  }

  // 3.7 Issue JWT (expires in 2h)
  const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? 'dev_secret');
  const token = await new SignJWT({ sub: user.id.toString(), email: user.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('2h')
    .sign(secret);

  // 3.8 Return user (sans password) + token
  return NextResponse.json(
    {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
    },
    { status: 200 }
  );
}

export const revalidate = 0;
