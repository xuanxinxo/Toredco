import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, company, location, salary, tags, isRemote } = body;

    if (!title || !company || !location || typeof salary !== 'number') {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const newJob = await prisma.newJob.create({
      data: {
        title,
        company,
        location,
        salary,
        tags: tags ?? [],
        isRemote: isRemote ?? false,
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

export async function GET() {
  try {
    const jobs = await prisma.newJob.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, data: jobs });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Internal server error' }, { status: 500 });
  }
}