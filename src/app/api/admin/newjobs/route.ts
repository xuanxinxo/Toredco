import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

// GET: Lấy danh sách NewJob mới nhất
export async function GET() {
  try {
    const newJobs = await prisma.newJob.findMany({
      orderBy: { postedDate: 'desc' },
      where: { status: 'active' }
    });
    return NextResponse.json({ success: true, data: newJobs });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// POST: Thêm mới một NewJob
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.title || !body.company || !body.location)
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    await prisma.newJob.create({
      data: {
        ...body,
        deadline: new Date(body?.deadline),
        status: 'active',
        postedDate: new Date(),
        isTopNew: true
      }
    });
    return NextResponse.json({ success: true, message: 'NewJob created successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
} 