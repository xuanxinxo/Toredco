import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function canUseCloudinary(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

// Hàm upload stream Cloudinary dạng Promise
function uploadToCloudinary(fileBuffer: Buffer, folder: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    Readable.from(fileBuffer).pipe(uploadStream);
  });
}

async function saveLocal(fileBuffer: Buffer, originalName: string): Promise<string> {
  const fs = await import('fs/promises');
  const path = await import('path');
  const filename = `${Date.now()}_${originalName}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, filename), fileBuffer);
  return `/uploads/${filename}`;
}

// GET: Lấy danh sách tin tức
export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams;
    const page = Math.max(parseInt(search.get('page') || '1', 10), 1);
    const pageSize = Math.min(Math.max(parseInt(search.get('limit') || '12', 10), 1), 100);
    const skip = (page - 1) * pageSize;

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        orderBy: { date: 'desc' },
        skip,
        take: pageSize,
        select: { id: true, title: true, summary: true, date: true, link: true, image: true },
      }),
      prisma.news.count(),
    ]);

    return NextResponse.json({ news, total, page, pageSize });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

// POST: Tạo tin tức mới
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const title = formData.get('title')?.toString() || '';
    const summary = formData.get('summary')?.toString() || '';
    const date = formData.get('date')?.toString() || '';
    const link = formData.get('link')?.toString() || '';
    const imageFile = formData.get('image') as File | null;

    if (!title || !summary || !date) {
      return NextResponse.json({ error: 'Thiếu dữ liệu bắt buộc' }, { status: 400 });
    }

    let imageUrl = '';
    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      if (canUseCloudinary()) {
        try {
          imageUrl = await uploadToCloudinary(buffer, 'news');
        } catch {
          imageUrl = await saveLocal(buffer, imageFile.name);
        }
      } else {
        imageUrl = await saveLocal(buffer, imageFile.name);
      }
    }

    const newsItem = await prisma.news.create({
      data: {
        title,
        summary,
        date,
        link,
        image: imageUrl,
        v: 0,
      },
    });

    return NextResponse.json(newsItem, { status: 201 });
  } catch (error) {
    console.error('Error creating news item:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE: Xóa tin tức
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await prisma.news.delete({ where: { id } });
    return NextResponse.json({ message: 'Tin tức đã được xóa' });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 });
  }
}
