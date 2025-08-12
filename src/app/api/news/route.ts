import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';
import { connectDB } from '@/src/lib/mongodb';
import News from '../../../models/News';

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET: Trả về danh sách tin tức
export async function GET() {
  await connectDB();
  const newsData = await News.find().sort({ date: -1 });
  return NextResponse.json({ news: newsData });
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
    let imageUrl = '';
    if (imageFile) {
      try {
        // Upload lên Cloudinary
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const base64Image = buffer.toString('base64');
        const dataURI = `data:${imageFile.type};base64,${base64Image}`;
        
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'news',
          public_id: `news_${Date.now()}`,
          overwrite: true,
        });
        
        imageUrl = result.secure_url;
        console.log('Image uploaded to Cloudinary:', imageUrl);
      } catch (err) {
        console.error('Error uploading to Cloudinary:', err);
        // Fallback: thử lưu local nếu có thể
        try {
          const buffer = Buffer.from(await imageFile.arrayBuffer());
          const filename = `${Date.now()}_${imageFile.name}`;
          const uploadDir = path.join(process.cwd(), 'public', 'uploads');
          await fs.mkdir(uploadDir, { recursive: true });
          await fs.writeFile(path.join(uploadDir, filename), buffer);
          imageUrl = `/uploads/${filename}`;
        } catch (localErr) {
          console.warn('Failed to save image locally:', localErr);
          imageUrl = '';
        }
      }
    }

  if (!title || !summary || !date) {
    return NextResponse.json({ error: 'Thiếu dữ liệu bắt buộc' }, { status: 400 });
  }

  await connectDB();
      const newItem = await News.create({ title, summary, date, image: imageUrl, link });
      return NextResponse.json({ success: true, news: newItem });
  } catch (error) {
    console.error('Error creating news item:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE: Xoá tin tức theo ID
export async function DELETE(request: NextRequest) {
  const { id } = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Thiếu ID' }, { status: 400 });
  }

  await connectDB();
  await News.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
