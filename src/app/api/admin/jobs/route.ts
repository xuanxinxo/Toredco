import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
// import { getAdminFromRequest } from '@/lib/auth'; // đảm bảo hàm trả user hợp lệ
import { getAdminFromRequest } from '../../../../lib/auth';
export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

// GET /api/admin/jobs
export async function GET(request: NextRequest) {
  try {
    const admin = getAdminFromRequest(request);
    if (!admin || admin.role !== 'admin')
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const status = request.nextUrl.searchParams.get('status');
    const jobs = await prisma.job.findMany({
      where: status && status !== 'all' ? { status } : {},
      orderBy: { postedDate: 'desc' },
    });

    return NextResponse.json({ success: true, data: jobs });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/jobs
export async function POST(request: NextRequest) {
  try {
    const admin = getAdminFromRequest(request);
    if (!admin || admin.role !== 'admin')
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    if (!body.title || !body.company || !body.location)
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });

    await prisma.job.create({ data: { ...body, deadline: new Date(body?.deadline), status: 'pending', postedDate: new Date() } });
    return NextResponse.json({ success: true, message: 'Job created successfully' }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
