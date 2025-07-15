import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, company, location, salary, tags, isRemote, type, description, requirements, benefits, deadline } = body;

    if (!title || !company || !location || !type || !description || !deadline) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
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
        status: 'pending', // Mặc định là pending, cần admin phê duyệt
        postedDate: new Date(),
        createdAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, data: newJob }, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message || 'Internal server error' }, { status: 500 });
  }
}

async function createNewJob() {
  const res = await fetch('/api/admin/newjobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Frontend Developer',
      company: 'Toredco',
      location: 'Hà Nội',
      salary: 2000,
      tags: ['React', 'Remote'],
      isRemote: true,
    }),
  });
  const data = await res.json();
  if (data.success) {
    alert('Tạo job thành công!');
  } else {
    alert('Lỗi: ' + data.message);
  }
}

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
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, data: jobs });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Internal server error' }, { status: 500 });
  }
}