import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

// GET /api/candidates
export async function GET() {
  try {
    const candidates = await prisma.application.findMany({
      orderBy: { createdAt: 'desc' },
    });
    // Fetch related hiring data
    const hiringIds = candidates.map(c => c.hiringId).filter(id => id) as string[];
    let hirings: any[] = [];
    if (hiringIds.length > 0) {
      hirings = await prisma.hiring.findMany({ where: { id: { in: hiringIds } } });
    }
    const data = candidates.map(c => ({
      ...c,
      hiring: c.hiringId ? hirings.find(h => h.id === c.hiringId) || null : null,
    }));
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('Error fetching candidates:', err);
    return NextResponse.json(
      { success: false, message: 'Không thể tải danh sách ứng viên' },
      { status: 500 }
    );
  }
}
