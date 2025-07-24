import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import News from '../../../models/News';

// GET: Trả về danh sách tin tức
export async function GET() {
  await connectDB();
  const newsData = await News.find().sort({ date: -1 });
  return NextResponse.json({ news: newsData });
}

// POST: Tạo tin tức mới
export async function POST(request: NextRequest) {
  try {
  const { title, summary, date, image, link } = await request.json();

  if (!title || !summary || !date || !image) {
    return NextResponse.json({ error: 'Thiếu dữ liệu bắt buộc' }, { status: 400 });
  }

  await connectDB();
      const newItem = await News.create({ title, summary, date, image, link });
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
