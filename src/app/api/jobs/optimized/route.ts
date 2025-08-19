import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { LRUCache } from 'lru-cache';

// Configure server-side caching with LRU cache
const cache = new LRUCache<string, { data: any; timestamp: number }>({
  max: 100, // Max 100 entries
  ttl: 5 * 60 * 1000, // 5 minutes TTL
  allowStale: false,
  updateAgeOnGet: true,
  updateAgeOnHas: true,
});

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = (searchParams.get('search') || '').trim();
    const type = (searchParams.get('type') || '').trim();
    const location = (searchParams.get('location') || '').trim();
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(20, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    
    // Create a cache key based on the request parameters
    const cacheKey = JSON.stringify({ search, type, location, page, limit });
    
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
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

    // Get total count for pagination
    const total = await prisma.job.count({ where });
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    // Fetch only the needed page of jobs
    const jobs = await prisma.job.findMany({
      where,
      select: selectFields,
      orderBy: { postedDate: 'desc' },
      take: limit,
      skip,
    });
    
    const result = {
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
      executionTime: Date.now() - startTime
    };
    
    // Cache the result
    cache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });
    
    return NextResponse.json({
      ...result,
      cached: false,
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { 
        error: 'Server error', 
        message: error instanceof Error ? error.message : 'Unknown error',
        executionTime: Date.now() - startTime 
      },
      { status: 500 }
    );
  }
}
