import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

export async function GET(request: NextRequest) {
  try {
    console.log('MONGODB_URI:', process.env.MONGODB_URI);

    const searchParams = request.nextUrl.searchParams;

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const location = searchParams.get('location') || '';

    console.log('Fetching newjobs with params:', { page, limit, search, type, location });

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

    const cacheKey = JSON.stringify({ page, limit, search, type, location, where });
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data);
    }

    const isSmallHomeQuery = page === 1 && limit <= 8 && !search && !type && !location;

    const totalJobs = isSmallHomeQuery ? -1 : await prisma.newJob.count({ where });

    const jobs = await prisma.newJob.findMany({
      where,
      skip,
      take: limit,
      orderBy: { postedDate: 'desc' },
      select: {
        id: true,
        title: true,
        company: true,
        location: true,
        type: true,
        salary: true,
        img: true,
        postedDate: true,
        description: true,
      },
    });

    console.log(`Found ${jobs.length} newjobs out of ${totalJobs} total`);

    const payload = {
      jobs,
      pagination: {
        page,
        limit,
        total: totalJobs === -1 ? jobs.length : totalJobs,
        totalPages: totalJobs === -1 ? 1 : Math.ceil(totalJobs / limit),
      },
    };
    cache.set(cacheKey, { data: payload, timestamp: Date.now() });
    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400'
      }
    });

  } catch (error) {
    console.error('Error fetching newjobs:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    );
  }
}
