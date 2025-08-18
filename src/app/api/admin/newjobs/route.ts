import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
export const dynamic = "force-dynamic";

// POST - Tạo job mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      company,
      location,
      salary,
      tags,
      isRemote,
      type,
      description,
      requirements,
      benefits,
      deadline,
      img,
    } = body;

    // Kiểm tra các trường bắt buộc
    if (!title || !company || !location || !type || !description || !deadline || !img) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newJob = await prisma.newJob.create({
      data: {
        title,
        company,
        location,
        salary: salary?.toString() || 'Thỏa thuận',
        tags: tags ?? [],
        isRemote: isRemote ?? false,
        type,
        description,
        requirements: requirements ?? [],
        benefits: benefits ?? [],
        deadline: new Date(deadline),
        status: 'pending', // Mặc định là pending, cần admin duyệt
        postedDate: new Date(),
        createdAt: new Date(),
        img,
      },
    });

    return NextResponse.json({ success: true, data: newJob }, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Lấy danh sách job theo status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status && status !== 'all') {
      where.status = status;
    }

    const jobs = await prisma.newJob.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: jobs });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
