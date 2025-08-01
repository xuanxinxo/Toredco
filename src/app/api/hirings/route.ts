import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

// GET /api/hirings - lấy danh sách tuyển dụng
export async function GET() {
  try {
    const data = await prisma.hiring.findMany({
      orderBy: { postedDate: 'desc' },
    });
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('Lỗi khi lấy danh sách tuyển dụng:', err);
    return NextResponse.json(
      { success: false, message: 'Không thể tải danh sách tuyển dụng' },
      { status: 500 }
    );
  }
}

// POST /api/hirings - thêm tin tuyển dụng (dùng trong admin)
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      title,
      company,
      location,
      type,
      salary,
      deadline,
      img,
      description = '',
      requirements = [],
      benefits = [],
    } = body;

    // ✅ Kiểm tra các trường bắt buộc
    if (!title || !company || !location || !type || !salary || !deadline || !img) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng điền đầy đủ thông tin bắt buộc' },
        { status: 400 }
      );
    }

    const newHiring = await prisma.hiring.create({
      data: {
        title,
        company,
        location,
        type,
        salary,
        img,
        deadline: new Date(deadline),
        postedDate: new Date(),
        description,
        requirements,
        benefits,
      },
    });

    return NextResponse.json({ success: true, data: newHiring });
  } catch (err) {
    console.error('Lỗi khi lưu tin tuyển dụng:', err);
    return NextResponse.json(
      { success: false, message: 'Lưu tin không thành công' },
      { status: 500 }
    );
  }
}
