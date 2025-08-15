import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ jobs: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } });
    }

    const searchParams = request.nextUrl.searchParams;

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const location = searchParams.get('location') || '';

    const skip = (page - 1) * limit;

    const where: any = {
      status: 'active',
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (type) {
      where.type = type;
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    const totalJobs = await prisma.newJob.count({ where });

    const jobs = await prisma.newJob.findMany({
      where,
      skip,
      take: limit,
      orderBy: { postedDate: 'desc' },
    });

    return NextResponse.json({
      jobs,
      pagination: {
        page,
        limit,
        total: totalJobs,
        totalPages: Math.ceil(totalJobs / limit),
      },
    });

  } catch (error) {
    console.error('Error fetching newjobs:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    );
  }
}
