import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function POST(req: Request) {
  try {
    const { hiringId, name, email, phone, message } = await req.json();
    const application = await prisma.application.create({
      data: { hiringId, name, email, phone, message },
    });
    return NextResponse.json({ success: true, data: application });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET() {
  try {
    const applications = await prisma.application.findMany({
      orderBy: { createdAt: 'desc' },
      include: { hiring: true },
    });
    return NextResponse.json({ success: true, data: applications });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
} 