import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

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

// PUT: Cập nhật tin tức
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contentType = request.headers.get('content-type') || '';

    let title = '';
    let summary = '';
    let date = '';
    let link = '';
    let imageUrl: string | undefined = undefined;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      title = formData.get('title')?.toString() || '';
      summary = formData.get('summary')?.toString() || '';
      date = formData.get('date')?.toString() || '';
      link = formData.get('link')?.toString() || '';

      const imageFile = formData.get('image') as File | null;
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
    } else {
      const body = await request.json();
      title = body.title;
      summary = body.summary;
      date = body.date;
      link = body.link;
    }

    if (!title || !summary || !date) {
      return NextResponse.json(
        { error: 'Thiếu dữ liệu bắt buộc' },
        { status: 400 }
      );
    }

    const updateData: any = { title, summary, date, link };
    if (imageUrl) updateData.image = imageUrl;

    const updated = await prisma.news.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, news: updated, message: 'Cập nhật tin tức thành công' });
  } catch (error) {
    console.error('Error updating news:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// GET: Lấy chi tiết tin tức theo ID
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const news = await prisma.news.findUnique({ where: { id: params.id } });
    if (!news) {
      return NextResponse.json({ error: 'Không tìm thấy tin tức' }, { status: 404 });
    }
    return NextResponse.json({ success: true, news });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
