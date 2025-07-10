import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

// GET /api/hirings
export async function GET() {
  const data = await prisma.hiring.findMany({
    orderBy: { postedDate: 'desc' },
  });
  return NextResponse.json({ success: true, data });
}

// POST /api/hirings  (dùng cho trang admin)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newHiring = await prisma.hiring.create({ data: body });
    return NextResponse.json({ success: true, data: newHiring });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: 'Lưu tin không thành công' },
      { status: 500 }
    );
  }
}
