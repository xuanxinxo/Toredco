import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // cache 5 minutes on the server

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

// GET /api/hirings - lấy danh sách tuyển dụng
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limitParam = parseInt(searchParams.get('limit') || '');
    const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 100) : 50;

    const cacheKey = JSON.stringify({ limit });
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({ success: true, data: cached.data, cached: true });
    }

    const data = await prisma.hiring.findMany({
      orderBy: { postedDate: 'desc' },
      take: limit,
      select: {
        id: true,
        title: true,
        company: true,
        location: true,
        type: true,
        salary: true,
        deadline: true,
        postedDate: true,
        img: true,
        description: true,
        requirements: true,
      },
    });

    cache.set(cacheKey, { data, timestamp: Date.now() });
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

    // Parse deadline string into Date, support dd/MM/yyyy
    let deadlineDate: Date;
    if (deadline.includes("/")) {
      const parts = deadline.split("/");
      if (parts.length !== 3) {
        return NextResponse.json({ success: false, message: 'Định dạng hạn nộp không hợp lệ' }, { status: 400 });
      }
      const [day, month, year] = parts;
      deadlineDate = new Date(`${year}-${month}-${day}`);
    } else {
      deadlineDate = new Date(deadline);
    }
    if (isNaN(deadlineDate.getTime())) {
      return NextResponse.json({ success: false, message: 'Định dạng hạn nộp không hợp lệ' }, { status: 400 });
    }

    const newHiring = await prisma.hiring.create({
      data: {
        title,
        company,
        location,
        type,
        salary,
        img,
        deadline: deadlineDate,
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
