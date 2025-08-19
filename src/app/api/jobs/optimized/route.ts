import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

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
    
    // Create a cache key based on the request parameters
    const cacheKey = JSON.stringify({ search, type, location });
    
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_TTL) {
      return NextResponse.json({
        ...cachedData.data,
        cached: true,
        executionTime: Date.now() - startTime
      });
    }

    // Build optimized search conditions
    const where = {
      status: 'active',
      ...(search && {
        title: {
          contains: search,
          mode: 'insensitive' as const
        }
      }),
      ...(type && { type }),
      ...(location && {
        location: { 
          contains: location,
          mode: 'insensitive' as const
        }
      })
    };

    // Only select fields needed for the listing
    const selectFields = {
      id: true,
      title: true,
      company: true,
      location: true,
      type: true,
      salary: true,
      postedDate: true,
      img: true
    };

    // Fetch all matching jobs in one go with optimized query
    const jobs = await prisma.job.findMany({
      where,
      select: selectFields,
      orderBy: { postedDate: 'desc' },
      take: 100, // Limit to 100 jobs for performance
    });
    
    const totalJobs = jobs.length;
    const executionTime = Date.now() - startTime;

    const result = {
      jobs,
      pagination: {
        page: 1,
        limit: jobs.length,
        total: totalJobs,
        totalPages: 1
      },
      executionTime
    };
    
    // Cache the result
    cache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });
    
    return NextResponse.json({
      ...result,
      cached: false,
      executionTime
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Server error', executionTime: Date.now() - startTime },
      { status: 500 }
    );
  }
}
