import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromRequest } from '../../../../../lib/auth';
import { prisma } from '../../../../../lib/prisma';
import fs from 'fs/promises';
import path from 'path';

// GET /api/admin/jobs/[id] - Lấy chi tiết việc làm
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAdminFromRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    const job = await prisma.job.findUnique({ where: { id: params.id } });
    if (!job) {
      return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: job });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/jobs/[id] - Cập nhật việc làm
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAdminFromRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    const jobId = params.id;

    const formData = await request.formData();
    const title = formData.get('title')?.toString();
    const company = formData.get('company')?.toString();
    const location = formData.get('location')?.toString();
    const type = formData.get('type')?.toString();
    const salary = formData.get('salary')?.toString();
    const description = formData.get('description')?.toString();
    const deadlineStr = formData.get('deadline')?.toString();
    const requirementsPresent = formData.get('requirementsPresent');
    const benefitsPresent = formData.get('benefitsPresent');
    const requirements = formData.getAll('requirements').map(item => item.toString());
    const benefits = formData.getAll('benefits').map(item => item.toString());

    let imgUrl: string | undefined;
    const imgFile = formData.get('img') as File | null;
    if (imgFile && imgFile instanceof File) {
      const buffer = Buffer.from(await imgFile.arrayBuffer());
      const filename = `${Date.now()}_${imgFile.name}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'jobs');
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(path.join(uploadDir, filename), buffer);
      imgUrl = `/uploads/jobs/${filename}`;
    }

    const data: any = {};
    if (title !== undefined) data.title = title;
    if (company !== undefined) data.company = company;
    if (location !== undefined) data.location = location;
    if (type !== undefined) data.type = type;
    if (salary !== undefined) data.salary = salary;
    if (description !== undefined) data.description = description;
    if (deadlineStr) data.deadline = new Date(deadlineStr);
    if (requirementsPresent !== null) data.requirements = requirements; // cho phép cập nhật mảng rỗng
    if (benefitsPresent !== null) data.benefits = benefits; // cho phép cập nhật mảng rỗng
    if (imgUrl) data.img = imgUrl;

    await prisma.job.update({
      where: { id: jobId },
      data,
    });

    return NextResponse.json({ success: true, message: 'Job updated successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/jobs/[id] - Xóa việc làm (soft delete)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAdminFromRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    const jobId = params.id;
    await prisma.job.update({
      where: { id: jobId },
      data: { status: 'deleted' },
    });
    return NextResponse.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
} 

// PATCH /api/admin/jobs/[id] - Cập nhật nhanh trạng thái hoặc trường lẻ
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAdminFromRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    const jobId = params.id;
    const body = await request.json();
    const allowedFields = [
      'title', 'company', 'location', 'type', 'salary', 'description',
      'requirements', 'benefits', 'deadline', 'status', 'postedDate', 'img'
    ];
    const data: any = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        data[key] = body[key];
      }
    }
    await prisma.job.update({
      where: { id: jobId },
      data,
    });
    return NextResponse.json({ success: true, message: 'Job updated successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
} 