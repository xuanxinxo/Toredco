import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const location = searchParams.get('location') || '';

    console.log('Fetching jobs with params:', { page, limit, search, type, location });

    const skip = (page - 1) * limit;

    // Xây dựng điều kiện tìm kiếm
    const where: any = {
      status: 'active'
    };

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { company: { contains: search } },
        { description: { contains: search } }
      ];
    }

    if (type) {
      where.type = type;
    }

    if (location) {
      where.location = { contains: location };
    }

    // Lấy tổng số việc làm
    const totalJobs = await prisma.job.count({ where });

    // Lấy danh sách việc làm với phân trang
    const jobs = await prisma.job.findMany({
      where,
      orderBy: { postedDate: 'desc' },
      skip,
      take: limit,
    });

    console.log(`Found ${jobs.length} jobs out of ${totalJobs} total`);
    
    return NextResponse.json({
      jobs,
      pagination: {
        page,
        limit,
        total: totalJobs,
        totalPages: Math.ceil(totalJobs / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      title,
      company,
      location,
      type,
      salary,
      description,
      requirements,
      benefits,
      deadline,
    } = await req.json();

    // Validate required fields
    if (!title || !company || !location || !type || !salary || !description || !deadline) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const job = await prisma.job.create({
      data: {
        title,
        company,
        location,
        type,
        salary,
        description,
        requirements: requirements ?? [],
        benefits: benefits ?? [],
        deadline: new Date(deadline),
        status: 'pending', // Mặc định là pending, cần admin phê duyệt
        postedDate: new Date(),
      },
    });
    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}