import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export const dynamic = 'force-dynamic';
// Cache the job listings for 5 minutes to reduce database load
export const revalidate = 300; // 5 minutes

// In-memory cache with 5-minute TTL
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = (searchParams.get('search') || '').trim();
    const type = (searchParams.get('type') || '').trim();
    const location = (searchParams.get('location') || '').trim();
    const limitParam = parseInt(searchParams.get('limit') || '');
    
    // Create a cache key based on the request parameters
    const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 100) : 100;
    const cacheKey = JSON.stringify({ search, type, location, limit });
    
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_TTL) {
      return NextResponse.json({
        ...cachedData.data,
        cached: true,
        executionTime: Date.now() - startTime
      });
    }

    // Respect client-provided limit (capped to 100); default fetching 100

    // Build optimized search conditions
    const where = {
      status: 'active',
      ...(search && {
        title: {
          contains: search.trim(),
          mode: 'insensitive'
        }
      }),
      ...(type && { type }),
      ...(location && {
        location: { 
          contains: location.trim(),
          mode: 'insensitive' 
        }
      })
    };

    // Optimize the query by only selecting fields needed for the listing
    const selectFields = {
      id: true,
      title: true,
      company: true,
      location: true,
      type: true,
      salary: true,
      deadline: true,
      postedDate: true,
      img: true
    };

    // Fetch all jobs in one go with optimized query
    const jobs = await prisma.job.findMany({
      where,
      select: selectFields,
      orderBy: { postedDate: 'desc' },
      take: limit,
    });
    
    const totalJobs = jobs.length;

    const result = {
      jobs,
      pagination: {
        page: 1,
        limit: jobs.length,
        total: totalJobs,
        totalPages: 1
      },
      executionTime: Date.now() - startTime
    };
    
    // Cache the result
    cache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });
    
    return NextResponse.json(result);
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