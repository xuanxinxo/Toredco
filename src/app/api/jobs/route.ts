import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const location = searchParams.get('location') || '';
    const searchType = (searchParams.get('searchType') || '').toLowerCase();
    const isExact = searchParams.get('exact') === '1' || searchParams.get('exact') === 'true';

    if (page < 1 || limit < 1) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ jobs: [], pagination: { page, limit, total: 0, totalPages: 0 } });
    }

    const skip = (page - 1) * limit;

    // Build search conditions
    const where: any = {
      status: 'active'
    };

    if (search) {
      if (searchType === 'title') {
        // Only search in title
        where.title = isExact
          ? { equals: search, mode: 'insensitive' }
          : { startsWith: search, mode: 'insensitive' };
      } else {
        // Default: search across multiple fields
        const stringFilter = isExact
          ? { equals: search, mode: 'insensitive' }
          : { contains: search, mode: 'insensitive' };
        where.OR = [
          { title: stringFilter },
          { company: stringFilter },
          { description: stringFilter }
        ];
      }
    }

    if (type) {
      where.type = type;
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    // Use Prisma's findMany with count
    const [jobs, totalJobs] = await Promise.all([
      prisma.job.findMany({
        where,
        orderBy: { postedDate: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          company: true,
          location: true,
          type: true,
          salary: true,
          description: true,
          requirements: true,
          benefits: true,
          deadline: true,
          status: true,
          postedDate: true,
          img: true
        }
      }),
      prisma.job.count({ where })
    ]);

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

    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ error: 'Database is not configured' }, { status: 500 });
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